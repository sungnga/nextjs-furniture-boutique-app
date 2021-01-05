import React, { Fragment } from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import baseUrl from '../utils/baseUrl';

// Destructure products and totalPages props from getServerSideProps function
function Home({ products, totalPages }) {
	return (
		<Fragment>
			<ProductList products={products} />
			<ProductPagination totalPages={totalPages} />
		</Fragment>
	);
}

// Fetch data and return response data as props object
// This props object can be passed to a component prior to the component mounts
// It's an async function
// NOTE: getServerSideProps does the same thing as getInitialProps function
export async function getServerSideProps(ctx) {
	// console.log(ctx.query)
	// Check to see if page query is available
	const page = ctx.query.page ? ctx.query.page : '1';
	// size is the number of products on a page
	const size = 9;
	// fetch data on server
	const url = `${baseUrl}/api/products`;
	// params is query string params
	const payload = { params: { page, size } };
	const response = await axios.get(url, payload);
	// The return response.data object contains products array and totalPages
	// note: this object will be merged with existing props
	return { props: response.data };
}

export default Home;
