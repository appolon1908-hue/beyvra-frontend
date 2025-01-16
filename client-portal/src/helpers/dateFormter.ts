import { UTCTimestamp } from "lightweight-charts";

/**
 * Formats a given date into a string in the format "YYYY-MM-DD".
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export function dateFormter(date: Date) {
  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

/**
 * Gets the formatted date of the previous day from a given timestamp.
 *
 * @param {UTCTimestamp} timestamp - The timestamp from which to calculate the previous day.
 * @returns {string} - The formatted date string of the previous day.
 */
export const getPreviousDayFromTimestamp = (timestamp: UTCTimestamp) => {
  const previousDate = new Date((timestamp - 1209600) * 1000); // Subtract 86400 seconds (1 day) from the timestamp
  const year = previousDate.getFullYear();
  const month = String(previousDate.getMonth() + 1).padStart(2, "0");
  const day = String(previousDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Converts a Unix timestamp to a formatted date string in the format "YYYY-MM-DD".
 *
 * @param {UTCTimestamp} timestamp - The Unix timestamp to be converted.
 * @returns {string} - The formatted date string.
 */
export const convertTimestampToDateString = (timestamp: UTCTimestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
