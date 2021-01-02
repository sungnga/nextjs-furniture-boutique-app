import { Fragment, useState, useEffect } from 'react';
import { Segment, Button, Divider } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ products, handleCheckout, success }) {
	const [isCartEmpty, setIsCartEmpty] = useState(false);
	const [cartAmount, setCartAmount] = useState(0);
	const [stripeAmount, setStripeAmount] = useState(0);

	useEffect(() => {
		const { cartTotal, stripeTotal } = calculateCartTotal(products);
		setCartAmount(cartTotal);
		setStripeAmount(stripeTotal);
		setIsCartEmpty(products.length === 0);
	}, [products]);

	return (
		<Fragment>
			<Divider />
			<Segment clearing size='large'>
				<strong>Subtotal:</strong> ${cartAmount}
				<StripeCheckout
					name='Furniture Boutique'
					amount={stripeAmount}
					image={products.length > 0 ? products[0].product.mediaUrl : ''}
					currency='USD'
					shippingAddress={true}
					billingAddress={true}
					zipCode={true}
					stripeKey='pk_test_51I4ydDADIwHRACIkXNyfNfefHO9zoXrEE2eVVwc4JO70GHyLndrutp1D7DBsi3hs5MWbe2k595hpDwj1h6LjkPQQ00EKlV9syf'
					token={handleCheckout}
					triggerEvent='onClick'
				>
					<Button
						icon='cart'
						disabled={isCartEmpty || success}
						color='teal'
						floated='right'
						content='Checkout'
					/>
				</StripeCheckout>
			</Segment>
		</Fragment>
	);
}

export default CartSummary;
