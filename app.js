if(process.env.NODE_ENV !== "production"){
	require('dotenv').config()
}

const express = require('express');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const nodemailer = require("nodemailer");
const multer = require('multer');
const {storage} = require('./cloudinaryFolder')
const upload = multer({storage});

const User = require("./models/user");
const Painting = require("./models/painting");

const usersRoutes = require("./routes/users")

mongoose.connect("mongodb+srv://Mike:" + process.env.PASSWORD + "@cluster0.dueqsab.mongodb.net/gallery?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
	.then(() =>{
		console.log("Connection open!")
	})
	.catch(err => {
		console.log("Oh no...");
		console.log(err);
	});
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

//Authetnification
app.use(require("express-session")({
	secret: "A very good secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(usersRoutes);

//start
app.get('/', function(req, res){
	res.render("start");
})

//index
app.get('/type/:id', async (req, res)=>{
	const {id} = req.params;
	const paintings = await Painting.find({category: id});
	res.render("index", {paintings});
})

//show
app.get('/painting/:id', async (req, res)=>{
	const {id} = req.params;
	const painting = await Painting.findById(id);
	const paintings = await Painting.find({category: painting.category});
	const index = await paintings.findIndex(painting => painting._id == id);
	const back_order = painting.order-1;
	const front_order = painting.order+1;
	const back_painting = await paintings.findIndex(painting => painting.order == back_order);
	const forward_painting = await paintings.findIndex(painting => painting.order == front_order);
	res.render("show", {paintings, index, back_painting, forward_painting});
});

//create
app.get('/createPainting', (req, res)=>{
	if(!req.isAuthenticated()){
		return res.redirect('/login')
	}
	res.render('new');
});

app.route('/painting').post(upload.fields([{ name: 'image', maxCount: 1 },{ name: 'image_small', maxCount: 1 }]), async (req, res)=>{
	const newPainting = new Painting(req.body);
	const paintings = await Painting.find({category: newPainting.category});
	newPainting.image = req.files['image'].map(f => ({url: f.path, filename: f.filename}));
	newPainting.image_small = req.files['image_small'].map(f => ({url: f.path, filename: f.filename}));
	newPainting.order = paintings.length;
	await newPainting.save();
	console.log(newPainting);
	res.redirect("/");
});

//ma out of stock
app.put('/painting/stock/:id', async(req, res)=>{
	const {id} = req.params;
	const stock = req.body;
	const painting = await Painting.findByIdAndUpdate(id, stock, {runValidators: true});
	res.redirect(`/painting/${painting._id}`)
});

//edit
app.get('/painting/:id/edit', async(req, res)=>{
	if(!req.isAuthenticated()){
		return res.redirect('/login')
	}
	const {id} = req.params;
	const painting = await Painting.findById(id);
	res.render('edit', {painting})
});

app.put('/painting/:id', async(req, res)=>{
	const {id} = req.params;
	const painting = await Painting.findById(id);
	const paintings = await Painting.find({category: painting.category});
	// const paintings = await Painting.filter(p => p.category === painting.category);
	// console.log(paintings);
	// const old_painting = await paintings.find({order: req.body.order});
	const old_painting = await paintings.find(({ order }) => order == req.body.order);
	const order = painting.order;
	painting.name = req.body.name;
	painting.image[0].url = req.body.image;
	painting.image_small[0].url = req.body.image_small;
	painting.technique = req.body.technique;
	painting.dimensions = req.body.dimensions;
	painting.category = req.body.category;
	painting.year = req.body.year;
	painting.order = req.body.order;
	
	old_painting.order = order;
	
	await old_painting.save();
	await painting.save();
	res.redirect(`/painting/${painting._id}`)
});

//delete
app.delete('/painting/:id', async (req, res)=>{
	const {id} = req.params;
	await Painting.findByIdAndDelete(id);
	res.redirect("/");
});

app.get('/gallery', (req, res)=>{
	res.render('gallery');
});

app.get('/bio', (req, res)=>{
	res.render('bio');
});

app.get('/contact', (req, res)=>{
	res.render("contact");
});

app.get("/*", (req, res)=>{
	res.render("pagentf")
});

const port = process.env.PORT || 3000;
app.listen(port, function(req, res){
	console.log(`App is listening on port${port}`)
})