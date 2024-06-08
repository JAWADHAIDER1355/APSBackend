const express=require('express');

const router=express.Router();//is k according require

const {getReservations,getParticularReservation,addReservation}= require('../controller/reservationController');
router.post('/addReservation',addReservation);
router.get('/getParticularReservation',getParticularReservation);
router.get('/getReservations',getReservations);
module.exports=router;