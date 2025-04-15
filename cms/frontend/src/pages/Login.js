import {
  Link,
  useSearchParams,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../components/utils/auth";

import classes from "./Login.module.css";
import ErrorBlock from "../components/utils/UI/ErrorBlock";
import getGoogleOAuthURL from "../components/utils/getGoogleOAuth";

function Login() {
  const navigation = useNavigate();
  let jsonFormData;
  let formSubmitStatus = <></>;
  const [errorHandler, setErrorHandler] = useState(<></>);

  const { mutate } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables, context) => {
      console.log(data.status);
      if (data.status === "success") {
        console.log(data, variables, context);
        navigation("/");
      } else if (data.status === 401 || data.status === 400) {
        setErrorHandler(
          <ErrorBlock
            title="Authentication failed"
            message={"User is not authorized on this app."}
          />
        );
      }
    },

    // onSettled: async (data) => {
    //   console.log(data);
    //   if (data.status === 200) {
    //     navigation("/");
    //   } else if (data.status === 401 || data.status === 400) {
    //     setErrorHandler(
    //       <ErrorBlock
    //         title="Authentication failed"
    //         message={"User is not authorized on this app."}
    //       />
    //     );
    //   }
    // },
    onError: (error) => {
      setErrorHandler(
        <ErrorBlock
          title="Authentication failed"
          message={
            error.message ||
            "Failed to load event. Please check your inputs and try again later."
          }
        />
      );
    },
  });

  console.log("hihi");

  function HandleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    jsonFormData = Object.fromEntries(formData);
    mutate(jsonFormData);
  }

  return (
    <div className={classes.formContainer}>
      <form
        method="post"
        className={classes.form}
        onSubmit={(e) => HandleSubmit(e)}
      >
        <h1>Log in</h1>
        {errorHandler}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          {/* <Link>Login</Link> */}
          <button>Login</button>
        </div>
      </form>
      {formSubmitStatus}
      <div className={classes.authOptionContainer}>
        <Link to="/create-account" className={classes.authOption}>
          Create account
        </Link>
        <span>or</span>
        <div className={classes.googleLinkContainer}>
          <Link className={classes.googleLink} to={getGoogleOAuthURL()}>
            Sign in with Google
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
