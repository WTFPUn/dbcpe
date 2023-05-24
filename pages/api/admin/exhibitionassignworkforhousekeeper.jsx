import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function exhibitionAssignWorkForHouseKeeper(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    let   account_id  = req.body?.account_id;
    let room_id = req.body?.room_id 




    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

      try {
        await client.connect();

        const room  = client.db('HotelManage').collection('exhibition_room');
        let result
        for(let i=0 ; i < room_id.length ; i++ ){

            if(room_id[i].selected === true){
                 result = await room.updateOne(
                
                    { "exhibition_id" : room_id[i].exhibition_id },
                { $set:  { housekeeper : account_id   }}
                    
                );


            }
        }

        if(result){  
            return( res.status(200).json({ message: 'Assign work success', success: true}))
        }
        else{
            return( res.status(200).json({ message: 'Assign work invalid', success: false}))
        }

        
       

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }





}