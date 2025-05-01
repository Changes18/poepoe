import Logo from "../assets/logo.png";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white text-black shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <img src={Logo} alt="Лого" className="w-14" />
          <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wider">
            <a href="#" className="hover:text-gray-500 transition duration-200">
              Discover
            </a>
            <a href="#" className="hover:text-gray-500 transition duration-200">
              Creators
            </a>
            <a href="#" className="hover:text-gray-500 transition duration-200">
              Sell
            </a>
            <a href="#" className="hover:text-gray-500 transition duration-200">
              Stats
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Найти обувъ"
              className="pl-10 pr-4 py-2 rounded-md bg-gray-100 text-sm text-gray-700 focus:outline-none focus:ring-0"
            />
          </div>
          <button className="bg-black text-white px-5 py-2 rounded-md text-sm hover:bg-gray-800 transition">
            Войти
          </button>
        </div>
      </div>
    </header>
  );
}
