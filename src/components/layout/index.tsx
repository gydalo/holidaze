import Header from "./header/Header";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;