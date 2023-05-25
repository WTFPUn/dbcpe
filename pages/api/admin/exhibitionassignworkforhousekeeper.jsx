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

    let account_id  = req.body?.account_id;
    let room_id = req.body?.room_id 

    

    // var body = JSON.parse(req.body);

    // const { room_id, account_id } = body;


    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

      try {
        await client.connect();

        const room  = client.db('HotelManage').collection('exhibition_room');
        
        
        let result
        for(let i=0 ; i < room_id.length ; i++ ){
            if(room_id[i].selected === true){
                    const getroom = await  room.findOne({ "exhibition_id":room_id[i].exhibition_id },{$project:{"_id":0}});
                    if(getroom.clean_status === 1 ){
                        return (res.status(400).json({ message: 'This room you selected is clean', success: false}))
                    }
                }
        }


        for(let j=0 ; j < room_id.length ; j++ ){
            console.log("true eiei")
            if(room_id[j].selected === true){
                        console.log("true")
                    result = await room.updateOne(
                    
                        { "exhibition_id" : room_id[j].exhibition_id },
                    { $set:  { housekeeper : account_id   }}
                        
                    );
             
            }
        }

        if(result){  
            return( res.status(200).json({ message: 'Assign exhibition work success', success: true}))
        }
        else{
            return( res.status(400).json({ message: 'Assign exhibition work invalid', success: false}))
        }

        
       

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }





}