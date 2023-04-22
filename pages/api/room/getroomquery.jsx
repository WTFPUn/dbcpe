import { MongoClient, ServerApiVersion  } from 'mongodb';


export default async function getRoomQuery(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    const checkIn = req.query?.checkIn;
    const checkOut = req.query?.checkOut;
    let minPerson = req.query?.minPerson;
    let roomType = req.query?.roomType;
    let arrayRoomType = [];
    // roomType change [Object Object] to array
    if(roomType){
      let roomTypeArr = roomType.split(",");
      roomTypeArr = roomTypeArr.map((val) => parseInt(val));
      roomType = roomTypeArr;
      // on arrayRoomType push index of roomType that is selected
      roomType.forEach((val, index) => {
        if(val != 0){
          arrayRoomType.push(index);
        }
      })
    }

    if(minPerson){
      minPerson = parseInt(minPerson);
    }

    console.log("carrayRoomTypeheckIn",arrayRoomType)

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

    if ((!checkIn && checkOut) || (checkIn && !checkOut)) {
        return res.status(400).json({ message: "fill missing error date fillter ", success: false });
      }

      try {
        await client.connect();
        console.log('Connected to database');
        const room = client.db('HotelManage').collection('room_booking');
        const roomquery =  client.db('HotelManage').collection('room');
        
        let aggregate = []
        if(checkIn && checkOut){
            aggregate.push({
                '$match': {
                  '$or': [
                    {
                      'checkin_date': {
                        $gte: checkIn,
                        $lte: checkOut
                      }
                    },
                    {
                      'checkout_date': {
                        $gte: checkIn,
                        $lte: checkOut
                      }
                    }
                  ]
                }
              })
        }
        aggregate.push({
            '$lookup': {
              from: "room",
              localField: "room_id",
              foreignField: "room_id",
              as: "room"
            }
          })
        let allroom ;
        let idRoom = []

    if(checkIn && checkOut){
      allroom = await room.aggregate(aggregate).toArray();
          
        allroom.forEach((val) => {
            idRoom.push(val.room_id)
        })
        console.log("idRoom",idRoom)
      }
        // idRoom is array
        let query = [] ;

       if(checkIn && checkOut){

          query.push({$match: {
                'room_id': { $nin: idRoom }}})

          if(arrayRoomType.length != 0){
            query.push({$match: {
              '$expr': {
                '$in': [
                  '$roomtype_id', arrayRoomType
                ]
              }
            }
            })
          }

          query.push({
                   $lookup: {
                from: "type_of_room",
                localField: "roomtype_id",
                foreignField: "roomtype_id",
                as: "roomtype"
              }
          })

          if(minPerson){
            query.push({
              $match: {
                    'roomtype.num_people_stay': { $gte: minPerson }
                  }
            })
          }
       }

       else{
        console.log("roomtype",roomType)
          if(arrayRoomType.length != 0){
            query.push({$match: {
              '$expr': {
                '$in': [
                  '$roomtype_id', arrayRoomType
                ]
              }
            }})
          }

            query.push({
              $lookup: {
                  from: "type_of_room",
                  localField: "roomtype_id",
                  foreignField: "roomtype_id",
                  as: "roomtype"
                }
            })

          if(minPerson){
            console.log("minPerson",minPerson)
            query.push({
              $match: {
                    'roomtype.num_people_stay': { $gte: minPerson }
                  }

            })
          }

        }

      const successRoom = await roomquery.aggregate(query).toArray();

        return( res.status(200).json({ successRoom ,message: 'Get room query success', success: true}))

    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }
}
















