import cookie from 'js-cookie';
import Router from 'next/router';

export function handleLogin(token) {
	// 1st arg is the key. We'll call it token
	// 2nd arg is the value, the given token
	cookie.set('token', token);
	// Redirect to the account route
	Router.push('/account');
}

// 1st arg is context object. Also have access to req and res objects of context
// 2nd arg is the path to redirect to
export function redirectUser(ctx, location) {
	// If we have access to context, the request is on the server
	// If we get a request on the server, redirect on the server
	if (ctx.req) {
		// Redirecting on the server with Node
		ctx.res.writeHead(302, { Location: location });
		// To stop writing to this response
		ctx.res.end();
	} else {
		// Redirect on the client
		Router.push(location);
	}
}

export function handleLogout() {
	cookie.remove('token');
	Router.push('/login');
}
