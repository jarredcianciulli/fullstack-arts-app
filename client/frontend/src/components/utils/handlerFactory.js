export default function capitalizeFirstLetter(string) {
  if (!string) return string; // Handle empty string or null/undefined
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function joinWithCommas(array) {
  if (!Array.isArray(array)) {
    return ""; // Handle cases where input is not an array
  }

  // Join array elements with comma and space
  return array.join(", ");
}

export function removeSlashes(str) {
  return str.replace(/\//g, "");
}

export function formatTime(time) {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  const period = hours < 12 ? "AM" : "PM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

// utils/handlerFactory.js
export function convertMilitaryToRegular(time) {
  // Split the time into hours and minutes
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  // Determine AM/PM
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour from 24-hour to 12-hour format
  hour = hour % 12 || 12;

  // Return formatted time
  return `${hour}:${minute < 10 ? "0" : ""}${minute} ${period}`;
}

export function formatDateForInput(isoDate) {
  if (!isoDate) return ""; // Handle empty or undefined input
  return isoDate.split("T")[0]; // Extracts only the YYYY-MM-DD part
}

export function formatAndSortDays(array) {
  if (!Array.isArray(array)) {
    throw new Error("Input is not an array");
  }

  const daysMapping = {
    mon: "Mondays",
    tue: "Tuesdays",
    wed: "Wednesdays",
    thu: "Thursdays",
    fri: "Fridays",
    sat: "Saturdays",
    sun: "Sundays",
  };

  const dayOrder = {
    Mondays: 1,
    Tuesdays: 2,
    Wednesdays: 3,
    Thursdays: 4,
    Fridays: 5,
    Saturdays: 6,
    Sundays: 7,
  };

  // Function to format the days object
  const formatDayss = (daysObject) => {
    return Object.keys(daysObject)
      .filter((key) => daysObject[key])
      .map((key) => daysMapping[key.toLowerCase()])
      .join(", ");
  };

  // Function to convert time to minutes
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Sort the array based on formatted days and start time
  let sorted = array.sort((a, b) => {
    const formattedDaysA = formatDayss(a.meeting_days);
    const formattedDaysB = formatDayss(b.meeting_days);
    const firstDayA = formattedDaysA.split(", ")[0];
    const firstDayB = formattedDaysB.split(", ")[0];

    // Compare days first
    const dayComparison = dayOrder[firstDayA] - dayOrder[firstDayB];
    if (dayComparison !== 0) {
      return dayComparison;
    }

    // If days are the same, compare start times
    const timeComparison =
      timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    return timeComparison;
  });

  return sorted;
}

export function formatDays(daysObject) {
  const daysMapping = {
    mon: "Mondays",
    tue: "Tuesdays",
    wed: "Wednesdays",
    thu: "Thursdays",
    fri: "Fridays",
    sat: "Saturdays",
    sun: "Sundays",
  };

  // Filter keys with true values and map to their corresponding day names
  const formattedDays = Object.keys(daysObject)
    .filter((key) => daysObject[key])
    .map((key) => daysMapping[key.toLowerCase()])
    .join(", ");

  return formattedDays;
}

export function convertToDuration(startTime, endTime) {
  const [startHourStr, startMinuteStr] = startTime.split(":");
  const [endHourStr, endMinuteStr] = endTime.split(":");

  let startHour = parseInt(startHourStr);
  const startMinute = parseInt(startMinuteStr);
  let endHour = parseInt(endHourStr);
  const endMinute = parseInt(endMinuteStr);

  // Determine AM/PM for start time
  const startPeriod = startHour >= 12 ? "PM" : "AM";
  startHour = startHour % 12 || 12;
  const formattedStartTime = `${startHour}:${
    startMinute < 10 ? "0" : ""
  }${startMinute} ${startPeriod}`;

  // Determine AM/PM for end time
  const endPeriod = endHour >= 12 ? "PM" : "AM";
  endHour = endHour % 12 || 12;
  const formattedEndTime = `${endHour}:${
    endMinute < 10 ? "0" : ""
  }${endMinute} ${endPeriod}`;

  // Calculate the duration in minutes
  const startTotalMinutes = parseInt(startHourStr) * 60 + startMinute;
  const endTotalMinutes = parseInt(endHourStr) * 60 + endMinute;
  let durationMinutes = endTotalMinutes - startTotalMinutes;

  // Handle case where end time is past midnight
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  // Format the duration
  const durationHours = Math.floor(durationMinutes / 60);
  const durationMins = durationMinutes % 60;

  let formattedDuration = "";
  if (durationHours > 0) {
    formattedDuration += `${durationHours}hr${durationHours > 1 ? "s" : ""}`;
  }
  if (durationMins > 0) {
    if (formattedDuration) formattedDuration += " ";
    formattedDuration += `${durationMins}min${durationMins > 1 ? "s" : ""}`;
  }

  // If both hours and minutes are 0, set to 0 mins
  if (!formattedDuration) {
    formattedDuration = "0mins";
  }

  return formattedDuration;
}

export const updateAge = (array) => {
  return array.map((item) => {
    // Extract the number after 'P' in the code
    const minNumberFromCode = parseInt(item.min_age.slice(1, 3), 10);
    const maxNumberFromCode = parseInt(item.max_age.slice(1, 3), 10);

    // Return a new object with updated min_age
    return {
      ...item,
      min_age: minNumberFromCode,
      max_age: maxNumberFromCode,
    };
  });
};

export function filterAges(data, minAge, maxAge) {
  if (data) {
    const elements = data.filter((item) => {
      return item.min_age >= minAge && item.max_age <= maxAge;
    });
    return elements;
  }
}

export function filterLocation(data, loc) {
  if (data) {
    const elements = data.filter((item) => {
      return item.location_name === loc;
    });
    return elements;
  }
}

export function formatStartDate(inputDate) {
  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May.",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  // Parse the input date
  const date = new Date(inputDate);
  const currentDate = new Date();

  // Compare dates
  if (date > currentDate) {
    // Format date as 'Sept. 3rd, 2024'
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const daySuffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";

    return `${month} ${day}${daySuffix}, ${year}`;
  } else {
    return "In session";
  }
}

export function convertDateFormat(dateString) {
  // Ensure the input is a valid date string
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid date string");
  }

  // Split the date string into components
  const [year, month, day] = dateString.split("-");

  // Create the new date format
  const newDateFormat = `${parseInt(month)}/${parseInt(day)}/${year.slice(-2)}`;

  return newDateFormat;
}

export function extractIdsAndAddToObjects(objectsArray) {
  // Function to extract the 'id' parameter from a given URL
  const getIdFromUrl = (url) => {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const preLoadClassID = params.get("amp;preLoadClassID");
    return preLoadClassID;
  };

  // Iterate over the array of objects, extract 'id' from 'online_reg_link', and add it to the object
  return objectsArray.map((obj) => {
    if (obj.online_reg_link) {
      const id = getIdFromUrl(obj.online_reg_link);
      return { ...obj, id }; // Add the 'id' field to the object
    }
    return { ...obj, id: null }; // Add 'id' as null if 'online_reg_link' is not present
  });
}
