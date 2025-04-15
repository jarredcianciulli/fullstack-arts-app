import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountClaim from "./AccountClaim";

import { fetchInvite } from "../../utils/http";

import AccountClaimError from "./AccountClaimError";
import classes from "./AccountClaim.module.css";

function AccountClaimRoot() {
  const { invite_token } = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null);
  useEffect(() => {
    // Simulate API call to validate token
    fetchInvite(invite_token)
      .then((data) => {
        if (data) {
          setIsValid(true);
          console.log(data, "true");
        } else {
          console.log(data, "false");
          setIsValid(false);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setIsValid(false);
      });
  }, [invite_token]);

  if (isValid === null) return <p className={classes.loading}>Loading...</p>;

  return isValid ? (
    <AccountClaim inviteToken={invite_token} />
  ) : (
    <AccountClaimError />
  );
}

export default AccountClaimRoot;

// import { useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { NavLink } from "react-router-dom";
// import DeleteModal from "../../../utils/UI/DeleteModal";
// import { useLocation } from "react-router-dom";
// import { fetchUsers } from "../../../utils/http";
// import SuccessBlock from "../../../utils/UI/SuccessBlock.jsx";

// import classes from "./User.module.css";

// function UsersList() {
//   const [isSuccessVisible, setIsSuccessVisible] = useState(<></>);
//   let location = useLocation();
//   if (location) {
//     // const { title, message } = success;
//   }

//   useEffect(() => {
//     if (location.state) {
//       setIsSuccessVisible(
//         <SuccessBlock
//           title={location.state.title}
//           message={location.state.message}
//         />
//       );
//       const timer = setTimeout(() => {
//         setIsSuccessVisible(<></>);
//       }, 3000);

//       return () => {
//         clearTimeout(timer);
//         window.history.replaceState({}, "");
//       };
//     }
//   }, []);

//   const queryClient = useQueryClient();
//   queryClient.invalidateQueries({ queryKey: ["groupClasses"] });

//   useEffect(() => {
//     console.log(location);
//   }, [location]);

//   let content;
//   const [Modal, setModal] = useState(<></>);

//   const { data } = useQuery({
//     queryKey: ["groupClasses"],
//     queryFn: fetchUsers,
//     enabled: true,
//   });

//   async function deleteGroup(id) {
//     console.log(id);
//     if (Modal !== <></>) {
//       await setModal(<></>);
//     }
//     let message =
//       "This action will delete the account, any enrollments and reviews associated with the account";
//     let action = "deleteAccount";
//     let title = "Delete account";
//     setModal(
//       <DeleteModal
//         message={message}
//         title={title}
//         action={action}
//         id={id}
//         b={true}
//         e={1}
//       />
//     );
//   }

//   if (data) {
//     console.log(data);
//     content = data.map((e) => (
//       <tr key={e.userID} className={classes.musicTableBodyContainer}>
//         <td className={classes.courseNameValueContainer}>
//           <NavLink
//             to={`${e._id}`}
//             className={`${classes.courseNameValue} ${classes.actionLink}`}
//           >
//             {e.userID}
//           </NavLink>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <span className={classes.courseNameValue}>{e.name}</span>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <span className={classes.courseNameValue}>{e.email}</span>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <span className={classes.courseNameValue}>{e.role}</span>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <span className={classes.courseNameValue}>{e.frequency}</span>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <NavLink
//             target="_blank"
//             to={`https://dashboard.stripe.com/test/products/${e.stripeId}`}
//             className={`${classes.courseNameValue} ${classes.actionLink}`}
//           >
//             View
//           </NavLink>
//         </td>
//         <td className={classes.courseNameValueContainer}>
//           <span
//             className={`${classes.courseAction} ${classes.actionLink}`}
//             onClick={() => deleteGroup(e.id)}
//             // onClick={(a) => HandleSubmit(a, e.id)}
//           >
//             Delete
//           </span>
//         </td>
//       </tr>
//     ));
//   }

//   return (
//     <>
//       {isSuccessVisible}
//       <div className={classes.actionContainer}>
//         <NavLink
//           to="/client-portal/users/create"
//           className={`${classes.actionCreate}`}
//         >
//           Create User
//         </NavLink>
//       </div>
//       {Modal}
//       <table className={classes.musicTable}>
//         <thead className={classes.musicTableHeader}>
//           <tr className={classes.musicTableHeaderContainer}>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th></th>
//             <th className={classes.musicTableActionField}>Stripe</th>
//             <th className={classes.musicTableActionField}></th>
//           </tr>
//         </thead>
//         <tbody>{content}</tbody>
//       </table>
//     </>
//   );
// }

// export default UsersList;
