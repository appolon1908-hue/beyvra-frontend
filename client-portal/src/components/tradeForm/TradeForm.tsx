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
}) => {
  const { duration, amount } = useAppSelector(
    (state: { trades: TradeStates }) => state.trades
  );
  const [cookies] = useCookies(["access_token"]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toggleTimeSelector, setToggleTimeSelector] = useState(false);
  const amountContainerRef = useRef();
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
    const { id, name, balance, currency } = selectedWallet;
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
      wallet: id.toString(),
      asset: assetPairs[0]?.id.toString(),
      open: socketData.open,
      close: socketData.close,
    };
    mutate({
      data: formattedData,
      token: cookies.access_token,
    });
  };
  const handleInputDown = () => {
    const { id } = selectedWallet;
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
      wallet: id.toString(),
      asset: assetPairs[0]?.id.toString(),
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
  const handleClickOutside = (e) => {
    if (
      amountContainerRef.current &&
      !amountContainerRef.current.contains(e.target)
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
    const iframe = document.getElementById("video-iframe");

    const handleIframeLoad = () => {
      try {
        const iframeDocument = iframe.contentWindow.document;
        const videoElement = iframeDocument.querySelector("video");

        if (videoElement) {
          videoElement.muted = true;

          videoElement.addEventListener("click", function () {
            videoElement.muted = !videoElement.muted;
          });
        }

        const skipAdButton = iframeDocument.querySelector(".skip-ad-button");
        if (skipAdButton) {
          skipAdButton.click();
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
            <div className="amount">
              <label htmlFor="amount">Amount, Đ</label>
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
            </div>
          </Tooltip>

          <div className="mathButtons">
            <button disabled={amount == 1} onClick={handleDecreaseAmount}>
              <SubtractIcon />
            </button>
            <button
              disabled={hintPlus ? false : disabled}
              className={`${hintPlus ? "hint" : ""}`}
              onClick={handleIncreaseAmount}
            >
              <PlusIcon />
            </button>
          </div>
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
              className="amount duration "
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
              <input
                type={disabled ? "text" : "text"}
                name="duration"
                id="duration"
                value={`${duration} sec`}
                // onChange={(e)=>SetDuration(e.target.value)}
                disabled={disabled}
                defaultValue={defaultDuration}
              />
            </div>
          </Tooltip>

          <div className="mathButtons">
            <button
              disabled={duration == 5}
              className={`${hintDuration ? "hint" : ""}`}
              onClick={handleDecreaseDuration}
            >
              <SubtractIcon />
            </button>
            <button disabled={disabled} onClick={handleIncreaseDuration}>
              <PlusIcon />
            </button>
          </div>
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
      {showProfit ? <p className="profit">Profit: + Đ0.82</p> : null}
      
    </div>
  );
};

export default TradeForm;
