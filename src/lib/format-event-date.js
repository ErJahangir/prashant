/**
 * Formats a date string in English (e.g. "Thursday, 19 June 2025").
 * @param {string} isoString - The ISO date string (e.g. YYYY-MM-DD or full ISO)
 * @param {('full'|'short'|'time')} [format='full'] - The format type to use
 * @param {boolean} [isJakartaTime=false] - Whether the input is already in Jakarta time
 * @returns {string} The formatted date string in English
 *
 * @example
 * // returns "Thursday, 19 June 2025"
 * formatEventDate("2025-06-19", "full")
 *
 * // returns "19 June 2025"
 * formatEventDate("2025-06-19", "short")
 */
export const formatEventDate = (
  input,
  format = "full",
  isJakartaTime = false,
) => {
  let date;

  // ✅ If Firestore timestamp object
  if (input?.seconds) {
    date = new Date(input.seconds * 1000);
  }
  // ✅ If Date object
  else if (input instanceof Date) {
    date = input;
  }
  // ✅ If ISO string
  else if (typeof input === "string") {
    if (isJakartaTime && input && !input.endsWith("Z")) {
      date = new Date(input + "Z");
    } else {
      date = new Date(input);
    }
  }
  // ❌ Invalid input fallback
  else {
    return "";
  }

  const locale = "en-GB";

  const options = {
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    },
    short: {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    },
  };

  if (format === "time") {
    return date.toLocaleTimeString(locale, options.time);
  }

  return date.toLocaleDateString(locale, options[format]);
};
