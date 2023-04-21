import { MongoClient, ServerApiVersion  } from 'mongodb';

export default async function getexhibition(req, res) {

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
        console.log('Connected to database');
        const exhibition = client.db('HotelManage').collection('exhibition_room');
        
        const allroom = await exhibition.aggregate( [
          {
            $lookup:
              {
                from: "type_of_exhibition",
                localField: "exhibition_type_id",
                foreignField: "exhibition_type_id",
                as: "exhibition_type"
              }
         }
       ] ).toArray();
       console.log("allroom ",allroom)
        
        return( res.status(200).json({  allroom ,message: 'Get exhibition room success', success: true}))

    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }


}






