
const express = require('express');
const router = express.Router();

const  { Exchat, getChatHistory, deleteAll }= require('../chatcontroller/exchat');
router.post('/chat',Exchat)
router.get("/history", getChatHistory);
router.get('/delete',deleteAll)

module.exports = router;