import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getpricebookexhibition(req, res) {

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


    const bookid = parseInt(req.body?.bookid);


    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }


try {
        await client.connect();
        console.log('Connected to database');
        const bookExhibition = client.db('HotelManage').collection('exhibition_booking');
        const bookRoom = client.db('HotelManage').collection('room_booking');
        const tier = client.db('HotelManage').collection('guess_tier');
        const  room = client.db('HotelManage').collection('exhibition_room')
        const  typeRooom = client.db('HotelManage').collection('type_of_exhibition')
       

        let seasonfac = {}
        //get season setup

        await  fetch("http://localhost:3000/api/bill/getseasonsetup", {
            method: "GET",
        })
        .then((res) => res.json())
        .then((data) => {
          
          
            seasonfac = data.seasonFactor
          
        })
       

        //check tier 
        let countexhibition
        const countBookEx = await bookExhibition.aggregate( [
            {$match:{
                'account_id': account_id,
                'bookstatus_id': 2

            } }
            ,{ $count: "myCount" }
         ] ).toArray();



         if(countBookEx.length === 0){
            countexhibition = 0
         }else {
            countexhibition =   countBookEx[0].myCount
         }
         



         let countroom
         const countBookRoom = await bookRoom.aggregate( [
            {$match:{
                'account_id': account_id,
                'bookstatus_id': 2

            } }
            ,{ $count: "myCount" }
         ] ).toArray();



         if(countBookRoom.length === 0){
            countroom = 0
         }else {
            countroom =   countBookRoom[0].myCount
         }
        


         let count = countexhibition + countroom
         
        
         let tierId = -1
         if(count>= 0 && count< 10){
            tierId = 0
         }
         else if(count>= 10 && count< 15){
            tierId = 1
         }
         else if(count>= 15 && count< 20){
            tierId = 2
         }
         else if(count>= 20){
            tierId = 3
         }

         const getTier = await tier.findOne( {"guess_tier_id": tierId},{projection:{"_id": 0,"guess_tier_id": 1,"room_discount_factor": 1,
         "breakfast_discount_factor": 1,"laundry_discount_factor": 1 }});
         

         const getBook = await bookExhibition.findOne({"exhibition_booking_id": bookid});
         const getRoom = await room.findOne({"exhibition_id": getBook.exhibition_id });
         const getRoomType = await typeRooom.findOne({"exhibition_type_id": getRoom.exhibition_type_id })

         
         let diffOutIn = (new Date(getBook.checkout_date) - new Date(getBook.checkin_date))/ (1000 * 60 * 60 * 24)
         let total_price = 0
         let Totalpricebegin =0
         let roomfac
         let servicefac


         if(seasonfac){

            roomfac = seasonfac.room_price_factor
            servicefac = seasonfac.service_factor

            

           
           

                if(getTier){
                    // sumPrice = (breakfast*300*(1 - getTier.breakfast_discount_factor)) + (laundry*50*(1 - getTier.laundry_discount_factor)) + ((1 - getBook.room_discount_factor)*getRoomType.room_price*diffOutIn)
                    total_price =   (roomfac*(1 - getTier.room_discount_factor)*getRoomType.exhibition_price*diffOutIn) 
                    
                    Totalpricebegin =   (roomfac*getRoomType.exhibition_price*diffOutIn) 

                }
                else{
                    total_price =  (roomfac*getRoomType.exhibition_price*diffOutIn) 
                }
                if(getTier){
                    return res.status(200).json({ book_count:count,total_price:Totalpricebegin ,discounted_total_price: total_price ,message: 'get price have tier success', success: true});
                }
                else if(!getTier){
                    return res.status(200).json({ book_count:count,total_price,discounted_total_price : 0  ,message: 'get price no tier success', success: true});
                }

         }


         else if(!seasonfac){
            

            if(getTier){
                // sumPrice = (breakfast*300*(1 - getTier.breakfast_discount_factor)) + (laundry*50*(1 - getTier.laundry_discount_factor)) + ((1 - getBook.room_discount_factor)*getRoomType.room_price*diffOutIn)
                total_price =  ((1 - getTier.room_discount_factor)*getRoomType.exhibition_price*diffOutIn) 
                
                Totalpricebegin =  (getRoomType.exhibition_price*diffOutIn) 
            }
            else{
                total_price =  (getRoomType.exhibition_price*diffOutIn) 
                
            }

            if(getTier){
                return res.status(200).json({ book_count:count,total_price:Totalpricebegin ,discounted_total_price: total_price ,message: 'get price have tier success', success: true});
            }
            else if(!getTier){
                return res.status(200).json({ book_count:count,total_price, discounted_total_price: 0 ,message: 'get price no tier success', success: true});
            }

         }




        

        else {
            return res.status(400).json({ message: 'No values price', success: false });
          }

       




}catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  } finally {
    await client.close();
  }



}