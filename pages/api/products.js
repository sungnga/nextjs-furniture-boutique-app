// import products from '../../static/products.json';
import Product from '../../models/Product';
import connectDB from '../../utils/connectDb';

// Execute the connectDB function to connect to MongoDB
connectDB();

export default async (req, res) => {
	const { page, size } = req.query;
	// Convert query string values to numbers
	const pageNum = Number(page);
	const pageSize = Number(size);
	let products = [];
	const totalDocs = await Product.countDocuments();
	const totalPages = Math.ceil(totalDocs / pageSize);
	if (pageNum === 1) {
		// limit the number of products getting back from db by pageSize
		products = await Product.find().limit(pageSize);
	} else {
		const skips = pageSize * (pageNum - 1) * -1;
		products = await Product.find().skip(skips).limit(pageSize);
	}
	// const products = await Product.find();
	res.status(200).json({ products, totalPages });
};
