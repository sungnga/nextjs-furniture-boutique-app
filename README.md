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




## RESOURCES
- Next.js docs: https://nextjs.org/docs/getting-started
- Semantic UI docs: https://react.semantic-ui.com/

## NPM PACKAGES USED IN THIS PROJECT
- react, react-dom
- next
- semantic-ui-react
- nprogress
- mongoose