import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function addBookingRoom(req, res) {

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
    let laundry_date = req.body?.laundry_date
    let Guest = req.body?.Guest;
    const room_id = parseInt(req.body?.room_id);
    const extra_bed = req.body?.extra_bed;
    const breakfast = req.body?.breakfast;
    const halal = req.body?.halal;
    const cleaning = req.body?.cleaning;
    const laundry = req.body?.laundry;
    
   

    if(Guest){   
      Guest = parseInt(Guest);
    }

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
        return res.status(400).json({ message: "Date pattern is invalid  ", success: false });
      }
  
  }

    if(laundry && laundry_date){
      laundry_date = new Date(laundry_date).toISOString().split("T")[0];
        
      if( !(laundry_date >=  checkin_date && laundry_date <= checkout_date)  ){
        return res.status(400).json({ message: "laundry date is not in the booking period ", success: false });
      }

    }

    else if(!laundry && laundry_date){
      return res.status(400).json({ message: "Do not select laundry service", success: false });
    }
    else if(laundry && !laundry_date){
      return res.status(400).json({ message: "Do not select laundry date", success: false });
    }


    
    try {
        await client.connect();
        console.log('Connected to database');
        const book = client.db('HotelManage').collection('room_booking');
        const room = client.db('HotelManage').collection('room');

        
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
                  'room_id': room_id
                 }
          }
        
      ] ).toArray();

     

      if(numberRoom.length === 0){
        return res.status(400).json({ message: 'No room number', success: false });
      }

      

      //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

     


    const checkroomid =  await book.aggregate( [
      {
          $match: {
              'room_id': room_id
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
      return res.status(400).json({ message: 'Room is not available', success: false });
    }

      
      console.log("bookdate  ",bookDate)

      console.log("checkIn : ",checkin_date)
      console.log("checkout : ",checkout_date)

      
       const result = await book.insertOne({

            book_id: count,
            account_id: account_id,
            room_id: room_id,
            book_date: bookDate,
            bookstatus_id: 1,
            checkin_date: checkin_date,
            checkout_date:  checkout_date,
            breakfast_status: breakfast,
            clean_need: cleaning,
            laundry_need: laundry,
            extrabed_need: extra_bed,
            halal_need: halal,
            guests: Guest,
            bill_id: -1,
            laundry_date: laundry_date,
      
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