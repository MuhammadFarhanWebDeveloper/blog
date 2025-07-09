import { Outlet, useLocation, useNavigationType } from "react-router";
import ResponsiveNavbar from "../components/Shared/Navbar/ResponsiveNavbar";
import NProgress from "../progress";
import { useEffect } from "react";

function MainLayout() {
    const location = useLocation();

  useEffect(() => {
    NProgress.start();

    // slight delay to simulate loading — real apps might use data fetching triggers here
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => clearTimeout(timeout);
  }, [location]);
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <ResponsiveNavbar />
      
      <Outlet />
    </div>
  );
}

export default MainLayout;
