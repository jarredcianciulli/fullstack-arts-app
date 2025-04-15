import React, { useEffect, useState } from "react";
// import Cookies from "universal-cookie";
import Cookies from "js-cookie";

import { Navigate, useNavigate } from "react-router-dom";
import RootLayout from "../pages/Root";
import { checkSession } from "../components/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PrivateRoutes = () => {
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ["auth"],
    queryFn: checkSession,
    refetchInterval: 5000,
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      console.log("error");
      navigate("/login");
    }
  }, [error, navigate]);

  if (data) {
    return <RootLayout />;
  }
};

export default PrivateRoutes;
