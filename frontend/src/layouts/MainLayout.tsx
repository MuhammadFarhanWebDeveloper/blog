import { Outlet } from "react-router";
import ResponsiveNavbar from "../components/Shared/Navbar/ResponsiveNavbar";

function MainLayout() {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <ResponsiveNavbar />
      
      <Outlet />
    </div>
  );
}

export default MainLayout;
