import PageContent from "../components/PageContent";
import { useUser } from "../contexts/UserContext";
import classes from "./Dashboard.module.css";
function DashboardPage() {
  const { user } = useUser();

  console.log(user.data.data);
  return (
    <div className={classes.container}>
      Welcome, {user.data.data?.first_name}!
    </div>
  );
}

export default DashboardPage;
