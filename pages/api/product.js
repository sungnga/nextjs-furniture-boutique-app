import Product from '../../models/Product';
import connectDB from '../../utils/connectDb';

connectDB();

// For each request, we have access to the request and response objects
// Using req.method, we can figure out what type of request it is
// Based on the type of request, we can write the appropriate type of route handler to handle the request
export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await handleGetRequest(req, res);
			break;
		case 'POST':
			await handlePostRequest(req, res);
			break;
		case 'DELETE':
			await handleDeleteRequest(req, res);
			break;
		default:
			res.status(405).send(`Method ${req.method} not allowed`); //405 means error with request
			break;
	}
};

async function handleGetRequest(req, res) {
	const { _id } = req.query;
	const product = await Product.findOne({ _id });
	res.status(200).json(product);
}

async function handlePostRequest(req, res) {
	// The payload info sent on request by the client is accessible in req.body object
	const { name, price, description, mediaUrl } = req.body;
	try {
		// Check to see if the value for all the input fields is provided
		if (!name || !price || !description || !mediaUrl) {
			// status code 422 means the user hasn't provided the necessary info
			return res.status(422).send('Product missing one or more fields');
		}
		// Create a product instance from the Product model
		const newProduct = await new Product({
			name,
			price,
			description,
			mediaUrl
		});
		// Save the product to db
		newProduct.save();
		// status code 201 means a resource is created
		res.status(201).json(newProduct);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error in creating product');
	}
}
