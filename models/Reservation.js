const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ReservationSchema = new mongoose.Schema({
    userId:{
      type:String,//email of user who is booking a slot or having a reservation of slot
    },
    floorNo: {
      type: String,
    },
    rowNo: {
      type: String,
    },
    columnNo: {
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
  