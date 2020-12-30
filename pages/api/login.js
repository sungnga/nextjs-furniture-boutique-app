import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDb';
import User from '../../models/User';

connectDB();

export default async (req, res) => {
	const { email, password } = req.body;
	try {
		// 1) Check to see if a user exists with the provided email
		// In User schema, we exclude password by default
		// But here, we want to select the password when finding a user in the db
		const user = await User.findOne({ email }).select('+password');
		// 2) --if not, return error
		if (!user) {
			return res.status(404).send('No user exists with that email');
		}
		// 3) Check to see if users' password matches the one in db
		// 1st arg is the password the user provided
		// 2nd arg is the password in the db
		// returns true or false
		const passwordsMatch = await bcrypt.compare(password, user.password);
		// 4) --if so, generate a token
		if (passwordsMatch) {
			const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: '7d'
			});
			res.status(200).json(token);
		} else {
			res.status(401).send('Passwords do not match'); //401 means not authenticated
		}
		// 5) Send that token to the client
	} catch (error) {
		console.error(error);
		res.status(500).send('Error logging in user');
	}
};
