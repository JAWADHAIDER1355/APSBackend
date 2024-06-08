const express=require('express');

const router=express.Router();//is k according require

const {registerMobileApp,loginMobileApp}= require('../controller/mobileAppController');

router.post('/registerMobileApp',registerMobileApp);
router.post('/loginMobileApp',loginMobileApp);

module.exports=router;