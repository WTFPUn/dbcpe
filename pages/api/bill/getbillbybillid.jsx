import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getBill(req, res) {


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

    let bill_id = (req.query?.bill_id);

    

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }
    
    
      try {
        await client.connect();
        
        const bookExhibition = client.db('HotelManage').collection('exhibition_booking');
        const bookRoom = client.db('HotelManage').collection('room_booking');
        const bill = client.db('HotelManage').collection('bill');
        const person = client.db('HotelManage').collection('personal_information');
        const code = client.db('HotelManage').collection('code');

        const getperson = await person.findOne({"account_id": account_id  },{projection:{"_id":0,"status":0,"password":0,"role":0,"sub_role":0,"date_of_birth":0,"account_id":0}}) 
        const getbill = await bill.findOne({"bill_id": bill_id,"account_id": account_id  },{projection:{"_id":0}}) 
        const getcode = await code.findOne({"code_id": getbill.code_id  },{projection:{"_id":0}})

        if(!getbill){
            return res.status(400).json({ message: 'Bill is not found', success: false });
        }

        
        let bookList = getbill.book_list
        let objectbook = []
        console.log("book_id getbill = ", bookList[0].book_id )

        const  looplenght = async () => {   
            for (const values of bookList){
                console.log("in forEach = ", values)
                if(values.book_type === 0){
                    console.log("room")

                    const getType = await bookRoom.aggregate( [
                        {
                            $match: {
                                'book_id': values.book_id
                               }
                        }
                        ,
                        {
                            
                          $lookup:
                            {
                              from: "room",
                              localField: "room_id",
                              foreignField: "room_id",
                              as: "room"
                            }
                       },

                       {
                            
                        $lookup:
                          {
                            from: "type_of_room",
                            localField: "room.roomtype_id",
                            foreignField: "roomtype_id",
                            as: "type_of_room"
                          }
                     },{$project:{"_id":0,"type_of_room.roomtype_name":1}}

                     ] ).toArray();

                     for (let i=0 ; i< getType.length; i++){
            
                        getType[i].type_of_room = getType[i].type_of_room[0]
                        
                    }
                    console.log("getType = ",getType[0].type_of_room.roomtype_name)

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
                        
                      objectbook.push(  {book_id: values.book_id,book_type: "room",description: getType[0].type_of_room.roomtype_name, amount : data.discounted_total_price } ) ;
                     
        
                    })


                }
                else if(values.book_type === 1){
                    console.log("Exhibition")

                    const getType = await  bookExhibition.aggregate( [
                        {
                            $match: {
                                'exhibition_booking_id': values.book_id
                               }
                        }
                        ,
                        {
                            
                          $lookup:
                            {
                              from: "exhibition_room",
                              localField: "exhibition_id",
                              foreignField: "exhibition_id",
                              as: "room"
                            }
                       },

                       {
                            
                        $lookup:
                          {
                            from: "type_of_exhibition",
                            localField: "room.exhibition_type_id",
                            foreignField: "exhibition_type_id",
                            as: "type_of_room"
                          }
                     },{$project:{"_id":0,"type_of_room.type_name":1}}

                     ] ).toArray();

                     for (let i=0 ; i< getType.length; i++){
            
                        getType[i].type_of_room = getType[i].type_of_room[0]
                        
                    }
                    console.log("getType = ",getType[0].type_of_room.type_name)

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
                        
                        

                      objectbook.push(  {book_id: values.book_id,book_type: "exhibition",description: getType[0].type_of_room.type_name, amount : data.discounted_total_price } ) ;
                     
        
                    })



                }



            }
        }

        await looplenght();
        

        getperson ["array_book"] = objectbook
        getperson ["create_date"] = getbill.create_date
        getperson ["pay_due_date"] = getbill.pay_due_date
        getperson ["code_name"]  =   getcode?.code_name| ""
        getperson ["code_type"] = getcode?.code_type | ""
        getperson ["discount_factor"] = getcode?.discount_factor | ""

       

    
    
      if(getperson){
        return( res.status(200).json({getbill: getperson  , message: 'Get bill success', success: true}))
      }
      else{
        return( res.status(400).json({ message: 'Get bill invalid', success: false}))
      }

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }






}