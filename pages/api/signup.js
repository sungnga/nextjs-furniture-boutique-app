import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../utils/connectDb';
import User from '../../models/User';

connectDB();

export default async (req, res) => {
	const { name, email, password } = req.body;
	try {
		// 1) Check to see if the user already exists in the db
		const user = await User.findOne({ email });
		if (user) {
			return res.status(422).send(`User already exist with email ${email}`);
		}
		// 2) --if not, hash their password
		const hash = await bcrypt.hash(password, 10);
		// 3) Create user
		const newUser = await new User({
			name,
			email,
			password: hash
		});
		newUser.save();
		console.log(newUser);
		// 4) Create token for the new user
		// A token expires after a certain period of time
		const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: '7d'
		});
		// 5) Send back token
		res.status(201).json(token);
	} catch (error) {
		console.error(error);
		res.status(500).send('Error signup user. Please try again later');
	}
};
