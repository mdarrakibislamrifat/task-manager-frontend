import { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenuAlt2, HiOutlineX } from "react-icons/hi";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between transition-all duration-300">
        {/* Left Side: Mobile Toggle & Title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenuAlt2 className="text-2xl" />
            )}
          </button>

          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Task /{" "}
              <span className="text-gray-900 capitalize">
                {activeMenu || "Dashboard"}
              </span>
            </h2>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {openSideMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600/20 backdrop-blur-sm"
            onClick={() => setOpenSideMenu(false)}
          ></div>

          {/* Sidebar Content */}
          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <HiOutlineX
                className="text-xl cursor-pointer"
                onClick={() => setOpenSideMenu(false)}
              />
            </div>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
