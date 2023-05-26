import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

export default async function bookCancel(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    //book_type = 0 ; room
    //book_type = 1 ; exhibition

    let book_type = parseInt(req.body?.roomtype)
    let book_id = parseInt(req.body?.book_id)



    if(req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        
    }

      try {
        await client.connect();

        const bookRoom  = client.db('HotelManage').collection('room_booking');
        const bookEx   = client.db('HotelManage').collection('exhibition_booking');
        let updatebook

        if(book_type === 0){
        //Room
         updatebook = await bookRoom.updateOne(
                        
            { "book_id" : book_id },
            { $set:  { bookstatus_id : 3   }}
            
        );

        }
        else if(book_type === 1){
        //Exhibition
        updatebook = await bookEx.updateOne(
                        
            { "exhibition_booking_id" : book_id },
            { $set:  { bookstatus_id : 3   }}
            
        );


        }




        if(updatebook){
            return( res.status(200).json({ message: 'Cancel book success', success: true}))
        }
        else{
            return( res.status(400).json({ message: 'Cancel book invalid', success: false}))
        }


    }catch (error) {
        console.log(error);
         return res.status(500).json({ message: error.message, success: false });
     } finally {
        await client.close();
     }


}










