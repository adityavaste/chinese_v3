import { Navbar } from './navbar';
import { Footer } from './footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const PageLayout = ({ children, showFooter = true }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
