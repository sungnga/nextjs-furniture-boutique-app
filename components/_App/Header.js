import { Fragment } from 'react';
import { Menu, Container, Image, Icon } from 'semantic-ui-react';
import Link from 'next/link';

function Header() {
	const user = true;

	return (
		<Menu fluid inverted id='menu'>
			<Container text>
				<Link href='/'>
					<Menu.Item header>
						<Image
							size='mini'
							src='/static/logo.svg'
							style={{ marginRight: '1em' }}
						/>
						Furniture Boutique
					</Menu.Item>
				</Link>

				<Link href='/cart'>
					<Menu.Item header>
						<Icon name='cart' size='large' />
						Cart
					</Menu.Item>
				</Link>

				{user && (
					<Link href='/create'>
						<Menu.Item header>
							<Icon name='add square' size='large' />
							Create
						</Menu.Item>
					</Link>
				)}

				{user ? (
					<Fragment>
						<Link href='/account'>
							<Menu.Item header>
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
							<Menu.Item header>
								<Icon name='sign in' size='large' />
								Login
							</Menu.Item>
						</Link>

						<Link href='/signup'>
							<Menu.Item header>
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
