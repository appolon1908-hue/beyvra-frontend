import { Story } from "react-insta-stories/dist/interfaces";

export interface StorieList {
  title: string;
  p1: string;
  p2?: string;
  image: string;
  background: string;
  storiesData: Story[];
}

export const storiesList: StorieList[] = [
  {
    title: "Еconomic",
    p1: "12/02-16/02",
    p2: "calendar:",
    image: "/menu-images/svgs/calender.svg",
    background: "backgroundPurple",
    storiesData: [
      {
        url: "/menu-images/stories/economins-1.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/economins-2.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/economins-3.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/economins-4.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/economins-5.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/economins-6.png",
        duration: 5000,
      },
    ],
  },
  {
    title: "Discover",
    p1: "Forex Mode",
    image: "/menu-images/svgs/forex-mode.svg",
    background: "backgroundGreen",
    storiesData: [
      {
        url: "/menu-images/stories/foremode-1.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/foremode-2.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/foremode-3.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/foremode-4.png",
        duration: 5000,
      },
    ],
  },
  {
    title: "Asset for Fast",
    p1: "Trading 24/7",
    image: "/menu-images/svgs/fast-trade.svg",
    background: "backgroundBlack",
    storiesData: [
      {
        url: "/menu-images/stories/trading-1.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/trading-2.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/trading-3.png",
        duration: 5000,
      },
    ],
  },
  {
    title: "Join Our",
    p1: "Community",
    image: "/menu-images/svgs/twitter.svg",
    background: "backgroundSky",
    storiesData: [
      {
        url: "/menu-images/stories/community-1.png",
        duration: 5000,
      },
      {
        url: "/menu-images/stories/community-2.png",
        duration: 5000,
      },
    ],
  },
];
