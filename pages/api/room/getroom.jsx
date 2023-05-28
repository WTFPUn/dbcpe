import { MongoClient, ServerApiVersion  } from 'mongodb';

export default async function getroom(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

    
    try {
        await client.connect();
        
        const room = client.db('HotelManage').collection('room');
        const type = client.db('HotelManage').collection('type_of_room')

  
        
        const allroom = await room.aggregate( [
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
       
        

        return( res.status(200).json({  allroom ,message: 'get room success', success: true}))



    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }


}