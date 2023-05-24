import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function roomAssignWorkForHouseKeeper(req, res) {

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
    let  room_id = parseInt(req.body?.room_id);


    console.log("account_id = ",account_id)
    console.log("room_id = ", room_id)

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

      try {
        await client.connect();

        const room  = client.db('HotelManage').collection('room');

        const result = await room.updateOne(
          
            { "room_id" : room_id },
           { $set:  { housekeeper : account_id   }}
            
          );

        
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