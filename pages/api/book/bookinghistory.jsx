import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function bookinghistory(req, res) {

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


    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }
    


      try {
        await client.connect();

        const bill  = client.db('HotelManage').collection('bill');
        const bookRoom = client.db('HotelManage').collection('room_booking');
        const bookEx =  client.db('HotelManage').collection('exhibition_booking');


        const getbill = await bill.find({"account_id": account_id },{projection:{"_id":0}}).toArray();
        
        
        for (let i=0 ; i< getbill.length; i++){
            let arraybook = []
            for (let j=0 ; j < getbill[i].book_list.length; j++){
              
                if(getbill[i].book_list[j].book_type === 0 ){
                    console.log("Room")
                    console.log("bookid55555 = ",getbill[i].book_list[j].book_id )
                   
                    const getbook = await bookRoom.findOne({"book_id": parseInt(getbill[i].book_list[j].book_id) },{projection:{"_id":0,"book_id":1,"room_id":1,"book_date":1
                    ,"checkin_date":1,"checkout_date":1}})
                    getbook["roomtype"] = "room"
                    arraybook.push(getbook)  
                }
                else if(getbill[i].book_list[j].book_type === 1){
                    console.log("Ex")
                    const getEx = await bookEx.findOne({"exhibition_booking_id": parseInt(getbill[i].book_list[j].book_id)},{projection:{"_id":0,"exhibition_booking_id":1,"exhibition_id":1
                    ,"book_date":1,"checkin_date":1, "checkout_date":1}})
                    getEx["roomtype"] = "exhibition"
                    arraybook.push(getEx)
                }
                


            }
            getbill[i]["book"] = arraybook
        }



        return( res.status(200).json({getbill  , message: 'Get bill success', success: true}))

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }






}