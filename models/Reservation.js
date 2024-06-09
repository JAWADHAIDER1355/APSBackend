const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ReservationSchema = new mongoose.Schema({
    userId:{
      type:String,//email of user who is booking a slot or having a reservation of slot
    },
    companyEmail:{
      type:String,//email of user who is booking a slot or having a reservation of slot
    },
    floorNo: {
      type: Number,
    },
    rowNo: {
      type: Number,
    },
    columnNo: {
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
  