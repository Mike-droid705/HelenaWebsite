const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require('passport')

router.get('/login', (req, res)=>{
	res.render('login')
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}), function(req, res){
});

module.exports = router;