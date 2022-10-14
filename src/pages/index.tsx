import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Spirit</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Spirit" />
        <meta name="apple-mobile-web-app-title" content="Spirit" />
        <meta
          name="description"
          content="Take notes and photo for your spirits and wines"
        />
        <meta name="theme-color" content="#FF2C55" />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/icons/favicon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/icons/favicon-72x72.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center h-screen space-y-8">
        <div className="relative h-40 w-40">
          <Image src="/assets/img/logo.png" layout="fill" />
        </div>
        <h1 className="text-8xl font-bold">Spirit</h1>
      </main>
    </>
  );
};

export default Home;
