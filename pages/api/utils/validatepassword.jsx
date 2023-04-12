export default  function validatePassword(req, res) {

const {checkPassword} = req.body
console.log("checkpass",checkPassword);

const regexPassword =   /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  if(!regexPassword.test(checkPassword)){
    return res.status(400).json({ format:false ,message: 'Password format is invalid', success: false });
  }

else{
    return res.status(200).json({ format:true ,message: 'Password format is correct', success: true })
}



}


