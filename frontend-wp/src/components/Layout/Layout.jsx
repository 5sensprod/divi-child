import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WishlistNotification from "../UI/WishlistNotification";
import WishlistFlyAnimation from "../UI/WishlistFlyAnimation";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WishlistNotification />
      <WishlistFlyAnimation />
    </div>
  );
};

export default Layout;
