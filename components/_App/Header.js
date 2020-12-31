import { Fragment } from 'react';
import { Menu, Container, Image, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import nProgress from 'nprogress';

// When a route change starts, start the progress bar
Router.onRouteChangeStart = () => nProgress.start();
// When a route change ends, end the progress bar
Router.onRouteChangeComplete = () => nProgress.done();
Router.onRouteChangeError = () => nProgress.done();

function Header({user}) {
	console.log(user);
	// When execute, it returns a router object
	const router = useRouter();
  // const user = false
	// Check if the given route matches with router.pathname
	// router.pathname gives information about the route the user is on
	function isActive(route) {
		// return true or false
		return route === router.pathname;
	}

	return (
		<Menu fluid inverted id='menu' stackable>
			<Container text>
				<Link href='/'>
					<Menu.Item header active={isActive('/')}>
						<Image
							size='mini'
							src='/static/logo.svg'
							style={{ marginRight: '1em' }}
						/>
						Furniture Boutique
					</Menu.Item>
				</Link>

				<Link href='/cart'>
					<Menu.Item header active={isActive('/cart')}>
						<Icon name='cart' size='large' />
						Cart
					</Menu.Item>
				</Link>

				{user && (
					<Link href='/create'>
						<Menu.Item header active={isActive('/create')}>
							<Icon name='add square' size='large' />
							Create
						</Menu.Item>
					</Link>
				)}

				{user ? (
					<Fragment>
						<Link href='/account'>
							<Menu.Item header active={isActive('/account')}>
								<Icon name='user' size='large' />
								Account
							</Menu.Item>
						</Link>

						<Menu.Item header>
							<Icon name='sign out' size='large' />
							Logout
						</Menu.Item>
					</Fragment>
				) : (
					<Fragment>
						<Link href='/login'>
							<Menu.Item header active={isActive('/login')}>
								<Icon name='sign in' size='large' />
								Login
							</Menu.Item>
						</Link>

						<Link href='/signup'>
							<Menu.Item header active={isActive('/signup')}>
								<Icon name='signup' size='large' />
								Signup
							</Menu.Item>
						</Link>
					</Fragment>
				)}
			</Container>
		</Menu>
	);
}

export default Header;
