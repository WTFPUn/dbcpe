import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function exhibitionUpdateWorkForHouseKeeper(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    

    let  account_id  = (req.body?.account_id);
    let  room_id = (req.body?.room_id);


    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }


      try {
        await client.connect();

        
        const work = client.db('HotelManage').collection('house_keeping_work_exhibition_room')

        let count
        const countWork = await work.aggregate( [
            { $count: "myCount" }
         ] ).toArray();
         if(countWork.length === 0){
            count = 0
         }else {
            count =   countWork[0].myCount
         }
  
         console.log("count = ",count )

         let result
         for(let i=0 ; i < room_id.length ; i++ ){
            if(room_id[i].selected === true){  
                result = await work.insertOne({
                        
                        account_id: account_id,
                        cleaned_time: new Date(),
                        exhibition_id: room_id[i].exhibition_id,
                        work_id: count,
                });
            }

         }


        if(result){
            return( res.status(200).json({  message: 'Update work success', success: true}))
        }
        else{
            return( res.status(400).json({  message: 'Update work invalid', success: false}))
        }

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }




}