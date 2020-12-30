import cookie from 'js-cookie';
import Router from 'next/router';

export function handleLogin(token) {
	// 1st arg is the key. We'll call it token
	// 2nd arg is the value, the given token
	cookie.set('token', token);
	// Redirect to the account route
	Router.push('/account');
}
