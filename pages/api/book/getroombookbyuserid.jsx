import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function addBookingRoom(req, res) {

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
        const book = client.db('HotelManage').collection('room_booking');
       
        

        const getbook  =  await book.aggregate( [
            {
                $match: {
                 $and: [
                    {'account_id': account_id},
                    {'bookstatus_id': 1}

                 ]


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
                $lookup: {
            from: "type_of_room",
            localField: "room.roomtype_id",
            foreignField: "roomtype_id",
            as: "roomtype"
            }
        }

          
        ] ).toArray();

        
        for (let i=0 ; i< getbook.length; i++){
            getbook[i].room = getbook[i].room[0]
            getbook[i].roomtype = getbook[i].roomtype[0]
        }



        if (getbook) {
            return res.status(200).json({getbook,message: 'get book success', success: true});
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