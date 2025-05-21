import Header from "./header/Header";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="">
      <Header />
      {}
      <main className="mx-auto max-w-7xl px-2">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;