import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { v6 as uuidv6 } from 'uuid';

dotenv.config();

export default async function register(req, res) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { 
    address,
    date_of_birth,
    district,
    email,
    first_name,
    gender,
    password,
    phone_no,
    postcode,
    province,
    role,
    sub_district,
    sub_role,
    user_name,
    last_name,
    } = req.body; 

  // check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // check if username and password are empty
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // check if username is already taken in the database, if so, return error
  try {
    await client.connect();
    const collection = client.db.collection('personal_information');

    const existingAccount = await collection.findOne({email: email});

    if (existingAccount) {
      return res.status(400).json({ message: 'Email already taken' });
    }

    const account_id = uuidv6();
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
      role: role,
      sub_district: sub_district,
      sub_role: sub_role,
      user_name: user_name,
      last_name: last_name,
      password: hashedPassword,
      status: 'active',
    });

    if (result) {
      return res.status(200).json({ message: 'Register success' });
    }
    else {
      return res.status(400).json({ message: 'Register failed' });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }

}

