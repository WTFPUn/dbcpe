import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function gethousekeeper(req, res) {

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

        const person  = client.db('HotelManage').collection('personal_information');

        const gethousekeeper  = await person.find({"role":1,"sub_role":1},{projection:{"_id":0,"account_id":1,"first_name":1,"last_name":1,"role":1,"sub_role":1}}).toArray();



        return( res.status(200).json({gethousekeeper  , message: 'Get bill success', success: true}))

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}