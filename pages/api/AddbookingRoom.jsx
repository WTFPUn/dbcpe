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

    
    // const checkIn = req.query?.checkIn;
    // const checkOut = req.query?.checkOut;
    // const numberOfRoom = req.query?.numberOfRoom;
    // const guests = req.query?.guests;
    // const halalStatus = req.query?.halalStatus;
    // const extrabedStatus = req.query?.extrabedStatus;
    // const cleanStatus = req.query?.cleanStatus;
    // const laundryStaus = req.query?.laundryStaus;

    const token = req.headers["auth-token"];
    const decoded = jwtdecode(token);
    const { account_id } = decoded || {};


    let checkIn = req.body?.checkIn;
    let checkOut = req.body?.checkOut;
    let guests = req.body?.guests;
    let numberOfRoom = req.body?.numberOfRoom;
    const extrabedStatus = req.body?.extrabedStatus;
    const breakfastStatus = req.body?.breakfastStatus;
    const halalStatus = req.body?.halalStatus;
    const cleanStatus = req.body?.cleanStatus;
    const laundryStatus = req.body?.laundryStatus;
    
   

    if(guests){   
      guests = parseInt(guests);
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

    if ((!checkIn && checkOut) || (checkIn && !checkOut)) {
      return res.status(400).json({ message: "fill missing error date fillter ", success: false });
    }
  
    if(checkIn && checkOut){

      checkIn = new Date(checkIn).toISOString().split("T")[0];
      checkOut = new Date(checkOut).toISOString().split("T")[0];

      if(checkIn > checkOut){
        return res.status(400).json({ message: "Date pattern is invalid  ", success: false });
      }
  
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
                  'room_no': numberOfRoom
                 }
          }
        
      ] ).toArray();

     

      if(numberRoom.length === 0){
        return res.status(400).json({ message: 'No room number', success: false });
      }

      

      console.log("id = ",numberRoom[0].room_id)


      //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];


    const checkroomid =  await book.aggregate( [
      {
          $match: {
            $and: [
              {'room_id': numberRoom[0].room_id},
              {'checkout_date': {
                $gte: bookDate
              }}
            ]

            }
      }
      
    
  ] ).toArray();


    if(!(checkroomid.length === 0)){
      return res.status(400).json({ message: 'Room is not available', success: false });
    }

      
      console.log("bookdate  ",bookDate)

      console.log("checkIn : ",checkIn)
      console.log("checkout : ",checkOut)
     

      
       const result = await book.insertOne({

            book_id: count,
            account_id: account_id,
            room_id: numberRoom[0].room_id,
            book_date: bookDate,
            bookstatus_id: 1,
            checkin_date: checkIn,
            checkout_date:  checkOut,
            breakfast_status: breakfastStatus,
            clean_need: cleanStatus,
            laundry_need: laundryStatus,
            extrabed_need: extrabedStatus,
            halal_need: halalStatus,
            guests: guests,
            bill_id: -1,
      
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