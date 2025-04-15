export function formatDate(date) {
  date = new Date(date);
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function formatTime(date) {
  date = new Date(date);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const offsetHours = Math.abs(date.getTimezoneOffset() / 60);
  const offsetSign = date.getTimezoneOffset() > 0 ? "-" : "+";
  const offsetMinutes = Math.abs(date.getTimezoneOffset() % 60);
  let timezone;

  // Determine the timezone abbreviation based on the offset
  if (offsetSign === "-" && offsetHours === 4 && offsetMinutes === 0) {
    timezone = "EST"; // Replace -04:00 with EST
  } else {
    timezone = `${offsetSign}${offsetHours
      .toString()
      .padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;
  }

  // Determine whether the time is in AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  let formattedHours;
  formattedHours = (hours % 12 || 12).toString().padStart(2, "0"); // If hours is 0, set it to 12 for 12 AM
  formattedHours = formattedHours.startsWith("0")
    ? formattedHours.slice(1)
    : formattedHours; // Remove leading 0
  return `${formattedHours}:${minutes} ${amOrPm} ${timezone}`;
}

export function formatMilitaryTime(militaryTime) {
  // Parse military time string (e.g., "14:30")
  const [hours, minutes] = militaryTime.split(":");
  const parsedTime = new Date();
  parsedTime.setHours(parseInt(hours, 10));
  parsedTime.setMinutes(parseInt(minutes, 10));

  // Format time in AM/PM format
  const formattedTime = parsedTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedTime;
}

export function formatDateForInput(date) {
  date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
