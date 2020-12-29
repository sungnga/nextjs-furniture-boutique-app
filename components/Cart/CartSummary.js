import { Fragment } from 'react';
import { Segment, Button, Divider } from 'semantic-ui-react';

function CartSummary() {
	return (
		<Fragment>
			<Divider />
			<Segment clearing size='large'>
				<strong>Subtotal:</strong> $0.00
				<Button icon='cart' color='teal' floated='right' content='Checkout' />
			</Segment>
		</Fragment>
	);
}

export default CartSummary;
