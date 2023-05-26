import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getallcode(req, res) {

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

        const code  = client.db('HotelManage').collection('code');
        const personal = client.db('HotelManage').collection('personal_information');

       const getcode = await code.find({},{"_id":0}).toArray()

        for(let i = 0 ; i < getcode.length ; i++){
            getcode[i]["remainder"] = getcode[i].count_limit - getcode[i].temp

        }



        return( res.status(200).json({ getcode, message: 'Get all bill by admin success', success: true}))



    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


    

}