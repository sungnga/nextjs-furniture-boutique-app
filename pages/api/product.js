import Product from '../../models/Product';

// For each request, we have access to the request and response objects
// Using req.method, we can figure out what type of request it is
// Based on the type of request, we can write the appropriate type of route handler to handle the request
export default async (req, res) => {
	switch (req.method) {
		case 'GET':
			await handleGetRequest(req, res);
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

async function handleDeleteRequest(req, res) {
	const { _id } = req.query;
	await Product.findOneAndDelete({ _id });
	// status code 204 means success and no content is sent back
	res.status(204).json({});
}
