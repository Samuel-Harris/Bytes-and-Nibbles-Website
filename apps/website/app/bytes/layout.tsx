import React from "react";
import Header, { Tab } from "@/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Header tab={Tab.Bytes}>{children}</Header>
);
export default Layout;
