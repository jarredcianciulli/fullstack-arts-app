import { QueryClient } from "@tanstack/react-query";
import { json } from "react-router-dom";
import Cookies from "universal-cookie";

export const queryClient = new QueryClient();

export async function loginUser(data) {
  const authData = {
    email: data.email,
    password: data.password,
  };

  let url = "http://localhost:8081/api/v1/accounts/login";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Error("Could not authenticate user.");
  }

  const resData = await response.json();
  const jwt = resData.token;

  let expires = new Date();
  expires.setTime(expires.getTime() + 100 * 60 * 1000); // 100 minutes

  const cookies = new Cookies();

  // 🔹 Remove existing cookie with all potential conflicting settings
  cookies.remove("jwt", { path: "/" });
  cookies.remove("jwt", { path: "/", domain: window.location.hostname });
  cookies.remove("jwt", { path: "/", domain: `.${window.location.hostname}` });

  // 🔹 Set new cookie with correct attributes
  cookies.set("jwt", jwt, {
    path: "/", // Make sure the path matches
    expires,
    sameSite: "Lax", // or "None" if using cross-site cookies
    secure: window.location.protocol === "https:", // Ensure secure cookies on HTTPS
    httpOnly: false, // Cookies from JS can't be HttpOnly
  });

  return resData;
}

export async function isLoggedIn() {
  const cookies = new Cookies();
  const jwt = cookies.get("jwt");

  if (!jwt) {
    return null;
  }

  const url = "http://localhost:8081/api/v1/accounts/me";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    credentials: "include", // Sends cookies with the request
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw json(
      { message: "Could not verify user authentication." },
      { status: 500 }
    );
  }

  const userData = await response.json();
  return userData;
}
