import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getAllSeasons(req, res) {

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

        const season  = client.db('HotelManage').collection('season_setup');

        const getseason = await season.find({},{projection:{"_id":0}}).toArray()

        return res.status(200).json({ getseason ,message: 'Get all Seasons success', success: true });



    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


    }