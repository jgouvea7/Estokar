"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function SideBar({ isCollapsed, setIsCollapsed }: SideBarProps) {
    const router = useRouter();
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const configRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (configRef.current && !configRef.current.contains(event.target as Node)) {
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
    }, [setIsCollapsed]);

    useEffect(() => {
      if (window.innerWidth >= 740) {
        localStorage.setItem("sidebar-collapsed", isCollapsed.toString());
      }
    }, [isCollapsed]);


    async function logout() {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }

    function MenuItem({
      href,
      icon,
      label,
    }: {
      href: string;
      icon: string;
      label: string;
    }) {
      return (
        <Link href={href} className="flex items-center cursor-pointer hover:bg-sky-800 p-1.5 rounded transition-colors duration-150"
        >
          <span className="material-icons text-[34px] flex-shrink-0">{icon}</span>
          <div
            style={{
              maxWidth: isCollapsed ? 0 : 125,
              overflow: "hidden",
              marginLeft: isCollapsed ? 0 : 10,
              transition: "max-width 0.5s ease, margin-left 0.5s ease, opacity 0.5s ease",
              opacity: isCollapsed ? 0 : 1,
            }}
            >
              <span
              style={{
                display: "inline-block",
                whiteSpace: "nowrap"
              }}>
                {label}
              </span>
            </div>
        </Link>
      );
    }

    return (
      <aside
        className={`fixed left-0 top-0 h-screen bg-sky-700 text-white transition-all duration-300 flex flex-col justify-between z-10 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        <div>
          <div 
            className={`flex items-center p-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && <h1 className="text-xl font-bold">Menu</h1>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`text-sm px-1 py-1 rounded hover:bg-sky-800 flex items-center`}
              aria-label="Toggle menu"
              type="button"
            >
              <span className="material-icons text-[32px] transition-all duration-300">{isCollapsed ? "menu" : "close"}</span>
            </button>
          </div>

          <nav className="p-4">
            <ul>
              <MenuItem href="/user/home" icon="home" label="Início" />
            </ul>
          </nav>

          <nav className="p-4">
            <ul>
              <MenuItem href="/user/update-stock" icon="autorenew" label="Atualizar estoque" />
            </ul>
          </nav>

          <nav className="p-4">
            <ul>
              <MenuItem href="/user/stock" icon="inventory" label="Estoque" />
            </ul>
          </nav>

          <nav className="p-4">
            <ul>
              <MenuItem href="/user/logs" icon="description" label="Logs" />
            </ul>
          </nav>
        </div>

        <div className="relative p-4" ref={configRef}>
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="w-full hover:bg-sky-800 px-1 py-1 rounded flex items-center"
            aria-haspopup="true"
            aria-expanded={isConfigOpen}
            type="button"
          >
            <span className="material-icons">settings</span>
            <span
              style={{
                maxWidth: isCollapsed ? 0 : 110,
                overflow: "hidden",
                whiteSpace: "nowrap",
                marginLeft: isCollapsed ? 0 : 10,
                transition: "max-width 0.5s ease, margin-left 0.5s ease, opacity 0.5s ease",
                opacity: isCollapsed ? 0 : 1,
                display: "inline-block",
              }}
            >
              Configurações
            </span>
          </button>

          {isConfigOpen && (
            <ul
              className={`absolute bg-sky-700 border border-sky-900 rounded shadow-lg z-30 transition-colors duration-150 ${
                isCollapsed ? "left-14 bottom-12 w-48" : "left-4 bottom-13 w-[85%]"
              }`}
            >
              <Link href="/user/config" className="flex items-center hover:bg-sky-800 p-2 rounded cursor-pointer transition-colors duration-150">
                <span className="material-icons text-[34px] flex-shrink-0">info</span>
                <span className="ml-3">Geral</span>
              </Link>

              <Link href="/user/profile" className="flex items-center hover:bg-sky-800 p-2 rounded cursor-pointer transition-colors duration-150">
                <span className="material-icons text-[34px] flex-shrink-0">person</span>
                <span className="ml-3">Perfil</span>
              </Link>

              <li
                onClick={logout}
                className="flex items-center hover:bg-sky-800 p-2 rounded cursor-pointe hover:text-red-500 transition-colors duration-150"
                style={{ gap: "10px", cursor: "pointer" }}
              >
                <span className="material-icons text-[34px] flex-shrink-0">logout</span>
                <span>Sair</span>
              </li>
            </ul>
          )}
        </div>
      </aside>
    );
}