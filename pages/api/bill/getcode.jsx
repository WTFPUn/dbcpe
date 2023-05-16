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

         //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];


        if(getcode.temp === getcode.count_limit){
            return res.status(400).json({ message: 'This code is over limit', success: false });
        
        }
        if(bookDate === getcode.expired_date){
            return res.status(400).json({ message: 'This code is out of range', success: false });
        }

        if(getcode){
            return ( res.status(200).json({ getcode:getcode ,message: 'Get code success', success: true}))
        }
        else{
            return( res.status(200).json({ message: 'Do not have this code', success: false }))
        }



    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


    
}