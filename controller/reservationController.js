const Reservation= require('../models/Reservation')
const nodemailer= require('nodemailer')
const bcrypt = require('bcryptjs');


const addReservation= async(req,res)=>{
    try {
      // Handle user registration here
     const { userId, floorNo,rowNo, columnNo,entryTime,exitTime,vehicleNumber,date }= req.body;
     console.log("came in add.",userId);
     console.log(req.body);
 
     
      const reservation1 = new Reservation({  userId, floorNo,rowNo, columnNo,entryTime,exitTime,vehicleNumber,date  });
     
      await reservation1.save();

      return res.status(200).json({ success: true, message: "Booked Successfully."});
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Booking Failed" });
      }
  }

const getParticularReservation = async (req, res) => {
  try {
    console.log("aya hai isme aab");
    const { userId } = req.query;
    console.log("userId is :", userId);
    const reservation1 = await Reservation.find({ userId });
    const responseData = {
      userReservations:reservation1
    };
    
console.log(responseData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching Particular Reservations data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getReservations = async (req, res) => {
  try {
    console.log("came in get all reservations");
    const reservations = await Reservation.find();
   
    
console.log(reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching Reservations data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


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
//Project

  module.exports={addReservation,getReservations,getParticularReservation};