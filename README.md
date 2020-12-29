# MY NOTES WHEN BUILDING THIS WEB APP

### PROJECT SETUP
- Download starter project directory from https://github.com/reedbarger/react-reserve
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











## RESOURCES
- Next.js docs: https://nextjs.org/docs/getting-started
- Semantic UI docs: https://react.semantic-ui.com/

## NPM PACKAGES USED IN THIS PROJECT
- react, react-dom
- next
- semantic-ui-react
- nprogress