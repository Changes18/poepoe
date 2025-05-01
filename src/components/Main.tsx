import Header from "./Header";
import NikeSlider from "./NikeSlider";
import Page from "./Page";

export default function Main() {
  return (
    <div className="bg-gray-100">
      <Header />
      <NikeSlider />
      <div className="px-4 md:px-10 lg:px-20">
        <Page />
      </div>
    </div>
  );
}
