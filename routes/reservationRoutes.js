const express=require('express');

const router=express.Router();//is k according require

const {getReservations,getParticularReservation,addReservation,getCompanyReservations}= require('../controller/reservationController');
router.post('/addReservation',addReservation);
router.get('/getParticularReservation',getParticularReservation);
router.get('/getCompanyReservations',getCompanyReservations);
router.get('/getReservations',getReservations);
module.exports=router;