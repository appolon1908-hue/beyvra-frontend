import { Dispatch, SetStateAction } from "react";
import AssetsMenu from "./platformMenus/assets/AssetsMenu";
import EventsMenu from "./platformMenus/events/EventsMenu";
import HelpMenu from "./platformMenus/help/HelpMenu";
import MarketMenu from "./platformMenus/market/MarketMenu";
import TradesMenu from "./platformMenus/trades/TradesMenu";
import {
  CurrentDrawerType,
  LeftSubDrawer,
  RightDrawerContent,
  RightSubDrawerContent,
  WindowDrawer,
} from "./types";
import HelpCenter from "./platformMenus/helpCenter/HelpCenter";
import SupportMenu from "./platformMenus/support/SupportMenu";
import TradingPlatform from "./platformMenus/tradingPlatform/TradingPlatform";
import TradingPlatformInfo from "./platformMenus/tradingPlatformInfo/TradingPlatformInfo";
import OlympTradeInfo from "./platformMenus/olympTradeInfo/OlympTradeInfo";
import PaymentsMenu from "./platformMenus/payments/PaymentsMenu";
import ProfileMenu from "./platformMenus/profile/ProfileMenu";
import AccountMenu from "./platformMenus/account/AccountMenu";
import VerificationMenu from "./platformMenus/verification/VerificationMenu";
import SettingsMenu from "./platformMenus/settings/SettingsMenu";
import TwoFactorMenu from "./platformMenus/twoFactor/TwoFactorMenu";
import PersonalSettingsMenu from "./platformMenus/personalSettings/PersonalSettingsMenu";
import AppearanceMenu from "./platformMenus/appearance/AppearanceMenu";
import TradingMenu from "./platformMenus/trading/TradingMenu";
import BarcodeMenu from "./platformMenus/barcode/BarcodeMenu";
import UserNotificationsMenu from "./platformMenus/userNotifications/UserNotificationsMenu";
import ChangePassword from "./platformMenus/changePassword/ChangePassword";
import EditName from "./platformMenus/editName/EditName";
import ConfirmMail from "./platformMenus/confirmMail/ConfirmMail";
import ConfirmPhone from "./platformMenus/confirmPhone/ConfirmPhone";
import WithdrawMenu from "./platformMenus/withdraw/WithdrawMenu";
import AddAccountMenu from "./platformMenus/add-account/AddAccount";
import TradersWayMenu from "./platformMenus/tradersWay/TradersWayMenu";
import VerifyPayment from "./platformMenus/VerifyPayment/VerifyPayment";
import MagicBoxRewards from "./platformMenus/MagicBoxRewards/MagicBoxRewards";
import InviteFriends from "./platformMenus/inviteFriends/InviteFriends";
import { ArrowLeftOS } from "../../../assets/icons";
import CardDetailsMenu from "./platformMenus/cardDetailsMenu/CardDetailsMenu";
import WithdrawAccount from "./platformMenus/withdrawAccount/WithdrawAccount";
import BoostCubes from "./platformMenus/boostClubes/BoostCubes";
import DepositSuccessful from "./platformMenus/depositSuccessful/DepositSuccessful";
import VerificationHelpCenterMenu from "./platformMenus/verificationHelpCenterMenu/VerificationHelpCenterMenu";
import VerificationHelpCenterSubMenu from "./platformMenus/verificationHelpCenterSubMenu/VerificationHelpCenterSubMenu";
import PasswordSuccess from "./platformMenus/passwordSuccess/PasswordSuccess";
import AccountArchiveMenu from "./platformMenus/accountArchiveMenu/AccountArchiveMenu";
import AccountArchivedSuccessMenu from "./platformMenus/accountArchivedSuccessMenu/AccountArchivedSuccessMenu";
import AccountRename from "./platformMenus/accountRename/AccountRename";
import WithdrawRequest from "./platformMenus/withdrawRequest/WithdrawRequest";
import WithdrawPayment from "./platformMenus/withdrawpayment/WithdrawPayment";
import StatusMenu from "./platformMenus/status/StatusMenu";
import AddAccountName from "./platformMenus/addAccountName/AddAccountName";
import PublishedStrategiesMenu from "./platformMenus/publishedStrategiesMenu/PublishedStrategiesMenu";
import AiMenu from "./platformMenus/aiMenu/AiMenu";
import NewsMenu from "./platformMenus/newsMenu/NewsMenu";
import AiAssetSummaryMenu from "./platformMenus/aiAssetSummaryMenu/AiAssetSummaryMenu";
import ForexMarketSubMenu from "./platformMenus/marketSubMenu/ForexMarketSubMenu";
import AstroMarketSubMenu from "./platformMenus/marketSubMenu/AstroMarketSubMenu";
import CryptoMarketSubMenu from "./platformMenus/marketSubMenu/CryptoMarketSubMenu";
import TradingConditionsMarketSubMenu from "./platformMenus/marketSubMenu/TradingConditionsMarketSubMenu";
import SignalsMarketSubMenu from "./platformMenus/marketSubMenu/SignalsMarketSubMenu";
import CustomStrategiesMarketSubMenu from "./platformMenus/marketSubMenu/CustomStrategiesMarketSubMenu";
import StrategiesMarketSubMenu from "./platformMenus/marketSubMenu/StrategiesMarketSubMenu";
import IndicatorsMarketSubMenu from "./platformMenus/marketSubMenu/IndicatorsMarketSubMenu";
import ThemesMarketSubMenu from "./platformMenus/marketSubMenu/ThemesMarketSubMenu";
import AdvisersMarketSubMenu from "./platformMenus/marketSubMenu/AdvisersMarketSubMenu";
import EducationMenu from "./platformMenus/educationMenu/EducationMenu";
import JoinLeagues from "./platformMenus/joinLeagues/JoinLeagues";
import TradingTutorials from "./platformMenus/tradingTutorials/TradingTutorials";
import EventsSignalsClub from "./platformMenus/eventsSignalsClub/EventsSignalsClub";
import PortfolioMenu from "./platformMenus/Portfolio/PortfolioMenu";

// Left Drawer Handlers
export function leftDarwerTitleHandler(
  currentDrawer: CurrentDrawerType
): string {
  switch (currentDrawer) {
    case "trades":
      return "Trades";
    case "events":
      return "Events";
    case "market":
      return "Market";
    case "help":
      return "Help";
    case "assets":
      return "Assets";
    case "ai":
      return "AI";
    case "news":
      return "News";
    default:
      return "";
  }
}

export const windowBodyHandler = (
  windowDrawer: WindowDrawer,
  setWindowDrawer: Dispatch<SetStateAction<WindowDrawer>>,
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>,
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>
) => {
  return <PortfolioMenu />;
};

export function leftDrawerBodyHandler(
  currentDrawer: CurrentDrawerType,
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>,
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>,
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
): JSX.Element | null {
  switch (currentDrawer) {
    case "trades":
      return (
        <TradesMenu
          setLeftSubDrawer={setLeftSubDrawer}
          setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      );
    case "market":
      return (
        <MarketMenu
          setLeftSubDrawer={setLeftSubDrawer}
          setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
        />
      );
    case "events":
      return (
        <EventsMenu
          setLeftSubDrawer={setLeftSubDrawer}
          setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
        />
      );
    case "help":
      return (
        <HelpMenu
          setLeftSubDrawer={setLeftSubDrawer}
          setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
        />
      );
    case "assets":
      return <AssetsMenu setIsDrawerOpen={setIsDrawerOpen} />;
    case "ai":
      return (
        <AiMenu
          setLeftSubDrawer={setLeftSubDrawer}
          setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
        />
      );
    case "news":
      return <NewsMenu />;
    default:
      return null;
  }
}

// Left Sub Drawer Handlers
export function leftSubDrawerTitleHandler(
  leftSubDrawer: LeftSubDrawer
): string {
  switch (leftSubDrawer) {
    case "help-center":
      return "Help Center";
    case "support":
      return "Support";
    case "barcode":
      return "Barcode";
    case "published-strategies":
      return "My Published Strategies";
    case "forex-market-sub":
    case "astro-market-submenu":
    case "crypto-market-submenu":
    case "trading-conditions-market-submenu":
    case "signals-market-submenu":
    case "custom-strategies-market-submenu":
    case "strategies-market-submenu":
    case "indicators-market-submenu":
    case "themes-market-submenu":
    case "advisers-market-submenu":
      return "Market";
    case "trading-platform":
      return "Help Center";
    case "education-menu":
      return "Education";
    case "trading-tutorials":
      return "Trading Tutorials";
    case "why-coose-us":
      return "Help Center";
    case "ai-asset-summary":
      return "AI";
    default:
      return "";
  }
}
export function leftSubDrawerBodyHandler(
  leftSubDrawer: LeftSubDrawer,
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>
): JSX.Element | null {
  switch (leftSubDrawer) {
    case "help-center":
      return <HelpCenter setLeftSubDrawer={setLeftSubDrawer} />;
    case "support":
      return <SupportMenu />;
    case "barcode":
      return <BarcodeMenu />;
    case "published-strategies":
      return <PublishedStrategiesMenu />;
    case "forex-market-sub":
      return <ForexMarketSubMenu />;
    case "crypto-market-submenu":
      return <CryptoMarketSubMenu />;
    case "astro-market-submenu":
      return <AstroMarketSubMenu />;
    case "trading-conditions-market-submenu":
      return <TradingConditionsMarketSubMenu />;
    case "signals-market-submenu":
      return <SignalsMarketSubMenu />;
    case "custom-strategies-market-submenu":
      return <CustomStrategiesMarketSubMenu />;
    case "strategies-market-submenu":
      return <StrategiesMarketSubMenu />;
    case "indicators-market-submenu":
      return <IndicatorsMarketSubMenu />;
    case "themes-market-submenu":
      return <ThemesMarketSubMenu />;
    case "advisers-market-submenu":
      return <AdvisersMarketSubMenu />;
    case "trading-platform":
      return <TradingPlatform setLeftSubDrawer={setLeftSubDrawer} />;
    case "trading-tutorials":
      return <TradingTutorials />;
    case "education-menu":
      return <EducationMenu />;
    case "what-is-trading":
      return <TradingPlatformInfo setLeftSubDrawer={setLeftSubDrawer} />;
    case "why-coose-us":
      return <OlympTradeInfo setLeftSubDrawer={setLeftSubDrawer} />;
    case "ai-asset-summary":
      return <AiAssetSummaryMenu />;
    case "event-join-leagues":
      return <JoinLeagues />;
    case "events-signals-club":
      return <EventsSignalsClub />;
    default:
      return null;
  }
}

// Right Drawer Handlers
export function rightDrawerTitleHandler(
  rightDrawerContent: RightDrawerContent
): string {
  switch (rightDrawerContent) {
    case "account":
      return "Accounts";
    case "profile":
      return "Profile";
    case "payments":
      return "Payments";
    case "verification":
      return "Verification";
    case "verify-payment":
      return "Confirm Payment";
    default:
      return "";
  }
}

export function rightDrawerBodyHandler(
  rightDrawerContent: RightDrawerContent,
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>,
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>,
  setIsRightDrawerOpen: Dispatch<SetStateAction<boolean>>
): JSX.Element | null {
  switch (rightDrawerContent) {
    case "payments":
      return (
        <PaymentsMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "profile":
      return (
        <ProfileMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
          setIsRightDrawerOpen={setIsRightDrawerOpen}
        />
      );
    case "account":
      return (
        <AccountMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "verification":
      return (
        <VerificationMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
      
    default:
      return null;
  }
}

// Right Sub Drawer Handlers
export function rightSubDrawerTitleHandler(
  rightSubDrawerContent: RightSubDrawerContent
): RightSubDrawerContent | string {
  switch (rightSubDrawerContent) {
    case "settings":
      return "Settings";
    case "twofactor":
      return "Two-factor Authentication";
    case "personalSettings":
      return "Personal settings";
    case "verification":
      return "Verification";
    case "appearance":
      return "Appearance";
    case "transfer":
      return "Transfer";
    case "trading":
      return "Trading";
    case "notifications":
      return "Notifications";
    case "barcode":
      return "Barcode";
    case "user-notifications":
      return "Notifications";
    case "change-password":
      return "Change Password";
    case "edit-name":
      return "Edit name";
    case "confirm-email":
      return "Confirm your email";
    case "confirm-phone":
      return "Confirm phone number";
    case "select-account":
      return "To:";
    case "withdraw":
    case "withdraw-payment":
      return "Withdraw";
    case "add-account":
      return "Add an account";
    case "traders-way":
      return "Trader's Way";
    case "invite-friends":
    case "boost-cubes":
    case "referral-program":
      return "Invite Friends & Get Rewards";
    case "payments-deposit":
    // return "Confirm Payment";
    case "get-rewards-deposit":
      return "Deposit";
    case "select-deposit-amount":
      return "Select Deposit Amount";
    case "payment-method":
      return "Payment Method";
    case "card-details-menu":
      return "Deposit";
    case "select-withdraw-account":
      return "Select Account";
    case "verification-helpcenter-menu":
      return "Help Center";
    case "add-account-name":
      return "Account Name";
    case "account-rename":
      return "Account Name";
    case "verification-helpcenter-sub-menu":
      return "Help Center";
    case "account-archive-menu":
      return "Confirmation";
    case "status":
      return "Statuses";
    case "crypto-payment":
      return "Crypto Payment";
    case "crypto-payment-processing":
      return "Crypto Payment";
    case "deposit-confirm-payment":
      return "Confirm Payment";
    default:
      return "";
  }
}

export function rightSubDrawerBodyHandler(
  rightSubDrawerContent: RightSubDrawerContent,
  setIsRightDrawerOpen: Dispatch<React.SetStateAction<boolean>>,
  setIsRightSubDrawerOpen: Dispatch<React.SetStateAction<boolean>>,
  setIsRightSubDrawerContent: Dispatch<
    React.SetStateAction<RightSubDrawerContent>
  >,
  setIsRightDrawerContent: Dispatch<React.SetStateAction<RightDrawerContent>>
): JSX.Element | null {
  switch (rightSubDrawerContent) {
    case "settings":
      return (
        <SettingsMenu
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
          setIsRightDrawerOpen={setIsRightDrawerOpen}
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
        />
      );
    case "status":
      return (
        <StatusMenu setIsRightSubDrawerContent={setIsRightSubDrawerContent} />
      );
    case "twofactor":
      return <TwoFactorMenu />;
    case "verification":
      return (
        <VerificationMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "verification-helpcenter-menu":
      return (
        <VerificationHelpCenterMenu
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "verification-helpcenter-sub-menu":
      return (
        <VerificationHelpCenterSubMenu
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "account-archive-menu":
      return (
        <AccountArchiveMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "account-archive-success-menu":
      return (
        <AccountArchivedSuccessMenu
          setIsRightDrawerContent={setIsRightDrawerContent}
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
        />
      );
    case "personalSettings":
      return (
        <PersonalSettingsMenu
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "appearance":
      return <AppearanceMenu />;
    case "trading":
      return <TradingMenu />;
    case "barcode":
      return <BarcodeMenu />;
    case "user-notifications":
      return <UserNotificationsMenu />;
    case "change-password":
      return (
        <ChangePassword
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "edit-name":
      return (
        <EditName setIsRightSubDrawerContent={setIsRightSubDrawerContent} />
      );
    case "confirm-email":
      return <ConfirmMail />;
    case "confirm-phone":
      return (
        <ConfirmPhone setIsRightSubDrawerContent={setIsRightSubDrawerContent} />
      );
    case "withdraw":
      return (
        <WithdrawMenu
          isModalOpen
          setIsModalOpen={setIsRightSubDrawerOpen}
          setIsWithdrawAccountModalOpen={(open: boolean) => {
            setIsRightSubDrawerOpen(open);
            if (open) setIsRightSubDrawerContent("select-withdraw-account");
          }}
        />
      );
    case "add-account":
      return (
        <AddAccountMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "traders-way":
      return <TradersWayMenu />;
    case "verify-payment":
      return <VerifyPayment />;
    case "mega-box-rewards":
      return <MagicBoxRewards />;
    case "referral-program":
      return (
        <InviteFriends
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "card-details-menu":
      return (
        <CardDetailsMenu
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );
    case "select-withdraw-account":
      return (
        <WithdrawAccount
          isModalOpen
          setIsModalOpen={setIsRightSubDrawerOpen}
          setIsWithdrawPaymentModalOpen={(open: boolean) => {
            setIsRightSubDrawerOpen(open);
            if (open) setIsRightSubDrawerContent("withdraw-payment");
          }}
        />
      );
    case "withdraw-payment":
      return (
        <WithdrawPayment
          isModalOpen
          setIsModalOpen={setIsRightSubDrawerOpen}
          setIsWithdrawRequestModalOpen={((open: boolean) => {
            setIsRightSubDrawerOpen(open);
            if (open) setIsRightSubDrawerContent("select-withdarw-request");
          }) as Dispatch<SetStateAction<boolean>>}
        />
      );
    case "select-withdarw-request":
      return (
        <WithdrawRequest
          isModalOpen
          setIsModalOpen={setIsRightSubDrawerOpen}
        />
      );
    case "boost-cubes":
      return (
        <BoostCubes
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
          setIsRightDrawerContent={setIsRightDrawerContent}
        />
      );
    case "depoist-successful":
      return <DepositSuccessful />;
    case "add-account-name":
      return (
        <AddAccountName
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightDrawerContent={setIsRightDrawerContent}
        />
      );
    case "account-rename":
      return (
        <AccountRename
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightDrawerContent={setIsRightDrawerContent}
        />
      );
    case "password-success":
      return (
        <PasswordSuccess
          setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
          setIsRightSubDrawerContent={setIsRightSubDrawerContent}
        />
      );

    default:
      return null;
  }
}

export function rightSubDrawerExtraHandler(
  rightSubDrawerContent: RightSubDrawerContent,
  setIsRightSubDrawerOpen: Dispatch<React.SetStateAction<boolean>>,
  setIsRightSubDrawerContent: Dispatch<
    React.SetStateAction<RightSubDrawerContent>
  >
): JSX.Element | null {
  switch (rightSubDrawerContent) {
    case "account-archive-success-menu":
    case "crypto-payment-processing":
      return null;
    case "twofactor":
    case "verification":
    case "personalSettings":
    case "appearance":
    case "trading":
    case "notifications":
    case "change-password":
      return (
        <div onClick={() => setIsRightSubDrawerContent("settings")}>
          <ArrowLeftOS />
        </div>
      );
    case "password-success":
      return (
        <div onClick={() => setIsRightSubDrawerContent("change-password")}>
          <ArrowLeftOS />
        </div>
      );
    case "edit-name":
    case "confirm-email":
    case "confirm-phone":
      return (
        <div onClick={() => setIsRightSubDrawerContent("personalSettings")}>
          <ArrowLeftOS />
        </div>
      );
    case "select-account":
      return (
        <div onClick={() => setIsRightSubDrawerContent("transfer")}>
          <ArrowLeftOS />
        </div>
      );
    case "verify-payment":
    case "mega-box-rewards":
      return (
        <div onClick={() => setIsRightSubDrawerContent("referral-program")}>
          <ArrowLeftOS />
        </div>
      );
    case "select-deposit-amount":
    case "payment-method":
    case "payments-promo-code":
    case "card-details-menu":
      return (
        <div onClick={() => setIsRightSubDrawerContent("payments-deposit")}>
          <ArrowLeftOS />
        </div>
      );
    case "crypto-payment":
      return (
        <div onClick={() => setIsRightSubDrawerContent("payment-method")}>
          <ArrowLeftOS />
        </div>
      );
    case "select-withdraw-account":
      return (
        <div onClick={() => setIsRightSubDrawerContent("withdraw")}>
          <ArrowLeftOS />
        </div>
      );
    case "verification-helpcenter-menu":
      return (
        <div onClick={() => setIsRightSubDrawerContent("verification")}>
          <ArrowLeftOS />
        </div>
      );
    case "verification-helpcenter-sub-menu":
      return (
        <div
          onClick={() =>
            setIsRightSubDrawerContent("verification-helpcenter-menu")
          }
        >
          <ArrowLeftOS />
        </div>
      );
    default:
      return (
        <div onClick={() => setIsRightSubDrawerOpen(false)}>
          <ArrowLeftOS />
        </div>
      );
  }
}
