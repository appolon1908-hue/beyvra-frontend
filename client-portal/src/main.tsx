import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Providers from "providers.tsx";
import ErrorBoundary from "components/ErrorBoundary";
import { validateEnvironment } from "config/environment";

import "react-toastify/dist/ReactToastify.css";
import "./i18n";

import "./index.scss";

// Validate environment on startup
validateEnvironment();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Providers>
      <App />
    </Providers>
  </ErrorBoundary>
);
