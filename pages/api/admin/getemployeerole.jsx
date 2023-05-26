import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getEmployeeRole(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );




    try {
        await client.connect();

        const role  = client.db('HotelManage').collection('role');
        
        const getrole = await role.find({"role": 1},{projection:{"_id":0,"sub_role":1,"sub_name":1}}).toArray() 
        

    
        return( res.status(200).json({ getemployeerole:getrole, message: 'Get role type success', success: true}))



    
    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


}