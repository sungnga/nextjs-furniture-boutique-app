import jwt from 'jsonwebtoken';
import User from '../../models/User';
import connectDb from '../../utils/connectDb';

connectDb();

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
		// Use the returned userId to find a user in the database
		const user = await User.findOne({ _id: userId });
		if (user) {
			// If user is found, return the user to the client
			res.status(200).json(user);
		} else {
			res.status(404).send('User not found');
		}
	} catch (error) {
		res.status(403).send('Invalid token'); //403 means forbidden action
	}
}

async function handlePutRequest(req, res) {
	const { _id, role } = req.body;
	// Find user by its id
	// Update the role field with the role data
	await User.findOneAndUpdate({ _id }, { role });
	res.status(203).send('User updated');
}
