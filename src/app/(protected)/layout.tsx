import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Listen To Me | Music",
  description: "Your dashboard",
};

const Layout = async ({ children }: LayoutProps) => {
  return <div className="">{children}</div>;
};

export default Layout;
