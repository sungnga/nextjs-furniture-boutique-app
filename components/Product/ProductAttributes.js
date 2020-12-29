import { Fragment } from 'react';
import { Button, Header } from 'semantic-ui-react';

// Destructure only the keys needed from the product object props
function ProductAttributes({ description }) {
	return (
		<Fragment>
			<Header as='h3'>About this product</Header>
			<p>{description}</p>
			<Button
				icon='trash alternate outline'
				color='red'
				content='Delete Product'
			/>
		</Fragment>
	);
}

export default ProductAttributes;
