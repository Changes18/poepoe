import { useState } from "react"; // Добавлен импорт useState
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

// Интерфейс для товара
interface Product {
  _id: string; // Убрана опциональность, так как _id обязателен для редактирования
  name: string;
  price: number;
  image: string;
  description: string;
}

// Интерфейс для пропсов модального окна
interface ProductModalProps {
  mode: "add" | "edit";
  product: Product;
  onSave: (product: Product) => Promise<void> | void; // Поддержка асинхронных функций
  onDelete?: () => void;
  onClose: () => void;
}

export default function ProductModal({
  mode,
  product,
  onSave,
  onDelete,
  onClose,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(product); // useState теперь работает

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white opacity-100 rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-gray-700">
            {mode === "add" ? "Добавить товар" : "Редактировать товар"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Название"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Цена ($)"
            value={formData.price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value) || 0,
              })
            }
            className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="URL изображения"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Описание"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className={`${
                mode === "add"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white text-sm py-2 flex-1`}
            >
              {mode === "add" ? "Добавить" : "Сохранить"}
            </Button>
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 flex-1"
              >
                Удалить
              </Button>
            )}
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 flex-1"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
