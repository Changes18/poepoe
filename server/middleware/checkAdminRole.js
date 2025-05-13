// /backend/middleware/checkAdminRole.js
import jwt from 'jsonwebtoken';

export const checkAdminRole = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    next();
  } catch (err) {
    console.error('Ошибка проверки роли', err);
    res.status(401).json({ message: 'Неверный токен' });
  }
};
