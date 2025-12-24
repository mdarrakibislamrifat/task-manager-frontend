import { useContext } from "react";
import { UserProviderContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserProviderContext);

  return (
    <div>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            {" "}
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="flex-1 p-10"> {children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
