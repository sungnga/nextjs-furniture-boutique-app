import mongoose from 'mongoose';
import shortid from 'shortid';

const { String, Number } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	sku: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	description: {
		type: String,
		required: true
	},
	mediaUrl: {
		type: String,
		required: true
	}
});

// We want to check if the Product model already exists in our connected database
// If it does, use the existing model
// If it doesn't, then create the Product model
export default mongoose.models.Product ||
	mongoose.model('Product', ProductSchema);
