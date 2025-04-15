import {
  convertMilitaryToRegular,
  formatDays,
  convertToDuration,
  convertDateFormat,
} from "../handlerFactory";

import classes from "../../tools/JackRabbit.module.css";

export const generateDanceTableElements = (
  minAge,
  maxAge,
  updatedData,
  all
) => {
  let elements = updatedData;

  if (!all) {
    elements = updatedData.filter((item) => {
      return item.min_age >= minAge && item.max_age <= maxAge;
    });
  }
  elements = elements.map((entry, index) => (
    <tr key={index}>
      <td>
        <a href={entry.online_reg_link} target="_blank" rel="noreferrer">
          Register
        </a>
      </td>
      <td className={classes.td_location}>
        <div
          className={`${
            entry.location === "Eagleville"
              ? classes.td_location_e
              : classes.td_location_w
          } ${classes.td_location_div}`}
        >
          {entry.location}
        </div>
      </td>
      <td>{entry.name}</td>
      <td>
        {formatDays(entry.meeting_days) + ", "}
        {convertMilitaryToRegular(entry.start_time) +
          " (" +
          convertToDuration(entry.start_time, entry.end_time) +
          ")"}
      </td>

      <td>{entry.session}</td>
      <td>${entry.tuition.fee} / month</td>
    </tr>
  ));

  // setClassListings(elements);

  const tableEl = (
    <table className={`${classes.table} ${classes.container_jr}`}>
      <thead>
        <tr>
          <th></th>
          <th>Location</th>
          <th>Class</th>
          <th>Times</th>
          <th>Session</th>
          <th>Tuition</th>
        </tr>
      </thead>
      <tbody>{elements}</tbody>
    </table>
  );
  // setTableElement(tableEl);
  return elements.length > 0 ? tableEl : null;
};

export const generateDanceTableElementsSmallest = (
  minAge,
  maxAge,
  updatedData,
  all
) => {
  let elements = updatedData;

  if (!all) {
    elements = updatedData.filter((item) => {
      return item.min_age >= minAge && item.max_age <= maxAge;
    });
  }
  elements = elements.map((entry, index) => (
    <tr key={index}>
      <td className={classes.td_location}>
        <div
          className={`${
            entry.location === "Eagleville"
              ? classes.td_location_e
              : classes.td_location_w
          } ${classes.td_location_smallest} ${classes.td_location_div}`}
        >
          {entry.location}
        </div>
        <div className={classes.td_name_smallest}>{entry.name}</div>
      </td>
      <td>
        <div className={classes.td_dates_smallest}>
          {convertDateFormat(entry.start_date) + " - "}
          {convertDateFormat(entry.end_date)}
        </div>
        <div className={classes.td_times_smallest}>
          {formatDays(entry.meeting_days) + ", "}
          {convertMilitaryToRegular(entry.start_time) +
            " (" +
            convertToDuration(entry.start_time, entry.end_time) +
            ")"}
        </div>
      </td>
      <td className={classes.registerLinkContainer}>
        <div className={classes.registerLink}>${entry.tuition.fee}/month</div>
        <a
          className={classes.online_reg_link}
          href={entry.online_reg_link}
          target="_blank"
          rel="noreferrer"
        >
          Register
        </a>
      </td>
    </tr>
  ));

  // setClassListings(elements);

  const tableEl = (
    <table className={`${classes.table} ${classes.container_jr}`}>
      <thead>
        <tr>
          <th>Class</th>
          <th>Session</th>
          <th>Tuition</th>
        </tr>
      </thead>
      <tbody>{elements}</tbody>
    </table>
  );
  // setTableElement(tableEl);
  return elements.length > 0 ? tableEl : null;
};

export const generateDanceTableElementsSmall = (
  minAge,
  maxAge,
  updatedData,
  all
) => {
  let elements = updatedData;
  if (!all) {
    elements = updatedData.filter((item) => {
      return item.min_age >= minAge && item.max_age <= maxAge;
    });
  }
  elements = elements.map((entry, index) => (
    <tr key={index}>
      <td className={classes.td_location}>
        <div
          className={`${
            entry.location === "Eagleville"
              ? classes.td_location_e
              : classes.td_location_w
          } ${classes.td_location_small} ${classes.td_location_div}`}
        >
          {entry.location}
        </div>
      </td>
      <td>{entry.name}</td>
      <td>
        {formatDays(entry.meeting_days) + ", "}
        {convertMilitaryToRegular(entry.start_time) +
          " (" +
          convertToDuration(entry.start_time, entry.end_time) +
          ")"}
      </td>

      {/* <td>{entry.session}</td> */}
      <td>
        {convertDateFormat(entry.start_date) + " - "}
        {convertDateFormat(entry.end_date)}
      </td>
      <td>
        <div className={classes.registerLink}>${entry.tuition.fee} / month</div>
        <a
          className={classes.online_reg_link}
          href={entry.online_reg_link}
          target="_blank"
          rel="noreferrer"
        >
          Register
        </a>
      </td>
    </tr>
  ));

  // setClassListings(elements);

  const tableEl = (
    <table className={`${classes.table} ${classes.container_jr}`}>
      <thead>
        <tr>
          <th>Location</th>
          <th>Class</th>
          <th>Times</th>
          <th>Session</th>
          <th>Tuition</th>
        </tr>
      </thead>
      <tbody>{elements}</tbody>
    </table>
  );
  // setTableElement(tableEl);
  return elements.length > 0 ? tableEl : null;
};
