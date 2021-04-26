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
	price: {
		type: Number,
		required: true,
		min: 0
	},
	category: {
		type: String,
		lowercase: true,
		enum: ['acrylic', 'oil', 'watercolor', 'charcoal', 'softpastel', 'polymerclay']
	},
	stock: {
		type: String
	}
})

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = Painting;