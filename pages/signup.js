import { Fragment, useState, useEffect } from 'react';
import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
import Link from 'next/link';
import axios from 'axios';
import catchErrors from '../utils/catchErrors';
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';

const INITIAL_USER = {
	name: '',
	email: '',
	password: ''
};

function Signup() {
	const [user, setUser] = useState(INITIAL_USER);
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const isUser = Object.values(user).every((el) => Boolean(el));
		isUser ? setDisabled(false) : setDisabled(true);
	}, [user]);

	function handleChange(event) {
		const { name, value } = event.target;
		setUser((prevState) => ({ ...prevState, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		try {
			setLoading(true);
			setError('');
			// make request to signup user
			const url = `${baseUrl}/api/signup`;
			// Spread in user object, which comes from user state
			const payload = { ...user };
			// What's returned from the request is a token in response.data object
			const response = await axios.post(url, payload);
			// Set cookie in the browser
			handleLogin(response.data);
		} catch (error) {
			catchErrors(error, setError);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Fragment>
			<Message
				attached
				icon='settings'
				header='Get Started!'
				content='Create a new account'
				color='teal'
			/>
			<Form onSubmit={handleSubmit} loading={loading} error={Boolean(error)}>
				<Message error header='Oops!' content={error} />
				<Segment>
					<Form.Input
						fluid
						icon='user'
						iconPosition='left'
						label='Name'
						placeholder='Name'
						name='name'
						value={user.name}
						onChange={handleChange}
					/>
					<Form.Input
						fluid
						icon='envelope'
						iconPosition='left'
						label='Email'
						placeholder='Email'
						name='email'
						type='email'
						value={user.email}
						onChange={handleChange}
					/>
					<Form.Input
						fluid
						icon='lock'
						iconPosition='left'
						label='Password'
						placeholder='Password'
						name='password'
						type='password'
						value={user.password}
						onChange={handleChange}
					/>
					<Button
						disabled={disabled || loading}
						icon='signup'
						type='submit'
						color='orange'
						content='Signup'
					/>
				</Segment>
			</Form>
			<Message attached='bottom' warning>
				<Icon name='help' />
				Existing user?{' '}
				<Link href='/login'>
					<a>Log in here</a>
				</Link>
				{'  '}instead.
			</Message>
		</Fragment>
	);
}

export default Signup;
