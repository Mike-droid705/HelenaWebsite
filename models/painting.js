const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
	order:{
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	image: [
		{
			url: String,
			filename: String
		}
	],
	image_small: [
		{
			url: String,
			filename: String
		}
	],
	technique: {
		type: String,
		required: true
	},
	dimensions: {
		type: String,
		required: true
	},
	category: {
		type: String,
		lowercase: true,
		enum: ['drawing', 'painting']
	},
	year: {
		type: String,
	}
})

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;