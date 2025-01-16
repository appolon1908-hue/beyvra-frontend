import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { RightDrawerContent, RightSubDrawerContent } from "../types";
import { setTransactionId } from "@store/slices/payment";
import { useAppDispatch } from "@store/hooks";

interface UseQueryParamHandlerProps {
  setIsRightSubDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightSubDrawerContent: React.Dispatch<
    React.SetStateAction<RightSubDrawerContent>
  >;
  setIsRightDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightDrawerContent: React.Dispatch<
    React.SetStateAction<RightDrawerContent>
  >;
}

const useQueryParamHandler = ({
  setIsRightDrawerOpen,
  setIsRightDrawerContent,
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}: UseQueryParamHandlerProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const transactionId = queryParams.get("t");
    const status = queryParams.get("s");

    if (transactionId && status) {
      if (status === "success") {
        dispatch(setTransactionId(transactionId));
        setIsRightDrawerOpen(true);
        setIsRightDrawerContent("account");
        setIsRightSubDrawerOpen(true);
        setIsRightSubDrawerContent("depoist-successful");
      } else if (status === "failure") {
        // Handle failure case
      }

      // Clear the query parameters after processing
      window.history.replaceState(null, "", "#/platform");
    }
  }, [location.search, history]);
};

export default useQueryParamHandler;
