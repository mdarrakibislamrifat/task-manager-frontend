import { use, useContext, useEffect } from "react";
import { UserProviderContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserProviderContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, [user, loading, clearUser, navigate]);
};

export default useUserAuth;
