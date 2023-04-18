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
    const { 
        
        checkIn,
        checkOut,
        } = req.body;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

      try {
        await client.connect();
        console.log('Connected to database');
        const room = client.db('HotelManage').collection('room_booking');
        const roomquery =  client.db('HotelManage').collection('room');
        
        // const startDate = new Date(checkIn);
        // const endDate = new Date(checkOut);
        
        // const allroom = await room.aggregate([

          
        //   {
        //     '$match': {
        //       'checkin_date': {
        //         '$gte': checkIn, 
        //         '$lte': checkOut
        //       }
        //     }
        //   }, {
        //     '$match': {
        //       'checkout_date': {
        //         '$gte': checkIn, 
        //         '$lte': checkOut
        //       }
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "room",
        //       localField: "room_id",
        //       foreignField: "room_id",
        //       as: "room"
        //     }
        //   },
          

        // ]).toArray();

        const allroom = await room.aggregate([
          {
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
          },
          {
            '$lookup': {
              from: "room",
              localField: "room_id",
              foreignField: "room_id",
              as: "room"
            }
          }
        ]).toArray();



       

       
        

        let idRoom = []

        allroom.forEach((val) => {
            
            idRoom.push(val.room_id)
        })

        console.log("idRoom",idRoom)
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
















