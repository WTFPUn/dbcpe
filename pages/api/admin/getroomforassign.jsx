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

        const room = client.db('HotelManage').collection('room');
        const roomtype = client.db('HotelManage').collection('type_of_room')

        let aggregate = []

        if( (clean_status === 0 || clean_status) || ( roomtype_id === 0 || roomtype_id) ){
            console.log("hello ")

                if(clean_status === 0 || clean_status){
                    console.log("eiei")
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
                    console.log("roomtype")
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
                    $project:{"_id":0,"room_id":1,"room_no":1,"clean_status":1,"housekeeper":1,"roomtype_id":1,"room_type.roomtype_name":1}
                }
            )
                
              
            
        }

        const getroom  = await room.aggregate(aggregate).toArray();


        for (let i=0 ; i< getroom.length; i++){

            getroom[i].room_type = getroom[i].room_type[0]

        }

        return( res.status(200).json({getroom  , message: 'Get room for assign success', success: true}))


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }






}