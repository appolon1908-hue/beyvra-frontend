import { backgroundImages } from "../../../components/backgroundImageSelector/imagesData";

export const setAppearanceBackground = (id: string) => {
  const tradeGraph = document.getElementById("tradeGraph");

  if (tradeGraph) {
    tradeGraph.style.backgroundImage = `url(${
      backgroundImages.find((img) => img.id.toString() === id)?.url
    })`;
    localStorage.setItem("selectedBackgroundImage", id);
  } else {
    console.error("Element with id 'tradeGraph' not found.");
  }
};

