import {
  createBrowserRouter,
  RouterProvider,
  type LoaderFunctionArgs,
} from "react-router";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import PostListPage from "./pages/PostListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SinglePostPage from "./pages/SinglePostPage";
import WritePage from "./pages/WritePage";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import api from "./services/api";
import ProtectedRoutes from "./components/Shared/ProtectedRoutes";
import PublicRoutes from "./components/Shared/PublicRoutes";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const fetchPost = async ({ params }: LoaderFunctionArgs) => {
  const res = await api.get(`/posts/${params.slug}`);
  return res.data;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/posts", element: <PostListPage /> },
      { path: "/:slug", element: <SinglePostPage />, loader: fetchPost },
      {
        path: "/write",
        element: (
          <ProtectedRoutes>
            <WritePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoutes>
            <LoginPage />
          </PublicRoutes>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoutes>
            <RegisterPage />
          </PublicRoutes>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <ToastContainer position="top-right" />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
