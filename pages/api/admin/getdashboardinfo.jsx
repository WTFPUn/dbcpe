import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function addSeasons(req, res) {

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
    const { account_id,role,sub_role } = decoded || {};

    
    


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


        const getper = await per.findOne({"account_id": account_id},{})
        

        console.log("role = ",getper.role )
        console.log("sub_role = ",getper.sub_role )
        

        if(getper.role === 0){
            return res.status(400).json({ message: 'You are not employee', success: false });
        }

        const getRole = await role.findOne({"role":getper.role, "sub_role":getper.sub_role},{})
        console.log("getrolename = ",getRole.sub_name)

      

    //set time  right now 

    const tzOffset = 7; // Offset for Indochina Time (GMT+7)
    const dateNow = new Date(Date.now() + tzOffset * 3600000).toISOString().split('T')[0];

    //room in
    let Standard_Room_in = 0
    let Queen_Room_in = 0
    let King_Room_in = 0
    let Deluxe_Room_in = 0
    let Loft_Room_in = 0
    let Suite_in = 0
    let Honeymoon_Suite_in = 0
    let Executive_Suite_in = 0
    let Penthouse_Suite_in = 0

    //room out
    let Standard_Room_out = 0
    let Queen_Room_out = 0
    let King_Room_out = 0
    let Deluxe_Room_out = 0
    let Loft_Room_out = 0
    let Suite_out = 0
    let Honeymoon_Suite_out = 0
    let Executive_Suite_out = 0
    let Penthouse_Suite_out = 0

    //exhibition in
    let Conference_Room_in = 0
    let Ballroom_in = 0
    let Meeting_Room_in = 0
    let Exhibition_Hall_in = 0
    let Boardroom_in = 0
    let Training_Room_in = 0
    
    //exhibition in
    let Conference_Room_out = 0
    let Ballroom_out = 0
    let Meeting_Room_out = 0
    let Exhibition_Hall_out = 0
    let Boardroom_out = 0
    let Training_Room_out = 0



    
   
    //comming
        const roomCheckin = await  bookRoom.aggregate([
            {
                $match: {
                    "checkin_date": {$eq: dateNow }
                }
            },{
                $lookup: {
                    from: "personal_information",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "person"
                }
            }
            
        ]).toArray();

        const exCheckin = await bookEx.aggregate([
            {
                $match: {
                    "checkin_date": {$eq: dateNow }
                }
            },
            {
                $lookup: {
                    from: "personal_information",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "person"
                }
            }
            

        ]).toArray();

       

        let halal_food = 0
        let regular_food = 0 

        
        
        

        let tmpcheckin = 0
      
        for(let i = 0; i < exCheckin.length ; i++ ){
            tmpcheckin = tmpcheckin + exCheckin[i].participant_count

        }

        for(let i = 0; i < roomCheckin.length ; i++ ){
            tmpcheckin = tmpcheckin + roomCheckin[i].guests 
             
            if(roomCheckin[i].halal_need === true){
                halal_food = halal_food + roomCheckin[i].guests
                
            }
            else if(roomCheckin[i].halal_need === false){
                regular_food = regular_food  + roomCheckin[i].guests
            }
        }
        

        
        let global = {}
        let local = {}
        let guest_coming = []
        for(let i = 0 ; i < roomCheckin.length ; i++){
                const getroom = await room.findOne({"room_id":roomCheckin[i].room_id },{})
                const getType = await roomType.findOne({"roomtype_id":getroom.roomtype_id},{})

            guest_coming  = guest_coming.concat([{"Name": `${roomCheckin[i].person[0].first_name} ${roomCheckin[i].person[0].last_name}`
            ,"room_type": "Accommodation", "subroom_type": getType.roomtype_name, "room_num": getroom.room_no, "floor": getroom.room_floor  }])

            if(  getType.roomtype_name  === "Standard Room"){
                Standard_Room_in ++
            }
            else if(  getType.roomtype_name  === "Queen Room"){
                Queen_Room_in ++
            }
            else if(  getType.roomtype_name  === "King Room"){
                King_Room_in ++
            }
            else if(  getType.roomtype_name  === "Deluxe Room"){
                Deluxe_Room_in ++
            }
            else if(  getType.roomtype_name  === "Loft Room"){
                Loft_Room_in ++
            }
            else if(  getType.roomtype_name  === "Suite"){
                Suite_in ++
            }
            else if(  getType.roomtype_name  === "Honeymoon Suite"){
                Honeymoon_Suite_in ++
            }
            else if(  getType.roomtype_name  === "Executive Suite"){
                Executive_Suite_in ++
            }
            else if(  getType.roomtype_name  === "Penthouse Suite"){
                Penthouse_Suite_in ++
            }



        }

        for(let i = 0 ; i < exCheckin.length ; i++){
            const getroom = await exhibition.findOne({"exhibition_id":exCheckin[i].exhibition_id },{})
            const getType = await exType.findOne({"exhibition_type_id":getroom.exhibition_type_id},{})

            guest_coming  = guest_coming.concat([{"Name": `${exCheckin[i].person[0].first_name} ${exCheckin[i].person[0].last_name}`
            ,"room_type": "Exhibition", "subroom_type": getType.type_name, "room_num": getroom.name, "floor": null }])

            if(getType.type_name === "Conference Room"){
                Conference_Room_in ++
            }
            else if(getType.type_name ===  "Ballroom"){
                Ballroom_in ++
            }
            else if( getType.type_name  === "Meeting Room"){
                Meeting_Room_in ++
            }
            else if( getType.type_name  === "Exhibition Hall"){
                Exhibition_Hall_in ++
            }
            else if( getType.type_name  === "Boardroom"){
                Boardroom_in ++
            }
            else if( getType.type_name  === "Training Room"){
                Training_Room_in ++
            }

        }

       
       
        //check out
        const roomCheckout = await  bookRoom.aggregate([
            {
                $match: {
                    "checkout_date": {$eq: dateNow }
                }
            },{
                $lookup: {
                    from: "personal_information",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "person"
                }
            }
            
        ]).toArray();

        const exCheckout = await bookEx.aggregate([
            {
                $match: {
                    "checkout_date": {$eq: dateNow }
                }
            },
            {
                $lookup: {
                    from: "personal_information",
                    localField: "account_id",
                    foreignField: "account_id",
                    as: "person"
                }
            }
            

        ]).toArray();

      

        let tmpcheckout = 0
        
        for(let i = 0; i < exCheckout.length ; i++ ){
            tmpcheckout = tmpcheckout + exCheckout[i].participant_count
            
        }

        for(let i = 0; i < roomCheckout.length ; i++ ){
            tmpcheckout = tmpcheckout + roomCheckout[i].guests 
        }

       let   guest_checkout = []

        for(let i = 0 ; i < roomCheckout.length ; i++){
            const getroom = await room.findOne({"room_id":roomCheckout[i].room_id },{})
            const getType = await roomType.findOne({"roomtype_id":getroom.roomtype_id},{})

            guest_checkout  = guest_checkout.concat([{"Name": `${roomCheckout[i].person[0].first_name} ${roomCheckout[i].person[0].last_name}`
        ,"room_type": "Accommodation", "subroom_type": getType.roomtype_name, "room_num": getroom.room_no, "floor": getroom.room_floor  }])

        if(  getType.roomtype_name  === "Standard Room"){
            Standard_Room_out ++
        }
        else if(  getType.roomtype_name  === "Queen Room"){
            Queen_Room_out ++
        }
        else if(  getType.roomtype_name  === "King Room"){
            King_Room_out ++
        }
        else if(  getType.roomtype_name  === "Deluxe Room"){
            Deluxe_Room_out ++
        }
        else if(  getType.roomtype_name  === "Loft Room"){
            Loft_Room_out ++
        }
        else if(  getType.roomtype_name  === "Suite"){
            Suite_out ++
        }
        else if(  getType.roomtype_name  === "Honeymoon Suite"){
            Honeymoon_Suite_out ++
        }
        else if(  getType.roomtype_name  === "Executive Suite"){
            Executive_Suite_out ++
        }
        else if(  getType.roomtype_name  === "Penthouse Suite"){
            Penthouse_Suite_out ++
        }



    }

    for(let i = 0 ; i < exCheckout.length ; i++){
        const getroom = await exhibition.findOne({"exhibition_id":exCheckout[i].exhibition_id },{})
        const getType = await exType.findOne({"exhibition_type_id":getroom.exhibition_type_id},{})

        guest_checkout  = guest_checkout.concat([{"Name": `${exCheckout[i].person[0].first_name} ${exCheckout[i].person[0].last_name}`
        ,"room_type": "Exhibition", "subroom_type": getType.type_name, "room_num": getroom.name, "floor": null }])

        if(getType.type_name === "Conference Room"){
            Conference_Room_out ++
        }
        else if(getType.type_name ===  "Ballroom"){
            Ballroom_out ++
        }
        else if( getType.type_name  === "Meeting Room"){
            Meeting_Room_out ++
        }
        else if( getType.type_name  === "Exhibition Hall"){
            Exhibition_Hall_out ++
        }
        else if( getType.type_name  === "Boardroom"){
            Boardroom_out ++
        }
        else if( getType.type_name  === "Training Room"){
            Training_Room_out ++
        }
        
        

    }

    // assign type
    let count_checkin_accom = []
    let  count_checkout_accom = []

    // assign Room in ,Exhibition in
    count_checkin_accom = count_checkin_accom.concat({"Accommodation": {"Standard_Room" : Standard_Room_in,"Queen_Room": Queen_Room_in
        ,"King_Room":King_Room_in,"Deluxe_Room":Deluxe_Room_in, "Loft_Room": Loft_Room_in , "Suite" : Suite_in
        ,"Honeymoon_Suite":Honeymoon_Suite_in, "Executive_Suite":Executive_Suite_in , "Penthouse_Suite": Penthouse_Suite_in

    }})
    count_checkin_accom = count_checkin_accom.concat({"Exhibition": {"Conference_Room": Conference_Room_in,"Ballroom":Ballroom_in,
        "Meeting_Room": Meeting_Room_in , "Exhibition_Hall": Exhibition_Hall_in , "Boardroom": Boardroom_in , "Training_Room":Training_Room_in

    }})

    // assign Room out ,Exhibition out

    count_checkout_accom = count_checkout_accom.concat({"Accommodation": {"Standard_Room" : Standard_Room_out,"Queen_Room": Queen_Room_out
    ,"King_Room":King_Room_out,"Deluxe_Room":Deluxe_Room_out, "Loft_Room": Loft_Room_out , "Suite" : Suite_out
    ,"Honeymoon_Suite":Honeymoon_Suite_out, "Executive_Suite":Executive_Suite_out , "Penthouse_Suite": Penthouse_Suite_out

    }})

    count_checkout_accom = count_checkout_accom.concat({"Exhibition": {"Conference_Room": Conference_Room_out,"Ballroom":Ballroom_out,
    "Meeting_Room": Meeting_Room_out , "Exhibition_Hall": Exhibition_Hall_out , "Boardroom": Boardroom_out , "Training_Room":Training_Room_out

}})

    


    if(getRole.sub_name === "Manager" || getRole.sub_name === "Recepter" || getRole.sub_name === "Housekeeping"  ){
         //manager,Receptor,housekeeper
         global['count_checkin'] =  tmpcheckin
         global['count_checkout'] = tmpcheckout
         global['guest_coming'] =  guest_coming

         return res.status(200).json({    global,role: getRole.sub_name ,message: 'Get dashboard success', success: true });
    }


    else if(getRole.sub_name === "Chef"){
        // cheft
        
        global['count_checkin'] =  tmpcheckin
        global['count_checkout'] = tmpcheckout
        global['guest_coming'] =  guest_coming
        local['halal_food'] = halal_food
        local['regular_food'] = regular_food

        return res.status(200).json({    global,local,role: getRole.sub_name ,message: 'Get dashboard success', success: true });


    }
    else if(getRole.sub_name === "Hall porter"){
        // Hall Porter

        global['count_checkin'] =  tmpcheckin
        global['count_checkout'] = tmpcheckout
        global['guest_coming'] =  guest_coming
        local['guest_checkout'] =  guest_checkout
        local['count_checkin_accom'] = count_checkin_accom 
        local['count_checkout_accom'] = count_checkout_accom

        return res.status(200).json({    global,local,role: getRole.sub_name ,message: 'Get dashboard success', success: true });
    }
        


        // global['guest_checkout'] =  guest_checkout
        // global['count_checkin_accom'] = count_checkin_accom 
        // global['count_checkout_accom'] = count_checkout_accom
        // global["halal_food"] = halal_food
        // global["regular_food"] = regular_food



        

    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}