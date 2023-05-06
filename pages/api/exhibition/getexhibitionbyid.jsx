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

    
    const exhibitionId =  parseInt(req.query?.exhibitionId);

    // const exhibitionId =  parseInt(req.body?.exhibitionId);

    
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }
    
      try {
        await client.connect();
        console.log('Connected to database');
        const exhibitionRoom = client.db('HotelManage').collection('exhibition_room');

        const exhibitionRoomById = await exhibitionRoom.aggregate( [
             {
                 $match: {
                     'exhibition_id': exhibitionId
                    }
             }
            ,
            {
              $lookup:
                {
                  from: "type_of_exhibition",
                  localField: "exhibition_type_id",
                  foreignField: "exhibition_type_id",
                  as: "exhibitiontype"
                }

           }
         ] ).toArray();


         for (let i=0 ; i< exhibitionRoomById.length; i++){
            exhibitionRoomById[i].exhibitiontype = exhibitionRoomById[i].exhibitiontype[0]
        }

        

        return( res.status(200).json({ exhibitionRoomById ,message: 'Get room by id success', success: true}))


      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }  

    

}