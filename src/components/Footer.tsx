export default function Ft() {
  return (
    <footer className="bg-gray-950 text-white px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* О нас */}
        <div>
          <h2 className="text-xl font-semibold mb-4">О нас</h2>
          <p className="text-sm text-gray-400">
            Мы создаём лучшие цифровые решения. Следите за нами в соцсетях и
            оставайтесь на связи!
          </p>
        </div>

        {/* Обратная связь — по центру */}
        <div className="flex flex-col items-start md:items-center md:justify-center text-left md:text-center">
          <h2 className="text-xl font-semibold mb-4">Обратная связь</h2>
          <p className="text-sm text-gray-400 mb-4 max-w-xs">
            Есть вопрос или предложение? Мы всегда открыты к диалогу.
          </p>
          <button className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 transition rounded-md text-white">
            Связаться с нами
          </button>
        </div>

        {/* Ссылки */}
        <div className="text-left md:text-right">
          <h2 className="text-xl font-semibold mb-4">Ссылки</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="/" className="hover:text-white transition">
                Главная
              </a>
            </li>
            <li>
              <a href="" className="hover:text-white transition">
                О нас
              </a>
            </li>
            <li>
              <a href="/page" className="hover:text-white transition">
                Каталог
              </a>
            </li>
            <li>
              <a href="/page" className="hover:text-white transition">
                Контакты
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
