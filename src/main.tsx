import { Provider } from "react-redux";
import { render } from "react-dom";
import React from "react";
;
import store from "store/store";

import makeServer from "./server";
import "./index.scss";
import DashboardLayout from "./views/DashboardLayout/DashboardLayout";

makeServer();

render(
  <Provider store={store}>
    <DashboardLayout />
  </Provider>,
  document.getElementById("root")
);
