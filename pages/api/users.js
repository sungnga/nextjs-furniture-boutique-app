import jwt from 'jsonwebtoken';
import User from '../../models/User';
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
		// Get every user in the users collection, EXCEPT for our self - the root user
		// $ne is not equal to operator
		// Filter out the user _id that is not equal to the userId
		// Then sort users by their roles in ascending order
		const users = await User.find({ _id: { $ne: userId } }).sort({
			role: 'asc'
		});
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res.status(403).send('Please login again');
	}
};
