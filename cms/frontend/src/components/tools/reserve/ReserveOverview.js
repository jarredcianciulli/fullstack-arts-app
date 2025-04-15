import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import DeleteModal from "../../utils/UI/DeleteModal.jsx";
import { useLocation } from "react-router-dom";
import { fetchSections } from "../../utils/http.js";
import SuccessBlock from "../../utils/UI/SuccessBlock.jsx";
import {
  formatDate,
  formatMilitaryTime,
} from "../../utils/UI/DateHandlers.jsx";

import classes from "./ReserveOverview.module.css";

const ReserveOverviewDetails = () => {
  const [isSuccessVisible, setIsSuccessVisible] = useState(<></>);
  let location = useLocation();
  if (location) {
    // const { title, message } = success;
  }

  useEffect(() => {
    if (location.state) {
      setIsSuccessVisible(
        <SuccessBlock
          title={location.state.title}
          message={location.state.message}
        />
      );
      const timer = setTimeout(() => {
        setIsSuccessVisible(<></>);
      }, 3000);

      return () => {
        clearTimeout(timer);
        window.history.replaceState({}, "");
      };
    }
  }, []);

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["groupClasses"] });

  useEffect(() => {
    console.log(location);
  }, [location]);

  let content;
  const [Modal, setModal] = useState(<></>);

  const { data } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
    enabled: true,
  });

  async function deleteGroup(id) {
    if (Modal !== <></>) {
      await setModal(<></>);
    }
    let message =
      "This action will delete the group class, public views of the class and all classes associated with the group class.";
    let action = "deleteGroup";
    let title = "Delete group class";
    setModal(
      <DeleteModal
        message={message}
        title={title}
        action={action}
        id={id}
        b={true}
        e={1}
      />
    );
  }

  if (data) {
    content = data.map((e) => (
      <tr key={e.id} className={classes.musicTableBodyContainer}>
        <td className={classes.courseNameValueContainer}>
          <NavLink
            to={`/reserve/${e.id}`}
            className={`${classes.courseNameValue} ${classes.actionLink}`}
          >
            {e.title}
          </NavLink>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span className={classes.courseNameValue}>{e.summary}</span>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span className={classes.courseNameValue}>{e.description}</span>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span className={classes.courseNameValue}>
            {e.active ? "true" : "false"}
          </span>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span className={classes.courseNameValue}>
            {formatDate(e.created_on)}
          </span>
        </td>
        <td className={classes.courseNameValueContainer}>
          <NavLink
            to={`/reserve/${e.id}/edit`}
            className={`${classes.courseNameValue} ${classes.actionLink}`}
          >
            Edit
          </NavLink>
        </td>
        <td className={classes.courseNameValueContainer}>
          <span
            className={`${classes.courseAction} ${classes.actionLink}`}
            onClick={() => deleteGroup(e.id)}
            // onClick={(a) => HandleSubmit(a, e.id)}
          >
            Delete
          </span>
        </td>
      </tr>
    ));
  }

  return (
    <>
      {isSuccessVisible}
      <div className={classes.actionContainer}>
        <NavLink to="/reserve/create" className={`${classes.actionCreate}`}>
          Create overview
        </NavLink>
      </div>
      {Modal}
      <table className={classes.musicTable}>
        <thead className={classes.musicTableHeader}>
          <tr className={classes.musicTableHeaderContainer}>
            <th>Title</th>
            <th>Summary</th>
            <th>Description</th>
            <th>Active</th>
            <th>Created on</th>
            <th className={classes.musicTableActionField}></th>
            <th className={classes.musicTableActionField}></th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </>
  );
};

export default ReserveOverviewDetails;
