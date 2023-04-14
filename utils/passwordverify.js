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