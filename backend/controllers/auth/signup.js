import User from "../../models/user.models.js";
import bcrypt from "bcryptjs"
export const UserSignUp=async(req,res)=>{

try {
    console.log(req.body);
    

        const{username,email,password}=req.body;
    
        if (!(username&& email&& password)) {
            return  res.send("all the fields are required").status(400)
          }
      
    
        const hashPassword= await bcrypt.hash(password,10)
    
        const findUser= await User.findOne({
            email
        })
    
        if (findUser) {
            return res.status(409).json("user already exist")
        }
    
    
        const user= await User.create({
            username,email,password:hashPassword
        })
    
        return res.status(200).json({
            data:user,
            message:"register successfull"
        })
} catch (error) {
    throw new Error(error.message)
}

}