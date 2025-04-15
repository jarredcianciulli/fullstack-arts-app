import { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import Cookies from "universal-cookie";
import { json } from "react-router-dom";

export const queryClient = new QueryClient();

export async function loginUser(data) {
  const authData = {
    email: data.email,
    password: data.password,
  };

  let url = "http://localhost:8080/api/v1/users/login";

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
    throw json({ message: "Could not authenticate user." }, { status: 500 });
  }

  const resData = await response.json();
  const jwt = resData.token;
  console.log(resData);

  let expires = new Date();
  expires.setTime(expires.getTime() + 100 * 60 * 1000);
  const cookies = new Cookies();
  cookies.set("jwt", jwt, { path: "/", expires });
  return resData;
}
