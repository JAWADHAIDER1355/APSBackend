const express=require('express');

const router=express.Router();//is k according require

const {registerMobileApp,loginMobileApp,updateStatus}= require('../controller/mobileAppController');

router.post('/registerMobileApp',registerMobileApp);
router.post('/loginMobileApp',loginMobileApp);
router.post('/updateStatus',updateStatus);


module.exports=router;