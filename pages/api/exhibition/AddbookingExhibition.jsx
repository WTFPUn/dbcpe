import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function addBookingExhibition(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
   
    const token = req.headers["auth-token"];
    const decoded = jwtdecode(token);
    const { account_id } = decoded || {};

  
    let checkin_date = req.body?.checkin_date;
    let checkout_date = req.body?.checkout_date;
    const exhibition_id = parseInt(req.body?.exhibition_id);
    const participant = parseInt(req.body?.participant);
   
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }
      
    if ((!checkin_date && checkout_date) || (checkin_date && !checkout_date)) {
      return res.status(400).json({ message: "fill missing error date fillter ", success: false });
    }
  
    if(checkin_date && checkout_date){

      checkin_date = new Date(checkin_date).toISOString().split("T")[0];
      checkout_date = new Date(checkout_date).toISOString().split("T")[0];
      

      if(checkin_date > checkout_date){
        return res.status(400).json({ message: "Date pattern is invalid", success: false });
      }
  
    }

    
    try {
        await client.connect();
        console.log('Connected to database');
        const book = client.db('HotelManage').collection('exhibition_booking');
        const room = client.db('HotelManage').collection('exhibition_room');

        
      let count
        const countBook = await book.aggregate( [
            { $count: "myCount" }
         ] ).toArray();
         if(countBook.length === 0){
            count = 0
         }else {
            count =   countBook[0].myCount
         }
  
         console.log("count = ",count )


         // find match between numberroom with id room
        const numberRoom =  await room.aggregate( [
          {
              $match: {
                  'exhibition_id': exhibition_id
                 }
          }
        
      ] ).toArray();

     

      if(numberRoom.length === 0){
        return res.status(400).json({ message: 'No exhibition', success: false });
      }

      //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

    const checkroomid =  await book.aggregate( [
      {
          $match: {
              'exhibition_id': exhibition_id
            }
      },
      {
        '$match': {
          '$or': [
            {
              'checkin_date': {
                $gte: checkin_date,
                $lte: checkout_date
              }
            },
            {
              'checkout_date': {
                $gte: checkin_date,
                $lte: checkout_date
              }
            }
          ]
        }
      }
      
    
  ] ).toArray();


    if(!(checkroomid.length === 0)){
      return res.status(400).json({ message: 'Exhibition is not available', success: false });
    }

      
      console.log("bookdate  ",bookDate)

      console.log("checkIn : ",checkin_date)
      console.log("checkout : ",checkout_date)

      
       const result = await book.insertOne({

            exhibition_booking_id: count,
            account_id: account_id,
            exhibition_id: exhibition_id,
            bookstatus_id: 1,
            book_date: bookDate,   
            checkin_date: checkin_date,
            checkout_date: checkout_date,
            participant_count: participant,

       });



       if (result) {
        return res.status(200).json({ message: 'Add booking success', success: true});
      }
      else {
        return res.status(400).json({ message: 'Add booking failed', success: false });
      }

        
    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }



}