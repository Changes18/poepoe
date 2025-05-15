import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import Product from "./models/Product.js";
import CartItem from "./models/CartItem.js";
import Order from "./models/Order.js";

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/nike_store")
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения к MongoDB:", err));

const JWT_SECRET = "pXT3UQ9xhdEXSQe3UXgQUaumsJzxcf10gGSVf5xZ51rVPYu6ha";

// Middleware для проверки JWT
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Ошибка аутентификации:", err);
    return res
      .status(401)
      .json({ message: "Недействительный токен", error: err.message });
  }
};

// Middleware для проверки роли admin
const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Доступ запрещен: требуется роль admin" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Ошибка проверки admin:", err);
    return res.status(401).json({ message: "Недействительный токен" });
  }
};

// 📩 Регистрация
app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    res.json({ message: "Регистрация успешна" });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

// 🔐 Вход
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Вход выполнен",
      user: { username: user.username, role: user.role, _id: user._id },
      token,
    });
  } catch (err) {
    console.error("Ошибка при входе:", err);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
});

// 🧑 Обновление данных пользователя
app.put("/users/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        message: "Доступ запрещен: можно редактировать только свой профиль",
      });
    }

    const updateData = {};
    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Логин уже занят" });
      }
      updateData.username = username;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (!username && !password) {
      return res
        .status(400)
        .json({ message: "Не указаны данные для обновления" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: "Данные обновлены",
      user: {
        username: updatedUser.username,
        role: updatedUser.role,
        _id: updatedUser._id,
      },
    });
  } catch (err) {
    console.error("Ошибка при обновлении пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера при обновлении" });
  }
});

// 🛍️ Получение всех товаров
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Ошибка при получении товаров:", err);
    res.status(500).json({ message: "Ошибка сервера при получении товаров" });
  }
});

// 🛍️ Добавление нового товара (только для admin)
app.post("/products", authenticateAdmin, async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    const newProduct = new Product({ name, price, image, description });
    await newProduct.save();

    res.json({ message: "Товар успешно добавлен", product: newProduct });
  } catch (err) {
    console.error("Ошибка при добавлении товара:", err);
    res.status(500).json({ message: "Ошибка сервера при добавлении товара" });
  }
});

// 🛍️ Обновление товара (только для admin)
app.put("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, image, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json({ message: "Товар успешно обновлен", product: updatedProduct });
  } catch (err) {
    console.error("Ошибка при обновлении товара:", err);
    res.status(500).json({ message: "Ошибка сервера при обновлении товара" });
  }
});

// 🛍️ Удаление товара (только для admin)
app.delete("/products/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json({ message: "Товар успешно удален" });
  } catch (err) {
    console.error("Ошибка при удалении товара:", err);
    res.status(500).json({ message: "Ошибка сервера при удалении товара" });
  }
});

// 🛒 Получение корзины пользователя
app.get("/cart", authenticateUser, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );
    res.json(cartItems);
  } catch (err) {
    console.error("Ошибка при получении корзины:", err);
    res.status(500).json({ message: "Ошибка сервера при получении корзины" });
  }
});

// 🛒 Добавление товара в корзину
app.post("/cart", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Неверный формат productId" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    let cartItem = await CartItem.findOne({
      user: req.user._id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
    } else {
      cartItem = new CartItem({
        user: req.user._id,
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cartItem.save();
    await cartItem.populate("product");
    res.json({ message: "Товар добавлен в корзину", cartItem });
  } catch (err) {
    console.error("Ошибка при добавлении в корзину:", err);
    res
      .status(500)
      .json({ message: "Ошибка сервера при добавлении в корзину" });
  }
});

// 🛒 Обновление количества товара в корзине
app.put("/cart/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Неверный формат id" });
    }

    const cartItem = await CartItem.findOne({ _id: id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ message: "Элемент корзины не найден" });
    }

    if (quantity <= 0) {
      await CartItem.deleteOne({ _id: id });
      return res.json({ message: "Элемент корзины удален" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    await cartItem.populate("product");
    res.json({ message: "Корзина обновлена", cartItem });
  } catch (err) {
    console.error("Ошибка при обновлении корзины:", err);
    res.status(500).json({ message: "Ошибка сервера при обновлении корзины" });
  }
});

// 🛒 Удаление товара из корзины
app.delete("/cart/:id", authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Неверный формат id" });
    }

    const cartItem = await CartItem.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Элемент корзины не найден" });
    }

    res.json({ message: "Элемент корзины удален" });
  } catch (err) {
    console.error("Ошибка при удалении из корзины:", err);
    res.status(500).json({ message: "Ошибка сервера при удалении из корзины" });
  }
});

// 🛒 Очистка корзины
app.delete("/cart", authenticateUser, async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: "Корзина очищена" });
  } catch (err) {
    console.error("Ошибка при очистке корзины:", err);
    res.status(500).json({ message: "Ошибка сервера при очистке корзины" });
  }
});

// 📦 Создание заказа
app.post("/orders", authenticateUser, async (req, res) => {
  try {
    const {
      customer: {
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
        phone,
        paymentMethod,
      },
      items,
    } = req.body;

    // Валидация входных данных
    if (
      !firstName ||
      !lastName ||
      !address ||
      !postalCode ||
      !city ||
      !email ||
      !phone ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Некорректные данные заказа" });
    }

    // Проверка товаров
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Товар ${item.productId} не найден` });
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Создание заказа
    const newOrder = new Order({
      user: req.user._id,
      customer: {
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
        phone,
        paymentMethod,
      },
      items: orderItems,
      total,
      status: "pending",
    });

    await newOrder.save();
    res.json({ message: "Заказ успешно создан", order: newOrder });
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    res.status(500).json({ message: "Ошибка сервера при создании заказа" });
  }
});

// 📦 Получение всех заказов (только для admin)
app.get("/orders", authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username")
      .populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    res.status(500).json({ message: "Ошибка сервера при получении заказов" });
  }
});

// 📦 Удаление заказа (только для admin)
app.delete("/orders/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Заказ не найден" });
    }
    res.json({ message: "Заказ успешно удален" });
  } catch (err) {
    console.error("Ошибка при удалении заказа:", err);
    res.status(500).json({ message: "Ошибка сервера при удалении заказа" });
  }
});

app.listen(3001, () => console.log("Сервер запущен на http://localhost:3001"));
