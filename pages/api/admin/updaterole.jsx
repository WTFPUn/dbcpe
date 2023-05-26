import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function updaterole(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );


    let account_id = req.body?.account_id
    let subrole_id = parseInt(req.body?.subrole_id)


    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }


      try {
        await client.connect();

        const person  = client.db('HotelManage').collection('personal_information');

        const getperson = await person.findOne({"account_id": account_id},{})

        if(!getperson){
            return  res.status(400).json({ message: 'Not found person', success: false });
        } 


        let updaterole

        if(getperson.role === 0 ){
             updaterole = await person.updateOne(
                        
                { "account_id" : account_id },
            { $set:  { role : 1  }}
                
            );
            updaterole = await person.updateOne(
                        
                { "account_id" : account_id },
            { $set:  { sub_role : subrole_id }}
                
            );

        }
        else if(getperson.role === 1 ){
          
           updaterole = await person.updateOne(
                       
               { "account_id" : account_id },
           { $set:  { sub_role : subrole_id }}
               
           );

       }


       if(updaterole){
            return res.status(200).json({ message: 'Update role success', success: false });
       }
       else{
        return res.status(400).json({ message: 'Update role invalid', success: false });
       }


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


}