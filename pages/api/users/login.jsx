import { MongoClient, ServerApiVersion  } from 'mongodb';
import dotenv from 'dotenv';
import sha256 from 'crypto-js/sha256'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import SHA256 from 'crypto-js/sha256';

dotenv.config();

export default async function login(req, res) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
  let { email, password } = req.body;
  const inpemail = email;
  const inppassword = password;

  // check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }

  // check every field is filled
  if (!email | !password) {
    return res.status(400).json({ message: 'Please fill all fields', success: false });
  }

  // query password from database by email
  try {
    await client.connect();
    const collection = client.db('HotelManage').collection('personal_information');

    console.log("email: ",inpemail)
    const result = await collection.findOne({email: inpemail});
    if (!result) {
      return res.status(400).json({ message: 'Email is not registered', success: false });
    }
    const { account_id, email, password, role, sub_role, user_name } = result || {};

    const cryptinput = SHA256(inppassword+account_id).toString();

    // compare password
    const isMatch = cryptinput === password;

    if(isMatch){
      const token = jwt.sign({ account_id, email, role, sub_role, user_name }, process.env.JWT_KEY, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login success', success: true, token: token });
    } else {
      return res.status(400).json({ message: 'Password is incorrect', success: false });
    }

  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error', success: false });
  }
  finally {
    await client.close();
  }

}
