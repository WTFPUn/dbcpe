import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function getEmployee(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );


    let sub_role  = parseInt(req.query?.sub_role);
    let name = req.query?.name
    let split
    if(name){
        split = name.split(" ")
   }


    try {
        await client.connect();

        const role  = client.db('HotelManage').collection('role');
        const personal = client.db('HotelManage').collection('personal_information');


        let query = []
        let getperson
        let keyname
       

        if(name){

            if(split.length === 1){
                keyname = await personal.findOne({"first_name": split[0]},{"_id":0})
                if(!keyname){
                    keyname = await personal.findOne({"last_name": split[0]},{"_id":0})
                }
                if(!keyname){
                    keyname = await personal.findOne({"user_name": split[0]},{"_id":0})
                }
            }
            else if(split.length === 2){
                keyname = await personal.findOne({"first_name": split[0],"last_name": split[1]},{"_id":0})
            }


            if(!keyname){
                return( res.status(400).json({ getbill : [], message: 'key name not found', success: true}))
            }


        }


        if((sub_role === 0 || sub_role) || (name)){

            query.push({
                $match: {
                    "role": 1
                }

            })

            if((sub_role === 0 || sub_role)){
                
                if(sub_role === 0){
                    //manager
                    query.push({
                        $match: {
                            "sub_role": 0
                        }

                    })

                }

                else if(sub_role === 1){
                    //Housekeeping
                    query.push({
                        $match: {
                            "sub_role": 1
                        }

                    })

                }

                else if(sub_role === 2){
                    //Recepter
                    query.push({
                        $match: {
                            "sub_role": 2
                        }

                    })

                }

                else if(sub_role === 3){
                    //Hall porter
                    query.push({
                        $match: {
                            "sub_role": 3
                        }

                    })

                }

                else if(sub_role === 4){
                    //Chef
                    query.push({
                        $match: {
                            "sub_role": 4
                        }

                    })

                }

            
            }

            if(name){
                query.push({
                    $match: {
                        "account_id": keyname.account_id
                    }

                })


            }

           

                        

            query.push( {
                $project:{"_id":0,"account_id":1,"first_name":1,"last_name":1,"user_name":1,"role":1,"sub_role":1  }
            })

            getperson = await personal.aggregate(query).sort({ "user_name": 1 }).toArray();

        }

        else{
            getperson = await personal.find({"role": 1},{projection:{"_id":0,"account_id":1,"first_name":1,"last_name":1,"user_name":1,"role":1,"sub_role":1 }}).sort({ "user_name": 1 }).toArray();
        }


        for(let i=0 ;i < getperson.length ; i++){
            if(getperson[i].role === 1 && getperson[i].sub_role === 0){
                getperson[i]["sub_name"] = "manager"
            }
            else if(getperson[i].role === 1 && getperson[i].sub_role === 1){
                getperson[i]["sub_name"] = "Housekeeping"
            }
            else if(getperson[i].role === 1 && getperson[i].sub_role === 2){
                getperson[i]["sub_name"] = "Recepter"
            }
            else if(getperson[i].role === 1 && getperson[i].sub_role === 3){
                getperson[i]["sub_name"] = "Hall porter"
            }
            else if(getperson[i].role === 1 && getperson[i].sub_role === 4){
                getperson[i]["sub_name"] = "Chef"
            }
        }


        
    //return getemployee
    return( res.status(200).json({ getemployee:getperson, message: 'Get all bill by admin success', success: true}))


    
    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}