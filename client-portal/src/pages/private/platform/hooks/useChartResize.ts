import { RefObject, useEffect } from "react";
import { IChartApi } from "lightweight-charts";

export function useChartResize(containerRef: RefObject<HTMLDivElement | null>, chart: IChartApi | null) {
  useEffect(() => {
    if (!containerRef.current || !chart) return;
    const resize = (width: number, height: number) => {
      if (width > 0 && height > 0) chart.applyOptions({ width: Math.floor(width), height: Math.floor(height) });
    };
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(([entry]) => resize(entry.contentRect.width, entry.contentRect.height)) : undefined;
    observer?.observe(containerRef.current);
    const onWindowResize = () => resize(containerRef.current?.clientWidth ?? 0, containerRef.current?.clientHeight ?? 0);
    window.addEventListener("resize", onWindowResize);
    return () => { observer?.disconnect(); window.removeEventListener("resize", onWindowResize); };
  }, [containerRef, chart]);
}
