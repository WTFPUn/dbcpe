import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getSeasonSetup(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );


    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }


    try {
        await client.connect();
        console.log('Connected to database');
       
        const season = client.db('HotelManage').collection('season_setup');


        
      //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];
      console.log(bookDate)


      const seasonFactor =  await season.aggregate( [
       
        {
          '$match': {
            '$and': [
              {
                'start_date': {
                  $lte: bookDate
                 
                }
              },
              {
                'end_date': {
                  $gte: bookDate
                }
              }
            ]
          }
        }
        
      
    ] ).toArray();
   
    let factor ={}

    factor = seasonFactor[0]

     
    

    if (seasonFactor.length){
        return( res.status(200).json({ seasonFactor:factor,message: 'Get room query success', success: true}))
    }
    else{
        return( res.status(400).json({ message: 'Date now out of range', success: false}))
    }


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }




}