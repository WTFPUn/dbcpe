import { MongoClient, ServerApiVersion  } from 'mongodb';
import React, { useState, useEffect } from 'react';
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
   
    
    const {
      token, 
      address,
      date_of_birth,
      district,
      emailEdit,
      first_name,
      gender,
      newpassword,
      phone_no,
      postcode,
      province,
      sub_district,
      last_name,
      } = req.body;
    
    const decoded = jwtdecode(token);
    const { account_id, email, role, sub_role, user_name} = decoded || {};
    console.log(`account_id: ${account_id} email: ${email} user_name: ${user_name}  role: ${role}  sub_role: ${sub_role}`)


    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Method not allowed', success: false });
    }
   
     
    try {
        await client.connect();
        console.log('Connected to database');
        const collection = client.db('HotelManage').collection('personal_information');
    
        const person = await collection.findOne({account_id: account_id})
      
        const cleanObject = (obj)=>   {
          for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
              delete obj[propName];
            }
          }
          return obj
        }
        const result = await collection.updateOne(
          
          { "account_id" : account_id },
         { $set: cleanObject ( { address: address,
          date_of_birth: date_of_birth,
          district: district,
          email: emailEdit,
          first_name: first_name,
          gender: gender,
          phone_no: phone_no,
          postcode: postcode,
          province: province,
          sub_district: sub_district,
          user_name: user_name,
          last_name: last_name,
          password: newpassword,}) }
          
        );

        if (result){
          return( res.status(200).json({ message: 'Update Profile success', success: true}))
        }
        else{
          return (res.status(400).json({ message: 'Update failed', success: false }));
        }

       

    }catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
      } finally {
        await client.close();
      }

}
