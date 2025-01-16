import React, { useState, WheelEvent } from 'react';
import './ScrollList.scss';

// Define the type for items in the list
interface Item {
  value: string;
}

// Define the props type for the ScrollList component
interface ScrollListProps {
  items: Item[];
}

const ScrollList: React.FC<ScrollListProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Type the event parameter as WheelEvent
  const handleScroll = (event: WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1));
    } else {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  return (
    <div className="scroll-container" onWheel={handleScroll}>
      {items.map((item, index) => (
        <div
          key={index}
          className="item"
          style={{
            transform: `translateY(-${currentIndex * 30}px)`,
          }}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default ScrollList;
