import { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
import cookie from 'js-cookie';

function AddProductToCart({ productId, user }) {
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	useEffect(() => {
		let timeout;
		if (success) {
			timeout = setTimeout(() => setSuccess(false), 3000);
		}
		return () => {
			// This is a global function
			clearTimeout(timeout);
		};
	}, [success]);

	async function handleAddProductToCart() {
		try {
			setLoading(true);
			const url = `${baseUrl}/api/cart`;
			const payload = { quantity, productId };
			// Get the token from cookie
			const token = cookie.get('token');
			// Provide the token as auth headers
			const headers = { headers: { Authorization: token } };
			await axios.put(url, payload, headers);
			setSuccess(true);
		} catch (error) {
			catchErrors(error, window.alert);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Input
			loading={loading}
			onChange={(event) => setQuantity(Number(event.target.value))}
			type='number'
			min='1'
			placeholder='Quantity'
			value={quantity}
			action={
				user && success
					? {
							color: 'blue',
							content: 'Item Added!',
							icon: 'plus cart',
							disabled: true
					  }
					: user
					? {
							color: 'orange',
							content: 'Add to Cart',
							icon: 'plus cart',
							loading,
							disabled: loading,
							onClick: handleAddProductToCart
					  }
					: {
							color: 'blue',
							content: 'Sign Up to Purchase',
							icon: 'signup',
							onClick: () => router.push('/signup')
					  }
			}
		/>
	);
}

export default AddProductToCart;
