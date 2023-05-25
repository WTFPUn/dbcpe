import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function gethousekeeper(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );

    let paid_status  = parseInt(req.query?.paid_status);
    let name = req.query?.name
    let split
    if(name){
         split = name.split(" ")
    }
   
    

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
      }

      try {
        await client.connect();

        const bill  = client.db('HotelManage').collection('bill');
        const personal = client.db('HotelManage').collection('personal_information');

        let query = []
        let getbill
        let keyname
        

        if(name){

            if(split.length === 1){
                keyname = await personal.findOne({"first_name": split[0]},{"_id":0})
                if(!keyname){
                    keyname = await personal.findOne({"last_name": split[0]},{"_id":0})
                }
            }
            else if(split.length === 2){
                keyname = await personal.findOne({"first_name": split[0],"last_name": split[1]},{"_id":0})
            }


            if(!keyname){
                return( res.status(400).json({ getbill : [], message: 'key name not found', success: true}))
            }


        }
        
       



        if((paid_status === 0 || paid_status) || (name)){

            if((paid_status === 0 || paid_status)){

                    if(paid_status === 0){
                        query.push({
                            $match: {
                                "payment_method": {$eq: "" }
                            }

                        })

                    }
                    else if(paid_status === 1){
                        query.push({
                            $match: {
                              $and: [
                                { "payment_method": { $ne: "" } },
                                { "payment_method": { $ne: "Cancel" } }
                              ]
                            }
                          });

                    }

            }

            if(name){
                query.push({
                    $lookup: {
                 from: "personal_information",
                 localField: "account_id",
                 foreignField: "account_id",
                 as: "person"
               }
           },
           {
            $match: {
                "person.account_id": keyname.account_id
            }
           }
           
           )

            }

            query.push( {
                $project:{"_id":0,"account_id":1,"bill_id":1,"book_list":1,"code_id":1,"create_date":1,"pay_due_date":1,"total_bill":1,"payment_method":1}
            })





             getbill = await bill.aggregate(query).toArray();
        }
        else{
            getbill = await bill.find({},{"_id":0}).toArray();
        }



         


        return( res.status(200).json({ getbill, message: 'Get all bill by admin success', success: true}))


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }



}