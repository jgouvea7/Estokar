"use client";

import { useState, useEffect } from "react";
import SideBar from "@/components/sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    }

    handleResize(); // inicializa no mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full relative">
      <SideBar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        className={`transition-transform duration-300 ${
          isMobile
            ? `fixed top-0 left-0 h-full z-50 transform ${
                isCollapsed ? "-translate-x-full" : "translate-x-0"
              }`
            : "relative"
        }`}
      />

      <main
        className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
          !isMobile ? (isCollapsed ? "ml-16" : "ml-64") : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
