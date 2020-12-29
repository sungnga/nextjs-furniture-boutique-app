import React, { Fragment, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';

function Home({ products }) {
	// console.log(products);
	return <ProductList products={products} />;
}

// Fetch data and return response data as props object
// This props object can be passed to a component prior to the component mounts
// It's an async function
// NOTE: getServerSideProps does the same thing as getInitialProps function
export async function getServerSideProps() {
	// fetch data on server
	const url = `${baseUrl}/api/products`;
	const response = await axios.get(url);
	// return response data as an object
	// note: this object will be merged with existing props
	return { props: { products: response.data } };
}

export default Home;
