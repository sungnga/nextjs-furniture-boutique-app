import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import { parseCookies } from 'nookies';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';

function Cart({ products }) {
	// console.log(products)
	return (
		<Segment>
			<CartItemList />
			<CartSummary />
		</Segment>
	);
}

Cart.getInitialProps = async (ctx) => {
	// Destructure token property from the returned cookies object
	const { token } = parseCookies(ctx);
	// First check to see if user is authenticated
	// --if not, set products to an empty array and return early
	if (!token) {
		return { products: [] };
	}
	const url = `${baseUrl}/api/cart`;
	const payload = { headers: { Authorization: token } };
	const response = await axios.get(url, payload);
	return { products: response.data };
};

export default Cart;
