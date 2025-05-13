import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

const Basket: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:3001/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Ошибка при загрузке корзины");
        }

        const data = await response.json();
        setCartItems(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const increaseQuantity = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const cartItem = cartItems.find((item) => item._id === id);
    if (!cartItem) return;

    try {
      const response = await fetch(`http://localhost:3001/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении корзины");
      }

      const updatedItem = await response.json();
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? updatedItem.cartItem : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const decreaseQuantity = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const cartItem = cartItems.find((item) => item._id === id);
    if (!cartItem || cartItem.quantity <= 1) return;

    try {
      const response = await fetch(`http://localhost:3001/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: cartItem.quantity - 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении корзины");
      }

      const updatedItem = await response.json();
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? updatedItem.cartItem : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/cart/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении из корзины");
      }

      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-3xl mx-auto pt-28 pb-20 h-screen">
          Загрузка...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="max-w-3xl mx-auto pt-28 pb-20 h-screen text-red-500">
          Ошибка: {error}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto pt-28 pb-20 h-screen">
        <h2 className="text-2xl font-bold mb-6">Корзина</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Корзина пуста</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-gray-500">{item.product.price} $</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="font-semibold">
                    {item.product.price * item.quantity} $
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 hover:underline"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right mt-6">
              <p className="text-xl font-bold">Итого: {totalPrice} $</p>
              <button className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                Перейти к оформлению
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Basket;
