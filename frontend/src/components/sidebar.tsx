'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SideBar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const configRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        configRef.current &&
        !configRef.current.contains(event.target as Node)
      ) {
        setIsConfigOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function checkSidebarState() {
      const width = window.innerWidth;

      if (width < 740) {
        setIsCollapsed(true);
      } else {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        } else {
          setIsCollapsed(false);
        }
      }
    }

    checkSidebarState();
    window.addEventListener("resize", checkSidebarState);
    return () => window.removeEventListener("resize", checkSidebarState);
  }, []);

  useEffect(() => {
    if (isCollapsed !== null && window.innerWidth >= 740) {
      localStorage.setItem("sidebar-collapsed", isCollapsed.toString());
    }
  }, [isCollapsed]);

  if (isCollapsed === null) return null;

  async function logout() {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-blue-500 text-white transition-all duration-300 flex flex-col justify-between z-10 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div>
        <div className={`flex items-center p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && <h1 className="text-xl font-bold">Menu</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-sm px-1 py-1 rounded hover:bg-blue-400 flex items-center ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
            aria-label="Toggle menu"
          >
            <span className="material-icons text-[32px]">
              {isCollapsed ? "menu" : "close"}
            </span>
          </button>
        </div>

        <nav className="p-4">
          <ul>
            <li
              className={`hover:bg-blue-400 p-2 rounded cursor-pointer flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <Link
                href="/user/home"
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                <span className="material-icons text-[34px]">home</span>
                {!isCollapsed && <span>Início</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="p-4">
          <ul>
            <li
              className={`hover:bg-blue-400 p-2 rounded cursor-pointer flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <Link
                href="/user/operation"
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                <span className="material-icons text-[34px]">store</span>
                {!isCollapsed && <span>Operação</span>}
              </Link>
            </li>
          </ul>          
        </nav>

        <nav className="p-4">
          <ul>
            <li
              className={`hover:bg-blue-400 p-2 rounded cursor-pointer flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <Link
                href="/user/stock"
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                <span className="material-icons text-[34px]">inventory</span>
                {!isCollapsed && <span>Estoque</span>}
              </Link>
            </li>
          </ul>          
        </nav>

        <nav className="p-4">
          <ul>
            <li
              className={`mb-2 hover:bg-blue-400 p-2 rounded cursor-pointer flex items-center ${
                isCollapsed ? "justify-center" : "gap-3"
              }`}
            >
              <Link
                href="/user/logs"
                className={`flex items-center ${
                  isCollapsed ? "justify-center w-full" : "gap-3"
                }`}
              >
                <span className="material-icons text-[34px]">description</span>
                {!isCollapsed && <span>Logs</span>}
              </Link>
            </li>
          </ul>          
        </nav>
        
      </div>

      <div className="relative p-4" ref={configRef}>
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className={`w-full hover:bg-blue-400 px-2 py-2 rounded flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
          aria-haspopup="true"
          aria-expanded={isConfigOpen}
        >
          <span className="material-icons text-[32px]">settings</span>
          {!isCollapsed && <span>Configurações</span>}
        </button>

        {isConfigOpen && (
          <ul
            className={`absolute bg-blue-500 border border-amber-50 rounded shadow-lg z-30
            ${isCollapsed ? "left-14 bottom-12 w-48" : "left-4 bottom-13 w-[85%]"}`}
          >
            <li className="hover:bg-blue-400 p-2 rounded cursor-pointer">
              <Link href="/configuracoes">Configurações</Link>
            </li>
            <li className="hover:bg-blue-400 p-2 rounded cursor-pointer">
              <Link href="/perfil">Perfil</Link>
            </li>
            <li
              onClick={logout}
              className="hover:bg-blue-400 p-2 rounded cursor-pointer"
            >
              Sair
            </li>
          </ul>
        )}
      </div>
    </aside>
    
    
  );
}
