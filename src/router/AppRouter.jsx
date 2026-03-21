import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminBookings from "../components/admin/AdminBookings";
import AdminDisputes from "../components/admin/AdminDisputes";
import AdminPayments from "../components/admin/AdminPayments";
import AdminProperties from "../components/admin/AdminProperties";
import AdminReviews from "../components/admin/AdminReviews";
import AdminUsers from "../components/admin/AdminUsers";

import Login from "../components/Login";
import Signup from "../components/Signup";

import { GuestNavbar } from "../components/guest/GuestNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import { Home } from "../components/guest/HomePage";
import SearchPage from "../components/guest/SearchPage";
import { PropertyDetails } from "../components/guest/PropertyDetails";
import GuestBookings from "../components/guest/GuestBookings";
import GuestMessages from "../components/guest/GuestMessages";
import HostLayout from "../components/host/HostLayout";
import HostDashboard from "../components/host/HostDashboard";
import HostBookings from "../components/host/HostBookings";

import HostEarnings from "../components/host/HostEarnings";
import HostProperties from "../components/host/HostProperties";
import AddProperty from "../components/host/AddProperty";
import HostSettings from "../components/host/HostSettings";
import HostReviews from "../components/host/HostReviews";
import HostMessages from "../components/host/HostMessages";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([

  {
    path: "/",
    element: <Navigate to="/user/home" replace />
  },
  {
    path: "/login",
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
        path: "search",
        element: <SearchPage />
      },
      {
        path: "properties/:id",      // NEW: property detail page
        element: <PropertyDetails />
      },

      {
        path: "bookings",
        element: <GuestBookings />
      },
      {
        path: "messages",
        element: <GuestMessages />
      },
      {
        path: "profile",
        element: <h1>User Profile Page</h1>
      }

    ]
  },

  /* HOST ROUTES */
  {
    path: "/host",
    element: (
      <ProtectedRoute allowedRoles={["Host"]}>
        <HostLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HostDashboard />
      },
      {
        path: "properties",
        element: <HostProperties />
      },
      {
        path: "properties/add",
        element: <AddProperty />
      },
      {
        path: "bookings",
        element: <HostBookings />
      },

      {
        path: "earnings",
        element: <HostEarnings />
      },
      {
        path: "reviews",
        element: <HostReviews />
      },
      {
        path: "messages",
        element: <HostMessages />
      },
      {
        path: "settings",
        element: <HostSettings />
      }
    ]
  },

  /* ADMIN ROUTES */
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminSidebar />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />
      },
      {
        path: "dashboard",
        element: <AdminDashboard />
      },

      {
        path: "users",
        element: <AdminUsers />
      },

      {
        path: "properties",
        element: <AdminProperties />
      },
      {
        path: "bookings",
        element: <AdminBookings />
      },

      {
        path: "reviews",
        element: <AdminReviews />
      },

      {
        path: "payments",
        element: <AdminPayments />
      },

      {
        path: "settings",
        element: <h1>Admin Settings</h1>
      },
      
      {
        path: "disputes",
        element: <AdminDisputes />
      }

    ]
  }

]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;