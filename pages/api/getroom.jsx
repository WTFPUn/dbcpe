import { MongoClient, ServerApiVersion  } from 'mongodb';

export default async function getroom(req, res) {

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
        console.log('Connected to database');
        const collection = client.db('HotelManage').collection('room');
        // const allroomtype = await collection.find().toArray();

        const allroom = await collection.aggregate([
            { $lookup:
               {
                 from: 'type_of_room',
                 localField: 'roomtype_id',
                 foreignField: 'roomtype_id',
                 as: 'roomtype'
               }
             }
            ])  

        return( res.status(200).json({ allroomtype ,message: 'Register success', success: true}))



    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }


}