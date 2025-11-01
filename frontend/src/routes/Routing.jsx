import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import App from "../App";
import MarketPlace from "../pages/MarketPlace";


export let myRoutes = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    children: [
      {
        path: "/",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:"/marketplace",
        element:<MarketPlace/>
      }
    ],
  },
]);
