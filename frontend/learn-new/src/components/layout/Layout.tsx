import { FiBookOpen, FiHome } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const Layout = () => {
  const linkItems = [
    { name: "Главная", route: "", icon: FiHome },
    { name: "Курсы", route: "courses", icon: FiBookOpen },
  ];

  return (
    <>
      <Sidebar items={linkItems}>
        <Outlet />
      </Sidebar>
    </>
  );
};
