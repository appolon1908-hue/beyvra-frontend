export function localFlagHandler(countryCode: string) {
  switch (countryCode) {
    case "en-US":
    case "en":
    case "en-UK":
      return "/menu-images/uk-flag.png";
    case "ar":
      return "/menu-images/svgs/uae.svg";
    case "fr":
      return "/menu-images/svgs/france.svg";
    case "de":
      return "/menu-images/svgs/germany.svg";
    case "ja":
      return "/menu-images/svgs/japan.svg";
    case "es":
      return "/menu-images/svgs/spain.svg";
    case "id":
      return "/menu-images/svgs/IndonesiaFlag.svg";
    case "vi":
      return "/menu-images/svgs/VietnamFlag.svg";
    case "hi":
      return "/menu-images/svgs/IndiaFlag.svg";
    case "ru":
      return "/menu-images/svgs/РусскийFlag.svg";
    case "th":
      return "/menu-images/svgs/ภาษาไทยFlag.svg";
    case "pt":
      return "/menu-images/svgs/PortuguêsFlag.svg";
    case "ms":
      return "/menu-images/svgs/BahasaMelayuFlag.svg";

    default:
      return "/menu-images/uk-flag.png";
  }
}
