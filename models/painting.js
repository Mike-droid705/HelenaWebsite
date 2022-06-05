const mongoose = require("mongoose");

const paintingSchema = new mongoose.Schema({
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
	surface: {
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
		enum: ['acrylic', 'oil', 'charcoal', 'softpastel']
	},
	year: {
		type: String,
	}
})

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;