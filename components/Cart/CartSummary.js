import { Fragment, useState, useEffect } from 'react';
import { Segment, Button, Divider } from 'semantic-ui-react';
import calculateCartTotal from '../../utils/calculateCartTotal';

function CartSummary({ products }) {
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
				<Button
					icon='cart'
					disabled={isCartEmpty}
					color='teal'
					floated='right'
					content='Checkout'
				/>
			</Segment>
		</Fragment>
	);
}

export default CartSummary;
