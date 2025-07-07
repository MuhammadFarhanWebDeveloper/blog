import { useState } from "react";
import Nav from "./Nav";
import MobileMenu from "./MobileMenu";

export default function ResponsiveNavbar() {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const openMobileMenu = () => setMobileMenuOpened(true);
  const closeMobileMenu = () => setMobileMenuOpened(false);
  return (
    <div>
      <Nav openMobileMenu={openMobileMenu} />
      <MobileMenu
        mobileMenuOpened={mobileMenuOpened}
        closeMobileMenu={closeMobileMenu}
      />
    </div>
  );
}
