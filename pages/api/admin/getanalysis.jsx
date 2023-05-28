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
        const houseEx = client.db('HotelManage').collection('house_keeping_work_exhibition_room');



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

    }
    ,
    {
        $project:{"_id":0,"account_id":1,"cleaned_time":1,"exhibition_id":1,"room.exhibition_type_id": 1}
    }


   ]).toArray()

  


   let accommodationPies = []
   let ExhibitionPies = []

   accommodationPies[0] = {["Standard"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[1] = {["King"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[2] = {["Queen"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']} }
   accommodationPies[3] = {["Deluxe"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']} }
   accommodationPies[4] = {["Loft"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[5] = {["Suite"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[6] = {["Honeymoon"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[7] = {["Executive"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   accommodationPies[8] = {["Penthouse"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}



   ExhibitionPies[0]  = {["Board"]: {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[1]  = {["Exhibition"]: {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[2] = {["Ball"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[3] = {["Conference"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[4]  = {["Meeting"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}
   ExhibitionPies[5]  = {["Training"] : {labels:null,data:null,backgroundColor:['#6C6EF2', '#1890FF', '#4BD4FF', '#FF6B4A', '#ACE89D', '#3AB25C']}}


 


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
        
        let other = sort.slice(5, sort.length)
        let otherCount = other.map((val) => {
            return count[val]
            }
        )
        // sum other value
        otherCount = otherCount.reduce((a, b) => a + b, 0)
        return {top5Count,top5Label,otherCount}
}
 
 

 for(let i = 0 ; i < getHouseRoom.length ; i++){

    let date =  getHouseRoom[i].cleaned_time.toISOString().split('T')[0].split("-")

    if(date[0] === now[0]){
        const getType =  await roomType.findOne({ "roomtype_id": getHouseRoom[i].room[0].roomtype_id },{}) 
        const getperson = await per.findOne({"account_id":getHouseRoom[i].account_id },{})

        

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





for(let i = 0 ; i < getHouseEx.length ; i++){
    
    let date = getHouseEx[i].cleaned_time.toISOString().split('T')[0].split("-")

    if(date[0] === now[0]){
        const getType =  await exType.findOne({ "exhibition_type_id": getHouseEx[i].room[0].exhibition_type_id },{}) 
        const getperson = await per.findOne({"account_id":getHouseEx[i].account_id },{})

        if(getType.type_name === "Boardroom"){
                objectEx.Board.push(`${getperson.first_name} ${getperson.last_name}`)    
        }
        else if(getType.type_name  === "Exhibition Hall"){
            objectEx.Exhibition.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.type_name  === "Ballroom"){
            objectEx.Ball.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.type_name  === "Conference Room"){
            objectEx.Conference.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.type_name === "Meeting Room"){
            objectEx.Meeting.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
        else if(getType.type_name === "Training Room"){
            objectEx.Training.push(`${getperson.first_name} ${getperson.last_name}`)  
        }
    }
}


        let  bars = {}
        let lines = {}
        let pies = {}

        bars['accommodation'] = accommodation
        bars['exhibition'] = Exhibition
        lines['accommodation'] = accommodationLine
        lines['exhibition'] = ExhibitionLine

       
       

        let Standard = (getPieResult(object.Standard))
        let king  = (getPieResult(object.King))
        let Queen = getPieResult(object.Queen)
        let  Deluxe = getPieResult(object.Deluxe)
        let Loft = getPieResult(object.Loft)
        let Suite = getPieResult(object.Suite)
        let Honeymoon = getPieResult(object.Honeymoon)
        let Executive = getPieResult(object.Executive)
        let Penthouse = getPieResult(object.Penthouse)


        let Board = getPieResult(objectEx.Board)
        let Exhibitions  = getPieResult(objectEx.Exhibition)
        let Ball = getPieResult(objectEx.Ball)
        let Conference = getPieResult(objectEx.Conference)
        let Meeting = getPieResult(objectEx.Meeting)
        let Training = getPieResult(objectEx.Training)


        if(Standard.otherCount === 0){
            accommodationPies[0].Standard.labels = Standard.top5Label
            accommodationPies[0].Standard.data = Standard.top5Count
        }
        else if(Standard.otherCount !== 0){
            accommodationPies[0].Standard.labels = Standard.top5Label
            accommodationPies[0].Standard.labels.push('other')
            accommodationPies[0].Standard.data = Standard.top5Count
            accommodationPies[0].Standard.data.push(Standard.otherCount)
        }
        if(king.otherCount === 0){
            accommodationPies[1].King.labels = king.top5Label
            accommodationPies[1].King.data = king.top5Count
        }
        else if(king.otherCount !== 0){
            accommodationPies[1].King.labels = king.top5Label
            accommodationPies[1].King.labels.push('other')
            accommodationPies[1].King.data = king.top5Count
            accommodationPies[1].King.data.push(king.otherCount)
        }
        if(Queen.otherCount === 0){
            accommodationPies[2].Queen.labels = Queen.top5Label
            accommodationPies[2].Queen.data = Queen.top5Count
        }
        else if(Queen.otherCount !== 0){
            accommodationPies[2].Queen.labels = Queen.top5Label
            accommodationPies[2].Queen.labels.push('other')
            accommodationPies[2].Queen.data = Queen.top5Count
            accommodationPies[2].Queen.data.push(Queen.otherCount)
        }
        if(Deluxe.otherCount === 0){
            accommodationPies[3].Deluxe.labels = Deluxe.top5Label
            accommodationPies[3].Deluxe.data = Deluxe.top5Count
        }
        else if(Deluxe.otherCount !== 0){
            accommodationPies[3].Deluxe.labels = Deluxe.top5Label
            accommodationPies[3].Deluxe.labels.push('other')
            accommodationPies[3].Deluxe.data = Deluxe.top5Count
            accommodationPies[3].Deluxe.data.push(Deluxe.otherCount)
        }
        if(Loft.otherCount === 0){
            accommodationPies[4].Loft.labels = Loft.top5Label
            accommodationPies[4].Loft.data = Loft.top5Count
        }
        else if(Loft.otherCount !== 0){
            accommodationPies[4].Loft.labels = Loft.top5Label
            accommodationPies[4].Loft.labels.push('other')
            accommodationPies[4].Loft.data = Loft.top5Count
            accommodationPies[4].Loft.data.push(Loft.otherCount)
        }
        if(Suite.otherCount === 0){
            accommodationPies[5].Suite.labels = Suite.top5Label
            accommodationPies[5].Suite.data = Suite.top5Count
        }
        else if(Suite.otherCount !== 0){
            accommodationPies[5].Suite.labels = Suite.top5Label
            accommodationPies[5].Suite.labels.push('other')
            accommodationPies[5].Suite.data = Suite.top5Count
            accommodationPies[5].Suite.data.push(Suite.otherCount)
        }
        if(Honeymoon.otherCount === 0){
            accommodationPies[6].Honeymoon.labels = Honeymoon.top5Label
            accommodationPies[6].Honeymoon.data = Honeymoon.top5Count
        }
        else if(Honeymoon.otherCount !== 0 ){
            accommodationPies[6].Honeymoon.labels = Honeymoon.top5Label
            accommodationPies[6].Honeymoon.labels.push('other')
            accommodationPies[6].Honeymoon.data = Honeymoon.top5Count
            accommodationPies[6].Honeymoon.data.push(Honeymoon.otherCount)
        }
        if(Executive.otherCount === 0){
            accommodationPies[7].Executive.labels = Executive.top5Label
            accommodationPies[7].Executive.data = Executive.top5Count
        }
        else if(Executive.otherCount !== 0){
            accommodationPies[7].Executive.labels = Executive.top5Label
            accommodationPies[7].Executive.labels.push('other')
            accommodationPies[7].Executive.data = Executive.top5Count
            accommodationPies[7].Executive.data.push(Executive.otherCount)
        }
        if(Penthouse.otherCount === 0){
            accommodationPies[8].Penthouse.labels = Penthouse.top5Label
            accommodationPies[8].Penthouse.data = Penthouse.top5Count
        }
        else if(Penthouse.otherCount !== 0){
            accommodationPies[8].Penthouse.labels = Penthouse.top5Label
            accommodationPies[8].Penthouse.labels.push('other')
            accommodationPies[8].Penthouse.data = Penthouse.top5Count
            accommodationPies[8].Penthouse.data.push(Penthouse.otherCount)
        }
        if(Board.otherCount === 0){
            ExhibitionPies[0].Board.labels = Board.top5Label
            ExhibitionPies[0].Board.data = Board.top5Count
        }
        else if(Board.otherCount !== 0){
            ExhibitionPies[0].Board.labels = Board.top5Label
            ExhibitionPies[0].Board.labels.push('other')
            ExhibitionPies[0].Board.data = Board.top5Count
            ExhibitionPies[0].Board.data.push(Board.otherCount)
        }
        if(Exhibitions.otherCount === 0){
            ExhibitionPies[1].Exhibition.labels = Exhibitions.top5Label
            ExhibitionPies[1].Exhibition.data = Exhibitions.top5Count
        }
        else if(Exhibitions.otherCount !== 0){
            ExhibitionPies[1].Exhibition.labels = Exhibitions.top5Label
            ExhibitionPies[1].Exhibition.labels.push('other')
            ExhibitionPies[1].Exhibition.data = Exhibitions.top5Count
            ExhibitionPies[1].Exhibition.data.push(Exhibitions.otherCount)
        }
        if(Ball.otherCount === 0){
            ExhibitionPies[2].Ball.labels = Ball.top5Label
            ExhibitionPies[2].Ball.data = Ball.top5Count
        }
        else if(Ball.otherCount !== 0){
            ExhibitionPies[2].Ball.labels = Ball.top5Label
            ExhibitionPies[2].Ball.labels.push('other')
            ExhibitionPies[2].Ball.data = Ball.top5Count
            ExhibitionPies[2].Ball.data.push(Ball.otherCount)
        }
        if(Conference.otherCount === 0){
            ExhibitionPies[3].Conference.labels = Conference.top5Label
            ExhibitionPies[3].Conference.data = Conference.top5Count
        }
        else if(Conference.otherCount !== 0){
            ExhibitionPies[3].Conference.labels = Conference.top5Label
            ExhibitionPies[3].Conference.labels.push('other')
            ExhibitionPies[3].Conference.data = Conference.top5Count
            ExhibitionPies[3].Conference.data.push(Conference.otherCount)
        }
        if(Meeting.otherCount === 0){
            ExhibitionPies[4].Meeting.labels = Meeting.top5Label
            ExhibitionPies[4].Meeting.data = Meeting.top5Count
        }
        else if(Meeting.otherCount !== 0){
            ExhibitionPies[4].Meeting.labels = Meeting.top5Label
            ExhibitionPies[4].Meeting.labels.push('other')
            ExhibitionPies[4].Meeting.data = Meeting.top5Count
            ExhibitionPies[4].Meeting.data.push(Meeting.otherCount)
        }
        if(Training.otherCount === 0){
            ExhibitionPies[5].Training.labels = Training.top5Label
            ExhibitionPies[5].Training.data = Training.top5Count
        }
        else if(Training.otherCount !== 0 ){
            ExhibitionPies[5].Training.labels = Training.top5Label
            ExhibitionPies[5].Training.labels.push('other')
            ExhibitionPies[5].Training.data = Training.top5Count
            ExhibitionPies[5].Training.data.push(Training.otherCount)
        }

        
           
        pies['accommodationPies'] = accommodationPies
        pies['ExhibitionPies'] = ExhibitionPies

        return res.status(200).json({  bars,lines,pies ,message: 'success', success: true});


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}