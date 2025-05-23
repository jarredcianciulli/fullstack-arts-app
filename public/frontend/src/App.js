import { RouterProvider, createBrowserRouter } from "react-router-dom";

// import HomePage from "./components/pages/Home";
import AboutPage from "./components/pages/About";
import SubscriptionsPage from "./components/pages/Subscriptions";
import ResourcesPage from "./components/pages/Resources";
import ContactPage from "./components/pages/Contact";
import ScalesPage from "./components/pages/resources/scales/Scales";
import sRhodesSystemPage from "./components/pages/resources/rhodesSystem/sRhodesSystem";
import ArpeggiosPage from "./components/pages/resources/arpeggios/Arpeggios";
import DoubleStopsPage from "./components/pages/resources/DoubleStops";
import ModesPage from "./components/pages/resources/Modes";
import PaymentStatus from "./components/main/form/PaymentStatus";
import ProfilePage from "./components/pages/Profile";
import PaymentSuccess from "./components/main/payment/PaymentSuccess";
import PaymentCancel from "./components/main/payment/PaymentCancel";

import ScrollToTop from "./components/ScrollToTop";

import RootLayout from "./components/pages/Root";
import MainPage from "./components/pages/Main";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
      {
        path: "services",
        children: [
          {
            index: true,
            element: <MainPage />,
          },
          {
            path: ":serviceSlug/register",
            element: <MainPage showForm={true} />,
          },
        ],
      },
      {
        path: "/about",
        index: true,
        element: <AboutPage />,
      },
      {
        path: "/subscriptions",
        index: true,
        element: <SubscriptionsPage />,
      },
      {
        path: "/resources",
        children: [
          {
            index: true,
            element: <ResourcesPage />,
          },
          {
            path: "/resources/prof_rhodes_scale_system",
            element: <sRhodesSystemPage />,
          },
          {
            path: "/resources/scales",
            element: <ScalesPage />,
          },
          {
            path: "/resources/arpeggios",
            element: <ArpeggiosPage />,
          },
          {
            path: "/resources/double_stops",
            element: <DoubleStopsPage />,
          },
          {
            path: "/resources/modes",
            index: true,
            element: <ModesPage />,
          },
        ],
      },
      {
        path: "/contact",
        index: true,
        element: <ContactPage />,
      },
      {
        path: "/payment/complete",
        element: <PaymentStatus />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment-cancel",
        element: <PaymentCancel />,
      },
    ],
  },
  // {
  //   path: "/resources",
  //   element: <RootLayout />,
  //   id: "resources",
  //   children: [
  //     {
  //       path: "/scales",
  //       index: true,
  //       element: <ScalesPage />,
  //     },
  //     {
  //       path: "/arpeggios",
  //       index: true,
  //       element: <ArpeggiosPage />,
  //     },
  //     {
  //       path: "/double_stops",
  //       index: true,
  //       element: <DoubleStopsPage />,
  //     },
  //     {
  //       path: "/modes",
  //       index: true,
  //       element: <ModesPage />,
  //     },
  //   ],
  // },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
        <ScrollToTop />
      </RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
