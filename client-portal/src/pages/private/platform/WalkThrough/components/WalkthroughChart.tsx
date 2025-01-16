import {
  createChart,
  ColorType,
  IChartApi,
  Time,
  LineStyle,
} from "lightweight-charts";
import React, { RefObject, useEffect, useRef } from "react";
// import { expiringPriceAlerts } from "../../../../lib/lightweight-charts/plugins/expiring-price-alerts";

export interface DataPoint {
  time: string;
  value: number;
}

interface ChartComponentProps {
  data: DataPoint[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    gridLines?: string;
  };
  direction?: "up" | "down" | null;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  colors,
  direction,
}) => {
  const {
    backgroundColor = "transparent",
    lineColor = "#0094FF",
    textColor = "#70808C",
    areaTopColor = "rgba(11, 166, 238, 0.2)",
    areaBottomColor = "rgba(11, 166, 238, 0)",
    gridLines = "#ffccff",
  } = colors || {};

  const chartContainerRef: RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();

  useEffect(() => {
    const chartContainer = chartContainerRef.current!;
    const chart = createChart(chartContainer, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: {
          color: "#16171a",
          visible: true,
        },
        horzLines: {
          color: "#16171a",
          visible: true,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: "#70808C",
      },
      timeScale: {
        secondsVisible: true,
        timeVisible: true,
        rightOffset: 20,
        allowShiftVisibleRangeOnWhitespaceReplacement: true,
        borderVisible: false,
      },
      width: chartContainer.clientWidth,
      height: 300,
    });

    const timeRangeInSeconds = 180; // 3 minutes
    const endTime = data[data.length - 1].time;
    const startTime = new Date(
      new Date(endTime).getTime() - timeRangeInSeconds * 1000
    );

    const newSeries = chart.addAreaSeries({
      lineColor,
      lineWidth: 1,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
      priceLineColor: "#868788",
      priceLineStyle: LineStyle.Solid,
      priceLineWidth: 1,
    });
    newSeries.setData(data);
    const lineSeries = chart.addLineSeries();

    chartRef.current = chart;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainer);

    const waitForChartInitialization = setTimeout(() => {
      chart.timeScale().setVisibleRange({
        from: startTime as unknown as Time,
        to: endTime as Time,
      });
      chart.timeScale().fitContent();

      clearTimeout(waitForChartInitialization);
    }, 100);

    const numberOfUpdates = 30;
    const updateChart = () => {
      const lastDataPoint = data[data.length - 1];
      const timeInterval = 500; // 0.5 seconds
      const startValue = lastDataPoint.value;
      const updateDirection =
        direction === "up" ? 1 : direction === "down" ? -1 : 0;

      const startTime = lastDataPoint.time + timeInterval; // Start from the next time point

      let updateCount = 0; // Keep track of the number of updates

      const updateIntervalId = setInterval(() => {
        const newObject: DataPoint = {
          time: startTime + updateCount * timeInterval,
          value: startValue + updateDirection * Math.random() * 10,
        };
        newSeries.update(newObject);

        const testObject: DataPoint = {
          time: startTime + updateCount * timeInterval,
          value: lastDataPoint.value,
        };
        lineSeries.update(testObject);

        updateCount++;

        if (updateCount >= numberOfUpdates) {
          clearInterval(updateIntervalId);
        }
      }, timeInterval);
    };

    const startUpdating = () => {
      const updateDuration = 15000; // 15 seconds
      const updateTimeout = setTimeout(() => {
        clearInterval(updateIntervalId);
      }, updateDuration);

      updateChart(); // Update immediately

      // if (chartContainerRef.current) {
      //   expiringPriceAlerts(chart);
      // }

      const updateIntervalId = setInterval(() => {
        updateChart();
      }, updateDuration / numberOfUpdates);

      return () => {
        clearTimeout(updateTimeout);
        clearInterval(updateIntervalId);
      };
    };

    if (direction === "up" || direction === "down") {
      return startUpdating();
    }

    return () => {
      window.removeEventListener(
        "resize",
        handleResize as unknown as EventListener
      );
      resizeObserver.disconnect();
      chartRef.current?.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    gridLines,
    direction,
  ]);

  return <div ref={chartContainerRef} style={{ height: "100%" }} />;
};

export default ChartComponent;
