import { Button } from "../components/ui/button";

const products = [
  {
    title: "Nike Air Max 90",
    description: "Легендарные кроссовки и удобство.",
    price: 149.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/8c9201a6-0c5a-42ed-891a-0cca1a25f75d/AIR+MAX+90+DRIFT.png",
  },
  {
    title: "Nike Air Force 1",
    description: "Икона стиля. Белоснежная классика.",
    price: 129.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4952cb90-ca73-41d5-ab9f-b560e6be510a/AIR+FORCE+1+%2707+LV8.png",
  },
  {
    title: "Nike Dunk Low",
    description: "Современная классика в уличном стиле.",
    price: 119.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/7888ed00-8d4c-45b3-bbfb-f3d6d29e8c1f/W+NIKE+DUNK+LOW.png",
  },
  {
    title: "Nike Vomero 5",
    description: "Комфорт марафона, дизайн мегаполиса.",
    price: 159.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5d9bfeb8-75af-41bf-a4bd-7788d84d6a9f/NIKE+ZOOM+VOMERO+5.png",
  },
  {
    title: "Nike Blazer Mid '77",
    description: "Ретро-дизайн и надёжность на каждый день.",
    price: 109.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/9446e7f6-c179-474a-830f-14a94411efb1/NIKE+ZOOM+BLAZER+MID+QS.png",
  },
  {
    title: "Nike ZoomX Vaporfly",
    description: "Сверхлёгкие для марафонов и скорости.",
    price: 249.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6666f296-2fe9-40dd-b4ef-6eae7ae449a4/W+ZOOMX+INVINCIBLE+RN+FK+3+PRM.png",
  },
  {
    title: "Nike React Infinity Run",
    description: "Ультракомфортные для длительных пробежек.",
    price: 159.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ff33d71-1970-4747-9b52-59816d0efab7/NIKE+REACT+PHANTOM+RUN+FK+2.png",
  },
  {
    title: "Nike Air Zoom Pegasus",
    description: "Легенда бега с отличной амортизацией.",
    price: 139.99,
    image:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/457339a3-6938-4a08-9cb9-1a330a58cc50/W+AIR+ZOOM+PEGASUS+41.png",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="relative bg-gray-100 h-56 sm:h-64 md:h-72 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="h-full object-contain transition-transform duration-300 "
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg md:text-xl font-bold text-gray-600 mb-1">
                {product.title}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-violet-500">
                  ${product.price}
                </span>
                <Button size="sm" className="rounded-full px-4 py-1">
                  В корзину
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
