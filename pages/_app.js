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
