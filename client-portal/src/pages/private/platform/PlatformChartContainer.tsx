import { useEffect, useRef, useState, useMemo } from "react";
import TradeForm from "../../../components/tradeForm/TradeForm";
import "./platform.scss";
import { AreaChartIcon, BarChartIcon, CandleStickIcon, MainChartAnalysisIcon, MainChartChangeIcon, MainChartSignalsIcon, ZoomInChartIcon, ZoomOutChartIcon } from "../../../assets/icons";

import MainChart from "./MainChart";
import { useAppSelector } from "@store/hooks";
import { isObjectEmpty, timeScaleMenu } from "utils/utils";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { CandlestickData, ColorType, createChart, CrosshairMode, IChartApi, ISeriesApi, LineStyle, Time, WhitespaceData } from "lightweight-charts";
import useSocketConnect, { ChartDataType } from "hooks/useSocketConnect";
import Loading from "components/loading";
import useCryptoSocketConnect from "hooks/useCryptoSocketConnect";
import { createCustomMarker1 } from "./MainChart/Markers";



////////////////// MY DECLARATIONS ////////////////////
interface MainChartNProps {
  symbol: string;
}

interface StockData {
  // Adjust these properties based on the actual structure of your stock data
  [key: string]: any; // Allow for dynamic keys or define specific properties
}


//////////////////////////////////////////////////////

interface PlatformProps {
  themeSelect: any;
  topbarHeight: number;
  tradeFormHeight: number;
  bottomSidebarHeight: number;
}
const removeDuplicates = (data: ChartDataType[]): (CandlestickData<Time> | WhitespaceData<Time>)[] => {
  const seen = new Set<number>();
  return data.filter(item => {
    if (!seen.has(Number(item.time))) {
      seen.add(Number(item.time));
      return true;
    }
    return false;
  }) as any;
};

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({
  themeSelect,
  topbarHeight,
  tradeFormHeight,
  bottomSidebarHeight,
}) => {
  const colors = {
    backgroundColor: "transparent",
    lineColor: "#0094FF",
    textColor: "#70808C",
    areaTopColor: "rgba(11, 166, 238, 0.2)",
    areaBottomColor: "rgba(11, 166, 238, 0)",
    gridLines: "#ffccff"
  };

  // Chart refs and constants
  let chartDataRef = useRef<ChartDataType[]>([]);
  let chartContainerRef = useRef<HTMLDivElement>(null);
  let chartRef = useRef<IChartApi>();
  let seriesRef = useRef<ISeriesApi<"Candlestick" | "Area" | "Bar", Time>>();
  let chart: IChartApi;
  let chartContainer = null;

  const [chartScale, setChartScale] = useState(6);
  const [selectedChart, setSelectedChart] = useState('area');
  const [selectedTimeScale, setSelectedTimeScale] = useState<any>(timeScaleMenu[0]);
  const { wsTicket, user } = useAppSelector((state) => state.user);

  const { data: socketData, oldData } = useSocketConnect(wsTicket as string);

  useCryptoSocketConnect(wsTicket as string, user?.id as string);
  // Chart logic
  useEffect(() => {
    if (!chartContainerRef.current) return;
    chartContainer = chartContainerRef.current!;
    chart = createChart(chartContainer, {
      layout: {
        background: { type: ColorType.Solid, color: colors?.backgroundColor },
        // 'white',
      },
      grid: {
        vertLines: {
          color: themeSelect == "night" ? "#16171a" : "#b9b9b9",
          visible: true,
        },
        horzLines: {
          color: themeSelect == "night" ? "#16171a" : "#b9b9b9",
          visible: true,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: "#868788",
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 70,
        allowShiftVisibleRangeOnWhitespaceReplacement: true,
      },
      width: chartContainer?.clientWidth,
      height: 300,
    });

    // Set custom price formatter for the right price scale
    chart.priceScale('right').applyOptions({ mode: 1 });

    //  candle series 
    const series = selectedChart === 'candlesticks'
      ? chart.addCandlestickSeries({
        upColor: 'green',
        downColor: 'red',
        borderDownColor: 'red',
        borderUpColor: 'green',
        wickDownColor: 'red',
        wickUpColor: 'green',
        priceFormat: {
          type: 'price', precision: 8, minMove: 0.000000001
        },
      })
      : selectedChart === 'area' ? chart.addAreaSeries({
        topColor: "#0c2c3b",
        bottomColor: 'transparent',
        lineColor: "#1973FA",
        lineWidth: 2
      }) : chart.addBarSeries({
        upColor: 'green',
        downColor: 'red'
      })
    chartRef.current = chart;
    seriesRef.current = series;

    // @ts-ignore
    if (chartDataRef.current.length > 0) {
      const sortedAndUniqueData = removeDuplicates(chartDataRef.current.sort((a, b) => Number(a.time) - Number(b.time)));
      if (selectedChart === 'area') {
        const reformattedData = sortedAndUniqueData.map(item => ({
          time: item.time,
          value: item.customValues,
        }));
        series.setData(reformattedData);
      } else {
        series.setData(sortedAndUniqueData);
      }
    }
    else if (oldData.length > 0) {
      const sortedAndUniqueData = removeDuplicates(oldData.sort((a, b) => Number(a.time) - Number(b.time)));
      if (selectedChart === 'area') {
        const reformattedData = sortedAndUniqueData.map(item => ({
          time: item.time,
          value: item.customValues,
        }));
        series.setData(reformattedData);
      } else {
        series.setData(sortedAndUniqueData);
      }
      chartDataRef.current = oldData;
    }

    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: "#48494b",
          style: LineStyle.Dashed,
          labelBackgroundColor: "#48494b",
        },
        horzLine: {
          width: 1,
          color: "#48494b",
          style: LineStyle.Dashed,
          labelBackgroundColor: "#48494b",
        },

      },
    });

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainer);


    return () => {
      window.removeEventListener(
        "resize",
        handleResize as unknown as EventListener
      );
      resizeObserver.disconnect();
      chartRef.current?.remove();
    };

  }, [selectedChart, oldData]);

  useEffect(() => {
    // @ts-ignore
    if (!isObjectEmpty(socketData)) {
      chartDataRef.current = [...chartDataRef.current, socketData];
      // @ts-ignore
      if (selectedChart === 'area') {
        seriesRef.current?.update({
          value: socketData?.close,
          time: socketData?.time as any
        });
      } else {
        seriesRef.current?.update(socketData as any);
      }
    };
  }, [socketData, selectedChart]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || !socketData) return;
    const chart = chartRef.current;
    const series = seriesRef.current;
    const createOrUpdateMarker = () => {
      let marker = document.getElementById('textElement1');
      if (!marker) {
        marker = createCustomMarker1(socketData?.open);
        marker.id = 'textElement1';
        chartContainerRef.current?.appendChild(marker);
      }
      const updateMarkerPosition = () => {
        if (!marker) return;
        // Update the marker content with the latest value
        const newValue = socketData?.value;
        const priceTextElement = marker.querySelector('#price-text'); // Select the nested span
        if (priceTextElement && newValue !== undefined) {
          priceTextElement.textContent = newValue.toString(); // Update the nested span's text content
        }
        const priceCoordinate = series.priceToCoordinate(newValue);
        let timeCoordinate = chart.timeScale().timeToCoordinate(socketData?.timestamp);
        if (priceCoordinate && timeCoordinate) {
          marker.style.top = `${(priceCoordinate - marker.offsetHeight / 2) + 0}px`;
          marker.style.left = `${timeCoordinate + 0}px`;
        }
      }
      requestAnimationFrame(updateMarkerPosition);
      chart.subscribeCrosshairMove(updateMarkerPosition);
    };
    createOrUpdateMarker();
    return () => {
      chart.unsubscribeCrosshairMove(createOrUpdateMarker);
    };
  }, [socketData]);

  const calculateTradeContentHeight = () => {
    const totalHeight =
      topbarHeight +
      (window.innerWidth <= 767 ? tradeFormHeight : 0) +
      (window.innerWidth <= 767 ? bottomSidebarHeight : 0);
    return `calc(100% - ${totalHeight}px)`;
  };

  const handleZoomChartScale = (increase = true) => {
    if (increase) {
      setChartScale(chartScale + 1);
    } else {
      setChartScale(chartScale > 1 ? chartScale - 1 : chartScale);
    }
  };

  const removeAllIndicators = () => {
    const marker1 = document.getElementById('textElement2');
    const marker2 = document.getElementById('textElement4');

    marker1?.remove()
    marker2?.remove()

  };

  const handleChartSelectionClick = (type = "candlesticks") => {
    setSelectedChart(type);
    removeAllIndicators()
  };

  const renderSelectedChartType = () => {
    if (oldData.length === 0) {
      return (
        <Loading />
      );
    }

    switch (selectedChart) {
      // Case for other charts can go here if needed

      default:
        return (
          <>
            <MainChart
              data={socketData}
              selectedTimeScale={selectedTimeScale}
              refs={{ chartContainerRef, chartRef, seriesRef }}
              chartScale={chartScale}
            />

            
            
          </>
        );
    }
  };

  const selectTimeScale = (timeScaleSelection = timeScaleMenu[0]) => {
    setSelectedTimeScale(timeScaleSelection);
  };

  const renderTimeScaleOptions = () => (
    <div className="grid-container">
      {timeScaleMenu.map((datum: any, _i: number) => (
        <button className="selected" onClick={() => selectTimeScale(datum)}>{datum?.text}</button>
      ))}
    </div>
  );

  const chartOptionMenus = [
    {
      onClick: undefined,
      icon: <MainChartChangeIcon />,
      tooltipText: 'Chart types',
      type: 'drop-down',
      position: 'right',
      menus: [
        {
          text: 'Area Chart',
          onclick: () => handleChartSelectionClick('area'),
          icon: <AreaChartIcon />
        },
        {
          text: 'Candlesticks',
          onclick: () => handleChartSelectionClick('candlesticks'),
          icon: <CandleStickIcon />
        },
        {
          text: 'Bars',
          onclick: () => handleChartSelectionClick('bar'),
          icon: <BarChartIcon />
        }

      ]
    },
    {
      onClick: undefined,
      icon: <MainChartAnalysisIcon />,
      tooltipText: 'Technical Analysis'
    },
    {
      onClick: undefined,
      icon: <MainChartSignalsIcon />,
      tooltipText: 'Signals'
    },
  ];

  return (
    <div
      className="trade-content"
      id="tradeContent"
      style={{ height: calculateTradeContentHeight() }}
    >
      <div className="trade-graph" id="tradeGraph">
        <div className="chart-container" style={{ height: "100%", color: "white", position: 'relative' }}>
          {renderSelectedChartType()}
          <div className="chart-options">
            {chartOptionMenus.map((data, _i) => (
              <DropdownMenu key={_i} position={data.position} type={data?.type} menuItems={data.menus}>
                <div className="chart-option" onClick={data.onClick}>
                  {data.icon}
                </div>
              </DropdownMenu>
            ))}
          </div>
          <div className="chart-zoom-controls">
            <div className="chart-control left-control" onClick={() => handleZoomChartScale(false)}>
              <ZoomOutChartIcon />
            </div>
            <DropdownMenu position="top" type="drop-down" menuItems={<>{renderTimeScaleOptions()}</>} customMenuItem>
              <div className="chart-control center">
                <span>{selectedTimeScale?.text.toUpperCase()}</span>
              </div>
            </DropdownMenu>
            <div className="chart-control right-control" onClick={() => handleZoomChartScale()}>
              <ZoomInChartIcon />
            </div>
          </div>

        </div>
      </div>
      <TradeForm bottomSidebarHeight={bottomSidebarHeight} socketData={socketData} />
    </div>
  );
};

export default PlatformChartContainer;