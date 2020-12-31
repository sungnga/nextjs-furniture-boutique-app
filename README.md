# MY NOTES WHEN BUILDING THIS WEB APP

### PROJECT SETUP
- Download the starter project directory from https://github.com/reedbarger/react-reserve
- Install and update the project dependencies by running:
  - `npm install`
  - then `npm update`
- To start up Next.js server and the project, run: `npm run dev`


### WORKING WITH REACT + NEXT.JS
**1. Create App Layout Component, Build Header Component**
- The Layout component is wrapped around the `<Component />` in _app.js file. This will override the default App.js and the layout defined in the Layout component will persist on every page
- Include the Semantic-UI-React stylesheet in Layout.js file
- The Layout component renders the HeadContent, Header Components, and children components
- All the contents inside the Layout component will be rendered on every page. For example, the Header component which contains the navbar will be rendered on every page
- The Header component contains the navbar menu with links that takes user to that particular page
  - Use Link component provided by Next.js to create the links
    - `import Link from 'next/link';`
  - Write a condition that check whether the user is currently logged in or not
  - If user not logged in, show the Login and Signup links and hide the Create link
  - If user is logged in, show the Account link and Logout button 
  - Use Semantic UI to style the Header component

**2. Get Route Data From useRouter Hook, Create Active Links**
- Since we're using a function component, Next provides a React useRouter() hook that gives us information from our router
- `import { useRouter } from 'next/router'`
- When execute, it will return a router object: `const router = useRouter()`
- We can get information about what path we're on from the router object by using the property `router.pathname`
- We can use this information to set the navbar menu item to be active when a user is on that particular route
- In Header.js file:
  - Write an isActive function that checks whether the given route matches with `router.pathname`. Return true or false
  - If it is matched, apply the `active` property to that navbar menu item
  ```js
  import { useRouter } from 'next/router';

  function Header() {
    // When execute, userRouter hook returns a router object
    const router = useRouter();
    const user = false;

    // Check if the given route matches with router.pathname
    // router.pathname gives information about the route the user is on
    function isActive(route) {
      // return true or false
      return route === router.pathname;
    }

    // Apply active style to menu item if the function returns true
    <Menu.Item header active={isActive('/')}>
  }
  ```

**3. Visualize Route Changes with Progress Bar**
- It's always good to display to the users visually what's taking place within the application
- We're going to display a progress bar when loading a new page or when fetching data
- Install nprogress package: `npm i nprogress`
- Next.js provides us with a `Router` object from `next/router`. In this object, we have access to when the route changes. We can write a function that starts the progress bar when the route changes, end the progress bar when route change is complete or encounter error
- In Header.js file:
  - Import the Router object from `next/router`
  - Import nProgress
  - Outside and above the Header component:
    - write a function that starts the progress bar when route change starts
    - Write a function that ends the progress bar when route change ends
    - write a function that ends the progress bar when an error occurs during route change
  ```js
  import Router, { useRouter } from 'next/router';
  import nProgress from 'nprogress';

  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  ```
- Style the progress bar in static/nprogress.css file and include the stylesheet in Layout.js file


### CREATING API WITH NODE + NEXT SERVER
**1. Node + Next Server with API Routes**
- In our home page in pages/index.js file, when the page loads (when the Home component mounts), we want to fetch the products with API and display them on the page
- Whenever our application is interacting with the outside world, such as fetching data from the database, we can use React's useEffect() hook. Inside this hook, we can call a function that makes an API request
- We will use axios, a tool to help make API requests
- APIs, in the purest sense, are routes. And routes are simple functions. So in order to create routes, we create basic functions
- In Next.js v.9 and newer, Next introduces API Routes. Any file (regular JS file) that is inside the `pages` directory Next.js will create a route for it. So we can create an api folder inside the `pages` directory that contains the route-name JS files and Next.js will automatically create the api routes for those files
- For example, if we want to make a get request to '/api/products' endpoint, we can just create a products.js file inside the pages/api folder. Then in this products.js file, we can write a function that sends a response with the data back to the client
- Another thing to note is that the port that the API request runs on is the same port that the client makes the request. By running on the same port, we can avoid CORS (cross-origin resource sharing) errors
- In pages/index.js file:
  - It's important that functions and components created inside pages directory is export default
  ```js
  import { Fragment, useEffect } from 'react';
  import axios from 'axios';

  function Home() {
    // useEffect hook accepts 2 arguments
    // 1st arg is the effect function
    // Run code inside this function to interact w / outside world
    // 2nd arg is dependencies array
    useEffect(() => {
      getProducts();
    }, []);

    // axios.get() method returns a promise
    // so make the getProduct function an async function
    // the response we get back is in response.data object
    async function getProducts() {
      const url = 'http://localhost:3000/api/products';
      const res = await axios.get(url);
      const { data } = res;
    }

    return <Fragment>home</Fragment>;
  }

  export default Home;
  ```
- In pages/api/products.js file:
  - It's important that functions and components created inside pages directory is export default
  - On every request made, we have access to the request(req) and response(res) objects
  ```js
  import products from '../../static/products.json';

  export default (req, res) => {
    res.status(200).json(products);
  };
  ```

**2. Fetching Data on the Server with getInitialProps**
- With client-side rendering, we would have to wait for the component to mount before we can fetch data. With Next.js, we can fetch data before the component mounts
- We do this using Next's `getInitialProps` function
  - This is an async function
  - This function fetches data on a server
  - Returns with the response data as an object
  - We can pass this object as props to our component
  - Also note that this object props will be merged with existing props
- Now, in order to pass the response data object coming from an API request as props to a component, we need to setup the `<Component />` in our custom _app.js file to receive pageProps, data object made available as props prior to the component mounts 
- In pages/_app.js file:
  ```js
  import App from 'next/app';
  import Layout from '../components/_App/Layout';

  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      let pageProps = {};

      // first check to see if there exists an initial props of a given component
      // if there is, execute the function that accepts context object as an argument
      // this is an async operation
      // assign the result to pageProps object
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps };
    }

    // destructure pageProps objects that's returned from getInitialProps funct
    // the <Component /> is the component of each page
    // each page component now has access to the pageProps object
    render() {
      const { Component, pageProps } = this.props;
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  }

  export default MyApp;
  ```
- In pages/index.js file:
  ```js
  import React, { Fragment, useEffect } from 'react';
  import axios from 'axios';

  function Home({ products }) {
    console.log(products);

    return <Fragment>home</Fragment>;
  }

  // Fetch data and return response data as props object
  // This props object can be passed to a component prior to the component mounts
  // It's an async function
  // NOTE: getServerSideProps does the same thing as getInitialProps function
  export async function getServerSideProps() {
    // fetch data on server
    const url = 'http://localhost:3000/api/products';
    const response = await axios.get(url);
    // return response data as an object
    // note: this object will be merged with existing props
    return { props: { products: response.data } };
  };

  export default Home;
  ```
- **The getInitialProps method:**
  - Docs: https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
  - `getInitialProps` enables server-side rendering in a page and allows you to do initial data population, it means sending the page with the data already populated from the server. This is especially useful for SEO
  - NOTE: `getInitialProps` is deprecated. If using Next.js 9.3 or newer, it's recommended to use `getStaticProps` or `getServerSideProps` instead of `getInitialProps`
  - These new data fetching methods allow you to have a granular choice between static generation and server-side rendering
  - Static generation vs. server-side rendering: https://nextjs.org/docs/basic-features/pages
- **Two forms of pre-rendering for Next.js:**
  - **Static Generation (Recommended):** The HTML is generated at **build time** and will be reused on each request. To make a page use Static Generation, either export the page component, or export `getStaticProps` (and `getStaticPaths` if necessary). It's great for pages that can be pre-rendered ahead of a user's request. You can also use it with Client-side Rendering to bring in additional data
  - **Server-side Rendering:** The HTML is generated on **each request**. To make a page use Server-side Rendering, export `getServerSideProps`. Because Server-side Rendering results in slower performance than Static Generation, use this only if absolutely necessary


### USING MONGODB WITH ATLAS
**1. Configure Mongo Atlas, Connect to Database**
- MongoDB Atlas: https://www.mongodb.com/cloud
- Mongo Atlas is a cloud database service that can host our MongoDB database on a remote server
- Once signed in to MongoDB Cloud, create a new project and choose the free tier. Name it FurnitureBoutique
- Then create a new cluster and give the cluster a name: FurnitureBoutique
- **Connecting the database to our application:**
  - First, we want to whitelist our connection IP address
    - From the project cluster dashboard, click on the Connect button
    - We want to allow our IP address be accessed anywhere. This will prevent potential errors in the future when we deploy our app in production. Problems like database denying access to our application due to the IP address we're trying to connect from
    - To do so, click on the Network Access on the left menu under Security. Then click the Allow Access From Anywhere button
  - Second, create a root database user
    - Create a user name and password
  - Third step is choose a connection method
    - Select the Connect your application option
    - Then what we want is the srv string. Copy the path to the clipboard
    - We just need to replace the username and password that we created for the root user earlier
- **Connect to database:**
  - In next.config.js file:
    - All of our environment variables are stored in this file
    - `MONGO_SRV: "<insert mongodb-srv path here>"`
    - Replace the password and dbname
    - Must restart the server
  - In utils/connectDb.js file:
    - In order to connect to the database we're going to use Mongoose package
    - We use Mongoose quite a lot when working with database
    - Install Mongoose: `npm i mongoose`
    - Write a connectDB function that connects our application to the database
    ```js
    import mongoose from 'mongoose';

    const connection = {};

    // Connect to database
    async function connectDB() {
      // If there is already a connection to db, just return
      // No need to make a new connection
      if (connection.isConnected) {
        // Use existing database connection
        console.log('Using existing connection');
        return;
      }
      // Use new database connection when connecting for 1st time
      // 1st arg is the mongo-srv path that mongo generated for our db cluster
      // The 2nd arg is options object. Theses are deprecation warnings
      // mongoose.connect() returns a promise
      // What we get back from this is a reference to our database
      const db = await mongoose.connect(process.env.MONGO_SRV, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('DB Connected');
      connection.isConnected = db.connections[0].readyState;
    }

    export default connectDB;
    ```
- **Call the connectDB function in routes:**
  - Finally, import and execute the connectDB function in the request routes files which are in the pages/api folder
  - Must restart the server
  - For example, import and execute the function in pages/api/products.js file
    - Execute the connectDB function at the very top and outside of the request route function
    ```js
    import connectDB from '../../utils/connectDb';

    // Execute the connectDB function to connect to MongoDB
    connectDB();
    ```
- If we're successfully connected to MongoDB, we should be able to see "DB Connected" logged in the console
- Lastly, add the next.config.js file to the .gitignore file

**2. Create Products Collection, Model Product Data**
- **Create products collection MongoDB by importing our static products data:**
  - On MongoBD project dashboard page, click on the Command Line Tools menu item at the top
  - In the Data Import and Export Tools section, copy the script for 'mongoimport'
  - In the terminal at the root of the project, paste in the script and specify the collection information
  - In our example, we want to import our static products json data into MongoDB Atlas
  - We'll call our collection products, type is json, provide the path to the data file, and add the --jsonArray flag
  - Use npx before the script
  - `npx mongoimport --uri mongodb+srv://<USERNAME>:<PASSWORD>@furnitureboutique.pikdk.mongodb.net/<DATABASE> --collection products --type json --file ./static/products.json --jsonArray`
  - If successful, we'll be able to see our products collection in MongoDB
- **Model Product data:**
  - We use Mongoose package to connect our application to the database. Now we will use Mongoose as ORM (Object Relational Mapper). It's a tool that's going to specify what each document must have for it to be added to a collection. What it must have in terms of properties and the corresponding data types and other conditions
  - An alternative word for a model is a schema
  - To create a Product model, we first need to define the product schema which contains the required fields and then call `mongoose.model()` to create a new model based on the schema we define
  - In models/Product.js file:
    - Use mongoose to create a new schema by using `new mongoose.Schema()`
    - This method takes an object as an argument and on this object we can specify all of the fields that a given document must have
    - The return result from this method we'll save to a variable ProductSchema
    - We'll use the npm package shortid to generate unique ids
    - Install shortid: `npm i shortid`
    - Generate a unique id by calling `shortid.generate()`
    - Call mongoose.model() method to create a new model
      - 1st arg is the name of the model
      - 2nd arg is the schema
    - We also want to check if the Product model already exists in our connected database. If it does, use the existing model. If it doesn't, then create the Product model
    ```js
    import mongoose from 'mongoose';
    import shortid from 'shortid';

    const { String, Number } = mongoose.Schema.Types;

    const ProductSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      sku: {
        type: String,
        unique: true,
        default: shortid.generate()
      },
      description: {
        type: String,
        required: true
      },
      mediaUrl: {
        type: String,
        required: true
      }
    });

    export default mongoose.models.Product ||
      mongoose.model('Product', ProductSchema);
    ```
- **Fetch Products From Mongo Database:**
  - In pages/api/products.js file:
    - Import the Product model and call the find() method on Product to retrieve the products from db
    - This is an async operation, so make the route function an async function
    ```js
    import Product from '../../models/Product';
    import connectDB from '../../utils/connectDb';

    // Execute the connectDB function to connect to MongoDB
    connectDB();

    export default async (req, res) => {
      const products = await Product.find();
      res.status(200).json(products);
    };
    ```
- Now when we make a request to `/api/products` endpoint, we should get back the products array coming from the MongoDB database

**3. Build Product Cards, Make Components Responsive**
- Semantic UI Card: https://react.semantic-ui.com/views/card/
- We'll use Semantic UI Card component to style the products on our home page
- The pages/index.js file renders the ProductList.js component
  - Pass the products array as props to ProductList component
  ```js
  import ProductList from '../components/Index/ProductList';

  function Home({ products }) {
    // console.log(products);
    return <ProductList products={products} />;
  }
  ```
- In components/Index/ProductList.js file
  - Destructure the products props
  - Write a mapProductsToItems function that maps over the products array and returns a new array of product objects
    - This product object defines keys and values that we can use to render the product in the Semantic UI Card component
  - In the Card component, specify the number of items per row
  - Add the stackable attribute to the `<Card.Group />` component so the items will stack on top of each other on smaller size screens
  - Do the same thing for the navbar menu items in Header.js component: `<Menu fluid inverted id='menu' stackable>`
  ```js
  import { Card } from 'semantic-ui-react';

  function ProductList({ products }) {
    function mapProductsToItems(products) {
      return products.map((product) => ({
        header: product.name,
        image: product.mediaUrl,
        meta: `$${product.price}`,
        color: 'teal',
        fluid: true,
        childKey: product._id,
        href: `/product?_id=${product._id}`
      }));
    }

    return (
      <Card.Group
        stackable
        itemsPerRow='3'
        centered
        items={mapProductsToItems(products)}
      />
    );
  }

  export default ProductList;
  ```


### FETCHING APP DATA FROM API
**1. Get Product By Id**
- When we click on a product, we want to direct user to the product detail page. We make an API request to get the product by its id
- In Next.js, we're able to fetch data before the component mounts. So we can make use of Next's getInitialProps function to fetch the data
- In pages/product.js file:
  - getInitialProps function automatically receives the context object as an argument
  - One of the properties in context object is query. We can use query string to get the product id to make the request
  - This function returns the response data object which we can pass to our Product component as props
  ```js
  import axios from 'axios';

  function Product({ product }) {
    console.log(product);
    return <p>product</p>;
  }

  Product.getInitialProps = async ({ query: { _id } }) => {
    const url = 'http://localhost:3000/api/product';
    const payload = { params: { _id } };
    const response = await axios.get(url, payload);
    return { product: response.data };
  };

  export default Product;
  ```
- Now let's create the API endpoint/route for the endpoint we defined in pages/product.js page
- In pages/api/product.js file:
  - Import the Product model and call the findOne() method on Product
  - The findOne() method is like a filter method. We want to filter by the _id property
  ```js
  import Product from '../../models/Product';

  export default async (req, res) => {
    // req.query is an object
    const { _id } = req.query;
    const product = await Product.findOne({ _id });
    res.status(200).json(product);
  };
  ```

**2. Style Product Detail Page**
- We will use three components to create and style the product detail page
- In components/Product folder:
  - ProductSummary.js - renders the AddProductToCart.js component
  - ProductAttributes.js
  - AddProductToCart.js
- In pages/product.js file:
  - The product route page renders the ProductSummary.js and ProductAttributes components
  - Each component receives the product object as props
  ```js
  // Spreading the product object as props using the object spread operator
  <Fragment>
    <ProductSummary {...product} />
    <ProductAttributes {...product} />
  </Fragment>
  ```
- In components/Product/ProductSummary.js file:
  - Destructure only the keys needed from the product object props
  ```js
  import { Item, Label } from 'semantic-ui-react';
  import AddProductToCart from './AddProductToCart';

  function ProductSummary({ _id, name, mediaUrl, sku, price }) {
    return (
      <Item.Group>
        <Item>
          <Item.Image size='medium' src={mediaUrl} />
          <Item.Content>
            <Item.Header>{name}</Item.Header>
            <Item.Description>
              <p>${price}</p>
              <Label>SKU: {sku}</Label>
            </Item.Description>
            <Item.Extra>
              <AddProductToCart productId={_id} />
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    );
  }

  export default ProductSummary;
  ```
- In components/Product/ProductAttributes.js file:
  - Destructure only the keys needed from the product object props
  ```js
  import { Button, Header } from 'semantic-ui-react';

  function ProductAttributes({ description }) {
    return (
      <>
        <Header as='h3'>About this product</Header>
        <p>{description}</p>
        <Button
          icon='trash alternate outline'
          color='red'
          content='Delete Product'
        />
      </>
    );
  }

  export default ProductAttributes;
  ```
- In components/Product/AddProductToCart.js file:
  ```js
  import { Input } from 'semantic-ui-react';

  function AddProductToCart(productId) {
    return (
      <Input
        type='number'
        min='1'
        placeholder='Quantity'
        value={1}
        action={{
          color: 'orange',
          content: 'Add to Cart',
          icon: 'plus cart'
        }}
      />
    );
  }

  export default AddProductToCart;
  ```

**3. Base URL Helper**
- When we fetch data in a development environment, we make request to `http:localhost:3000` on local server. And when we're in production, we're going to use the deployment URL
- Let's write a base URL helper function that detects whether we're in a production or development environment. We can dynamically determine this whether that's the case or not with the help of a environment variable
- In utils/baseUrl.js file:
  ```js
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://deployment-url.now.sh'
      : 'http://localhost:3000';

  export default baseUrl;
  ```
- Then wherever we use a URL to fetch data, we can replace the base URL with our baseUrl helper to generate the base URL dynamically
- In pages/index.js and pages/product.js files:
  - Import the baseUrl helper function
  - For the url variable, use template literal and interpolate the baseUrl variable
  ```js
  import baseUrl from '../utils/baseUrl';

  const url = `${baseUrl}/api/products`;
  ```


### ADDING CRUD FUNCTIONALITY, UPLOADING IMAGE FILES
**1. Delete A Product Functionality**
- When a user clicks on the Delete Product button, we want to display a modal asking the user to confirm the product deletion
- The modal contains the cancel button and Delete button
- To implement the modal functionality, we want to create a state for the modal to keep track of modal state in our application. We can use React useState() hook
- When the Cancel button is clicked, we just want to close the modal, setting the modal state to false
- When the Delete button is clicked, we want to make a delete API request to backend and delete the product based on id. Then redirect user to products index page
- In components/Product/ProductAttributes.js file:
  - Use Semantic UI Modal component to make the modal
  - Use React useState() to create the modal state. Default value is set to false
    - When the Delete Product button is clicked, set modal state to true
    - When Cancel button is clicked, set modal state to false. This will close the modal
  - Use useRouter hook from Next to redirect
  - Write a handleDelete function that makes a delete API request using axios to delete the product based on id
  ```js
  import React, { Fragment, useState } from 'react';
  import { useRouter } from 'next/router';
  import { Button, Header, Modal } from 'semantic-ui-react';
  import axios from 'axios';
  import baseUrl from '../../utils/baseUrl';

  function ProductAttributes({ description, _id }) {
    const [modal, setModal] = useState(false);
    const router = useRouter();

    async function handleDelete() {
      const url = `${baseUrl}/api/product`;
      const payload = { params: { _id } };
      await axios.delete(url, payload);
      // redirect to home page after delete product
      router.push('/');
    }

    return (
      <Fragment>
        <Header as='h3'>About this product</Header>
        <p>{description}</p>
        <Button
          icon='trash alternate outline'
          color='red'
          content='Delete Product'
          onClick={() => setModal(true)}
        />
        <Modal open={modal} dimmer='blurring'>
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this product?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button content='Cancel' onClick={() => setModal(false)} />
            <Button
              negative
              icon='trash'
              labelPosition='right'
              content='Delete'
              onClick={handleDelete}
            />
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }

  export default ProductAttributes;
  ```
- In pages/api/product.js file:
  - In the api routes for product, we want to be able to handle different types of requests such as create, read, update, and delete
  - For each request, we have access to the request and response objects. Using `req.method`, we can figure out what type of request it is
  - And based on the type of request, we can write the appropriate type of route handler to handle the request
  - We can use the switch statement to handle different types of requests
  - For now, we have a get and delete requests of a product
  ```js
  import Product from '../../models/Product';

  export default async (req, res) => {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      default:
        res.status(405).send(`Method ${req.method} not allowed`); //405 means error with request
        break;
    }
  };

  async function handleGetRequest(req, res) {
    const { _id } = req.query;
    const product = await Product.findOne({ _id });
    res.status(200).json(product);
  }

  async function handleDeleteRequest(req, res) {
    const { _id } = req.query;
    await Product.findOneAndDelete({ _id });
    // status code 204 means success and no content is sent back
    res.status(204).json({});
  }
  ```

**2. Building the Create Product Form**
- Let's build out the Create New Product form on the /create route (pages/create.js file) that enables user to create a product. They can provide product name, price, description, a product image, and upload a product image
- When the user uploads a file image, we want to display a preview of the image they just uploaded
- Once the user submitted the form, we can display a success message and clear the form input fields
- In pages/create.js file:
  ```js
  import { Fragment, useState } from 'react';
  import {
    Form, Input, TextArea, Button, Image, Header, Message, Icon } from 'semantic-ui-react';

  const INITIAL_PRODUCT = {
    name: '',
    price: '',
    media: '',
    description: ''
  };

  function CreateProduct() {
    const [product, setProduct] = useState(INITIAL_PRODUCT);
    const [mediaPreview, setMediaPreview] = useState('');
    const [success, setSuccess] = useState(false);

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

    function handleSubmit(event) {
      event.preventDefault();
      console.log(product);
      // Empty the input fields after form submit
      setProduct(INITIAL_PRODUCT);
      // Display the success message to the user
      setSuccess(true);
    }

    return (
      <Fragment>
        <Header as='h2' block>
          <Icon name='add' color='orange' />
          Create New Product
        </Header>
        <Form success={success} onSubmit={handleSubmit}>
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
  ```

**3. Upload Product Image, Post Product**
- **Create Cloudinary account, create upload preset:**
  - Cloudinary website: https://cloudinary.com/
  - Signup for a Cloudinary account
  - On the Dashboard page, make note of the Cloud name and the API Base URL. We will need them
  - We can specify image upload preset by going to Settings -> Upload tab
  - Scroll down to the Upload presets section:
    - Click the Add upload preset link
    - Give the upload preset a name. We will use this name in our code
    - Set the Signing Mode to Unsigned
    - Specify the folder name. The images will be uploaded to this folder
  - Select Upload Manipulations on the left menu:
    - In Incoming Transformation section, click on Edit
    - Here, we can change the size and quality of the image
  - Don't forget to hit the Save button to save the preset
- Creating a new product consists of two steps: 
  - First, take the image file and upload it to Cloudinary media storage service. What we get back is the image URL that we can store in our database
  - Second, take the image URL and the rest of product data stored in the state, make a request to an API endpoint to store the product in the database
  - Then display the new product within our app
- In pages/create.js file:
  - When the form is submitting, we want to let the user know that their request is processing by showing a loading icon and disable the submit button
  ```js
  import axios from 'axios';
  import baseUrl from '../utils/baseUrl';

  const [loading, setLoading] = useState(false);

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
		event.preventDefault();
		setLoading(true);
		const mediaUrl = await handleImageUpload();
		// console.log(mediaUrl)
		const url = `${baseUrl}/api/product`;
		const { name, price, description } = product;
		const payload = { name, description, price, mediaUrl };
		const response = await axios.post(url, payload);
		console.log(response);
		setLoading(false);
		// Clear the form input fields after submit
		setProduct(INITIAL_PRODUCT);
		// Show the success message
		setSuccess(true);
	}
  ```
- In pages/api/product.js file:
  - Before adding a product to db, make sure we're connected to the database
  - Create a POST request route handler that adds a new product to the database
  - Add a case for POST method and write a handlePostRequest method to handle the request
  ```js
  import connectDB from '../../utils/connectDb';

  connectDB();

  case 'POST':
    await handlePostRequest(req, res);
    break;

  async function handlePostRequest(req, res) {
    // The payload info sent on request by the client is accessible in req.body object
    const { name, price, description, mediaUrl } = req.body;
    // Check to see if the value for all the input fields is provided
    if (!name || !price || !description || !mediaUrl) {
      // status code 422 means the user hasn't provided the necessary info
      return res.status(422).send('Product missing one or more fields');
    }
    // Create a product instance from the Product model
    const newProduct = await new Product({ name, price, description, mediaUrl });
    // Save the product to db
    newProduct.save();
    // status code 201 means a resource is created
    res.status(201).json(newProduct);
  }
  ```


### HANDLING ERRORS ON THE CLIENT AND SERVER
**1. Prevent, Catch Errors on Client and Server Sides**
- A general guideline when taking care of problems within our app is we want to try to prevent errors on the client side before they can take place on the server side
- **Prevent users from submitting empty product input fields:**
  - As the current state of our app it's possible to submit a product form without all its fields filled out and this would naturally cause an error on the server
  - A solution is we can disable the Submit button if one of the fields is empty
  - In pages/create.js file:
    - Create a disabled state using useState() hook and set the default value to true
      - Pass the disabled state to the disabled property of the Submit button. This will disable the button by default
    - Then use useEffect() hook to update the `disabled` state when there's a change to the `product` state
    - We want to check whether the input field is empty or not. Only when the fields are not empty will we enable the Submit button
    ```js
    // Disable the Submit button. By default, it's disabled
    const [disabled, setDiasbled] = useState(true);
    
    // Whenever the product state changes, run the useEffect function
    useEffect(() => {
      // The Object.values() method returns an array of values of the object passed in
      // The every() method takes a callback and loops through the values array
      // For every element in every() method, call the Boolean method on it
      // The Boolean method will return true or false if the element is empty or not
      const isProduct = Object.values(product).every((el) => Boolean(el));
      isProduct ? setDiasbled(false) : setDiasbled(true);
    }, [product]);
    
    <Form.Field
      control={Button}
      disabled={disabled || loading}
      color='blue'
      icon='pencil alternate'
      content='Submit'
      type='submit'
    />
    ```
- **Handle errors on client-side when making request to image upload and request to product endpoint:**
  - A common pattern used to catch errors in asynchronous functions in executing promises is the try/catch block
    - In the `try` block is the code we try to run
    - In there's an error, the `catch` block can catch the error. The catch block automatically receives the error and we can decide what to do with the error
    - In the `finally` block is where we want run a piece of code no matter what the outcome is
  - There are different types of errors we might get back and instead of console logging the error, we can display an error message to the user
  - Let's write a separate function that displays an error message based on the type of error returned from the promise
  - In utils/catchErrors.js file:
    ```js
    // 1st arg is the error received from the catch block that gets passed down to this function
    // 2nd arg is a callback function that receives the errorMsg as an argument
    function catchErrors(error, displayError) {
      let errorMsg;
      if (error.response) {
        // The request was made and the server response with a  status code
        // that is not in the range of 2xx
        errorMsg = error.response.data;
        console.error('Error response', errorMsg);

        // For Cloudingary image uploads
        if (error.response.data.error) {
          errorMsg = error.response.data.error.message;
        }
      } else if (error.request) {
        // The request was made, but no response was received
        errorMsg = error.request;
        console.error('Error request', errorMsg);
      } else {
        // Something else happened in making the request that triggered an error
        errorMsg = error.message;
        console.error('Error message', errorMsg);
      }
      displayError(errorMsg);
    }

    export default catchErrors;
    ```
  - Then use the catchErrors function in the catch block in the handleSubmit function and display the error message to the user. This is handling errors when user submits a product form to create a new product
  - In pages/create.js file:
    - Create an error state and initialize its value to an empty string
    - Use try/catch/finally block in the handleSubmit function
    - Import and call the catchErrors function in the catch block
    - Lastly, check error state to see if there's an error
    - If there is, use Semantic UI Message component to render the error message in the Form component
    ```js
    import catchErrors from '../utils/catchErrors';

    const [error, setError] = useState('');

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
    // Display the error message to the user
    // Boolean(error) returns true or false. Error is the error state
    <Form
      loading={loading}
      error={Boolean(error)}
      success={success}
      onSubmit={handleSubmit}
    >
      <Message error header='Oops!' content={error} />
    </Form>
    ```
- **Handling errors on server side:**
  - On the server side, we want to try to figure out all the potential causes of errors and give the client as much information to resolve the error on their own
  - If there are some errors that we don't know about, we want to back a status code and a message about the error as well
  - Use try/catch block in async functions to catch the error returned from the promise
  - In pages/api/product.js file:
    ```js
    async function handlePostRequest(req, res) {
      // The payload info sent on request by the client is accessible in req.body object
      const { name, price, description, mediaUrl } = req.body;
      try {
        // Check to see if the value for all the input fields is provided
        if (!name || !price || !description || !mediaUrl) {
          // status code 422 means the user hasn't provided the necessary info
          return res.status(422).send('Product missing one or more fields');
        }
        // Create a product instance from the Product model
        const newProduct = await new Product({
          name,
          price,
          description,
          mediaUrl
        });
        // Save the product to db
        newProduct.save();
        // status code 201 means a resource is created
        res.status(201).json(newProduct);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error in creating product');
      }
    }
    ```

**2. Structure Cart Page**
- The cart page route consists of a section that displays a list of products in their shopping cart and a section that displays the subtotal and a checkout button
- In pages/cart.js file:
  - The cart route renders the CartItemList and CartSummary components
  ```js
  import { Segment } from 'semantic-ui-react';
  import CartItemList from '../components/Cart/CartItemList';
  import CartSummary from '../components/Cart/CartSummary';

  function Cart() {
    return (
      <Segment>
        <CartItemList />
        <CartSummary />
      </Segment>
    );
  }

  export default Cart;
  ```
- In components/Cart/CartItemList.js file:
  - Use Semantic UI to style this component
  - If the shopping cart is empty and the user has signed in, show the View Product button
  - If shopping cart is empty and user is not logged in, show the Login button
  ```js
  import { Header, Segment, Icon, Button } from 'semantic-ui-react';

  function CartItemList() {
    const user = false;

    return (
      <Segment secondary color='teal' inverted textAlign='center'>
        <Header icon>
          <Icon name='shopping basket' />
          No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color='orange'>View Products</Button>
          ) : (
            <Button color='blue'>Login to Add Products</Button>
          )}
        </div>
      </Segment>
    );
  }

  export default CartItemList;
  ```
- In components/Cart/CartSummary.js file:
  - Use Semantic UI to style this component
  ```js
  import { Fragment } from 'react';
  import { Segment, Button, Divider } from 'semantic-ui-react';

  function CartSummary() {
    return (
      <Fragment>
        <Divider />
        <Segment clearing size='large'>
          <strong>Subtotal:</strong> $0.00
          <Button icon='cart' color='teal' floated='right' content='Checkout' />
        </Segment>
      </Fragment>
    );
  }

  export default CartSummary;
  ```


### AUTHENTICATING USERS WITH JWT + COOKIES
**1. Build Login and Signup Forms**
- Both the Login and Signup forms have very similar functionality as the Create New Product form
- The Signup form has input fields of name, email, and password and a submit button
- The Login form has input fields of name and password and a submit button
- We use states using useEffect hooks to keep track of various aspects of the forms
  - Create a user state to store the input values the user enters in the form
  - Create a disabled state to disable the Submit button if the values for all fields are not provided
  - Create a loading state to display a loading icon letting the user know that the form is processing
  - Create an error state so that we can display an error message if something went wrong
- In pages/signup.js file:
  ```js
  import { Fragment, useState, useEffect } from 'react';
  import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react';
  import Link from 'next/link';
  import catchErrors from '../utils/catchErrors';

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
        console.log(user);
        // make request to signup user
      } catch (error) {
        catchErrors(error, setError);
      } finally {
        setLoading(false);
      }
    }

    return (
      //the rest of the code...
    )
  ```

**2. Model User, Signup User with JWT and Cookies**
- When a user signs up by submitting the Signup form, we want to create a new user and store it in a users collection in the database. We want to create a User model that defines what a user document would look like
- If a new user is successfully created, what's returned to the client from the server is a jsonwebtoken. We then use this token to set a cookie in the browser so that we can identify this client as an authenticated user
- **Client-side: make a request to signup user endpoint:**
  - In pages/signup.js file:
    - Import axios and baseUrl helper 
    - Call axios.post() method to make the request to signup user
      - 1st arg is the request endpoint
      - 2nd arg is the payload which contains the user data
      - This is an async operation
    ```js
    import axios from 'axios';
    import baseUrl from '../utils/baseUrl';

    // make request to signup user
    const url = `${baseUrl}/api/signup`
    // Spread in the user data coming from user state
    const payload = { ...user }
    // What's returned from the request is a token in response.data object
    const response = await axios.post(url, payload)
    ```
- **Create User model:**
  - In models/User.js file:
    ```js
    import mongoose from 'mongoose';

    const { String } = mongoose.Schema.Types;

    const UserSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          unique: true
        },
        password: {
          type: String,
          required: true,
          select: false
        },
        role: {
          type: String,
          required: true,
          default: 'user',
          enum: ['user', 'admin', 'root'] //the role field can only accept one of these three values
        }
      },
      {
        timestamps: true
      }
    );

    export default mongoose.models.User || mongoose.model('User', UserSchema);
    ```
- **Server-side: create signup route handler to signup user with JWT:**
  - In pages/api/signup.js file:
    - Import bcrypt package to hash user's password
    - Import connectDB to connect to our database
    - Import User model to create a user instance
    - Import jwt jsonwebtoken to generate a token
    ```js
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import connectDB from '../../utils/connectDb';
    import User from '../../models/User';

    connectDB();

    export default async (req, res) => {
      const { name, email, password } = req.body;
      try {
        // 1) Check to see if the user already exists in the db
        const user = await User.findOne({ email });
        if (use) {
          return res.status(422).send(`User already exist with email ${email}`);
        }
        // 2) --if not, hash their password
        const hash = await bcrypt.hash(password, 10);
        // 3) Create user
        const newUser = await new User({
          name,
          email,
          password: hash
        });
        newUser.save();
        console.log(newUser);
        // 4) Create token for the new user
        // A token expires after a certain period of time
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });
        // 5) Send back token
        res.status(201).json(token);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error signup user. Please try again later');
      }
    };
    ```
- **Store the JWT token in the browser as a cookie:**
  - Make a request to our signup endpoint -> get the token back on the client -> use a function to put the token in our browser as a cookie that can be accessed on the client or server
  - In utils/auth.js file:
    - Import js-cookie
    - Write a handleLogin helper function that sets a cookie based on the given token
    ```js
    import cookie from 'js-cookie';
    import Router from 'next/router';

    export function handleLogin(token) {
      // 1st arg is the key. We'll call it token
      // 2nd arg is the value, the given token
      cookie.set('token', token);
      // Redirect to the account route
      Router.push('/account');
    }
    ```
  - In pages/signup.js file:
    - Import the handleLogin helper function
    - Once we get the token back from the request, call the helper function and pass in the token as an argument
    - This will set a cookie in the browser for this particular token
    - Once handleSubmit is completed, a new user is successfully created, and a cookie is added to the browser, this helper function redirects user to the account page
    ```js
    import { handleLogin } from '../utils/auth';

    async function handleSubmit(event) {
      event.preventDefault();
      try {
        setLoading(true);
        setError('');
        // make request to signup user
        const url = `${baseUrl}/api/signup`;
        // Spread in the user data coming from user state
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
    ```

**3. Validate POST Content on Server Side**
- Right now users can enter anything they want in the input fields when they sign up. We want to set some constraints on the name, email, and password fields. We want to validate on the server side the values that are provided on the request body and then send an error back to the client and display it to users if it doesn't meet the conditions that we set
- We're going to use a tool called validator to help us validate forms
- Import validator: `npm i validator`
- In pages/api/signup.js file:
  - Add validation to name, email, and password
  ```js
  import isEmail from 'validator/lib/isEmail';
  import isLength from 'validator/lib/isLength';

  if (!isLength(name, { min: 3, max: 10 })) {
    return res.status(422).send('Name must be 3-10 characters long');
  } else if (!isLength(password, { min: 6 })) {
    return res.status(422).send('Password must be at least 6 characters');
  } else if (!isEmail(email)) {
    return res.status(422).send('Email must be valid');
  }
  ```

**4. Add Login Functionality**
- **Client-side: make a request to login user endpoint**
  - In pages/login.js file:
    - Import axios and baseUrl helper 
    - Call axios.post() method to make the request to login user
    ```js
    import axios from 'axios';
    import baseUrl from '../utils/baseUrl';

    const url = `${baseUrl}/api/login`;
    // Spread in user object, which come from user state
    const payload = { ...user };
    // What's returned from the request is a token in response.data object
    const response = await axios.post(url, payload);
    ```
- **Server-side: create login user route handler with JWT**
  - In pages/api/login.js file:
    - Use the try/catch block to handle the login user route request
    ```js
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import connectDB from '../../utils/connectDb';
    import User from '../../models/User';

    // Connect to the database
    connectDB();

    export default async (req, res) => {
      const { email, password } = req.body;
      try {
        // 1) Check to see if a user exists with the provided email
        // In User schema, we exclude password by default
        // But here, we want to select the password when finding a user in the db
        const user = await User.findOne({ email }).select('+password');
        // 2) --if not, return error
        if (!user) {
          return res.status(404).send('No user exists with that email');
        }
        // 3) Check to see if users' password matches the one in db
        // 1st arg is the password the user provided
        // 2nd arg is the password in the db
        // returns true or false
        const passwordsMatch = await bcrypt.compare(password, user.password);
        // 4) --if so, generate a token
        if (passwordsMatch) {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
          });
          res.status(200).json(token);
        } else {
          res.status(401).send('Passwords do not match'); //401 means not authenticated
        }
        // 5) Send that token to the client
      } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in user');
      }
    };
    ```
- **Store the JWT token in the browser as a cookie:**
  - Once the client receives the token from the server, we want to use a function to put the token in our browser as a cookie that can be accessed on the client or server
  - In pages/login.js file:
    - Import the handleLogin helper function
    - Once we get the token back from the request, call the helper function and pass in the token as an argument
    - This will set a cookie in the browser for this particular token
    - Once handleSubmit is completed, the user is successfully logged in, and a cookie is added to the browser, this helper function redirects user to the account page
    ```js
    import { handleLogin } from '../utils/auth';

    async function handleSubmit(event) {
      event.preventDefault();
      try {
        setLoading(true);
        setError('');
        // make request to signup user
        const url = `${baseUrl}/api/login`;
        // Spread in use object, which comes from user state
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
    ```

**5. Create User Cart Upon Signup**
- After a user sign up and when we create a document for them in the database, we need to link the user document with a cart document in the database
- So first we need to build a Cart model to define what a cart document has
  - One of the fields of the cart document is the user field
  - The value for this user field is the ObjectId of a user, a reference id to a user document in MongoDB
  - Whenever a new document is created in a collection, Mongoose automatically generates a _id for it. We can use ObjectId to reference other documents in a given document. MongoDB then uses an action called populate on that id to expand the data into the document 
  - So when we create a new cart document, we can associate a user document by its ObjectId
- **Create a Cart model:**
  - In models/Cart.js file:
    ```js
    import mongoose from 'mongoose';

    const { ObjectId, Number } = mongoose.Schema.Types;

    const CartSchema = new mongoose.Schema({
      user: {
        type: ObjectId,
        ref: 'User' //referencing the User model
      },
      products: [
        {
          quantity: {
            type: Number,
            default: 1
          },
          product: {
            type: ObjectId,
            ref: 'Product' //referencing the Product model
          }
        }
      ]
    });

    export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
    ```
- **Create a cart for new user upon signup:**
  - In pages/api/signup.js file:
    - Import Cart model
    - Before generating a token for the new user, create a cart for them. Save the new cart instance to the db
    ```js
    import Cart from '../../models/Cart';

		const cart = await new Cart({ user: newUser._id });
		cart.save();
    ```
- Now in MongoBD, when a new user document is created a cart document is also created that has a user field associated with the user ObjectId


### AUTHORIZATION AND PROTECTING CONTENT
**1. Get Current User from Token, Protect Auth Routes**
- Install nookies: `npm i nookies`
- Once a user signup or login to our application they can see different parts of the app depending on permission that they have
- On our custom App page(_app.js file) we have a `getInitialProps` method that gets called for each of our page components. This App component is executed on the server and it's executed before anything else. The `getInitialProps` method in this custom App component gets executed when page changes
- So this is the ideal place to fetch our user's data from token and pass it down to each of our page components and the page layout as props
- **Client-side: get user's account data from token:**
  - In pages/_app.js file:
    - From the context object we're able to information about the request and response because the App component is being executed on the server
    - And with that we'll be able to get all of the cookies
    - We're going to use a package called nookies that's going to allow us to take the context object and get from it all of the cookies, so that we can use that to make a request to send back the user to our app
    - Import the parseCookies function from nookies
    - Call parseCookies() and pass in context object as an argument. What we get back is cookies object
    - In this cookies object is the token property that we want. So we can destructure token from cookies
    - So now after we execute `getInitialProps` for each page component, we can check to see if the current user has a token
    - If no token, they are not an authenticated user. Hence they should not be able to access certain pages
    - Write an if statement that checks if current user is unauthenticated (no token) and if they are on a protected route (such as /create or /account), redirect the user using the redirectUser helper function
    - Import redirectUser helper function
    - If current user is authenticated (with token), make a request to get the user's account data from token
      - Use the try/catch block since we're making a request to an end point
      - The payload we provide is a little different. When it comes to providing a token, we're not going to pass it on a request body. If we need to provide a jsonwebtoken(jwt) for authorization, what we're providing is what's known as an authorization headers
      - So within the payload object, we're going to include an object call `headers`. This headers has a property called `Authorization` and it's going to be set to `token` that we're getting from cookies object
      - Import axios and baseUrl helper
      - Then specify a url and use axios to make a GET request
      - If the request is successful, what we get back is the user object from the database. Assign this user to pageProps.user
    - Pass the pageProps object as props to each page components and Layout component. Now every page routes has access to this user data
    ```js
    import { parseCookies } from 'nookies';
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
    ```
  - In utils/auth.js file:
    - Write a redirectUser helper function that redirects the user on the server or on client side
      - This function accepts two arguments
      - 1st arg is the context object. Also have access to req and res objects of context
      - 2nd arg is the location - the path to redirect to
    ```js
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
    ```
- **Server-side: create user account route handler:**
  - In pages/api/account.js file:
    - Since we want to get a user, we're going to interact with the User model. Import User model
    - Import connectDB helper since we need to connect to the db
    - Import jwt
    - First thing is check to see the authorization headers is provided with the request
    - If there isn't, we want to return early. If there is, then we have a token that we can use to verify the user
    - Use the jwt.verify() method to verify the provided token
    ```js
    import jwt from 'jsonwebtoken';
    import User from '../../models/User';
    import connectDB from '../../utils/connectDb';

    connectDB();

    export default async (req, res) => {
      // Check if authorization headers is provided with the request
      // If not, we want to return early`
      if (!('authorization' in req.headers)) {
        return res.status(401).send('No authorization token'); //401 means not permitted
      }

      try {
        // jwt.verify() method verifies the token
        // 1st arg is the provided token
        // 2nd arg is the jwt secret which we use to sign the token
        // what's returned is an object. Destructure the userId property from it
        const { userId } = jwt.verify(
          req.headers.authorization,
          process.env.JWT_SECRET
        );
        // Use the returned userId to find a user in the database
        const user = await User.findOne({ _id: userId });
        if (user) {
          // If user is found, return the user to the client
          res.send(200).json(user);
        } else {
          res.status(404).send('User not found');
        }
      } catch (error) {
        res.status(403).send('Invalid token'); //403 means forbidden action
      }
    };
    ```
- In components/_App/Layout.js component, receive and destructure the user props. Pass down the user props to the Header component
- In components/_App/Header.js component, receive and destructure the user props
- Now when an unauthenticated user tries to visit the /account or /create routes, they will be redirected to login page
- If a user is successfully logged in, they will be able to see and access the Create and Account links in the navbar

**2. Handle Invalid Auth Tokens**
- If the user's token has been expired or has been tampered with or somehow malfunctioned, we want to delete the invalid token and redirect user to login page so they can login again
- In page/_app.js file:
  - Import destroyCookie function from nookies
  - In the catch block, call the destroyCookie method to delete the invalid token
  - Then call the redirectUser helper method to redirect user to login page
  ```js
  import { parseCookies, destroyCookie } from 'nookies';

  catch (error) {
    console.error('Error getting current user', error);
    // 1) Throw out invalid token
    destroyCookie(ctx, 'token')
    // 2) Redirect to login route
    redirectUser(ctx, '/login')
  }
  ```

**3. Protect Admin Routes, Hide Protected Content**
- Users may have permission to certain pages depending on their role. For example, a user with the role of "user" does not have permission to create a product. Only admin users and root users have permission to create route. So for regular users, the Create link in the navbar will be hidden
- In page/_app.js file:
  - If a user is not an admin or root user and is on /create route, redirect them to home page
  ```js
  const response = await axios.get(url, payload);
  const user = response.data;
  const isRoot = user.role === 'root';
  const isAdmin = user.role === 'admin';
  // If authenticated, but not of role 'admin' or 'root', redirect from '/create/' page
  const isNotPermitted =
    !(isRoot || isAdmin) && ctx.pathname === '/create';
  if (isNotPermitted) {
    redirectUser(ctx, '/');
  }
  ```
- In components/_App/Header.js file:
  - Only admin or root users get to see the Create link in Menu.Item navbar
  ```js
  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isRoot || isAdmin;

  {isRootOrAdmin && (
    <Link href='/create'>
      <Menu.Item header active={isActive('/create')}>
        <Icon name='add square' size='large' />
        Create
      </Menu.Item>
    </Link>
  )}
  ```
- Also, a regular user does not have permission to delete a product. So the Delete Product button will be hidden
- In components/Product/ProductAttributes.js file
  - Destructure user props which receives from the Product parent component
  - Only reveal the Delete Product button and the Modal component to admin or root users
  ```js
  const isRoot = user && user.role === 'root';
  const isAdmin = user && user.role === 'admin';
  const isRootOrAdmin = isRoot || isAdmin;

  {isRootOrAdmin && (
    <Fragment>
      <Button
        icon='trash alternate outline'
        color='red'
        content='Delete Product'
        onClick={() => setModal(true)}
      />
      <Modal open={modal} dimmer='blurring'>
      ...
  )}
  ```

**4. Logout User**
- In utils/auth.js file:
  - Write a handleLogout function that logs out a user
  - Call the cookie.remove() method to remove the token from cookie
  - Then redirect user to login route
  ```js
  import cookie from 'js-cookie';

  export function handleLogout() {
    cookie.remove('token');
    Router.push('/login');
  }
  ```
- In components/_App/Header.js file:
  - Import the handleLogout function
  - Execute the handleLogout function on onClick event for Logout button
  ```js
  import { handleLogout } from '../../utils/auth';

  <Menu.Item onClick={handleLogout} header>
    <Icon name='sign out' size='large' />
    Logout
  </Menu.Item>
  ```


**4. Universal Logout Using LocalStorage**











## RESOURCES
- Next.js docs: https://nextjs.org/docs/getting-started
- Semantic UI docs: https://react.semantic-ui.com/

## NPM PACKAGES USED IN THIS PROJECT
- react, react-dom
- next
- mongoose (interact with MongoDB Atlas)
- semantic-ui-react (styling our app)
- nprogress (progress bar)
- bcrypt (hash password)
- jsonwebtoken (generate a token for user)
- js-cookie (generate a cookie)
- nookies (get cookies)