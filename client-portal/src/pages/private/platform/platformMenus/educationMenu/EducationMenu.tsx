import SearchBar from "../../../../../components/searchBar/SearchBar";
import {
  AnalysisIcon,
  CandlesIcon,
  ChartIcon2,
  CustomStrategiesIcon,
  FXIcon,
  FixedTimeIcon,
  ForexIcon,
  IndicatorIcon3,
  OscillatorIcon,
  PIcon,
  RiskIcon,
  SearchIcon3,
  StocksIcon,
  TimerIcon3,
  TradingAdviceIcon,
} from "../../../../../assets/icons";
import "./educationMenu.scss";
import { useAppSelector } from "@store/hooks";

const EducationMenuList = [
  {
    title: "How to start trading",
    icon: <PIcon />,
  },
  {
    title: "Fixed Time guide",
    icon: <TimerIcon3 />,
  },
  {
    title: "Fixed Time strategies",
    icon: <FixedTimeIcon />,
  },
  {
    title: "Forex guide",
    icon: <FXIcon />,
  },
  {
    title: "Forex strategies",
    icon: <ForexIcon />,
  },
  {
    title: "Stocks guide",
    icon: <StocksIcon />,
  },
  {
    title: "Risk & money management",
    icon: <RiskIcon />,
  },
  {
    title: "Fundamental analysis",
    icon: <SearchIcon3 />,
  },
  {
    title: "Technical analysis",
    icon: <AnalysisIcon />,
  },
  {
    title: "Сhart",
    icon: <ChartIcon2 />,
  },
  {
    title: "Japanese candlesticks",
    icon: <CandlesIcon />,
  },
  {
    title: "Drawing tools",
    icon: <CustomStrategiesIcon />,
  },
  {
    title: "Indicators",
    icon: <IndicatorIcon3 />,
  },
  {
    title: "Oscillators",
    icon: <OscillatorIcon />,
  },
  {
    title: "Trading advice",
    icon: <TradingAdviceIcon />,
  },
];

const EducationMenu = () => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} educationMenu`}>
      <SearchBar
        className="educationSearch"
        placeholder="Find the help you need"
      />
      <p className="educationSectionTitle">User Guide</p>
      <div className="educationItems">
        {EducationMenuList.map((item, index) => (
          <div key={index} className="educationItem">
            {item.icon}
            <h2>{item.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationMenu;
