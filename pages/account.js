import { Fragment } from 'react';
import AccountHeader from '../components/Account/AccountHeader';
import AccountOrders from '../components/Account/AccountOrders';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { parseCookies } from 'nookies';

function Account({ user, orders }) {
	return (
		<Fragment>
			<AccountHeader {...user} />
			<AccountOrders orders={orders} />
		</Fragment>
	);
}

Account.getInitialProps = async (ctx) => {
	const { token } = parseCookies(ctx);
	if (!token) {
		return { orders: [] };
	}
	const payload = { headers: { Authorization: token } };
	const url = `${baseUrl}/api/orders`;
	const response = await axios.get(url, payload);
	// The response.data object contains orders object props
	return response.data;
};
export default Account;
