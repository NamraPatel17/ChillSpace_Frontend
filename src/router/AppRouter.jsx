import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../components/Login";
import Signup from "../components/Signup";

import { GuestNavbar } from "../components/guest/GuestNavbar";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { Home } from "../components/guest/HomePage";
import { PropertyDetails } from "../components/guest/PropertyDetails";


const router = createBrowserRouter([

  {
    path: "/",
    element: <Login />
  },

  {
    path: "/signup",
    element: <Signup />
  },

  /* USER ROUTES */
  {
    path: "/user",
    element: <GuestNavbar />,
    children: [

      {
        path: "home",
        element: <Home/>
      },

      {
        path: "properties",
        element: <h1>Properties</h1>
      },
      {
        path: "properties/:id",      // NEW: property detail page
        element: <PropertyDetails />
      },

      {
        path: "bookings",
        element: <h1>My Bookings Page</h1>
      },

      {
        path: "profile",
        element: <h1>User Profile Page</h1>
      }

    ]
  },

  /* ADMIN ROUTES */
  {
    path: "/admin",
    element: <AdminSidebar />,
    children: [

      {
        path: "dashboard",
        element: <h1>Admin Dashboard</h1>
      },

      {
        path: "users",
        element: <h1>Users</h1>
      },

      {
        path: "properties",
        element: <h1>Manage Properties</h1>
      },

      {
        path: "bookings",
        element: <h1>Manage Bookings</h1>
      },

      {
        path: "reviews",
        element: <h1>Manage Reviews</h1>
      },

      {
        path: "payments",
        element: <h1>Payments</h1>
      },

      {
        path: "settings",
        element: <h1>Admin Settings</h1>
      }

    ]
  }

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;