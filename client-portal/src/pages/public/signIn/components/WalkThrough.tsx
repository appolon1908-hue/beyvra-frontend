import { useState } from "react";
import "./WalkThrough.scss";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useDisableWalkThrough from "api/user/useDisableWalkthrough";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "@store/slices/user";
import { toUserSafeErrorText } from "errors/userSafeError";

const WalkThrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 10;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, , removeCookie] = useCookies(["access_token", "step"]);

  const { mutate: completeWalkthrough, isPending } = useDisableWalkThrough({
    onSuccess: (data) => {
      dispatch(setUser(data));
      removeCookie("step", { path: "/" });
      navigate("/platform", { replace: true });
    },
    onError: (err) => {
      setError(toUserSafeErrorText(err, "auth"));
    },
  });

  const handleComplete = () => {
    if (!cookies.access_token || isPending) return;
    setError(null);
    completeWalkthrough({ token: cookies.access_token });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      handleComplete();
    }
  };

  const renderModalContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeContentModal handleNext={handleNext} />;
      case 1:
        return <CompanyContentModal handleNext={handleNext} />;
      case 2:
        return <ChartContentModal handleNext={handleNext} />;
      case 3:
        return <ChartChangeContentModal handleNext={handleNext} />;
      case 4:
        return <ChartChange2ContentModal handleNext={handleNext} />;
      case 5:
        return <ChartItemSelectedContentModal handleNext={handleNext} />;
      case 6:
        return <InvestementsContentModal handleNext={handleNext} />;
      case 7:
        return <Investements2ContentModal handleNext={handleNext} />;
      case 8:
        return <Investements3ContentModal handleNext={handleNext} />;
      case 9:
        return <CompleteContentModal handleNext={handleComplete} />;
      default:
        return <CompleteContentModal handleNext={handleComplete} />;
    }
  };

  return (
    <div className="walkthrough-modal">
      <div className="walkthrough-content">
        <button className="close-button" onClick={handleComplete} disabled={isPending} aria-label="Skip training">
          ×
        </button>
        <div className="modal-counter">{`${
          currentStep + 1
        }/${totalSteps}`}</div>
        {renderModalContent()}
        {isPending && <div className="walkthrough-saving" role="status">Saving your progress…</div>}
      </div>
    </div>
  );
};

type WalkthroughStepProps = { handleNext: () => void };

const WelcomeContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="welcome-modal">
      <img src="/walkthrough-modal/welcome-modal.png" alt="" />
      <div className="welcome-modal_title">Welcome!</div>
      <div className="welcome-modal_descr">
        We&#39;ll help you take your first steps on our online trading platform.
      </div>
      <div className="welcome-modal_button" onClick={handleNext}>
        Start Training
      </div>
    </div>
  );
};

const CompanyContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img src="/walkthrough-modal/company.jpg" alt="" />
      <div className="company-modal_content">
        <div className="welcome-modal_descr">
          Trading is an activity that lets you earn money on price fluctuations
          of different assets such as currency pairs, commodities, and stocks.
        </div>
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const ChartContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart.gif"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item.png"
        alt=""
      />
      <div className="chart-modal_content">
        <div className="welcome-modal_descr">
          The chart shows how the price of an asset changes. If the line on the
          chart is going down, it means the price is falling. If it's going up,
          the price is rising.
        </div>
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const ChartChangeContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.gif"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item.png"
        alt=""
      />
      <div className="chart-modal_content">
        <div className="welcome-modal_descr">
          Traders make forecasts on how the price will change in the near
          future. Such a forecast is called a "trade".
        </div>
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const ChartChange2ContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.gif"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item.png"
        alt=""
      />
      <div className="chart-modal_content">
        <div className="welcome-modal_descr">
          Trades of fixed duration that offer a fixed profit are known as Fixed
          Time Trades or FTT.
        </div>
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const ChartItemSelectedContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.png"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item-selected.png"
        alt=""
      />
      <div className="info-block">
        <p>
          FTT assets vary in profitability. In this case, you will receive
          <strong> 85% of profit </strong> if, when the trade expires, the chart
          will still be moving in the correct direction.
        </p>
        <button className="understand-button" onClick={handleNext}>
          I Understand
        </button>
      </div>
    </div>
  );
};

const InvestementsContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.png"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item-selected.png"
        alt=""
      />
      <img
        className="investments-modal_img-item"
        src="/walkthrough-modal/investments.png"
        alt=""
      />
      <div className="investment-info">
        <p>
          You can set the investment amount at <strong>$100</strong>. Don't
          worry, this is training money.
        </p>
      </div>
      <div className="chart-modal_content">
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const Investements2ContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.png"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item-selected.png"
        alt=""
      />
      <img
        className="investments-modal_img-item"
        src="/walkthrough-modal/ivestments2.png"
        alt=""
      />
      <div className="investment-info investment-info_two">
        <p>
          You can select <strong>1 minute</strong> as the duration of your
          trade.
        </p>
      </div>
      <div className="chart-modal_content">
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const Investements3ContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.png"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item-selected.png"
        alt=""
      />
      <img
        className="investments-modal_img-item"
        src="/walkthrough-modal/instesments3.png"
        alt=""
      />
      <div className="investment-info investment-info_three">
        <p>
          Look at the chart and decide where it will go next:
          <strong>Up or Down</strong>
        </p>
      </div>
      <div className="chart-modal_content">
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Next
        </div>
      </div>
    </div>
  );
};

const CompleteContentModal = ({ handleNext }: WalkthroughStepProps) => {
  return (
    <div className="company-modal">
      <img
        className="company-modal_img"
        src="/walkthrough-modal/chart-change.png"
        alt=""
      />
      <img
        className="company-modal_img-item"
        src="/walkthrough-modal/chart-item-selected.png"
        alt=""
      />

      <div className="chart-modal_content">
        <div className="welcome-modal_descr">
          Congratulations! Your trade was successful. By investing $100, you've
          earned $85 — a 85% return in just 1 minute.
        </div>
        <div
          className="welcome-modal_button company-modal_button"
          onClick={handleNext}
        >
          Complete Training
        </div>
      </div>
    </div>
  );
};

export default WalkThrough;
