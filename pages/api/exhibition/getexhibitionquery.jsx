import { MongoClient, ServerApiVersion  } from 'mongodb';


export default async function getExhibitionQuery(req, res) {

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
    const minPerson = req.query?.minPerson;
    const roomType = req.query?.roomType;


    

    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed', success: false });
    }


    if ((!checkIn && checkOut) || (checkIn && !checkOut)) {
        return res.status(400).json({ message: "fill missing error date fillter ", success: false });
      }

    
      let arrayRoomType = []
      let tmp = 0
      let index = 0

      if(roomType){
      

      roomType.forEach((val) => {
        
        if(val){
          arrayRoomType[index] = tmp
          index ++;
        }    
        tmp ++ ;
        
    })
    }

    console.log("arrayRoomtype ",arrayRoomType)


      try {
        await client.connect();
        console.log('Connected to database');
        const exhibition = client.db('HotelManage').collection('exhibition_booking');
        const exhibitionQuery =  client.db('HotelManage').collection('exhibition_room');
        
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
              from: "exhibition_room",
              localField: "exhibition_id",
              foreignField: "exhibition_id",
              as: "exhibition_room"
            }
          })
        let allroom ;
        let idRoom = []

    if(checkIn && checkOut){
      allroom = await exhibition.aggregate(aggregate).toArray();
          
        allroom.forEach((val) => {
            idRoom.push(val.exhibition_id)
        })
        console.log("idRoom",idRoom)
      }
        // idRoom is array
        let query = [] ;

       if(checkIn && checkOut){

          query.push({$match: {
                'exhibition_id': { $nin: idRoom }}})

          if(arrayRoomType.length != 0){
            query.push({$match: {
              '$expr': {
                '$in': [
                  '$exhibition_type_id', arrayRoomType 
                ]
              }
            }
            })
          }

          if(minPerson){
            query.push({
              $match: {
                    'max_people': { $gte: minPerson }
                  }
            })
          }

          query.push({
                   $lookup: {
                from: "type_of_exhibition",
                localField: "exhibition_type_id",
                foreignField: "exhibition_type_id",
                as: "exhibition_type"
              }
          })

         
       }

       else{
        
          if(arrayRoomType.length != 0){
            query.push({$match: {
              '$expr': {
                '$in': [
                  '$exhibition_type_id', arrayRoomType 
                ]
              }
            }})
          }


          if(minPerson){
            query.push({
              $match: {
                'max_people': { $gte: minPerson }
                  }

            })
          }

            query.push({
              $lookup: {
                  from: "type_of_exhibition",
                  localField: "exhibition_type_id",
                  foreignField: "exhibition_type_id",
                  as: "exhibition_type"
                }
            })

        }

      const successRoom = await exhibitionQuery.aggregate(query).toArray();

        return( res.status(200).json({ successRoom ,message: 'Get exhibition query success', success: true}))

    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }



}