import express from 'express';
import {userRegisters,userProfile,logUser,allUser,userImages} from '../controller/userController.js';
import {upload} from '../service/image1.js'

// const MessagingResponse = require('twilio').twiml.MessagingResponse;

const router = express.Router();
router.post("/register",userRegisters);
router.post("/login",logUser);
router.post("/imageUpload",upload.single("Image"),userImages)
router.get("/AlluserList",allUser);
router.get("/userProfile",userProfile);




// router.post("/sms",(req,res)=>{
//   try {
//     const twiml = new MessagingResponse();
//     twiml.message('The Robots are coming! Head for the hills!');
//     // res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.send(twiml.toString());
//   } catch (error) {
//  res.status(400).send()     
// }
// })


export {router}