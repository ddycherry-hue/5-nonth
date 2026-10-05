import { createBrowserRouter } from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";

import UsersPage, { usersLoader } from "./pages/UsersPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
        { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'about', element: <AboutPage /> },
      
      { 
        path: 'users', 
        element: <UsersPage />,
        loader: usersLoader 
      },
      
      { path: '*', element: <NotFoundPage /> }

    ]
  }
]);
