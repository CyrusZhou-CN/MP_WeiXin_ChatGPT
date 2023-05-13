import { Footer } from "./footer";
import { Header } from "./header";

export default function Layout({ children,heading,title }: any) {
  return (
    <>
      <Header heading={heading} title={title} />
      <div className="container">
        <div className="content">
            {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
