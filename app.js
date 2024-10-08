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
	secret: "Toothless, Umbra, Annomalys and Skully are the best dragons",
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

app.get('/register', async (req, res) => {
	const user = new User({email: "helenablagojevic@gmail.com", username: "Helena"});
	const newUser = await User.register(user, "ella123");
	res.send(newUser);
})

//index
app.get('/type/:id', async (req, res)=>{
	const {id} = req.params
	const paintings = await Painting.find({category: id})
	res.render("index", {paintings});
})

//show
app.get('/painting/:id', async (req, res)=>{
	const {id} = req.params;
	const painting = await Painting.findById(id);
	res.render("show", {painting})
});

//create
app.get('/createPainting', (req, res)=>{
	if(!req.isAuthenticated()){
		return res.redirect('/login')
	}
	res.render('new');
});

app.route('/painting').post(upload.array('image'), async (req, res)=>{
	const newPainting = new Painting(req.body);
	newPainting.image = req.files.map(f => ({url: f.path, filename: f.filename}));
	await newPainting.save();
	console.log(newPainting)
	res.redirect("/")
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
	const {id} = req.params;
	const painting = await Painting.findById(id);
	res.render('edit', {painting})
});

app.put('/painting/:id', async(req, res)=>{
	const {id} = req.params;
	const painting = await Painting.findById(id);
	painting.name = req.body.name;
	painting.image[0].url = req.body.image;
	painting.surface = req.body.surface;
	painting.dimensions = req.body.dimensions;
	painting.category = req.body.category;
	painting.year = req.body.year;
	await painting.save();
	res.redirect(`/painting/${painting._id}`)
});

//delete
app.delete('/painting/:id', async (req, res)=>{
	const {id} = req.params;
	await Painting.findByIdAndDelete(id);
	res.redirect("/");
});

//navbar

app.get('/about', (req, res)=>{
	res.render('about');
});

app.get('/contacts', (req, res)=>{
	res.render("contacts");
});

//email route
app.post('/mail', upload.array('image'), (req, res)=>{
	const {email, size, date, comment} = req.body;
	const img = req.files.map(f => ({url: f.path}));
	const image = img[0].url;
	var smtpTransport = nodemailer.createTransport({
		service: 'Gmail', 
		auth: {
			user: 'blagojevicm18@gmail.com',
			pass: process.env.PASSWORD	
		}
	});
	var mailOptions = {
		from: email,
		to: 'blagojevicm18@gmail.com',
		subject: 'User ' + email + ' sent you a commission!',
		text: "User " + email + ' wants a picture sized ' + size + ' on date ' + date + '.\n\n' +
		 	image + " .\n\n" +
		 	comment
	};
	smtpTransport.sendMail(mailOptions, function(err) {
		if (err) {
			return console.log(err.message);
		}
		console.log('mail sent');
		res.redirect('/commissions')
	});
});

app.get("/easteregg", (req, res)=>{
	res.render("easteregg");
})

app.get("/*", (req, res)=>{
	res.render("pagentf")
});

const port = process.env.PORT || 3000;
app.listen(port, function(req, res){
	console.log(`App is listening on port${port}`)
})
