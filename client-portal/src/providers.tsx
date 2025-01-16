import { Provider as ReduxProvider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import store from "./store";
import { ToastContainer } from "react-toastify";

export const queryClient = new QueryClient();

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <ToastContainer theme="dark" />
          {children}
        </CookiesProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

export default Providers;
