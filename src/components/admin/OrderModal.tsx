import { X } from "lucide-react";
import { Button } from "../../components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Order {
  _id: string;
  user: { _id: string; username: string };
  products: { product: Product; quantity: number }[];
  total: number;
  status: string;
  createdAt: string;
}

interface OrderModalProps {
  order: Order; // Проблема здесь: order должен быть Order, но передается Order | null
  editData: Partial<Order>;
  setEditData: (data: Partial<Order>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function OrderModal({
  order,
  editData,
  setEditData,
  onSave,
  onClose,
}: OrderModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-gray-700">
            Редактировать заказ #{order._id.slice(0, 8)}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Статус
            </label>
            <select
              value={editData.status || order.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Ожидает</option>
              <option value="processing">В обработке</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 flex-1"
            >
              Сохранить
            </Button>
            <Button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
