import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getAnalysis(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }


    try {
        await client.connect();

        const bookRoom  = client.db('HotelManage').collection('room_booking');
        const bookEx   = client.db('HotelManage').collection('exhibition_booking');
        const room  = client.db('HotelManage').collection('room');
        const exhibition = client.db('HotelManage').collection('exhibition_room');
        const roomType  = client.db('HotelManage').collection('type_of_room');
        const exType  = client.db('HotelManage').collection('type_of_exhibition');
        const per = client.db('HotelManage').collection('personal_information');
        const role = client.db('HotelManage').collection('role');

        const getbookRoom = await bookRoom.aggregate([

            {
                $match: {
                    "bookstatus_id": {$ne: 3 }
                }
            },
            {
                $lookup: {
                    from: "room",
                    localField: "room_id",
                    foreignField: "room_id",
                    as: "room"
                }

            },
            {
                $project:{"_id":0,"account_id":1,"book_id":1,"room_id":1,"checkin_date":1,"checkout_date":1,"guests":1,"room.roomtype_id": 1}
            }





        ]).toArray()
       const getbookEx  = await bookEx.aggregate([
        {
            $match: {
                "bookstatus_id": {$ne: 3 }
            }
        },

        {
            $lookup: {
                from: "exhibition_room",
                localField: "exhibition_id",
                foreignField: "exhibition_id",
                as: "room"
            }

        },
        {
            $project:{"_id":0,"account_id":1,"exhibition_booking_id":1,"exhibition_id":1,"checkin_date":1,"checkout_date":1,"participant_count":1,"room.exhibition_type_id": 1}
        }


       ]).toArray()


        
        //set time  right now 

        const tzOffset = 7; // Offset for Indochina Time (GMT+7)
        const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

        let now = dateNow.split("-")
        console.log("now = ",now)

        let accommodation = []
        let Exhibition = []

        accommodation[0] = {label:"Standard",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"6C6EF2"}
        accommodation[1] = {label:"King",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"61890FF"}
        accommodation[2] = {label:"Queen",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"4BD4FF"}
        accommodation[3] = {label:"Deluxe",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FF9F9F"}
        accommodation[4] = {label:"Loft",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FF6B4A"}
        accommodation[5] = {label:"Suite",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FFA030"}
        accommodation[6] = {label:"Honeymoon",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FAB248"}
        accommodation[7] = {label:"Executive",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"ACE89D"}
        accommodation[8] = {label:"Penthouse",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"3AB25C"}

     

        Exhibition[0]  = {label:"Board",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"6C6EF2"}
        Exhibition[1]  = {label:"Exhibition",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"1890FF"}
        Exhibition[2]  = {label:"Ball",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"4BD4FF"}
        Exhibition[3]  = {label:"Conference",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FF6B4A"}
        Exhibition[4]  = {label:"Meeting",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"FFA030"}
        Exhibition[5]  = {label:"Training",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"3AB25C"}
        

       //Accommodation

        for(let i = 0 ; i < getbookRoom.length ; i++){
            let date = getbookRoom[i].checkin_date.split("-")
            console.log("date = ",date[0])
            if(date[0] === now[0]){
                const getType = await  roomType.findOne({ "roomtype_id": getbookRoom[i].room[0].roomtype_id },{}) 
                let month = date[1]
                console.log(getType.roomtype_name )

                if(getType.roomtype_name === "Standard Room"){
                    accommodation[0].data[parseInt(month)] =  accommodation[0].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "King Room"){
                    accommodation[1].data[parseInt(month)] =  accommodation[1].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Queen Room"){
                    accommodation[2].data[parseInt(month)] =  accommodation[2].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Deluxe Room"){
                    accommodation[3].data[parseInt(month)] =  accommodation[3].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Loft Room"){
                    accommodation[4].data[parseInt(month)] =  accommodation[4].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Suite"){
                    accommodation[5].data[parseInt(month)] =  accommodation[5].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Honeymoon Suite"){
                    accommodation[6].data[parseInt(month)] =  accommodation[6].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Executive Suite"){
                    accommodation[7].data[parseInt(month)] =  accommodation[7].data[parseInt(month)] + getbookRoom[i].guests
                }
                else if(getType.roomtype_name === "Penthouse Suite"){
                    accommodation[8].data[parseInt(month)] =  accommodation[8].data[parseInt(month)] + getbookRoom[i].guests
                }

            }
            
        }

        // Exhibition


        for(let i = 0 ; i < getbookEx.length ; i++){
            let date = getbookEx[i].checkin_date.split("-")
            console.log("date = ",date[0])
            if(date[0] === now[0]){
                const getType = await  exType.findOne({ "exhibition_type_id": getbookEx[i].room[0].exhibition_type_id },{}) 
                let month = date[1]
                console.log(getType.type_name)

                if(getType.type_name === "Boardroom"){
                    Exhibition[0].data[parseInt(month)] =   Exhibition[0].data[parseInt(month)] + getbookEx[i].participant_count
                }
                else if(getType.type_name === "Exhibition Hall"){
                    Exhibition[1].data[parseInt(month)] =   Exhibition[1].data[parseInt(month)] + getbookEx[i].participant_count
                }
                else if(getType.type_name === "Ballroom"){
                    Exhibition[2].data[parseInt(month)] =   Exhibition[2].data[parseInt(month)] + getbookEx[i].participant_count
                }
                else if(getType.type_name === "Conference Room"){
                    Exhibition[3].data[parseInt(month)] =   Exhibition[3].data[parseInt(month)] + getbookEx[i].participant_count
                }
                else if(getType.type_name === "Meeting Room"){
                    Exhibition[4].data[parseInt(month)] =   Exhibition[4].data[parseInt(month)] + getbookEx[i].participant_count
                }
                else if(getType.type_name === "Training Room"){
                    Exhibition[5].data[parseInt(month)] =   Exhibition[5].data[parseInt(month)] + getbookEx[i].participant_count
                }
                

            }
            
        }





        return res.status(200).json({ accommodation,Exhibition ,message: 'success', success: true});


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}