import '@/styles/globals.css'; // make sure Tailwind CSS is imported
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>MRCC EMR Preprocessing Tool</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Tailwind test block */}
      <div className="p-10 bg-blue-100 text-center text-lg font-semibold text-blue-800">
        Tailwind is working!
      </div>

      {/* Main page component */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
