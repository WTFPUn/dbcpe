import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function verifycode(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    let code_name = req.body?.code_name 
    let code_type = parseInt(req.body?.code_type)
    let discount_factor =parseInt (req.body?.discount_factor)
    let count_limit =parseInt (req.body?.count_limit)
    let expired_date = req.body?. expired_date
    let description = req.body?. description 



    expired_date = new Date(expired_date).toISOString().split("T")[0];


    //set time  right now 

    const tzOffset = 7; // Offset for Indochina Time (GMT+7)
    const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

    if(expired_date <= dateNow){
        return res.status(400).json({ message: 'Expired_date not available', success: false });
    }


    if(code_type === 0){
        code_type = "fixed"
    }
    else if(code_type === 1){
        code_type = "percent"
    }



    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }



      try {
        await client.connect();

        const code  = client.db('HotelManage').collection('code');

        const validateCode = await code.findOne({"code_name":code_name },{"_id":0})

        if(validateCode){
            return( res.status(400).json({ message: 'This code is duplicate', success: false}))
        }



        let count
        const countCode = await code.aggregate( [
            { $count: "myCount" }
         ] ).toArray();
         if(countCode.length === 0){
            count = 0
         }else {
            count =   countCode[0].myCount
         }
  
         console.log("count = ",count )

        const result = await code.insertOne({

            code_name: code_name,
            code_type: code_type,
            discount_factor: discount_factor,
            count_limit: count_limit,
            expired_date: expired_date,
            description: description,
            code_id: count,
            temp: 0
            
           
          });

        if(result){
          return( res.status(200).json({ message: 'add code success', success: true}))
        }
        else {
            return( res.status(400).json({ message: 'add code invalid', success: false}))
        }

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


}