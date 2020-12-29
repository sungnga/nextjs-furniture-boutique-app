import { Fragment, useState, useEffect } from 'react';
import {
	Form,
	Input,
	TextArea,
	Button,
	Image,
	Header,
	Message,
	Icon
} from 'semantic-ui-react';

const INITIAL_PRODUCT = {
	name: '',
	price: '',
	media: '',
	description: ''
};
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';

function CreateProduct() {
	const [product, setProduct] = useState(INITIAL_PRODUCT);
	const [mediaPreview, setMediaPreview] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	// Disable the Submit button. By default, it's disabled
	const [disabled, setDiasbled] = useState(true);
	const [error, setError] = useState('');

	// Whenever the product state changes, run the useEffect function
	useEffect(() => {
		// The Object.values() method returns an array of values of the object passed in
		// The every() method takes a callback and loops through the values array
		// For every element in every() method, call the Boolean method on it
		// The Boolean method will return true or false if the element is empty or not
		const isProduct = Object.values(product).every((el) => Boolean(el));
		isProduct ? setDiasbled(false) : setDiasbled(true);
	}, [product]);

	function handleChange(event) {
		const { name, value, files } = event.target;
		if (name === 'media') {
			setProduct((prevState) => ({ ...prevState, media: files[0] }));
			// Display preview of uploaded image
			setMediaPreview(window.URL.createObjectURL(files[0]));
		} else {
			// Pass in the updater function to setProduct function
			// Spread in the previous state object into the new state object
			setProduct((prevState) => ({ ...prevState, [name]: value }));
		}
	}

	async function handleImageUpload() {
		// Using form data constructor to get data from the form
		const data = new FormData();
		data.append('file', product.media);
		data.append('upload_preset', 'furnitureboutique');
		data.append('cloud_name', 'sungnga');
		const response = await axios.post(process.env.CLOUDINARY_URL, data);
		const mediaUrl = response.data.url;
		return mediaUrl;
	}

	async function handleSubmit(event) {
		try {
			event.preventDefault();
			setLoading(true);
			const mediaUrl = await handleImageUpload();
			// console.log(mediaUrl)
			const url = `${baseUrl}/api/product`;
			const { name, price, description } = product;
			// Triggering an error for testing
			// const payload = { name: '', description, price, mediaUrl };
			const payload = { name, description, price, mediaUrl };
			const response = await axios.post(url, payload);
			console.log(response);
			// Clear the form input fields after submit
			setProduct(INITIAL_PRODUCT);
			// Show the success message
			setSuccess(true);
		} catch (error) {
			// 1st arg is the error received from the promise
			// 2nd arg is the function to update the error state
			catchErrors(error, setError);
			// console.error('ERROR!!', error)
		} finally {
			// At the end of handleSubmit, set loading state to false. Loading icon will go away
			setLoading(false);
		}
	}

	return (
		<Fragment>
			<Header as='h2' block>
				<Icon name='add' color='orange' />
				Create New Product
			</Header>
			<Form
				onSubmit={handleSubmit}
				loading={loading}
				success={success}
				error={Boolean(error)}
			>
				<Message error header='Oops!' content={error} />
				<Message
					success
					icon='check'
					header='Success!'
					content='Your product has been posted'
				/>
				<Form.Group widths='equal'>
					<Form.Field
						control={Input}
						name='name'
						label='Name'
						placeholder='Name'
						value={product.name}
						onChange={handleChange}
					/>
					<Form.Field
						control={Input}
						name='price'
						label='Price'
						placeholder='Price'
						min='0.00'
						step='0.01'
						type='number'
						value={product.price}
						onChange={handleChange}
					/>
					<Form.Field
						control={Input}
						name='media'
						type='file'
						label='Media'
						accept='image/*'
						content='Select Image'
						onChange={handleChange}
					/>
				</Form.Group>
				<Image src={mediaPreview} rounded centered size='small' />
				<Form.Field
					control={TextArea}
					name='description'
					label='Description'
					placeholder='Description'
					value={product.description}
					onChange={handleChange}
				/>
				<Form.Field
					control={Button}
					disabled={disabled || loading}
					color='blue'
					icon='pencil alternate'
					content='Submit'
					type='submit'
				/>
			</Form>
		</Fragment>
	);
}

export default CreateProduct;
