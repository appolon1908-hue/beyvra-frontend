import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Providers from "providers.tsx";

import "react-toastify/dist/ReactToastify.css";
import "./i18n";

import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
