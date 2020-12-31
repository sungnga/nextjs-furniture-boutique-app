import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDb';
import Cart from '../../models/Cart';

connectDB();

export default async (req, res) => {
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
};
