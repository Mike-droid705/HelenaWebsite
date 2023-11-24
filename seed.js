const mongoose = require("mongoose");
const Painting = require('./models/painting');

mongoose.connect("mongodb://localhost:27017/gallery", {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() =>{
		console.log("Connection open!")
	})
	.catch(err => {
		console.log("Oh no...");
		console.log(err);
	});

const seedPaintings = [
	{
		name: 'Acrlylic painting',
		image: '',
		surface: 'canvas',
		price: 190,
		category: 'acrylic'
	},
	{
		name: 'Acrlylic painting 2.0',
		image: '',
		surface: 'canvas',
		price: 250,
		category: 'acrylic'
	},
	{
		name: 'Oil painting',
		image: '',
		surface: 'canvas',
		price: 500,
		category: 'oil'
	},
	
]

Painting.insertMany(seedPaintings)
.then(res =>{
	console.log(res)
})
.catch(e => {
	console.log(e);
})