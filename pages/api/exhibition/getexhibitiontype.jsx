import { MongoClient, ServerApiVersion  } from 'mongodb';


export default async function getExhibitionType(req, res) {
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
        const collection = client.db('HotelManage').collection('type_of_exhibition');
    
        // const existingAccount = await collection.findOne({email: email});
        const allexhibitiontype = await collection.find( {},{projection:{"_id": 0,"exhibition_type_id": 1,"type_name": 1}}).sort({ "exhibition_type_id": 1 }).toArray();
        
        
        return( res.status(200).json({ allexhibitiontype ,message: 'Get exhibition type success', success: true}))



    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }

}
