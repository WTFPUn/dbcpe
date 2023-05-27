import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getExhibitionBookById(req, res) {

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
        console.log('Connected to database');
        const book = client.db('HotelManage').collection('exhibition_booking');
        const tier = client.db('HotelManage').collection('guess_tier');
        const role = client.db('HotelManage').collection('role');
        const per = client.db('HotelManage').collection('personal_information');

          //set time  right now 

    const tzOffset = 7; // Offset for Indochina Time (GMT+7)
    const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];
       

        
        
        const getbook  =  await book.aggregate( [
            {
                $match: {
                 $and: [
                    {'account_id': account_id},
                    {'bookstatus_id': 0}

                 ]


                   }
            },
            {
              $match: {
                'checkin_date': {
                  $gte: dateNow
                  
                }
              }
            },
            

            {
                $lookup: {
             from: "exhibition_room",
             localField: "exhibition_id",
             foreignField: "exhibition_id",
             as: "exhibition_room"
           }
            },
            
        {
                $lookup: {
            from: "type_of_exhibition",
            localField: "exhibition_room.exhibition_type_id",
            foreignField: "exhibition_type_id",
            as: "type_of_exhibition"
            }
        },{$project:{"_id":0,"exhibition_booking_id":1,"account_id":1,"exhibition_id":1,"book_date":1,"bookstatus_id":1,"checkin_date":1,"checkout_date":1,"participant_count":1,
        "exhibition_room.name":1, "type_of_exhibition.type_name":1, "type_of_exhibition.have_microphone":1, "type_of_exhibition.have_projector":1,
        "type_of_exhibition.have_wifi":1, "type_of_exhibition.have_wifi":1,  "type_of_exhibition.have_whiteboard":1,  "type_of_exhibition.sound_system":1, 
        "type_of_exhibition.catering_service":1,  "type_of_exhibition.Seating_arrangements":1, "type_of_exhibition.image":1,  }}
        

          
        ] ).toArray();

        
        let count;
        const  loop = async () => {

        for (let i=0 ; i< getbook.length; i++){

        await  fetch("http://localhost:3000/api/book/getpricebookexhibition", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                 "auth-token": token,
                 },
              
               body: JSON.stringify({bookid: getbook[i].exhibition_booking_id}),
            })
            .then((res) => res.json())
            .then((data) => {
              getbook[i]["price_summary"] = data;
              count = data.book_count

            })

            getbook[i].exhibition_room = getbook[i].exhibition_room[0]
            getbook[i].type_of_exhibition = getbook[i].type_of_exhibition[0]
            
        }

     }
     
      await loop();

    
     //check tier 

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
       
     const getRole = await role.findOne( {"role":0,"sub_role": tierId},{projection:{"_id": 0}});

     if(getRole){
      const getper = await per.updateOne(
                        
        { "account_id" : account_id },
        { $set:  { sub_role : tierId   }}
        
    );

     }

        //add user role in message


        if (getbook) {
            return res.status(200).json({book:{getRole,getbook},message: 'get book success', success: true});
          }
          else {
            return res.status(400).json({ message: 'get book failed', success: false });
          }



    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }



}