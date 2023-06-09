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
    const checkIn = req.body?.checkIn;
    const checkOut = req.body?.checkOut;
    const minPerson = req.body?.minPerson;
    const roomType = req.body?.roomType;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

    if (!checkIn || !checkOut) {
        return res.status(400).json({ message: "Missing fields, both field if one was selected annother one must select too", success: false });
      }

      try {
        await client.connect();
        
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
        const allroom = await room.aggregate(aggregate).toArray();

        let idRoom = []

        allroom.forEach((val) => {
            
            idRoom.push(val.room_id)
        })

        
        // idRoom is array
      const  successRoom = await roomquery.find({ 'room_id': { $nin: idRoom } }).toArray()

        return( res.status(200).json({ allroom ,message: 'Register success', success: true}))


    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }


}
















