import { MongoClient, ServerApiVersion  } from 'mongodb';

export default async function addBookingRoom(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    // const roomId =  req.query?.roomId;


    const roomId =  parseInt(req.query?.roomId);

    
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }
    
      try {
        await client.connect();
        console.log('Connected to database');
        const room = client.db('HotelManage').collection('room');



        const roomByID = await room.aggregate( [
             {
                 $match: {
                     'room_id': roomId
                    }
             }
            ,
            {
              $lookup:
                {
                  from: "type_of_room",
                  localField: "roomtype_id",
                  foreignField: "roomtype_id",
                  as: "roomtype"
                }
           }
         ] ).toArray();

        

        return( res.status(200).json({  roomByID ,message: 'Get room by id success', success: true}))


      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }  

    

}