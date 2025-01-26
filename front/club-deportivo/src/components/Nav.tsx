import { navConfig, NavItem } from "@/config/navConfig";
import Image from "next/image";
import Link from "next/link";
import MobileMenuToggle from "./MobileMenuToggle";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-navbarDefault shadow-navbar">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/home" className="py-4">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737838109/imagen_2025-01-15_210703968-removebg-preview_pzguoo.png"
              alt="Logo"
              width={150}
              height={150}
              className="h-16 w-auto max-w-[200] min-w-[100]"
            />
          </Link>

          {/* Desktop Navigation menu */}
          <ul className="hidden md:flex items-center justify-center flex-grow text-sm font-semibold uppercase text-white">
            {navConfig.map((item: NavItem) => (
              <li key={item.path} className="relative group mx-4">
                <Link
                  href={item.path}
                  className="py-6 hover:text-slate-300 transition duration-300"
                >
                  <span className="relative">
                    {item.text}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
                {item.subItems && (
                  <div className="absolute left-0 top-full z-50 hidden group-hover:block pt-2">
                    <ul className="bg-white text-black shadow-lg rounded-md min-w-[200px]">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            href={subItem.path}
                            className="block px-4 py-2 hover:bg-gray-200 whitespace-nowrap"
                          >
                            {subItem.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <MobileMenuToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
