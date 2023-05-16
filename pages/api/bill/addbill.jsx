import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";
import { v4 as uuidv4 } from 'uuid';

export default async function addBill(req, res) {

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


    let book_list = req.body?.book_list;
    let code_id = req.body?.code_id;
    let getprice = 0
    


    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }





          
    const  looplenght = async () => {   
            for (const values of book_list){
                console.log("in forEach = ", values)
                 if(values.book_type === 0){
                    console.log("room")
                    
                    await  fetch("http://localhost:3000/api/book/getpricebookroom", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                         "auth-token": token,
                         },
                      
                       body: JSON.stringify({bookid: values.book_id}),
                    })
                    .then((res) => res.json())
                    .then((data) => {

                        
                      getprice = data.discounted_total_price + getprice;
                      console.log("getprice = ", getprice)
        
                    })
                     
                
                }
                       
               
                else if(values.book_type === 1){
                    console.log("Exhibition")

                    await  fetch("http://localhost:3000/api/book/getpricebookexhibition", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                         "auth-token": token,
                         },
                      
                       body: JSON.stringify({bookid: values.book_id}),
                    })
                    .then((res) => res.json())
                    .then((data) => {

                        
                      getprice = data.discounted_total_price + getprice;
                      console.log("getprice = ", getprice)
        
                    })
                }
                
            };

        
    }    

    await  looplenght();
   
           
        
    try {
        await client.connect();
        console.log('Connected to database');
        const book = client.db('HotelManage').collection('room_booking');
        // const roomquery =  client.db('HotelManage').collection('room');
        const bill = client.db('HotelManage').collection('bill');
        const code = client.db('HotelManage').collection('code');
        const bookEx = client.db('HotelManage').collection('exhibition_booking');
        const bookRoom = client.db('HotelManage').collection('room_booking');

         //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const bookDate = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];


        if(typeof (code_id) === "number"){

            const getcode = await code.findOne({"code_id": code_id},{projection:{"_id":0}}) 
            if(getcode.temp === getcode.count_limit){
                return res.status(400).json({ message: 'This code is over limit', success: false });
            
            }
            if(bookDate === getcode.expired_date){
                return res.status(400).json({ message: 'This code is out of range', success: false });
            }


            if(getcode.code_type === "persen"){
                getprice = getprice * (1-getcode.discount_factor)
            }
            else if(getcode.code_type === "fixed"){
                console.log("fixed")
                getprice = getprice - getcode.discount_factor
            }

           

            const updateTemp = await code.updateOne(
            
                { "code_id": code_id },
            { $set:  { temp: getcode.temp + 1 } }
                
            );

         }

         console.log("getprice after = ",getprice)


        
         let count = uuidv4();


         const result = await bill.insertOne({

            account_id: account_id,
            bill_id: count,
            book_list: book_list,
            code_id: code_id,
            create_date: new Date(),
            total_bill: getprice,
           
      
      
          });






        if(result){
                    for (const values of book_list){

                        if(values.book_type === 0){
                            const updateBookRoom = await bookRoom.updateOne(
            
                                { "book_id": values.book_id },
                            { $set:  { bookstatus_id: 0 } }
                                
                            );

                        }

                        else if(values.book_type === 1){
                            const updateBookEx = await bookEx.updateOne(
            
                                { "exhibition_booking_id": values.book_id },
                            { $set:  { bookstatus_id: 0 } }
                                
                            );

                        }


                    }


                

             return( res.status(200).json({ bill_id : count ,message: 'Add bill success', success: true}))
        }
        else {
            return( res.status(400).json({ message: 'Add bill Failed', success: false}))
        }



    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }




}
