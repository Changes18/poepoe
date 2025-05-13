import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

// Типы для данных заказа
interface Order {
  _id: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
}

const statusOptions = ["pending", "processing", "completed", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Функция для загрузки заказов с фильтрами
  const fetchOrders = async () => {
    setLoading(true);
    console.log("Начинаем загрузку данных...");

    try {
      const res = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          search,
          status: statusFilter,
        },
      });
      console.log("Данные получены:", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке заказов:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  // Функция для удаления заказа
  const handleDelete = async (id: string) => {
    if (!window.confirm("Удалить заказ?")) return;
    await axios.delete(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchOrders();
  };

  // Открытие модального окна редактирования
  const openEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditData({ ...order });
  };

  // Сохранение изменений в заказе
  const handleEditSave = async () => {
    if (!selectedOrder) return;

    await axios.put(`/api/orders/${selectedOrder._id}`, editData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setSelectedOrder(null);
    fetchOrders();
  };

  return (
    <div>
      <Header />
      <div className="pt-10 px-20">
        <h2 className="text-2xl font-bold mb-4">Список заказов</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Поиск по имени или email"
            className="border px-2 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border px-2 py-1 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Все статусы</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Имя клиента</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Сумма</th>
                  <th className="border px-2 py-1">Статус</th>
                  <th className="border px-2 py-1">Действия</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="border px-2 py-1">{order.customerName}</td>
                      <td className="border px-2 py-1">{order.email}</td>
                      <td className="border px-2 py-1">{order.total} ₽</td>
                      <td className="border px-2 py-1">{order.status}</td>
                      <td className="border px-2 py-1 space-x-2">
                        <button
                          onClick={() => openEdit(order)}
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Нет заказов
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Модалка редактирования */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-96">
              <h3 className="text-lg font-bold mb-4">Редактировать заказ</h3>
              <label className="block mb-2">
                Статус:
                <select
                  className="w-full border px-2 py-1 mt-1"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Отмена
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
