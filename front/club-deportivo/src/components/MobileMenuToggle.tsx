"use client";

import { useState } from "react";
import { navConfig, NavItem } from "@/config/navConfig";
import Link from "next/link";

export default function MobileMenuToggle() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        // Cerrar todos los submenús al cerrar el menú principal
        if (isMenuOpen) {
            setOpenSubMenu(null);
        }
    };

    const toggleSubMenu = (path: string) => {
        // Si el submenú ya está abierto, lo cerramos
        if (openSubMenu === path) {
            setOpenSubMenu(null);
        } else {
            // Si es un submenú diferente, lo abrimos
            setOpenSubMenu(path);
        }
    };

    return (
        <>
            <button 
                onClick={toggleMenu} 
                className="cursor-pointer text-white text-2xl focus:outline-none"
                aria-label="Toggle mobile menu"
            >
                {isMenuOpen ? '✕' : '☰'}
            </button>

            {isMenuOpen && (
                <ul className="absolute left-[1em] right-0 top-full bg-navbarDefault flex flex-col space-y-4 py-4 text-sm font-semibold uppercase text-white">
                    {navConfig.map((item: NavItem) => (
                        <li key={item.path} className="px-4">
                            <div className="flex justify-between items-center">
                                <Link 
                                    href={item.path} 
                                    className="block py-2 hover:text-slate-300 transition duration-300 flex-grow"
                                    onClick={toggleMenu}
                                >
                                    {item.text}
                                </Link>
                                {item.subItems && (
                                    <button 
                                        onClick={() => toggleSubMenu(item.path)}
                                        className="p-2 focus:outline-none"
                                        aria-label={`Toggle ${item.text} submenu`}
                                    >
                                        {openSubMenu === item.path ? '▼' : '►'}
                                    </button>
                                )}
                            </div>
                            
                            {item.subItems && openSubMenu === item.path && (
                                <ul className="pl-4 mt-2 space-y-2">
                                    {item.subItems.map((subItem) => (
                                        <li key={subItem.path}>
                                            <Link 
                                                href={subItem.path} 
                                                className="block py-1 hover:text-slate-300 transition duration-300"
                                                onClick={toggleMenu}
                                            >
                                                {subItem.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}