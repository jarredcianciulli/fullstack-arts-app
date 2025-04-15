import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

// import ErrorPage from "./pages/Error";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import ResourcesPage from "./pages/Resources";
import ContactPage from "./pages/Contact";
import IntakeFormPage from "./pages/IntakeForm";
import DashboardPage from "./pages/Dashboard";
import EnrollmentsPage from "./pages/Enrollments";
import EnrollmentsOverview from "./components/enrollments/EnrollmentsOverview";
import AccountClaimPage from "./pages/AccountClaim";
import ResetPWPage from "./pages/ResetPW";
import OptionsPage from "./pages/Options";
import TestPage from "./pages/Test";
import RootUnauth from "./pages/RootUnauth";
// import ScrollToTop from "./ScrollToTop";
import LoginPage from "./pages/Login";
import ForgotPW from "./pages/ForgotPW";
import NewPW from "./pages/NewPW";
import { UserProvider } from "./contexts/UserContext";
// import { queryClient } from "./components/utils/http.js";
import { QueryClient } from "@tanstack/react-query";

import PrivateRoutes from "./utils/private_routes/PrivateRoutes";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClientProvider } from "@tanstack/react-query";

// import LifeCoachingSignupPage from "./pages/signup/LifeCoachingSignup";
import YogaPage from "./pages/Yoga";
// import YogaSignupPage from "./pages/signup/YogaSignup";
import RootLayout from "./pages/Root";
const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    path: "/",
    id: "root",

    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "intake-form", element: <IntakeFormPage /> },
      { path: "test", element: <TestPage /> },
      { path: "profile", element: <DashboardPage /> },
      {
        path: "enrollments",
        id: "enrollments",
        children: [
          { index: true, element: <EnrollmentsPage /> },
          {
            path: ":enrollmentId",
            element: <EnrollmentsOverview />,
          },
        ],
      },
      { path: "settings", element: <OptionsPage /> },
      { path: "account-claim/:", element: <OptionsPage /> },

      {
        path: "yoga",
        element: <YogaPage />,
      },
    ],
  },
  {
    element: <RootUnauth />,
    children: [
      {
        element: <LoginPage />,
        path: "/login",
      },
    ],
  },
  {
    element: <RootUnauth />,
    children: [{ path: "invite/:invite_token", element: <AccountClaimPage /> }],
  },
  {
    element: <RootUnauth />,
    children: [{ path: "password-reset/:invite_token", element: <NewPW /> }],
  },
  {
    element: <RootUnauth />,
    children: [{ path: "forgot-password", element: <ForgotPW /> }],
  },
  {
    element: <RootUnauth />,
    children: [
      { path: "reset-password/:reset_token", element: <ResetPWPage /> },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router}>{/* <ScrollToTop /> */}</RouterProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
