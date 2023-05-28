import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";


export default async function getroomforupdate(req, res) {

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


    let  clean_status  = parseInt(req.query?.clean_status);
    let  roomtype_id = parseInt(req.query?.roomtype_id);




    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

    
      try {
        await client.connect();

        const room = client.db('HotelManage').collection('room');
        const book = client.db('HotelManage').collection('room_booking')
        const person = client.db('HotelManage').collection('personal_information')
        const work = client.db('HotelManage').collection('house_keeping_work_room')

       

        let aggregate = []

        if( (clean_status === 0 || clean_status) || ( roomtype_id === 0 || roomtype_id) ){


            aggregate.push({
                $match: {
                    "housekeeper": account_id
                }                       
            }
            )
            

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
                        from: "type_of_room",
                        localField: "roomtype_id",
                        foreignField: "roomtype_id",
                        as: "room_type"
                    }
                } 
                )

                     

                if(  roomtype_id === 0 || roomtype_id ){
                   
                    aggregate.push({
                        $match: {
                            'room_type.roomtype_id': roomtype_id
                        }                        
                    })
                }

                aggregate.push(

                                           
                        {
                            $project:{"_id":0,"room_id":1,"room_no":1,"clean_status":1,"housekeeper":1,"roomtype_id":1,"room_type.roomtype_name":1}
                        }
                )
               
        }
        else{

            aggregate.push({
                $match: {
                    "housekeeper": account_id
                }                       
            }
            )
            aggregate.push(
                {
                    $lookup: {
                        from: "type_of_room",
                        localField: "roomtype_id",
                        foreignField: "roomtype_id",
                        as: "room_type"
                    }
                },
                {
                    $project:{"_id":0,"room_id":1,"room_no":1,"clean_status":1,"housekeeper":1,"room_floor":1,"roomtype_id":1,"room_type.roomtype_name":1}
                }
            )
                
              
            
        }

        const getroom  = await room.aggregate(aggregate).toArray();


        //  set time  right now 
      const tzOffset = 7; // Offset for Indochina Time (GMT+7)
      const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

      console.log(getroom)
    


        for (let i=0 ; i< getroom.length; i++){
            
            getroom[i]["completed_time"] = null
           


            const getwork = await work.find({ "room_id":getroom[i].room_id },{$project:{"_id":0}}).toArray()
            if(getwork){
                 
                for (let j=0 ; j< getwork.length; j++){
                     if(getwork[j].cleaned_time.toISOString().split('T')[0] === dateNow ){
                            
                            getroom[i]["completed_time"] = getwork[j].cleaned_time
                            
                            const updatestatus = await room.updateOne(
                        
                                { "room_id" : getroom[i].room_id },
                            { $set:  { clean_status : 1   }}
                                
                            );
                            const getclean = await room.findOne({"room_id":getroom[i].room_id},{})

                            getroom[i].clean_status = getclean.clean_status
                    

                     }

            }

           
            getroom[i].room_type = getroom[i].room_type[0]
            }

        }




        return( res.status(200).json({  getroom ,message: 'Get room for update success', success: true}))


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }
















}