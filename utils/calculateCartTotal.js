function calculateCartTotal(products) {
	const total = products.reduce((accum, el) => {
		accum += el.product.price * el.quantity;
		return accum;
	}, 0);
	// Trick to remove any rounding errors, multiply by 100 then divide by 100
	// To make sure it rounds to two decimal places
	const cartTotal = ((total * 100) / 100).toFixed(2);
	const stripeTotal = Number((total * 100).toFixed(2));

	return { cartTotal, stripeTotal };
}

export default calculateCartTotal;
