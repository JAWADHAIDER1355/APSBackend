const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CustomerSchema = new mongoose.Schema({
    userName:{
      type:String,
    }
    ,email:{
      type:String,
    },
    contactNumber:{
      type:String,
    }
    ,password:{
      type:String,
    }
    ,cnic:{
      type:String,
    },

  });

  
  CustomerSchema.pre('save', async function () {
  //when i modify object it again modify the password, why? apply condition
    if (!this.isModified('password'))
    {
      console.log("ayahai");
      return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
  })
  
  CustomerSchema.methods.createJWT = function () {
    console.log("id:"+this._id+" , name: "+this.userName);
    return jwt.sign(
      { userId: this._id, name: this.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    )
  }
  
  
  module.exports = mongoose.model('Customer', CustomerSchema)
  