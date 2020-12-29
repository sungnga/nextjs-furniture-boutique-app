import products from '../../static/products.json';
import connectDB from '../../utils/connectDb';

// Execute the connectDB function to connect to MongoDB
connectDB();

export default (req, res) => {
	res.status(200).json(products);
};
