import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function deleteSeasons(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );


   
    let  season_id = req.body?. season_id


    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }


    try {
        await client.connect();

        const season  = client.db('HotelManage').collection('season_setup');

        const getseason =  await  season.findOne({"season_id": season_id },{})
        
        if(!getseason){
            return res.status(400).json({ message: 'Not found this season', success: false });
        }

        const result  = await  season.deleteOne({season_id: season_id}) 

        if(result){
            return res.status(200).json({ message: 'Delete season success', success: true });
        }
        else {
            return res.status(400).json({ message: 'Delete season invalid', success: true });
        }




    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}