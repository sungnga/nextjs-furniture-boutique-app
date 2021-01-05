import { Fragment } from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react';

import Header from './Header';
import HeadContent from './HeadContent';

function Layout({ children, user }) {
	return (
		<Fragment>
			<Head>
				<HeadContent />
				{/* Stylesheets */}
				<link rel='stylesheet' type='text/css' href='/static/styles.css' />
				<link rel='stylesheet' type='text/css' href='/static/nprogress.css' />
				<link
					rel='stylesheet'
					href="//cdn.jsdelivr.net/npm/semantic-ui@${props.versions.sui}/dist/semantic.min.css"
				/>
				<title>Furniture Boutique</title>
			</Head>
			<Header user={user} />
			<Container text style={{ padding: '1em 0' }}>
				{children}
			</Container>
		</Fragment>
	);
}

export default Layout;
