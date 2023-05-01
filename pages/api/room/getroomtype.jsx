import { MongoClient, ServerApiVersion  } from 'mongodb';


export default async function login(req, res) {
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
        const collection = client.db('HotelManage').collection('type_of_room');
    
        // const existingAccount = await collection.findOne({email: email});
        const allroomtype = await collection.find( {},{projection:{"_id": 0,"roomtype_id": 1,"roomtype_name": 1}}).sort({ "roomtype_id": 1 }).toArray();
        
        //  allroomtype.sort(allroomtype)
         console.log("before sort = ",allroomtype)
         console.log("after sort ",allroomtype)

        return( res.status(200).json({ allroomtype ,message: 'Register success', success: true}))



    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }

}
