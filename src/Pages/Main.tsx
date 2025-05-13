import Header from "../components/Header";
import NikeSlider from "../components/NikeSlider";
import Footer from "../components/Footer";

export default function Main() {
  return (
    <div className="bg-gray-100">
      <div className="">
        <Header />
      </div>
      <div className="h-full">
        <NikeSlider />
      </div>

      {/* Почему именно мы */}
      <section className="py-10 px-4 sm:px-8 lg:px-20">
        <h2 className="font-bold text-2xl sm:text-3xl text-center pt-6">
          Почему именно мы?
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-8 pt-8">
          <div className="w-full lg:w-1/2 flex flex-col gap-5 text-sm sm:text-base">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Similique, numquam placeat veniam, fuga necessitatibus sapiente
              est magni dolor quos natus fugit. Earum laborum quos distinctio
              aperiam reiciendis pariatur, voluptates ipsam?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi,
              necessitatibus.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <img
              className="rounded-lg w-full h-auto object-cover"
              src="https://picsum.photos/600/400"
              alt="Почему именно мы"
            />
          </div>
        </div>
      </section>

      {/* Наша Задача */}
      <section className="bg-gray-200 py-12 px-4 sm:px-8 lg:px-20">
        <h2 className="font-bold text-2xl sm:text-3xl text-center pt-6">
          Наша Задача
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="bg-white rounded-md h-40 flex flex-col justify-center items-center px-6 text-center"
            >
              <div className="text-xl font-bold mb-2">{num}</div>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repudiandae, deleniti.
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
