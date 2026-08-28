/**
 * Checks if an array is empty
 * @param {Array} arr Array to be tested
 * @returns {Boolean} Boolean value
 */
export const isArrayEmpty = (arr: any) =>
  Array.isArray(arr) && arr.length === 0;

export const changeNumberToArrayList = (number: any) =>
  Array.from(Array(number).keys());

// /**
//  * Delete an array of keys from a given object
//  * @param {Object} targetObj Object to remove propeties from
//  * @param {Array} props Array of object properties to be deleted
//  * @returns {Object} A copy of the orginal object excluding the specified properties
//  */
export const omit = (targetObj: any, props: any): any => {
  // Clone the targetObj to avoid mutating the original data
  // eslint-disable-next-line prefer-object-spread
  const obj: any = Object.assign({}, targetObj);
  if (!Array.isArray(props)) {
    return;
  }

  props.forEach((prop) => {
    // eslint-disable-next-line no-prototype-builtins
    obj.hasOwnProperty(prop) && delete obj[prop];
  });

  // eslint-disable-next-line consistent-return
  return obj;
};

export const getUrlParams = (url = window.location.href) => {
  const params = {};
  // @ts-ignore
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    // @ts-ignore
    params[key] = value;
  });
  return params;
};

/**
 * Checks if an object has no set properties
 * @param {*} obj The object to test
 * @returns {*} boolean
 */
export const isObjectEmpty = (obj = {}) =>
  !obj || Object.keys(obj).length === 0;

// /**
//  * Ensure that a given string matches the character count and ellipsized at that point
//  * @param {String} text Target text
//  * @param {Number} numChars Number of characters needed
//  * @returns {String} Truncated text
//  */
export const truncateMultilineText = (text: string, numChars: number) => {
  if (!text) return "";

  // Because '...' will be appended to long strings,
  // this ensures that the entire character count is as specified
  const maxStringLength = numChars - 3;

  return maxStringLength > text.length
    ? text
    : `${text.trim().substring(0, maxStringLength)}...`;
};

/**
 * Function that does nothing:
 * Useful as a default value for an optional Component prop
 * that's of type - function
 * Or for stubbing function calls in Tests and Storybook Docs
 * @returns {*} undefined
 */
export const noOp = () => {};

export const parseJwt = (token: string): any => {
  if (!token) {
    return null;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
};

// /**
//  * Method to Extract initials from Full name
//  * @param {string} name name
//  * @returns {string} initials
//  */
export const getInitials = (name: string) => {
  const fullName = name.split(" ");
  const initials = fullName[0].substring(0, 1).toUpperCase();

  if (fullName.length > 1) {
    initials.concat(
      fullName[fullName.length - 1].substring(0, 1).toUpperCase()
    );
  }

  return initials;
};

export const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const scrollDown = () => {
  window.scrollTo({
    // bottom:0,
    behavior: "smooth",
  });
};

export const formatDate = (date: Date) => {
  if (!date) return "";
  const d = new Date(date);

  const newDate =
    d.getFullYear() +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + d.getDate()).slice(-2);
  return newDate;
};

export const capitalizeFirstLetter = (string = "") =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const extractFirstLetter = (string = "") => {
  if (string) {
    return string.charAt(0).toUpperCase();
  }

  return string;
};

export const replaceSpace = (str = "") =>
  // Empty
  str.split(" ").join("");

export const clearNumber = (value: any) => value.replace(/\D+/g, "");

export const clearPhoneNumber = (value: any) =>
  value.replace(/([^\w]+|\s+)/g, "");

export const formatCVC = (value: any, allValues = {}) => {
  const clearValue = clearNumber(value);
  let maxLength = 4;
  // @ts-ignore
  if (allValues.number) {
    // @ts-ignore
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
};

export const formatCreditCardExpirationDate = (value: any) => {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
};

export const formatCreditCardNumber = (value: string) => {
  const v = value
    .replace(/\s+/g, "")
    .replace(/[^0-9]/gi, "")
    .substr(0, 16);
  const parts = [];

  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }

  return parts.length > 1 ? parts.join(" ") : value;
};

export const creditCardType = (cc: string) => {
  if (cc) {
    cc = replaceSpace(cc);
  }
  const amex = new RegExp("^3[47][0-9]{13}$");
  const visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
  const cup1 = new RegExp("^62[0-9]{14}[0-9]*$");
  const cup2 = new RegExp("^81[0-9]{14}[0-9]*$");

  const mastercard = new RegExp("^5[1-5][0-9]{14}$");
  const mastercard2 = new RegExp("^2[2-7][0-9]{14}$");

  const disco1 = new RegExp("^6011[0-9]{12}[0-9]*$");
  const disco2 = new RegExp("^62[24568][0-9]{13}[0-9]*$");
  const disco3 = new RegExp("^6[45][0-9]{14}[0-9]*$");

  const diners = new RegExp("^3[0689][0-9]{12}[0-9]*$");
  const jcb = new RegExp("^35[0-9]{14}[0-9]*$");

  if (visa.test(cc)) {
    return "VISA";
  }
  if (amex.test(cc)) {
    return "AMEX";
  }
  if (mastercard.test(cc) || mastercard2.test(cc)) {
    return "MASTERCARD";
  }
  if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
    return "DISCOVER";
  }
  if (diners.test(cc)) {
    return "DINERS";
  }
  if (jcb.test(cc)) {
    return "JCB";
  }
  if (cup1.test(cc) || cup2.test(cc)) {
    return "CHINA_UNION_PAY";
  }
  return undefined;
};

export const validateImage = (file: any): boolean => {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/x-icon",
  ];
  if (validTypes.indexOf(file.type) === -1) {
    return false;
  }

  return true;
};

export const replaceUnderScore = (str = "") =>
  // Empty
  str.split("_").join(" ");

export const replaceSpaceWithUnderScore = (str = "") =>
  // Empty
  str.split(" ").join("_");

/**
 * Format a given number to a currency format
 * NOTE: If we ever need to format for different currencies, this is be a good place to do that :)
 * @param {Number} price The given price
 * @returns {String} Formatted price
 */
export const formatMoney = (price: number, showCents = true) => {
  if ((!price && price !== 0) || isNaN(price)) {
    return "";
  }

  return showCents
    ? Number(price)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    : price.toLocaleString();
};

export const notEmptyString = (string: string): boolean => {
  if (string !== undefined && string !== null) {
    return true;
  }
  return false;
};

export const bufferToSrcImage = (buffer: string): string => {
  const _buffer = `data:image/png;base64,${Buffer.from(buffer).toString(
    "base64"
  )}`;
  return buffer ? _buffer : "";
};

export const checkIfDataIsEmpty = (isLoading = false, data = []) => {
  if (isArrayEmpty(data) && !isLoading) return false;
  if (isLoading) return false;
  return true;
};

export const isValidURL = (string: string) => {
  const res = string.match(
    /(https:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  );
  return res !== null;
};

export const creditCardExpiresFormat = (string: string) => {
  return string
    .replace(/[^0-9]/g, "")
    .replace(/^([2-9])$/g, "0$1")
    .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
    .replace(/^0{1,}/g, "0")
    .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2");
};

export const validateDate = (date: any) => {
  // @ts-expect-error
  return date instanceof Date && !isNaN(date);
};

export const splitDateToDayMothYear = (string: string) => {
  const date = new Date(string);
  if (validateDate(date)) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return { day, month, year };
  }
  return null;
};

export const timeScaleMenu = [
  {
    text: "5s",
    id: 5,
    type: "seconds",
    number: 5,
  },
  {
    text: "10s",
    type: "seconds",
    number: 10,
    id: 10,
  },
  {
    text: "15s",
    type: "seconds",
    number: 15,
    id: 15,
  },
  {
    text: "20s",
    type: "seconds",
    number: 20,
    id: 20,
  },
  {
    text: "30s",
    type: "seconds",
    number: 30,
    id: 30,
  },
  {
    text: "1m",
    type: "minutes",
    number: 60,
    id: 60,
  },
  {
    text: "2m",
    type: "minutes",
    number: 120,
    id: 120,
  },
  {
    text: "5m",
    type: "minutes",
    number: 300,
    id: 300,
  },
  {
    text: "10m",
    type: "minutes",
    number: 600,
    id: 600,
  },
  {
    text: "15m",
    type: "minutes",
    number: 900,
    id: 900,
  },
  {
    text: "30m",
    type: "minutes",
    number: 1800,
    id: 1800,
  },
  {
    text: "1h",
    type: "hours",
    number: 3600,
    id: 3600,
  },
  {
    text: "4h",
    type: "hours",
    number: 14400,
    id: 14400,
  },
  {
    text: "1d",
    type: "days",
    number: 86400,
    id: 86400,
  },
  {
    text: "7d",
    type: "days",
    number: 604800,
    id: 604800,
  },
];

export const getDate = (isAmericanFormat = false) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();

  return isAmericanFormat
    ? `${month}.${date}.${year} ${hours}:${minutes}:${seconds}`
    : `${date}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
