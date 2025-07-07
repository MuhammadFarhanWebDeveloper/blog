import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { NAV_LINKS } from "../../../constants/nav_links";
import { Link, useLocation } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
type NavProps = {
  openMobileMenu: () => void;
};

function Nav({ openMobileMenu }: NavProps) {

  const location = useLocation()


  return (
    <div
      className={` py-8 flex justify-between  items-center  navbar   px-6 z-10`}
    >
      {/* Logo */}

      <img src="/logo.svg" width={50} height={50} alt="" />

      <div className=" flex gap-2">
        {/* Navbar Links */}
        <ul className="hidden lg:flex gap-6 ">
          {NAV_LINKS.map((link, index) => (
            <li
              className={`${
                location.pathname === link.link && "selected-nav"
              } inline-block relative nav-link`}
              key={index}
            >
              <Link to={link.link}>
                <p className={``}>{link.lable}</p>
              </Link>
            </li>
          ))}
          <li>
            <SignedOut>
              <Link to={"/login"}>
                <button className="p-1  bg-blue-900 text-white   rounded-full px-4">
                  Login
                </button>
              </Link>{" "}
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>

        <HiOutlineMenuAlt3
          size={20}
          onClick={openMobileMenu}
          className="block lg:hidden cursor-pointer "
        />
      </div>
    </div>
  );
}

export default Nav;
