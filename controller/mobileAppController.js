const Customer= require('../models/Customer')
const User= require('../models/Admin')
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

const updateStatus= async(req,res)=>{
  try {
    // Handle user registration here
   const { companyEmail,floorNo,slotNo,vehicleNumber}= req.body;
   console.log("came in register.",companyEmail);

   console.log(req.body);
  
   const companyAdmin = await User.findOne({ email: companyEmail });
   console.log("companyAdmin is,", companyAdmin);

   if (!companyAdmin) {
     return res.status(404).json({ success: false, message: "Company not found!" });
   }

   let floorsPlan = companyAdmin.floorsPlan;
   let profit=0;
   console.log("No of Floors:", floorsPlan.length);

   let updated = false;

   const updatedFloorsPlan = floorsPlan.map((floor, floorIndex) => {
     if (floorIndex === floorNo) { // Adjusting the floor index
       return floor.map((row, rowIndex) => {
           return row.map((cell, cellIndex) => {
             if (cell.slotNo === slotNo) {
               console.log("came here-------------");
               console.log(cell);

profit=parseInt(cell.cost, 10);
               // Create a new object instead of modifying the existing one
               const updatedCell = {
                 ...cell,
                 status: "booked",
                 vehicle: vehicleNumber
               };

               console.log(updatedCell);
               updated = true;
               return updatedCell;
             }
             return cell;
           });
         
         return row;
       });
     }
     return floor;
   });

   // Update the floorsPlan attribute of companyAdmin with the updated floorsPlan object
   if (updated) {

     console.log("here also came");
     if(companyAdmin.netProfit===undefined||companyAdmin.netProfit===null)
      {
        companyAdmin.netProfit = profit;

      }
      else
      {
        companyAdmin.netProfit = companyAdmin.netProfit+profit;

      }
     companyAdmin.floorsPlan = updatedFloorsPlan;
     await companyAdmin.save();
     console.log("here not came");
     return res.status(200).json({ success: true, message: "Status Updated Successfully." });
   } else {
     res.status(200).json({ success: false, message: "No Slot Found!" });
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


  module.exports={registerMobileApp,loginMobileApp,updateStatus};