import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; // Импортируем AxiosError
import { toast } from "react-toastify";
import OrderModal from "./OrderModal";

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

interface OrderListProps {
  token: string | null;
  setError: (error: string | null) => void;
}

interface OrderResponse {
  message: string;
  order: Order;
}

export default function OrderList({ token, setError }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>(
          "http://localhost:3001/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (err) {
        const error = err as AxiosError; // Явно указываем тип ошибки
        console.error("Ошибка при загрузке заказов:", error);
        setError(
          error.response?.status === 404
            ? "Request failed with status code 404"
            : "Неизвестная ошибка"
        );
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, setError]);

  const handleEditOrderSave = async () => {
    if (!selectedOrder) return;

    try {
      const response = await axios.put<OrderResponse>(
        `http://localhost:3001/orders/${selectedOrder._id}`,
        { status: editData.status || selectedOrder.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(
        orders.map((order) =>
          order._id === selectedOrder._id ? response.data.order : order
        )
      );
      setSelectedOrder(null);
      toast.success("Заказ обновлен!");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Ошибка при обновлении заказа:", error);
      setError("Ошибка при обновлении заказа");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот заказ?")) return;

    try {
      await axios.delete(`http://localhost:3001/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Заказ удален!");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Ошибка при удалении заказа:", error);
      setError("Ошибка при удалении заказа");
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) => (statusFilter ? order.status === statusFilter : true));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-base font-medium text-gray-700 mb-3">Заказы</h2>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Поиск по имени пользователя..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="processing">В обработке</option>
          <option value="completed">Завершен</option>
          <option value="cancelled">Отменен</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-sm">Нет заказов</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="py-3 px-6">ID заказа</th>
                <th className="py-3 px-6">Пользователь</th>
                <th className="py-3 px-6">Сумма</th>
                <th className="py-3 px-6">Статус</th>
                <th className="py-3 px-6">Дата</th>
                <th className="py-3 px-6">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-6">{order._id.slice(0, 8)}</td>
                  <td className="py-4 px-6">{order.user.username}</td>
                  <td className="py-4 px-6">${order.total}</td>
                  <td className="py-4 px-6">{order.status}</td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setEditData({ status: order.status });
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          editData={editData}
          setEditData={setEditData}
          onSave={handleEditOrderSave}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
