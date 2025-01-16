import { Carousel, CarouselProps } from "antd";
import "./carouselSlider.scss";

interface CarouselSliderProps extends CarouselProps {
  children?: React.ReactNode;
}

const CarouselSlider: React.FC<CarouselSliderProps> = ({
  children,
  ...props
}) => {
  return (
    <div className="carouselSlider">
      <Carousel {...props}>{children}</Carousel>
    </div>
  );
};

export default CarouselSlider;
