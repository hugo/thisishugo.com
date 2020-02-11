import Head from "next/head";

import "../css/index.css";

import largeImage from "../images/hugo_large.jpg";
import ogImage from "../images/hugo_og.jpg";

export default () => (
  <div>
    <Head>
      <meta charSet="utf-8" />
      <meta
        content="width=device-width, initial-scale=1, viewport-fit=cover"
        name="viewport"
      />

      <title>Hugo Jobling</title>

      <meta
        content="Hugo Jobling. A programmer, writer, and human"
        name="description"
      />

      {/* Facebook */}
      <meta content="Hugo Jobling" property="og:title" />
      <meta content="Hugo Jobling" property="og:site_name" />
      <meta content="https://thisishugo.com" property="og:url" />
      <meta
        content="Hugo Jobling. A programmer, writer, and human"
        property="og:description"
      />
      <meta content="profile" property="og:type" />
      <meta content={ogImage} property="og:image" />

      {/* Twitter */}
      <meta content="summary" name="twitter:card" />
      <meta content="@dissimile" name="twitter:site" />
      <meta content="Hugo Jobling" name="twitter:title" />
      <meta
        content="Programmer, writer, and human"
        name="twitter:description"
      />
      <meta content={largeImage} name="twitter:image" />

      <link href="/icons/favicon.ico" rel="shortcut icon" />
      <link href="/icons/apple-touch-icon.png" rel="apple-touch-icon" />
    </Head>
  </div>
);
