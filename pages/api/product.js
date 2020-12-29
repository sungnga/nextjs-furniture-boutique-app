import Product from '../../models/Product';

export default async (req, res) => {
	// req.query is an object
	const { _id } = req.query;
	// The findOne() method is like a filter method
	// We want to filter by the _id property
	const product = await Product.findOne({ _id });
	res.status(200).json(product);
};
