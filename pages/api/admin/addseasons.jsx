import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function addSeasons(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

   
    let  start_date = req.body?.start_date
    let  end_date = req.body?.end_date
    let room_price_factor = req.body?.room_price_factor
    let  service_factor = req.body?.service_factor
    let season_description = req.body?.season_description


    start_date = new Date(start_date).toISOString().split("T")[0];
    end_date = new Date(end_date).toISOString().split("T")[0];

    //set time  right now 

    const tzOffset = 7; // Offset for Indochina Time (GMT+7)
    const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];


    if(start_date <= dateNow){
        return res.status(400).json({ message: 'start_date not available', success: false });
    }
    else if(end_date <= dateNow){
       return res.status(400).json({ message: 'end_date not available', success: false });
    }



    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }


    try {
        await client.connect();

        const season  = client.db('HotelManage').collection('season_setup');

        let count
        const countSeason = await season.aggregate( [
            { $count: "myCount" }
         ] ).toArray();
         if(countSeason.length === 0){
            count = 0
         }else {
            count =   countSeason[0].myCount
         }
  
         


         const result = await season.insertOne({
            season_id: count,
            start_date: start_date,
            end_date: end_date,
            room_price_factor: room_price_factor,
            service_factor: service_factor,
            season_description: season_description
        
 
          });



          if(result){
            return res.status(200).json({ message: 'Add Seasons success', success: true });
          }
          else{
            return res.status(400).json({ message: 'Add Seasons invalid', success: false });
          }





        }catch (error) {
            console.log(error);
             return res.status(500).json({ message: error.message, success: false });
         } finally {
            await client.close();
         }


}    