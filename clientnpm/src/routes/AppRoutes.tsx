import { Outlet, useLocation } from "react-router"; 
import { useEffect } from "react";
import Login from "../components/Login";
import ProfileInfo from "../components/ProfileInfo";

const AppRoutes = () => {
  const location = useLocation(); 

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.classList.add("backHome");
    } else {
      document.body.classList.remove("backHome");
    }

    return () => {
      document.body.classList.remove("backHome"); 
    };
  }, [location.pathname]); 

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppRoutes;