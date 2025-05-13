import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4d00d185-6db5-4f9b-b91a-f42138c8b4c3/AIR+MAX+90.png",
    title: "Nike Air Max 90",
  },
  {
    image:
      "https://sneakertown.kz/upload/iblock/a78/m11j823ptg0sp90u15cwmea27qs8ng7b.jpg",
    title: "Nike Air Force 1",
  },
  {
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2ef9baef-dc22-43be-9061-b64a0104cdd6/NIKE+ZOOM+VOMERO+5.png",
    title: "Nike Vomero 5",
  },
];

export default function NikeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    renderMode: "performance",
    drag: false,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      slider.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <div className="relative w-full h-">
      <div
        ref={sliderRef}
        className="keen-slider overflow-hidden shadow-2xl h-[610px]"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide flex justify-center items-end relative 
                                   h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-neutral-100"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="relative z-10 bg-black/60 text-white w-full text-center p-4 
                                       text-base sm:text-lg md:text-xl lg:text-2xl font-semibold pb-7"
            >
              {slide.title}
            </div>
          </div>
        ))}
      </div>

      {/* Индикаторы */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => slider.current?.moveToIdx(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-1000 ${
              currentSlide === index
                ? "bg-white scale-125 shadow-md"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
