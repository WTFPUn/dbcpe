import { MongoClient, ServerApiVersion  } from 'mongodb';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256'

dotenv.config();

export default async function register(req, res) {
  const uri = "mongodb+srv://adminCPE:ctFzCfc2qAlVBnQD@cluster0.lufvjrz.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);
  console.log(req.body)
  const { 
    address,
    date_of_birth,
    district,
    email,
    first_name,
    gender,
    password,
    re_password,
    phone_no,
    postcode,
    province,
    sub_district,
    last_name,
    } = req.body;

  // check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }
  
  // check every field is filled
  if (!address | !date_of_birth | !district | !email | !first_name | !gender | !password | !re_password | !phone_no | !postcode | !province | !sub_district | !last_name) 
  {
    return res.status(400).json({ message: 'Please fill all fields', success: false });
  }

  // check password and re_password is same
  if (password !== re_password) {
    return res.status(400).json({ message: 'Password and re-password is not same', success: false });
  }

  // check if username is already taken in the database, if so, return error
  try {
    await client.connect();
    console.log('Connected to database');
    const collection = client.db('HotelManage').collection('personal_information');

    const existingAccount = await collection.findOne({email: email});
  
    if (existingAccount) {
      return res.status(400).json({ message: 'Email already taken', success: false });
    }
    console.log('Email is available', existingAccount);

    // username is value of email before @
    const user_name = email.split('@')[0];

    const account_id = uuidv4();
    // hash password with sha256 with account_id as salt
    const hashedPassword = sha256(password + account_id);

    const result = await collection.insertOne({
      account_id: account_id,
      address: address,
      date_of_birth: date_of_birth,
      district: district,
      email: email,
      first_name: first_name,
      gender: gender,
      phone_no: phone_no,
      postcode: postcode,
      province: province,
      role: 0,
      sub_district: sub_district,
      sub_role: 0,
      user_name: user_name,
      last_name: last_name,
      password: hashedPassword,
      status: 'active',
    });

    if (result) {
      return res.status(200).json({ message: 'Register success', success: true});
    }
    else {
      return res.status(400).json({ message: 'Register failed', success: false });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  } finally {
    await client.close();
  }

}

