import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getcode(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    const code_name =  req.query?.code_name;
    

    

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

      try {
        await client.connect();
        console.log('Connected to database');
       
        const code = client.db('HotelManage').collection('code');

        const getcode = await code.findOne({"code_name": code_name},{projection:{"_id":0}}) 

        if(getcode){
            return ( res.status(200).json({ getcode:getcode ,message: 'Get code success', success: true}))
        }
        else{
            return( res.status(200).json({ message: 'Do not have this code', success: true}))
        }



    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


    
}