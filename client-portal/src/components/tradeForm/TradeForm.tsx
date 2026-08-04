import { Modal, Tooltip } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";

import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  InfoCircleIconSmall,
  PlusIcon,
  SubtractIcon,
  TimerIcon,
} from "../../assets/icons";
import "./tradeform.scss";
import { useAppSelector } from "@store/hooks";
import {
  changeAmount,
  changeDuration,
  setAmount,
  SetDuration,
  setTrade,
  setTradeData,
  setTradeTransaction,
  TradeStates,
} from "@store/slices/trade";
import { useDispatch } from "react-redux";
import { WalletSliceState } from "@store/slices/wallet";
import { AssetPairSliceState } from "@store/slices/pairs";
import useTrade from "api/wallet/useTrade";
import { useCookies } from "react-cookie";
import CustomTimeSelector from "components/customTimeSelector/CustomTimeSelector";
import { useCallback, useEffect, useRef, useState } from "react";

interface TradeFormProps {
  bottomSidebarHeight?: number;
  coinInfo?: boolean;
  showProfit?: boolean;
  showSetupOrder?: boolean;
  disabled?: boolean;
  defaultAmount?: string;
  defaultDuration?: string;
  amountTooltip?: boolean;
  durationTooltip?: boolean;
  hintTradesTooltip?: boolean;
  hintPlus?: boolean;
  hintDuration?: boolean;
  hintTrades?: boolean;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  handleUserInputUp?: () => void;
  handleUserInputDown?: () => void;
  profitPercent?: string;
  amountTooltipPlacement?: TooltipPlacement;
  durationTooltipPlacement?: TooltipPlacement;
  hintTradesTooltipPlacement?: TooltipPlacement;
  socketData?: any;
  onDecreaseDuration?: () => void;
}

const TradeForm: React.FunctionComponent<TradeFormProps> = ({
  bottomSidebarHeight,
  coinInfo = true,
  showProfit = true,
  showSetupOrder = true,
  disabled = false,
  defaultAmount,
  defaultDuration,
  amountTooltip = false,
  durationTooltip = false,
  hintTradesTooltip = false,
  hintPlus = false,
  hintDuration = false,
  hintTrades = false,
  handleUserInputUp,
  handleUserInputDown,
  setStep,
  profitPercent,
  amountTooltipPlacement = "left",
  durationTooltipPlacement = "left",
  hintTradesTooltipPlacement = "left",
  socketData,
  onDecreaseDuration,
}) => {
  const { duration, amount } = useAppSelector(
    (state: { trades: TradeStates }) => state.trades
  );
  const [cookies] = useCookies(["access_token"]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toggleTimeSelector, setToggleTimeSelector] = useState(false);
  const amountContainerRef = useRef<HTMLDivElement>(null);
  const { assetPairs } = useAppSelector(
    (state: { assetPair: AssetPairSliceState }) => state.assetPair
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const { selectedWallet } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );

  const { mutate, isPending } = useTrade({
    onSuccess: (data: any) => {
      console.log(data);
      // dispatch(setWallets(updatedWallets))
    },
    onError: (error) => {
      console.log("fetching wallets error", error);
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInputUp = () => {
    const walletId = selectedWallet?.id;
    const assetId = assetPairs[0]?.id;
    if (!walletId || !assetId || !socketData || !cookies.access_token) return;
    // const {id} = currency
    dispatch(setTrade("up"));
    dispatch(SetDuration(duration));
    dispatch(setAmount(amount));
    dispatch(setTradeData(socketData));
    console.log(socketData);

    const formattedData = {
      category: "fixed",
      quantity: "1",
      price_per_unit: amount,
      trade_type: "up",
      is_active: true,
      duration: duration,
      wallet: walletId.toString(),
      asset: assetId.toString(),
      open: socketData.open,
      close: socketData.close,
    };
    mutate({
      data: formattedData,
      token: cookies.access_token,
    });
  };
  const handleInputDown = () => {
    const walletId = selectedWallet?.id;
    const assetId = assetPairs[0]?.id;
    if (!walletId || !assetId || !socketData || !cookies.access_token) return;
    dispatch(setTrade("down"));
    dispatch(SetDuration(duration));
    dispatch(setAmount(amount));
    dispatch(setTradeData(socketData));

    const formattedData = {
      category: "fixed",
      quantity: "1",
      price_per_unit: amount,
      trade_type: "down",
      is_active: true,
      duration: duration,
      wallet: walletId.toString(),
      asset: assetId.toString(),
      open: socketData.open,
      close: socketData.close,
    };
    mutate({
      data: formattedData,
      token: cookies.access_token,
    });
  };

  const handleIncreaseDuration = () => {
    console.log("increase duration");
    dispatch(changeDuration("increase"));
  };
  const handleDecreaseDuration = () => {
    onDecreaseDuration?.();
    console.log("decrease duration");
    if (duration > 10) {
      dispatch(changeDuration("decrease"));
    }
    if (duration === 0 && setStep) {
      setStep(9);
    }
  };
  const handleIncreaseAmount = () => {
    dispatch(changeAmount("increase"));
    if (amount === 99 && setStep) {
      setStep(8);
    }
  };
  const handleDecreaseAmount = () => {
    if (amount > 1) {
      dispatch(changeAmount("decrease"));
    }
  };
  const handleClickOutside = (e: React.MouseEvent | globalThis.MouseEvent) => {
    if (
      amountContainerRef.current &&
      !amountContainerRef.current.contains(e.target as Node | null)
    ) {
      setToggleTimeSelector(false);
      console.log("triggered");
    }
  };

  useEffect(() => {
    if (toggleTimeSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleTimeSelector]);

  useEffect(() => {
    const iframe = document.getElementById("video-iframe") as HTMLIFrameElement | null;

    const handleIframeLoad = () => {
      try {
        const iframeDocument = iframe?.contentWindow?.document;
        if (!iframeDocument) return;
        const videoElement = iframeDocument.querySelector("video");

        if (videoElement) {
          videoElement.muted = true;

          videoElement.addEventListener("click", function () {
            videoElement.muted = !videoElement.muted;
          });
        }

        const skipAdButton = iframeDocument.querySelector(".skip-ad-button");
        if (skipAdButton) {
          (skipAdButton as HTMLElement).click();
        }
      } catch (error) {
        console.warn(
          "Cannot access iframe contents due to cross-origin policy.",
          error
        );
      }
    };

    if (iframe) {
      iframe.onload = handleIframeLoad;
    }
  }, []);

  return (
    <div
      className={`trade-form ${disabled ? "disabled" : ""}`}
      id="tradeForm"
      style={{
        marginBottom: window.innerWidth <= 767 ? bottomSidebarHeight : 0,
      }}
      onClick={handleClickOutside}
    >
      {/* {coinInfo ? (
        <div className="coinInfo">
          <div className="timeMode">
            <p className="coinTitle">EUR/USD OTC</p>
            <p className="timeSubtext">Fixed Time</p>
          </div>
          <InfoCircleIconSmall />
        </div>
      ) : null} */}

      <div className="amountsWrapper">
        <div className="amountContainer">
          <Tooltip
            rootClassName="walkthroughTooltip amountTooltip"
            placement={amountTooltipPlacement}
            title="Set the investment amount at $100. Don’t worry, this is test money."
            color="#28bd66"
            open={amountTooltip}
          >
            <div className="amount amount-control">
              <label htmlFor="amount">Amount, Demo</label>
              <div className="stepper-row">
                <button type="button" aria-label="Decrease demo amount" disabled={amount == 1 || disabled} onClick={handleDecreaseAmount}>
                  <SubtractIcon />
                </button>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  min="1"
                  id="amounts"
                  onChange={(e) => dispatch(setAmount(parseInt(e.target.value)))}
                  disabled={disabled}
                  defaultValue={defaultAmount}
                />
                <button type="button" aria-label="Increase demo amount" disabled={hintPlus ? false : disabled} onClick={handleIncreaseAmount}>
                  <PlusIcon />
                </button>
              </div>
            </div>
          </Tooltip>
        </div>

        <div className="amountContainer">
          <Tooltip
            rootClassName="walkthroughTooltip amountTooltip"
            placement={durationTooltipPlacement}
            title="Select 1 minute as the duration of the trade."
            color="#28bd66"
            open={durationTooltip}
          >
            <div
              className="amount amount-control duration "
              onClick={(e) => {
                setToggleTimeSelector(true);
                e.stopPropagation();
              }}
              ref={amountContainerRef}
            >
              {toggleTimeSelector && (
                <CustomTimeSelector
                  setToggleTimeSelector={setToggleTimeSelector}
                />
              )}
              <label htmlFor="duration">Duration</label>
              <div className="stepper-row">
                <button type="button" aria-label="Decrease demo duration" disabled={duration == 5 || disabled} onClick={(e) => { e.stopPropagation(); handleDecreaseDuration(); }}>
                  <SubtractIcon />
                </button>
                <input
                  type="text"
                  name="duration"
                  id="duration"
                  value={`${duration} sec`}
                  readOnly
                  disabled={disabled}
                  defaultValue={defaultDuration}
                  aria-label="Demo duration"
                />
                <button type="button" aria-label="Increase demo duration" disabled={disabled} onClick={(e) => { e.stopPropagation(); handleIncreaseDuration(); }}>
                  <PlusIcon />
                </button>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="buttonsWrapper">
        <Tooltip
          rootClassName="walkthroughTooltip amountTooltip"
          placement={hintTradesTooltipPlacement}
          title="Look at the chart and decide where it will go next: Up or Down"
          color="#28bd66"
          open={hintTradesTooltip}
        >
          <div className="upNdown">
            {showSetupOrder ? (
              <button className="setupOrder">
                <div className="buttonContent">
                  <span>Setup</span>
                  <span>Order</span>
                </div>
                <TimerIcon />
              </button>
            ) : null}
            <button
              onClick={handleInputUp}
              disabled={isPending}
              aria-busy={isPending}
              className={`up ${hintTrades ? "hint" : ""}`}
            >
              <div className="textContainerBtns">
                <span>Up</span>
                {profitPercent ? (
                  <span className="percentText">{profitPercent}</span>
                ) : null}
              </div>
              <span>
                <ArrowUpRightIcon />
              </span>
            </button>
            <button
              onClick={handleInputDown}
              disabled={isPending}
              aria-busy={isPending}
              className={`down ${hintTrades ? "hint" : ""}`}
            >
              <div className="textContainerBtns">
                <span>Down</span>
                {profitPercent ? (
                  <span className="percentText">{profitPercent}</span>
                ) : null}
              </div>
              <span>
                <ArrowDownRightIcon />
              </span>
            </button>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default TradeForm;
