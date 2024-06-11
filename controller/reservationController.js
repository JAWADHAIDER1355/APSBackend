const Reservation= require('../models/Reservation')
const Company= require('../models/Admin')


const addReservation= async(req,res)=>{
    try {
      // Handle user registration here
     const { userId, companyEmail,floorNo,slotNo,entryTime,exitTime,vehicleNumber,date,day }= req.body;
     console.log("came in add.",userId);
     const companyAdmin = await Company.findOne({ email: companyEmail });
     console.log("companyAdmin is,", companyAdmin.userName);
  
     
     console.log(req.body);
 
     const reservation1 = new Reservation({ userId,companyEmail, companyName:companyAdmin.userName,floorNo, slotNo, entryTime, exitTime, vehicleNumber, date ,day});
     await reservation1.save();
 
     return res.status(200).json({ success: true, message: "Booked Successfully." });     
      
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

  module.exports={addReservation,getReservations,getParticularReservation};