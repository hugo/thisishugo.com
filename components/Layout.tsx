import { Fragment } from "react";

import Head from "../components/Head";

export default ({ children }) => (
  <Fragment>
    <Head />

    {children}
  </Fragment>
);
