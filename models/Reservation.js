const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ReservationSchema = new mongoose.Schema({
    userId:{
      type:String,//email of user who is booking a slot or having a reservation of slot
    },
    companyName:{
      type:String,//name of company 
    },
    companyEmail:{
      type:String,//email of company
    },
    floorNo: {
      type: Number,
    },
    slotNo: {
      type: String,
    },
    entryTime: {
      type: String,
    },
    exitTime: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    date: {
      type: Date,
    },

  });

  
  
  module.exports = mongoose.model('Reservation', ReservationSchema)
  