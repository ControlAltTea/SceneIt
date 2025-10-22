import { useState, useEffect } from "react";

export default function Header() {
  // For the header
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll threshold for header style
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 8;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header
      id="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-[width,margin,padding,transform,background-color,border-radius] duration-700 ease-in-out ${isScrolled
        ? "w-[70%] text-gray-100 mt-7 px-10 py-4 bg-gradient-to-b from-gray-500 to-gray-300 shadow-lg shadow-gray-900/30 dark:shadow-gray-100/70 rounded-full mx-auto"
        : "w-full backdrop-blur-sm text-gray-900 py-8 px-20 bg-transparent"
        }`}
    >
      <div className="flex justify-between items-center">
        <div className="text-4xl font-bold text-gray-700 dark:text-white cursor-pointer">
            <img src='/sceneit.png' width={35} alt="SceneIt" />
        </div>
        <nav
          className={`${isScrolled ? "text-gray-200 dark:text-gray-300" : "text-gray-700 dark:text-gray-200"}`}
        >
          <ul className="flex space-x-8 items-center text-gray-700 dark:text-gray-300 transition-all duration-200">
            <li>
              <a
                className="font-semibold text-lg cursor-pointer hover:underline"
              >
                Log In
              </a>
            </li>
            <li>
              <a
                className="font-semibold text-lg cursor-pointer hover:underline"
              >
                Create an Account
              </a>
            </li>
            <li>
              <a
                className="font-semibold text-lg cursor-pointer hover:underline"
              >
                Shows
              </a>
            </li>
            <li>
              <a
                className="font-semibold text-lg cursor-pointer hover:underline"
              >
                Playlist
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}