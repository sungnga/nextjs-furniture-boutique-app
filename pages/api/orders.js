import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
import connectDb from '../../utils/connectDb';

connectDb();

export default async (req, res) => {
	try {
		// jwt.verify() method verifies the token
		// 1st arg is the provided token
		// 2nd arg is the jwt secret which we use to sign the token
		// what's returned is an object. Destructure the userId property from it
		const { userId } = jwt.verify(
			req.headers.authorization,
			process.env.JWT_SECRET
		);
		const orders = await Order.find({ user: userId })
			.sort({ createdAt: 'desc' })
			.populate({
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
