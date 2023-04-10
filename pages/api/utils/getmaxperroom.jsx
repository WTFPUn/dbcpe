import { MongoClient, ServerApiVersion } from 'mongodb';
import { useRouter } from 'next/router';

export default async function getmaxperroom(req, res) {

    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
    );
    const query = req.query
    // const adult = query?.minperson
    const adult = query?.minperson;
    console.log("query: ",query)
    
    

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
      }

    try {
        await client.connect();
        console.log('Connected to database');
        const collection = client.db('HotelManage').collection('type_of_room');
    if(adult){
        const adultOfRoom = await collection.find({ num_people_stay: { $gt: adult-1 } }, { roomtype_id: 1, num_people_stay: 1 }).toArray();
        return( res.status(200).json({ adultOfRoom ,message: 'Get adult of room success', success: true}))
    }
    else{
        const adultOfRoom = await collection.find({ }, { roomtype_id: 1, num_people_stay: 1 }).toArray();
        return( res.status(200).json({ adultOfRoom ,message: 'Get adult of room success', success: true}))
    }




    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }


}