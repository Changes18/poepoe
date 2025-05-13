import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";
import ProductModal from "./ProductModal";

interface Product {
  _id: string; // _id теперь обязательно строка
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductListProps {
  token: string | null;
  setError: (error: string | null) => void;
}

export default function ProductList({ token, setError }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    _id: "", // Инициализируем _id пустой строкой для add-режима
    name: "",
    price: 0,
    image: "",
    description: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) throw new Error("Ошибка при загрузке товаров");
        const data = await response.json();
        // Убеждаемся, что каждый продукт имеет _id как строку
        const validatedProducts = data.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          price: p.price,
          image: p.image,
          description: p.description,
        }));
        setProducts(validatedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      }
    };

    fetchProducts();
  }, [setError]);

  const handleAddProduct = async (product: Product) => {
    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        setError("Сессия истекла. Пожалуйста, войдите заново.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при добавлении товара");
      }

      const addedProduct = await response.json();
      setProducts([...products, addedProduct.product]);
      setNewProduct({
        _id: "",
        name: "",
        price: 0,
        image: "",
        description: "",
      });
      setIsAddModalOpen(false);
      toast.success("Товар добавлен!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const response = await fetch(
        `http://localhost:3001/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        setError("Сессия истекла. Пожалуйста, войдите заново.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении товара");
      }

      const updatedProduct = await response.json();
      setProducts(
        products.map((p) =>
          p._id === updatedProduct.product._id ? updatedProduct.product : p
        )
      );
      setEditingProduct(null);
      setIsEditModalOpen(false);
      toast.success("Товар обновлен!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        setError("Сессия истекла. Пожалуйста, войдите заново.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при удалении товара");
      }

      setProducts(products.filter((p) => p._id !== id));
      setEditingProduct(null);
      setIsEditModalOpen(false);
      toast.success("Товар удален!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "light",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  };

  return (
    <>
      <div className="mb-6">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 px-6 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Добавить товар
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-base font-medium text-gray-700 mb-3">Товары</h2>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">Товары отсутствуют</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="relative bg-gray-50 rounded-md p-3 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">${product.price}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description || "Без описания"}
                </p>
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditModalOpen(true);
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <ProductModal
          mode="add"
          product={newProduct}
          onSave={handleAddProduct}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && editingProduct && (
        <ProductModal
          mode="edit"
          product={editingProduct}
          onSave={handleEditProduct}
          onDelete={() => handleDeleteProduct(editingProduct._id)}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
