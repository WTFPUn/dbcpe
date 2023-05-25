import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function billCancel(req, res) {

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

    let  bill_id  = (req.body?.bill_id);
   
    

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

    try {
        await client.connect();

        const bill  = client.db('HotelManage').collection('bill');
        const bookRoom  = client.db('HotelManage').collection('room_booking');
        const bookEx = client.db('HotelManage').collection('exhibition_booking');
        const person = client.db('HotelManage').collection('personal_information');

        const getperson = await person.findOne({"account_id": account_id },{"_id":0});

        if(!(getperson.role === 1  &&  getperson.sub_role === 2)){
            return( res.status(400).json({ message: 'You are not Recepter ', success: false}))
        }


        const getbill = await bill.findOne({"bill_id": bill_id },{"_id":0});

        if(!getbill){
            return( res.status(400).json({ message: 'Not found this bill', success: false}))
        }


        const updatepayment = await bill.updateOne(
                        
            { "bill_id" : bill_id },
        { $set:  { payment_method : "Cancel"  }}
            
        );

       
        for ( let i=0  ; i < getbill.book_list.length; i++ ){

            if(getbill.book_list[i].book_type === 0 ){
                //room
                console.log("room")
                const updatestatusroom = await bookRoom.updateOne(
                        
                    { "book_id" : getbill.book_list[i].book_id },
                    { $set:  { bookstatus_id : 3   }}
                    
                );


            }
            else if(getbill.book_list[i].book_type === 1 ){
                //exhibition
                console.log("ex")
                const updatestatusexhibition = await bookEx.updateOne(
                        
                    { "exhibition_booking_id" : getbill.book_list[i].book_id },
                    { $set:  { bookstatus_id : 3  }}
                    
                );


            }
                
        }



        return( res.status(200).json({ message: 'Cancel bill success ', success: true}))


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }




}