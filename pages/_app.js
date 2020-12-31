import App from 'next/app';
import Layout from '../components/_App/Layout';
import { parseCookies, destroyCookie } from 'nookies';
import { redirectUser } from '../utils/auth';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';

// App component is executed on the server and is executed before anything else
class MyApp extends App {
	// We have access to request and response from context object
	static async getInitialProps({ Component, ctx }) {
		// What's returned from parseCookies is cookies object
		// Destructure the token property from it
		const { token } = parseCookies(ctx);
		let pageProps = {};

		// first check to see if there exists an initial props of a given component
		// if there is, execute the function that accepts context object as an argument
		// this is an async operation
		// assign the result to pageProps object
		if (Component.getInitialProps) {
			// Execute getInitalProps for each page component
			pageProps = await Component.getInitialProps(ctx);
		}

		// Check to see if current user has a token
		if (!token) {
			const isProtectedRoute =
				ctx.pathname === '/account' || ctx.pathname === '/create';
			// If user is unauthenticated and is on a protected route, redirect user to login page
			if (isProtectedRoute) {
				redirectUser(ctx, '/login');
			}
		} else {
			// Make a request to get the user's account data from token
			try {
				const payload = { headers: { Authorization: token } };
				const url = `${baseUrl}/api/account`;
				const response = await axios.get(url, payload);
				const user = response.data;
				// Pass the user to the  pageProps user object
				// The pageProps will then pass to every page components and Layout component
				pageProps.user = user;
			} catch (error) {
        console.error('Error getting current user', error);
        // 1) Throw out invalid token
        destroyCookie(ctx, 'token')
        // 2) Redirect to login route
        redirectUser(ctx, '/login')
			}
		}

		// console.log(pageProps.user)
		return { pageProps };
	}

	// destructure pageProps object that's returned from getInitialProps function
	// the <Component /> is the component of each page
	// each page component now has access to the pageProps object
	render() {
		const { Component, pageProps } = this.props;
		return (
			<Layout {...pageProps}>
				<Component {...pageProps} />
			</Layout>
		);
	}
}

export default MyApp;
