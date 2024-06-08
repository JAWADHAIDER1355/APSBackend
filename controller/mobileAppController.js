const Customer= require('../models/Customer')
const nodemailer= require('nodemailer')
const bcrypt = require('bcryptjs');


const registerMobileApp= async(req,res)=>{
  try {
    // Handle user registration here
   const { userName, email, password, contactNumber,cnic}= req.body;
   console.log("came in register.",password);
   console.log(req.body);
  
    const existingUser = await Customer.findOne({ email });
  if(!existingUser)
  {
    const customer1 = new Customer({ userName, email, password, contactNumber,cnic  });
    await customer1.save();

    return res.status(200).json({ success: true, message: "User Successfully Registered."});
  }   
  else
  {
    res.status(500).json({ success: false, message: "User Already Exists." });
  }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An Error Occured" });
    }
}

const loginMobileApp = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("email:"+email);
    // Find the user by email
    const existingUser = await Customer.findOne({ email });


    if (!existingUser) {
      console.log("here2");

      return res.status(201).json({ success: false, message: "No Account Exists" });
    }
    else
    {

        const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      console.log("her4");

      return res.status(201).json({ success: false, message: "Invalid Password" });
    }
    else
    {
      const token =await existingUser.createJWT(); 
      console.log("okay",token);
      res.status(200).json({
        success: true,
        message: "Login Successful",
      token,
        User: {
          userName: existingUser.userName,
          email: existingUser.email,
          },
      });

    }
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An Error Occured" });
  }
}



const storeFile = async (file, id) => {
  console.log("file: ", file);
  const fs = require("fs");
  const path = require("path");
  const fileType = file.mimetype.split("/")[1];
  const filePath = path.join(__dirname, `../uploads`, `${id}.${fileType}`);
  console.log("filePath: ", filePath);
  fs.writeFileSync(filePath, file.buffer, function (err) {
    if (err) {
      console.log("error is", err);
    } else {
      console.log("file saved");
    }
  });
  return `${id}.${fileType}`;
};


  module.exports={registerMobileApp,loginMobileApp};