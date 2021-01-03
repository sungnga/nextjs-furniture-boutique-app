import jwt from 'jsonwebtoken';
import connectDb from '../../utils/connectDb';
import Order from '../../models/Order';

connectDb();

export default async (req, res) => {
	// Check if authorization headers is provided with the request
	// If not, we want to return early
	if (!('authorization' in req.headers)) {
		return res.status(401).send('No authorization token'); //401 means not permitted
	}

	try {
		// jwt.verify() method verifies the token
		// 1st arg is the provided token
		// 2nd arg is the jwt secret which we use to sign the token
		// what's returned is an object. Destructure the userId property from it
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		const orders = await Order.find({ user: userId }).populate({
			path: 'products.product',
			model: 'Product'
		});
		// The .find() method returns an orders array. But we want to return orders object back to client
		res.status(203).json({ orders });
	} catch (error) {
		console.error(error);
		res.status(403).send('Please login again');
	}
};
