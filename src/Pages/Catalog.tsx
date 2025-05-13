import Header from "../components/Header";
import Page from "../components/Page";
import Footer from "../components/Footer";

export default function Catalog() {
  return (
    <div className="bg-gray-100">
      <Header />
      <div className="px-20 pt-20">
        <Page />
      </div>
      <Footer />
    </div>
  );
}
