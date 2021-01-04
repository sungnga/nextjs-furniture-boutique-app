import { useState, useEffect, useRef } from 'react';
import { Header, Checkbox, Table, Icon } from 'semantic-ui-react';
import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from '../../utils/baseUrl';
import formatDate from '../../utils/formatDate';

function AccountPermissions() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		const url = `${baseUrl}/api/users`;
		const token = cookie.get('token');
		const payload = { headers: { Authorization: token } };
		const response = await axios.get(url, payload);
		// console.log(response.data)
		setUsers(response.data);
	}
	return (
		<div style={{ margin: '2em 0' }}>
			<Header as='h2'>
				<Icon name='settings' />
				User Permissions
			</Header>
			<Table compact celled definition>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell />
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Email</Table.HeaderCell>
						<Table.HeaderCell>Joined</Table.HeaderCell>
						<Table.HeaderCell>Updated</Table.HeaderCell>
						<Table.HeaderCell>Role</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{users.map((user) => (
						<UserPermission key={user._id} user={user} />
					))}
				</Table.Body>
			</Table>
		</div>
	);
}

function UserPermission({ user }) {
	const [admin, setAdmin] = useState(user.role === 'admin');
	const isFirstRun = useRef(true);

	// We only want useEffect to run when admin state changes, not when the component first mounts
	useEffect(() => {
		// The current property is whatever value we initialize when calling useRef() hook
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
		updatePermission();
	}, [admin]);

	function handleChangePermission() {
		setAdmin((prevState) => !prevState);
	}

	// Make request to update user's role based on user id in the db
	async function updatePermission() {
		const url = `${baseUrl}/api/account`;
		const payload = { _id: user._id, role: admin ? 'admin' : 'user' };
		// Use put method to update the db
		await axios.put(url, payload);
	}

	return (
		<Table.Row>
			<Table.Cell collapsing>
				<Checkbox checked={admin} toggle onChange={handleChangePermission} />
			</Table.Cell>
			<Table.Cell>{user.name}</Table.Cell>
			<Table.Cell>{user.email}</Table.Cell>
			<Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
			<Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
			<Table.Cell>{admin ? 'admin' : 'user'}</Table.Cell>
		</Table.Row>
	);
}

export default AccountPermissions;
