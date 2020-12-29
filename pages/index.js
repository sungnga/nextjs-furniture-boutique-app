import { useEffect, Fragment } from 'react';
import axios from 'axios';

function Home() {
  // useEffect hook accepts 2 arguments
  // 1st arg is the effect function
  // Run code inside this function to interact w / outside world
  // 2nd arg is dependencies array
	useEffect(() => {
		getProducts();
	}, []);

	// axios.get() method returns a promise
	// so make the getProduct function an async function
	// the response we get back is in response.data object
	async function getProducts() {
		const url = 'http://localhost:3000/api/products';
		const res = await axios.get(url);
		const { data } = res;
	}

	return <Fragment>home</Fragment>;
}

export default Home;
