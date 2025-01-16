import { useEffect, useRef } from "react";

/**
 * custom React hook that triggers a callback function when the mouse moves after a five-minute stop
 * 
 * @param {Function} callback - The callback function to be triggered when the mouse moves after a five-minute stop.
 * @param {number} delay - The delay in milliseconds before triggering the callback function. Default is 300000 (5 minutes).
 * @returns {void}
 */

function useMouseIdle(
  callback: () => void,
  delay = 300000 /* 5 minutes in millisecons */
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleMouseMove() {
      clearTimeout(timerRef.current!);
      timerRef.current = setTimeout(() => {
        callback();
      }, delay);
    }

    function clearTimer() {
      clearTimeout(timerRef.current!);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimer();
    };
  }, [callback, delay]);
}

export default useMouseIdle;
