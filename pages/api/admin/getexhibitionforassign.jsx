import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getroombycleanstatus(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    let  clean_status  = parseInt(req.query?.clean_status);
    let  roomtype_id = parseInt(req.query?.roomtype_id);




    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

    
      try {
        await client.connect();

        const room = client.db('HotelManage').collection('exhibition_room');
        const book = client.db('HotelManage').collection('exhibition_booking')
        const person = client.db('HotelManage').collection('personal_information')
       

        let aggregate = []

        if( (clean_status === 0 || clean_status) || ( roomtype_id === 0 || roomtype_id) ){
            

                if(clean_status === 0 || clean_status){
                 
                    aggregate.push({
                        $match: {
                            "clean_status": clean_status
                        }                       
                    }
                    
                    

                    )
                }

                aggregate.push(
                {    
                    $lookup: {
                        from: "type_of_exhibition",
                        localField: "exhibition_type_id",
                        foreignField: "exhibition_type_id",
                        as: "room_type"
                    }
                } 
                )

                     

                if(  roomtype_id === 0 || roomtype_id ){
                    
                    aggregate.push({
                        $match: {
                            'room_type.exhibition_type_id': roomtype_id
                        }                        
                    })
                }

                aggregate.push(
                    { $sort : { exhibition_id : 1 } },
                                           
                        {
                            $project:{"_id":0,"exhibition_id":1,"name":1,"clean_status":1,"housekeeper":1,"exhibition_type_id":1,"room_type.type_name":1}
                        }
                )
               
        }
        else{
            
            aggregate.push(
                {
                    $lookup: {
                        from: "type_of_exhibition",
                        localField: "exhibition_type_id",
                        foreignField: "exhibition_type_id",
                        as: "room_type"
                    }
                },
                { $sort : { exhibition_id : 1 } }
                ,
                {
                    $project:{"_id":0,"exhibition_id":1,"name":1,"clean_status":1,"housekeeper":1,"exhibition_type_id":1,"room_type.type_name":1}
                }
            )
                
              
            
        }

        const getroom  = await room.aggregate(aggregate).toArray();


         //set time  right now 

      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];
      


        for (let i=0 ; i< getroom.length; i++){


            const getbook  = await book.find({"exhibition_id": getroom[i].exhibition_id},{$project:{"_id":0}}).toArray()
            getroom[i]["availability"] =  "Occupied"

            for(let j=0 ; j< getbook.length; j++){
                 if(dateNow >= getbook[j].checkin_date && dateNow <= getbook[j].checkout_date ){
                    getroom[i]["availability"] = "Available"
                 }
                
            }


            if(getroom[i]?.housekeeper){
               
                const gethousekeeper = await person.findOne({"account_id":getroom[i].housekeeper },{"_id":0});

                getroom[i]["housekeeper_fullname"] = `${gethousekeeper.first_name} ${gethousekeeper.last_name}`
            }
            else{
                getroom[i]["housekeeper_fullname"] = "";
            }

            getroom[i].room_type = getroom[i].room_type[0]

        }

        return( res.status(200).json({getroom  , message: 'Get exhibition room for assign success', success: true}))


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }




}
