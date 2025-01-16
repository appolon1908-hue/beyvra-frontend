import { FC, ReactNode, createRef, useEffect, useState } from "react";
import { ArrowLeftOS, ArrowRightOS } from "../../assets/icons";

import "./ArrowsSlider.scss";
import { useAppSelector } from "@store/hooks";

interface ArrowsSliderProps {
  children: ReactNode;
  LeftArrow?: boolean;
}

const ArrowsSlider: FC<ArrowsSliderProps> = ({ children }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollbarContainerRef = createRef<HTMLDivElement>();
  const {themeSelect} = useAppSelector(state => state.themeBg)


  useEffect(() => {
    const container = scrollbarContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft + container.clientWidth < container.scrollWidth
      );
    }

    const handleScroll = () => {
      if (container) {
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft + container.clientWidth < container.scrollWidth
        );
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChevronLeftClick = () => {
    if (scrollbarContainerRef.current) {
      scrollbarContainerRef.current.scrollBy({
        left: -100, // Adjust scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  const handleChevronRightClick = () => {
    if (scrollbarContainerRef.current) {
      scrollbarContainerRef.current.scrollBy({
        left: 100, // Adjust scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`arrows-slider-container ${themeSelect}`}>
      {showLeftArrow && (
        <div
          className="arrows-slider-left-icon"
          onClick={handleChevronLeftClick}
        >
          <ArrowLeftOS />
        </div>
      )}

      <div className="arrows-slider-children" ref={scrollbarContainerRef}>
        {children}
      </div>

      {showRightArrow && (
        <div
          className="arrows-slider-right-icon"
          onClick={handleChevronRightClick}
        >
          <ArrowRightOS />
        </div>
      )}
    </div>
  );
};

export default ArrowsSlider;
