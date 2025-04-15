import React, { useRef, useState, useEffect } from "react";
import classes from "./DeleteModal.module.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMusicGroup } from "../http";

export default function ErrorBlock({ title, message, action, id, b, e }) {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["groupClasses"] });
  const navigate = useNavigate();
  const deleteModalRef = useRef(null);
  const checkboxRef = useRef(null);
  const [modalPresence, setModalPresence] = useState(true);
  const [errorMessage, setErrorMessage] = useState(<></>);

  useEffect(() => {
    console.log(queryClient);
  }, [queryClient]);

  const { mutate } = useMutation({
    mutationFn: (id) => deleteMusicGroup(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["groupClasses"] });
      navigate("/treck/music/group");
    },
  });

  function HandleSubmit(e) {
    e.preventDefault();
    console.log(checkboxRef.current.checked);
    if (!checkboxRef.current.checked) {
      setErrorMessage(
        <div className={classes.errorMessage}>
          Please check the box to ensure you understand the action
        </div>
      );
    } else {
      mutate(id);
      setModalPresence(false);
    }
  }

  function handleOnChange() {
    if (checkboxRef.current.checked) {
      setErrorMessage(<></>);
    }
  }
  //   // Increment count every time the component is rendered
  //   setCount(count + 1 + e);
  //   console.log(count);

  function handleCloseModal() {
    setModalPresence(false);
  }
  return (
    <>
      {modalPresence && (
        <div className={classes.errorBlockContainer}>
          <form
            className={classes.errorBlock}
            ref={deleteModalRef}
            onSubmit={(id) => HandleSubmit(id)}
          >
            <div className={classes.errorBlockText}>
              <h2>{title}</h2>
              <p>{message}</p>
              <div></div>

              <div className={classes.checkBoxContainer}>
                <input
                  type="checkbox"
                  className={classes.checkBox}
                  ref={checkboxRef}
                  onChange={handleOnChange}
                />
                <div>I understand</div>
              </div>
              {errorMessage}
              <button className={classes.button} type="submit">
                Delete
              </button>
              <button className={classes.button} onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
