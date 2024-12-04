import { createBrowserRouter, RouterProvider, FutureConfig } from "react-router-dom";
import GuestLayout from "./Layouts/GuestLayout";
import Welcome from "./Pages/Welcome";
import ChefProfile from "./Pages/Chefs/ChefProfile";
import DishList from "./Pages/Foods/DishList";
import ChefList from "./Pages/Chefs/ChefList";
import AboutPage from "./Pages/Aboutus";
import ContactUs from "./Pages/ContactUs";
import Account from "./Pages/Account";
import AdminDashboard from "./Pages/Admin/Boards/AdminDashboard";
import AdminNav from "./Pages/Admin/AdminNav";
import Kitchen from "./Pages/Admin/Boards/Kitchen";
import { RoleGuard } from './components/auth/RoleGuard';
import UsersManagement from "./Pages/Admin/Boards/UsersManagement";
import ChefManagement from "./Pages/Admin/Boards/ChefManagement";
import Settings from "./Pages/Admin/Boards/Settings";

// Error component for 404 pages
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold text-foodred-600">404</h1>
    <p className="text-xl text-gray-600">Page not found</p>
  </div>
);

// Define public routes
const publicRoutes = [
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <Welcome /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactUs /> },
      { path: "chefs", element: <ChefList /> },
      { path: "chefs/:id", element: <ChefProfile /> },
      { path: "dishes", element: <DishList /> },
      { path: "dishes/category/:category", element: <DishList /> },
      { path: "account", element: <Account /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

// Define protected routes (require authentication)
const protectedRoutes = [
  {
    path: "/admin",
    element: (
      <RoleGuard requireAdmin>
        <AdminNav />
      </RoleGuard>
    ),
    children: [
      { 
        index: true, 
        element: <AdminDashboard /> 
      },
      {
        path: "users",
        element: <UsersManagement />
      },
      {
        path: "chefs",
        element: <ChefManagement />
      },
      {
        path: "kitchen",
        element: <Kitchen />
      },
      {
        path: "orders",
        element: <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-100">Orders Management</h1>
        </div>
      },
      {
        path: "settings",
        element: <Settings />
      },
      // Remove the chef-applications route since it's now in the dashboard
    ],
  },
];

// Define chef routes
const chefRoutes = [
  {
    path: "/chef",
    element: (
      <RoleGuard requireChef>
        <AdminNav />
      </RoleGuard>
    ),
    children: [
      { 
        index: true, 
        element: <div></div> 
      },
      {
        path: "menu",
        element: <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-100">Menu Management</h1>
        </div>
      },
      {
        path: "orders",
        element: <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-100">Orders</h1>
        </div>
      },
    ],
  },
];

// Combine all routes
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes, ...chefRoutes], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true
  } as Partial<FutureConfig & { v7_startTransition?: boolean }>
});

// Router component
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
