import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getpricebookroom(req, res) {

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
        
        const bookRoom = client.db('HotelManage').collection('room_booking');
        const bookExhibition = client.db('HotelManage').collection('exhibition_booking');
        const tier = client.db('HotelManage').collection('guess_tier');
        const  room = client.db('HotelManage').collection('room')
        const  typeRooom = client.db('HotelManage').collection('type_of_room')
        const season = client.db('HotelManage').collection('season_setup')

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

         const getBook = await bookRoom.findOne({"book_id": bookid});
         const getRoom = await room.findOne({"room_id": getBook.room_id});
         const getRoomType = await typeRooom.findOne({"roomtype_id": getRoom.roomtype_id})

         
         
         let diffOutIn = (new Date(getBook.checkout_date) - new Date(getBook.checkin_date))/ (1000 * 60 * 60 * 24)
         let laundry = 0
         let total_price = 0
         let extraBed =0
         let Totalpricebegin =0
         let roomfac
         let servicefac

        if(getBook.extrabed_need){
            extraBed = 1
        }
         if(getBook.laundry_need){
            laundry = 1
         }

         if(seasonfac){

            roomfac = seasonfac.room_price_factor
            servicefac = seasonfac.service_factor


           
            

                if(getTier){
                    // sumPrice = (breakfast*300*(1 - getTier.breakfast_discount_factor)) + (laundry*50*(1 - getTier.laundry_discount_factor)) + ((1 - getBook.room_discount_factor)*getRoomType.room_price*diffOutIn)
                    total_price = (300*(1 - getTier.breakfast_discount_factor)*servicefac) + (laundry*50*(1 - getTier.laundry_discount_factor)*servicefac) + (roomfac*(1 - getTier.room_discount_factor)*getRoomType.room_price*diffOutIn) + (servicefac*extraBed*100)
                    
                    Totalpricebegin = (300*servicefac)  + (servicefac*laundry*50) + (roomfac*getRoomType.room_price*diffOutIn) + (servicefac*extraBed*100)

                }
                else{
                    total_price = (300*servicefac)  + (servicefac*laundry*50) + (roomfac*getRoomType.room_price*diffOutIn) + (servicefac*extraBed*100)
                    
                }
                if(getTier){
                    return res.status(200).json({ book_count: count ,total_price:Totalpricebegin ,discounted_total_price: total_price ,discounted_breakfast:(300*(1 - getTier.breakfast_discount_factor)*servicefac),discounted_laundry:(laundry*50*(1 - getTier.laundry_discount_factor)*servicefac)
                        ,discounted_priceroom:((1 - getTier.room_discount_factor)*getRoomType.room_price*diffOutIn*roomfac), priceRoom:(getRoomType.room_price*roomfac), laundry : (servicefac*laundry*50), breakfast:(servicefac *300), extraBed : (extraBed*100*servicefac)    ,message: 'get price have tier success', success: true});
                }
                else if(!getTier){
                    return res.status(200).json({ book_count: count ,total_price,discounted_total_price : 0,discounted_breakfast: 0,discounted_laundry: 0,discounted_priceroom: 0,  
                         priceRoom:(getRoomType.room_price*roomfac), laundry : (servicefac*laundry*50) ,breakfast:(servicefac*300),extraBed:(servicefac*100*extraBed)    ,message: 'get price no tier success', success: true});
                }

         }


         else if(!seasonfac){
            

            if(getTier){
                
                total_price = (300*(1 - getTier.breakfast_discount_factor)) + (laundry*50*(1 - getTier.laundry_discount_factor)) + ((1 - getTier.room_discount_factor)*getRoomType.room_price*diffOutIn) + (extraBed*100)
                
                Totalpricebegin = (300)  + (laundry*50) + (getRoomType.room_price*diffOutIn) + (extraBed*100)

            }
            else{
                total_price = (300)  + (laundry*50) + (getRoomType.room_price*diffOutIn) + (extraBed*100)
                
            }

            if(getTier){
                return res.status(200).json({ book_count: count ,total_price:Totalpricebegin ,discounted_total_price: total_price ,discounted_breakfast:(300*(1 - getTier.breakfast_discount_factor)),discounted_laundry:(laundry*50*(1 - getTier.laundry_discount_factor))
                    ,discounted_priceroom:((1 - getTier.room_discount_factor)*getRoomType.room_price*diffOutIn), priceRoom:getRoomType.room_price, laundry : laundry*50, breakfast: 300, extraBed : extraBed*100    ,message: 'get price have tier success', success: true});
            }
            else if(!getTier){
                return res.status(200).json({ book_count: count ,total_price,discounted_total_price: 0,discounted_breakfast: 0,discounted_laundry:0,discounted_priceroom:0,
                     priceRoom:getRoomType.room_price, laundry : laundry*50,breakfast: 300,extraBed:100*extraBed    ,message: 'get price no tier success', success: true});
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
