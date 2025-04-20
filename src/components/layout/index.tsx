import Header from "./header/Header";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="">
      <Header />
      {}
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;