import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function Page() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) {
          throw new Error(
            `Ошибка HTTP: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка в fetchProducts:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Ошибка HTTP: ${response.status} ${response.statusText}`
        );
      }

      toast.success("Товар добавлен в корзину!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (err) {
      console.error("Ошибка в handleAddToCart:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-red-500">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl max-w-sm mx-auto"
          >
            <div className="relative bg-gray-100 h-48 sm:h-56 md:h-64 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-full object-contain transition-transform duration-300"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-600 mb-1">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                {product.description || "Описание отсутствует"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-violet-500">
                  {product.price} $
                </span>
                <Button
                  size="sm"
                  className="rounded-full px-4 py-1 text-xs sm:text-sm"
                  onClick={() => handleAddToCart(product._id)}
                >
                  В корзину
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
