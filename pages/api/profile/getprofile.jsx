import { MongoClient, ServerApiVersion  } from 'mongodb';
import { jwtdecode } from "@/utils/verify";

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

    const token = req.headers['auth-token'];
    const { qArray } = req.query;
    const decoded = jwtdecode(token);
    const { account_id } = decoded || {};
     
    const splitArray = qArray.split(',')
    let projection = {}

    splitArray.forEach((val) => {
        projection[val] = 1;
    })
    
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed', success: false });
        }
         
    try {
        await client.connect();
        
        const collection = client.db('HotelManage').collection('personal_information');

    
        const  profile = await collection.findOne({account_id: account_id}, {projection});
        

        let profileSort = {}

        splitArray.forEach((val) => {
            
            profileSort[val] = profile[val];
        })
    

        
        return( res.status(200).json({ profile: profileSort ,message: 'Get profile success', success: true}))

    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }

}