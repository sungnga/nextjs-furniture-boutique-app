import { useState } from 'react';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';

function Cart({ products, user }) {
	const [cartProducts, setCartProducts] = useState(products);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleRemoveFromCart(productId) {
		const url = `${baseUrl}/api/cart`;
		const token = cookie.get('token');
		const payload = {
			params: { productId },
			headers: { Authorization: token }
		};
		const response = await axios.delete(url, payload);
		setCartProducts(response.data);
	}

	async function handleCheckout(paymentData) {
		try {
			setLoading(true);
			const url = `${baseUrl}/api/checkout`;
			const token = cookie.get('token');
			const payload = { paymentData };
			const headers = { headers: { Authorization: token } };
			await axios.post(url, payload, headers);
			setSuccess(true);
		} catch (error) {
			catchErrors(error, window.alert);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Segment loading={loading}>
			<CartItemList
				handleRemoveFromCart={handleRemoveFromCart}
				user={user}
				products={cartProducts}
				success={success}
			/>
			<CartSummary
				products={cartProducts}
				handleCheckout={handleCheckout}
				success={success}
			/>
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
