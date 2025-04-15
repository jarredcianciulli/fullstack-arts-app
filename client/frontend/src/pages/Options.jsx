import PageContent from "../components/PageContent";
import classes from "./Options.module.css";
import { useUser } from "../contexts/UserContext";
import ProfilePhoto from "../components/profile/photo/ProfilePhoto";

function OptionsPage() {
  const { user } = useUser();
  console.log(user.data.data.photo);
  return (
    <>
      <ProfilePhoto
        initialPhoto={user?.data?.data?.photo}
        user={user?.data?.data}
      />
      <div className={classes.headerBody}>
        <div className={classes.headerContainer}>
          <h1>Settings</h1>
          <div className={classes.tableContainer}>
            <table id="Personal information" className={classes.table}>
              <tr className={classes.tableHeader}>
                <th>Personal information</th>
              </tr>
              <tr className={classes.tableRow}>
                <td>First name:</td>
                <td>{user.data.data?.first_name}</td>
              </tr>
              <tr className={classes.tableRow}>
                <td>Last name:</td>
                <td>{user.data.data?.last_name}</td>
              </tr>
              <tr className={classes.tableRow}>
                <td>Birthdate:</td>
                <td>{user.data.data?.birth_date}</td>
              </tr>
              <tr className={classes.tableRow}>
                <td>Email:</td>
                <td>{user.data.data?.email}</td>
              </tr>
              <tr className={classes.tableRow}>
                <td>Phone number:</td>
                <td>{user.data.data?.phone}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OptionsPage;
