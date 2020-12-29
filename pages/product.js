import axios from 'axios';

function Product({ product }) {
	console.log(product);
	return <p>product</p>;
}

// getInitialProps function automatically receives the context object as an argument
// One of the properties in context object is query
// We can use query string to get the product id to make the request
// This function returns the response data object which we can pass to our Product component as props
Product.getInitialProps = async ({ query: { _id } }) => {
	const url = 'http://localhost:3000/api/product';
	const payload = { params: { _id } };
	const response = await axios.get(url, payload);
	return { product: response.data };
};

export default Product;
