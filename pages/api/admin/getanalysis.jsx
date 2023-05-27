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
        const houseRoom = client.db('HotelManage').collection('house_keeping_work_room');
        const houseEx = client.db('HotelManage').collection('house_keeping_work_exhibion_room');


        // const count = (val) =>{

        //     let count = val.reduce((acc, curr) => {
        //         if (typeof acc[curr] == 'undefined') {
        //           acc[curr] = 1
        //         } else {
        //           acc[curr] += 1
        //         }
              
        //         return acc
        //       }
        //       return count
        
        // }

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
       

        let accommodation = []
        let Exhibition = []

        accommodation[0] = {label:"Standard",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#6C6EF2"}
        accommodation[1] = {label:"King",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#1890FF"}
        accommodation[2] = {label:"Queen",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#4BD4FF"}
        accommodation[3] = {label:"Deluxe",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF9F9F"}
        accommodation[4] = {label:"Loft",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF6B4A"}
        accommodation[5] = {label:"Suite",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FFA030"}
        accommodation[6] = {label:"Honeymoon",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FAB248"}
        accommodation[7] = {label:"Executive",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#ACE89D"}
        accommodation[8] = {label:"Penthouse",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#3AB25C"}

     

        Exhibition[0]  = {label:"Board",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#6C6EF2"}
        Exhibition[1]  = {label:"Exhibition",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#1890FF"}
        Exhibition[2]  = {label:"Ball",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#4BD4FF"}
        Exhibition[3]  = {label:"Conference",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF6B4A"}
        Exhibition[4]  = {label:"Meeting",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FFA030"}
        Exhibition[5]  = {label:"Training",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#3AB25C"}
        

       //Accommodation

        for(let i = 0 ; i < getbookRoom.length ; i++){
            let date = getbookRoom[i].checkin_date.split("-")
            
            if(date[0] === now[0]){
                const getType = await  roomType.findOne({ "roomtype_id": getbookRoom[i].room[0].roomtype_id },{}) 
                let month = date[1]
                

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
            
            if(date[0] === now[0]){
                const getType = await  exType.findOne({ "exhibition_type_id": getbookEx[i].room[0].exhibition_type_id },{}) 
                let month = date[1]
                

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


        // line


        const getbookRoomline = await bookRoom.aggregate([

            {
                $match: {
                    "bookstatus_id":  2 
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
       const getbookExline  = await bookEx.aggregate([
        {
            $match: {
                "bookstatus_id":  2 
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



       let accommodationLine = []
       let ExhibitionLine = []

       accommodationLine[0] = {label:"Standard",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#6C6EF2",borderColor:"#6C6EF2"}
       accommodationLine[1] = {label:"King",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#1890FF",borderColor:"#1890FF"}
       accommodationLine[2] = {label:"Queen",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#4BD4FF",borderColor:"#4BD4FF" }
       accommodationLine[3] = {label:"Deluxe",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF9F9F",borderColor:"#FF9F9F"}
       accommodationLine[4] = {label:"Loft",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF6B4A",borderColor:"#FF6B4A"}
       accommodationLine[5] = {label:"Suite",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FFA030",borderColor:"#FFA030"}
       accommodationLine[6] = {label:"Honeymoon",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FAB248",borderColor:"#FAB248"}
       accommodationLine[7] = {label:"Executive",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#ACE89D",borderColor:"#ACE89D"}
       accommodationLine[8] = {label:"Penthouse",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#3AB25C",borderColor:"#3AB25C"}

    

       ExhibitionLine[0]  = {label:"Board",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#6C6EF2",borderColor:"#6C6EF2"}
       ExhibitionLine[1]  = {label:"Exhibition",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#1890FF",borderColor:"#1890FF"}
       ExhibitionLine[2]  = {label:"Ball",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#4BD4FF",borderColor:"#4BD4FF"}
       ExhibitionLine[3]  = {label:"Conference",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FF6B4A",borderColor: "#FF6B4A"}
       ExhibitionLine[4]  = {label:"Meeting",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#FFA030",borderColor:"#FFA030"}
       ExhibitionLine[5]  = {label:"Training",data:[0,0,0,0,0,0,0,0,0,0,0,0],backgroundColor:"#3AB25C",borderColor:"#3AB25C"}
       
 //Accommodation

 for(let i = 0 ; i < getbookRoomline.length ; i++){
    let date = getbookRoomline[i].checkin_date.split("-")
    
    if(date[0] === now[0]){
        const getType =  await roomType.findOne({ "roomtype_id": getbookRoomline[i].room[0].roomtype_id },{}) 
        let between  = (new Date(getbookRoomline[i].checkout_date) - new Date(getbookRoomline[i].checkin_date)) / (1000 * 60 * 60 * 24)
        let month = date[1]
        
        if(getType.roomtype_name === "Standard Room"){
            accommodationLine[0].data[parseInt(month)] =  accommodationLine[0].data[parseInt(month)] + (getType.room_price*between) 
        }
        else if(getType.roomtype_name === "King Room"){
            accommodationLine[1].data[parseInt(month)] =  accommodationLine[1].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Queen Room"){
            accommodationLine[2].data[parseInt(month)] =  accommodationLine[2].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Deluxe Room"){
            accommodationLine[3].data[parseInt(month)] =  accommodationLine[3].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Loft Room"){
            accommodationLine[4].data[parseInt(month)] =  accommodationLine[4].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Suite"){
            accommodationLine[5].data[parseInt(month)] =  accommodationLine[5].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Honeymoon Suite"){
            accommodationLine[6].data[parseInt(month)] =  accommodationLine[6].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Executive Suite"){
            accommodationLine[7].data[parseInt(month)] =  accommodationLine[7].data[parseInt(month)] + (getType.room_price*between)
        }
        else if(getType.roomtype_name === "Penthouse Suite"){
            accommodationLine[8].data[parseInt(month)] =  accommodationLine[8].data[parseInt(month)] + (getType.room_price*between)
        }

    }
    
}

// Exhibition


for(let i = 0 ; i < getbookExline.length ; i++){
    let date = getbookExline[i].checkin_date.split("-")
    
    if(date[0] === now[0]){
        const getType = await  exType.findOne({ "exhibition_type_id": getbookExline[i].room[0].exhibition_type_id },{})
        let between  = (new Date(getbookExline[i].checkout_date) - new Date(getbookExline[i].checkin_date)) / (1000 * 60 * 60 * 24) 
        let month = date[1]
        

        if(getType.type_name === "Boardroom"){
            ExhibitionLine[0].data[parseInt(month)] =   ExhibitionLine[0].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        else if(getType.type_name === "Exhibition Hall"){
            ExhibitionLine[1].data[parseInt(month)] =   ExhibitionLine[1].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        else if(getType.type_name === "Ballroom"){
            ExhibitionLine[2].data[parseInt(month)] =   ExhibitionLine[2].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        else if(getType.type_name === "Conference Room"){
            ExhibitionLine[3].data[parseInt(month)] =   ExhibitionLine[3].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        else if(getType.type_name === "Meeting Room"){
            ExhibitionLine[4].data[parseInt(month)] =   ExhibitionLine[4].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        else if(getType.type_name === "Training Room"){
            ExhibitionLine[5].data[parseInt(month)] =   ExhibitionLine[5].data[parseInt(month)] + (getType.exhibition_price*between)
        }
        

    }
    
}



// pies

const getHouseRoom  = await houseRoom.aggregate([
   
    {
        $lookup: {
            from: "room",
            localField: "room_id",
            foreignField: "room_id",
            as: "room"
        }

    },
    {
        $project:{"_id":0,"account_id":1,"cleaned_time":1,"room_id":1,"work_id":1,"room.roomtype_id":1}
    }


   ]).toArray()



   const getHouseEx  = await houseEx.aggregate([
   
    {
        $lookup: {
            from: "exhibition_room",
            localField: "exhibition_id",
            foreignField: "exhibition_id",
            as: "room"
        }

    },
    {
        $project:{"_id":0,"account_id":1,"cleaned_time":1,"exhibition_id":1,"room.exhibition_type_id": 1}
    }


   ]).toArray()

   console.log(getHouseEx)
   console.log("hello")


   let accommodationPies = []
   let ExhibitionPies = []

   accommodationPies[0] = {["Standard"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[1] = {["King"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[2] = {["Queen"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']} }
   accommodationPies[3] = {["Deluxe"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']} }
   accommodationPies[4] = {["Loft"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[5] = {["Suite"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[6] = {["Honeymoon"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[7] = {["Executive"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[8] = {["Penthouse"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}



   ExhibitionPies[0]  = {["Board"]: {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[1]  = {["Exhibition"]: {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[2] = {["Ball"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[3] = {["Conference"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[4]  = {["Meeting"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[5]  = {["Training"] : {labels:[],data:[0,0,0,0,0,0],backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}


 


const accType = ["Standard","King","Queen","Deluxe","Loft","Suite","Honeymoon","Executive","Penthouse"]

 //Accommodation
 let object = {}
 object["Standard"] = []
 object["King"] = []
 object["Queen"] = []
 object["Deluxe"] = []
 object["Loft"] = []
 object["Suite"] = []
 object["Honeymoon"] = []
 object["Executive"] = []
 object["Penthouse"] = []





let objectEx = {}
objectEx["Board"] = []
objectEx["Exhibition"] = []
objectEx["Ball"] = []
objectEx["Conference"] = []
objectEx["Meeting"] = []
objectEx["Training"] = []


const getPieResult = (val) => {
      // count value in array
      let count = val.reduce((acc, curr) => {
        if (typeof acc[curr] == 'undefined') {
          acc[curr] = 1
        } else {
          acc[curr] += 1
        }
      
        return acc
      }
      , {}
      )
      
      // sort value in array
      let sort = Object.keys(count).sort((a, b) => {
        return count[b] - count[a]
        }
      )

        // get top 5 value in array
        let top5 = sort.slice(0, 5)
        let top5Count = top5.map((val) => {
            return count[val]
            }
        )
        let top5Label = top5.map((val) => {
            return val
            }
        )
        return {top5Count,top5Label}
}
 
 

 for(let i = 0 ; i < getHouseRoom.length ; i++){

    let date =  getHouseRoom[i].cleaned_time.toISOString().split('T')[0].split("-")

    if(date[0] === now[0]){
        const getType =  await roomType.findOne({ "roomtype_id": getHouseRoom[i].room[0].roomtype_id },{}) 
        const getperson = await per.findOne({"account_id":getHouseRoom[i].account_id },{})

        
        // if(getperson){
        // console.log(getperson.first_name)
        
        // }
        // console.log(`${getperson.first_name} ${getperson.last_name}`)

        if(getType.roomtype_name === "Standard Room"){
                // accommodationPies[0].Standard.labels.push(`${getperson.first_name} ${getperson.last_name}`) 
                object.Standard.push(`${getperson.first_name} ${getperson.last_name}`)    
            
        }
        else if(getType.roomtype_name === "King Room"){
            object.King.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Queen Room"){
            object.Queen.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Deluxe Room"){
            object.Deluxe.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Loft Room"){
            object.Loft.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Suite"){
            object.Suite.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Honeymoon Suite"){
            object.Honeymoon.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Executive Suite"){
            object.Executive.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.roomtype_name === "Penthouse Suite"){
            object.Penthouse.push(`${getperson.first_name} ${getperson.last_name}`)  
        }

    }
    
}



// console.log(getHouseEx)

// for(let i = 0 ; i < getHouseEx.length ; i++){
    
//     let date = getHouseEx[i].cleaned_time.toISOString().split('T')[0].split("-")

//     if(date[0] === now[0]){
//         const getType =  await exType.findOne({ "exhibition_type_id": getHouseEx[i].room[0].exhibition_type_id },{}) 
//         const getperson = await per.findOne({"account_id":getHouseEx[i].account_id },{})

//         // console.log(getperson.first_name)
//         if(getType.roomtype_name === "Boardroom"){
//                 objectEx.Board.push(`${getperson.first_name} ${getperson.last_name}`)    
//         }
//         else if(getType.roomtype_name === "Exhibition Hall"){
//             objectEx.Exhibition.push(`${getperson.first_name} ${getperson.last_name}`)  
//         }
//         else if(getType.roomtype_name === "Ballroom"){
//             objectEx.Ball.push(`${getperson.first_name} ${getperson.last_name}`)  
//         }
//         else if(getType.roomtype_name === "Conference Room"){
//             objectEx.Conference.push(`${getperson.first_name} ${getperson.last_name}`)  
//         }
//         else if(getType.roomtype_name === "Meeting Room"){
//             objectEx.Meeting.push(`${getperson.first_name} ${getperson.last_name}`)  
//         }
//         else if(getType.roomtype_name === "Training Room"){
//             objectEx.Training.push(`${getperson.first_name} ${getperson.last_name}`)  
//         }
//     }
// }


        let  bars = {}
        let lines = {}
        bars['accommodation'] = accommodation
        bars['exhibition'] = Exhibition
        lines['accommodation'] = accommodationLine
        lines['exhibition'] = ExhibitionLine

        // console.log(object)
        // console.log(objectEx)

        // console.log(getPieResult(object.King))




        return res.status(200).json({  bars,lines,accommodationPies,ExhibitionPies ,message: 'success', success: true});


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}