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

    // parse string body to object
    var body = JSON.parse(req.body);

    const { room_id, account_id } = body;
    console.log(room_id, account_id)
    

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

      try {
        await client.connect();

        const room  = client.db('HotelManage').collection('room');

        let result
        for(let i=0 ; i < room_id.length ; i++ ){

            if(room_id[i].selected === true){
                        
                result = await room.updateOne(
                
                    { "room_id" : room_id[i].room_id },
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