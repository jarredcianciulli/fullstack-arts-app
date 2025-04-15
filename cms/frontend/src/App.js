import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import PrivateRoutes from "./utils/PrivateRoutes";

import Reserve from "./pages/reserve/Reserve";
import Aviary from "./pages/aviary/Aviary";
import Exhibit from "./pages/exhibit/Exhibit";
import Tracks from "./pages/tracks/Tracks";
import Nomad from "./pages/nomad/Nomad";

import ReserveRoot from "./pages/reserve/ReserveRoot";
import AviaryRoot from "./pages/aviary/AviaryRoot";
import ExhibitRoot from "./pages/exhibit/ExhibitRoot";
import TracksRoot from "./pages/tracks/TracksRoot";
import NomadRoot from "./pages/nomad/NomadRoot";

import ReserveSectionsRoot from "./pages/reserve/sections/ReserveSectionsRoot";

import ReserveCreateSection from "./pages/reserve/ReserveCreateSection";
import ReserveEvents from "./pages/reserve/events/ReserveEvents";
import ReserveSections from "./pages/reserve/sections/ReserveSections";

import ReserveSectionsServicesRoot from "./pages/reserve/sections/services/ReserveSectionServicesRoot";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";

// import RootLayout from "./pages/Root";

import "./App.css";

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/reserve",
        element: <ReserveRoot />,
        id: "reserve",
        children: [
          {
            index: true,
            element: <Reserve />,
          },
          {
            path: "/reserve/sections/create",
            element: <ReserveCreateSection />,
          },
          { path: "/reserve/sections", element: <ReserveSections /> },
          { path: "/reserve/events", element: <ReserveEvents /> },
          {
            path: "/reserve/:section_id",
            element: <ReserveSectionsRoot />,
            children: [
              {
                path: "/reserve/:section_id/:services_id",
                element: <ReserveSectionsServicesRoot />,
              },
            ],
          },
        ],
      },
      {
        path: "/tracks",
        element: <Tracks />,
      },
      {
        path: "/aviary",
        element: <Aviary />,
      },
      {
        path: "/nomad",
        element: <Nomad />,
      },
      {
        path: "/exhibit",
        element: <Exhibit />,
      },
    ],
  },
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: <CreateAccount />,
    path: "/create-account",
  },
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
