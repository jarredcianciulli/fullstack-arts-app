import {
  Link,
  useSearchParams,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../components/utils/auth";

import classes from "./CreateAccount.module.css";
import ErrorBlock from "../components/utils/UI/ErrorBlock";
import getGoogleOAuthURL from "../components/utils/getGoogleOAuth";

function CreateAccount() {
  return (
    <div className={classes.formContainer}>
      <form
        method="post"
        className={classes.form}
        // onSubmit={(e) => HandleSubmit(e)}
      >
        <h1>Create account</h1>
        {/* {errorHandler} */}
        <div className={classes.createAccountFieldsContainer}>
          <p>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name" required />
          </p>
          <p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </p>
          <p>
            <label htmlFor="confirmPassword"> Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
            />
          </p>
        </div>
        <div className={classes.actions}>
          <button>Create account</button>
        </div>
        <div className={classes.orContainer}>
          <div className={classes.orLineBreak}></div>
          <div className={classes.orText}>or</div>
          <div className={classes.orLineBreak}></div>
        </div>
        <div className={classes.googleLinkContainer}>
          <Link className={classes.googleLink} to={getGoogleOAuthURL()}>
            Sign up with Google
          </Link>
        </div>
      </form>
      <div className={classes.authOptionContainer}>
        Have an account?
        <Link to="/login" className={classes.authOption}>
          Login
        </Link>
      </div>
    </div>
  );
}

export default CreateAccount;
