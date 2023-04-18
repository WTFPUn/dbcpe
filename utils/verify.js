import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function jwtdecode(token) {
  return jwt.decode(token);
}

export function validatePassword(pass) {

  const regexPassword =   /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  // pattern is false
  if(!regexPassword.test(pass)){
      return false;
    }
  // pattern is true
  else{
      return true;
  }
  
  
  }

  export function validateEmail(email){

    const regexmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     // pattern is false
  if(!regexmail.test(email)){
    return false;
  }
   // pattern is true
  else{
    return true;
  }


  }


  export function validatePostcode(postcode){

    const regexPostcode = /^\d{5}$/;
  if(!regexPostcode.test(postcode)){
    return false;
  }
  else{
    return true;
  } 


  }


export function validatePhone(phone_no){

 const regexPhone = /^\d{10}$/;

  if(!regexPhone.test(phone_no)){
     return false;
  }
  else{
    return true;
  }

}  


export function validateGender(gender){

  if(!(gender === "Male" || gender === "Female" || gender === "Other")){
    return false;
  }
   else{
     return true;
   }
 
}


export function validateDateOfBirth(date_of_birth){

    const [year, month, day] = date_of_birth.split("-");
    // Create a new Date object using the year, month, and day components
    const dateObj = new Date(year, month - 1, day);
    // Check that the Date object's year, month, and day components match the input string
    const isDateValid =
      dateObj.getFullYear() == year &&
      dateObj.getMonth() == month - 1 &&
      dateObj.getDate() == day;

    const currentdate = new Date ;
    console.log(`check current = ${currentdate.getFullYear()}  dateobj = ${dateObj.getFullYear()}  dateObj > currentdate  = ${dateObj.getFullYear()  > currentdate.getFullYear()}`)

    if(!isDateValid || dateObj.getFullYear()  > currentdate.getFullYear()){
      return false ;
    }
    else{
      return true ;
    }
    

}







