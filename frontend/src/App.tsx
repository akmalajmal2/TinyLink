import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import HealthCheck from "./pages/HealthCheck";
import Layout from "./components/Layout";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/code/:code", element: <Stats /> },
        { path: "/health", element: <HealthCheck /> },
      ],
    },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
