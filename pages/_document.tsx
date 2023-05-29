import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html>
      <Head>
        <title>Niekform</title>
      </Head>
      <body>
        <Main />
        <NextScript />

        <div id="niekform-flash"></div>
      </body>
    </Html>
  );
};

export default Document;
