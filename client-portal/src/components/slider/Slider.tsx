import SlickSlider from "react-slick";

// react-slick is CommonJS. Vite 8 can expose it as either the component or a
// module namespace depending on whether the file is loaded eagerly or lazily.
const Slider = (
  SlickSlider as unknown as { default?: typeof SlickSlider }
).default ?? SlickSlider;

export default Slider;
