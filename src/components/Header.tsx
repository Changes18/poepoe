import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const user = localStorage.getItem("user");

    setIsAuth(auth === "true");

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAdmin(parsedUser.role === "admin");
      } catch (err) {
        console.error("Ошибка при парсинге user из localStorage:", err);
      }
    }
  }, []);

  const handleClick = () => {
    navigate(isAuth ? "/account" : "/login");
  };

  return (
    <header className="bg-white text-black shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer mr-10" onClick={() => navigate("/")}>
            <img src={Logo} alt="Лого" className="w-10" />
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-normal uppercase tracking-wider">
            <span
              className="hover:text-gray-500 transition duration-200 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Главная
            </span>
            <span
              className="hover:text-gray-500 transition duration-200 cursor-pointer"
              onClick={() => navigate("/page")}
            >
              Каталог
            </span>
            <span
              className="hover:text-gray-500 transition duration-200 cursor-pointer"
              onClick={() => navigate("/bask")}
            >
              Корзина
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Кнопки */}
          <span className="hidden sm:inline-block" onClick={handleClick}>
            {isAuth ? (
              <button
                onClick={() => navigate("/account")}
                className="bg-black text-white px-5 py-[6px] rounded-md text-md hover:bg-gray-800 transition"
              >
                Аккаунт
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-black text-white px-5 py-[6px] rounded-md text-md hover:bg-gray-800 transition"
              >
                Войти
              </button>
            )}
          </span>

          {isAuth && isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="hidden sm:inline-block bg-gray-700 text-white px-5 py-[6px] rounded-md text-md hover:bg-gray-600 transition"
            >
              admin
            </button>
          )}

          {/* Бургер-меню */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-4 space-y-4 shadow-lg">
          <div
            className="text-sm uppercase cursor-pointer hover:text-gray-500"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Главная
          </div>
          <div
            className="text-sm uppercase cursor-pointer hover:text-gray-500"
            onClick={() => {
              navigate("/page");
              setMenuOpen(false);
            }}
          >
            Каталог
          </div>
          <div
            className="text-sm uppercase cursor-pointer hover:text-gray-500"
            onClick={() => {
              navigate("/bask");
              setMenuOpen(false);
            }}
          >
            Корзина
          </div>
          <div>
            <button
              onClick={() => {
                handleClick();
                setMenuOpen(false);
              }}
              className="w-full bg-black text-white px-5 py-2 rounded-md text-md hover:bg-gray-800 transition"
            >
              {isAuth ? "Аккаунт" : "Войти"}
            </button>
          </div>
          {isAuth && isAdmin && (
            <div>
              <button
                onClick={() => {
                  navigate("/admin");
                  setMenuOpen(false);
                }}
                className="w-full bg-gray-700 text-white px-5 py-2 rounded-md text-md hover:bg-gray-600 transition"
              >
                admin
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
