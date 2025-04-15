import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEnrollmentById } from "../utils/http";
import classes from "./EnrollmentsOverview.module.css";

function EnrollmentsOverview() {
  console.log("hihi");
  const { enrollmentId } = useParams();
  const navigate = useNavigate(); // For navigation

  const {
    data: enrollment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enrollment", enrollmentId],
    queryFn: () => fetchEnrollmentById(enrollmentId),
    enabled: !!enrollmentId,
  });

  if (isLoading) return <p>Loading enrollment details...</p>;
  if (error) return <p>Error loading enrollment: {error.message}</p>;

  return (
    <div className={classes.enrollmentOverview}>
      <h3 className={classes.pageTitle}>Enrollment Overview</h3>
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Who is this for?</td>
              <td>{enrollment?.clientInfo?.[0]?.relation || "N/A"}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{enrollment?.clientInfo?.[0]?.name || "N/A"}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{enrollment?.clientInfo?.[0]?.email || "N/A"}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{enrollment?.clientInfo?.[0]?.phone || "N/A"}</td>
            </tr>
            <tr>
              <td>Package</td>
              <td>{enrollment?.tier || "N/A"}</td>
            </tr>
            <tr>
              <td>Start Date</td>
              <td>{enrollment?.startDate || "N/A"}</td>
            </tr>
            <tr>
              <td>Enrollment ID</td>
              <td>{enrollment?._id || "N/A"}</td>
            </tr>
            <tr>
              <td>Sponsor</td>
              <td>{enrollment?.sponsor || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        className={classes.backButton}
        onClick={() => navigate("/enrollments")}
      >
        Back to Enrollments
      </button>
    </div>
  );
}

export default EnrollmentsOverview;
