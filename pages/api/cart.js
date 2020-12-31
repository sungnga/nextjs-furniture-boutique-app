import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDb';
import Cart from '../../models/Cart';

connectDB();

const { ObjectId } = mongoose.Types;

export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await handleGetRequest(req, res);
			break;
		case 'PUT':
			await handlePutRequest(req, res);
			break;
		default:
			res.status(405).send(`Method ${req.method} not allowed`);
			break;
	}
};

async function handleGetRequest(req, res) {
	// Check if a token is provided with the request
	if (!('authorization' in req.headers)) {
		return res.status(401).send('No authorization token');
	}
	try {
		// Verify the provided token
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		const cart = await Cart.findOne({ user: userId }).populate({
			path: 'products.product',
			model: 'Product'
		});
		// Send back just the products array from cart
		res.status(200).json(cart.products);
	} catch (error) {
		console.error(error);
		res.status(403).send('Please login again');
	}
}

async function handlePutRequest(req, res) {
	const { productId, quantity } = req.body;

	if (!('authorization' in req.headers)) {
		return res.status(401).send('No authorization token');
	}
	try {
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		// Get user cart based on userId
		const cart = await Cart.findOne({ user: userId });
		// Check if product already exists in cart
		// Use mongoose's ObjectId() method to convert string productId to objectIds
		// Returns true or false
		const productExists = cart.products.some((doc) =>
			ObjectId(productId).equals(doc.product)
		);
    // If so, increment quantity (by number provided to request)
    // 1st arg is specifying what we want to update
    // 2nd arg is how we want to update it
    // In mongoDB $inc is the increment operator. The $ is the index in the array
    // And then provide the path to the property we want to increment
		if (productExists) {
			await Cart.findOneAndUpdate(
				{ _id: cart._id, 'products.product': productId },
				{ $inc: { 'products.$.quantity': quantity } }
			);
		} else {
      // If not, add new product with given quantity
      // Use the $addToSet operator to ensure there won't be any duplicated product add
			const newProduct = { quantity, product: productId };
			await Cart.findOneAndUpdate(
				{ _id: cart._id },
				{ $addToSet: { products: newProduct } }
			);
		}
		res.status(200).send('Cart updated');
	} catch (error) {
		console.error(error);
		res.status(403).send('Please login again');
	}
}
