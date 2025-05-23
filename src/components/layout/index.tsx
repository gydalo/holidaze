import Header from "./header/Header";
import Footer from "./footer/Footer";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-2 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
