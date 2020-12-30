import mongoose from 'mongoose';

const { ObjectId, Number } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
	user: {
		type: ObjectId,
		ref: 'User' //referencing the User model
	},
	products: [
		{
			quantity: {
				type: Number,
				default: 1
			},
			product: {
				type: ObjectId,
				ref: 'Product' //referencing the Product model
			}
		}
	]
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
