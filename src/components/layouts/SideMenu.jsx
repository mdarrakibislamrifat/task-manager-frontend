import { useContext, useEffect, useState } from "react";
import { UserProviderContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserProviderContext);

  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA,
      );
    }
    return () => {};
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-60px)] bg-white border-r border-gray-200/50 sticky top-15 z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-15">
        <div className="relative">
          <img
            src={user?.profileImageUrl || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>
        {user?.role === "admin" && (
          <div className="text-[12px] font-medium text-white bg-primary px-3 py-1 rounded-md mt-1">
            Admin
          </div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-700 font-medium">
          {user?.email || ""}
        </p>
      </div>
      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] font-medium ${
            activeMenu === item.label
              ? "text-primary bg-blue-100 border-r-4 border-primary"
              : "text-gray-600"
          } py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.link)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}{" "}
    </div>
  );
};

export default SideMenu;
