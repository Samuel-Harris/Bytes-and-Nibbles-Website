import Header, { Tab } from "@/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Header tab={Tab.Nibbles}>{children}</Header>
);
export default Layout;
