import { Header, Segment, Icon, Button, Item } from 'semantic-ui-react';
import { useRouter } from 'next/router';

function CartItemList({ products, user }) {
	const router = useRouter();

	function mapCartProductsToItems(products) {
		return products.map((p) => ({
			childKey: p.product._id,
			header: (
				<Item.Header
					as='a'
					onClick={() => router.push(`/product?_id=${p.product._id}`)}
				>
					{p.product.name}
				</Item.Header>
			),
			image: p.product.mediaUrl,
			meta: `${p.quantity} x $${p.product.price}`,
			fluid: 'true',
			extra: (
				<Button
					basic
					icon='remove'
					floated='right'
					onClick={() => console.log(p.product._id)}
				/>
			)
		}));
	}

	if (products.length === 0) {
		return (
			<Segment secondary color='teal' inverted textAlign='center'>
				<Header icon>
					<Icon name='shopping basket' />
					No products in your cart. Add some!
				</Header>
				<div>
					{user ? (
						<Button onClick={() => router.push('/')} color='orange'>
							View Products
						</Button>
					) : (
						<Button onClick={() => router.push('/login')} color='blue'>
							Login to Add Products
						</Button>
					)}
				</div>
			</Segment>
		);
	}

	return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
