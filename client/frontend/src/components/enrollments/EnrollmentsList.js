import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { fetchEnrollments } from "../utils/http";
import classes from "./EnrollmentsList.module.css";

const EnrollmentsList = () => {
  const { user } = useUser();
  const userId = user?.data?.data?._id;

  const [isSuccessVisible, setIsSuccessVisible] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setIsSuccessVisible(
        <SuccessBlock
          title={location.state.title}
          message={location.state.message}
        />
      );

      const timer = setTimeout(() => {
        setIsSuccessVisible(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.history.replaceState({}, "");
      };
    }
  }, [location]);

  // Fetch enrollments with userId
  const { data } = useQuery({
    queryKey: ["enrollmentList", userId],
    queryFn: () => fetchEnrollments({ id: userId }),
    enabled: !!userId, // Ensures query runs only when userId is available
  });

  let content;
  console.log("Data:", data); // Check the entire data object

  if (data?.length > 0) {
    content = data.map((e) => (
      <tr key={e.id} className={classes.musicTableBodyContainer}>
        <td className={classes.courseNameValueContainer}>
          {/* Ensure e.clientInfo[0].name is valid */}
          <NavLink
            to={`${e._id}`}
            className={`${classes.courseNameValue} ${classes.actionLink}`}
          >
            {e.clientInfo?.[0]?.name || "Unknown Name"}
          </NavLink>
        </td>
        <td
          className={`${classes.courseNameValueContainer}  ${classes.hideOnSmallScreen}`}
        >
          <span className={`${classes.courseNameValue}`}>
            {e.clientInfo?.[0]?.email || "Unknown Email"}
          </span>
        </td>
        <td
          className={`${classes.courseNameValueContainer}  ${classes.hideOnSmallScreen}`}
        >
          <span className={classes.courseNameValue}>{e?.tier || "N/A"}</span>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span className={classes.courseNameValue}>
            {e.startDate || "N/A"}
          </span>
        </td>
        <td className={classes.courseNameValueContainer}>{e.status}</td>
      </tr>
    ));
  } else {
    content = (
      <tr>
        <td colSpan="7" className={classes.noEnrollmentsMessage}>
          <p>No enrollments to display!</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {isSuccessVisible}
      {data?.length > 0 ? (
        <table className={classes.musicTable}>
          <thead className={classes.musicTableHeader}>
            <tr className={classes.musicTableHeaderContainer}>
              <th>Name</th>
              <th className={classes.hideOnSmallScreen}>Email</th>
              <th className={classes.hideOnSmallScreen}>Package</th>
              <th>Start date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      ) : (
        <p className={classes.noEnrollmentsMessage}>
          No enrollments to display!
        </p>
      )}
    </>
  );
};

export default EnrollmentsList;
