import { navConfig, NavItem } from "@/config/navConfig";
import Image from "next/image";
import Link from "next/link";
import MobileMenuToggle from "./MobileMenuToggle";

import { CartButton } from "./IconosMenu/CartButton";
import { UserMenu } from "./IconosMenu/UserMenu";


export default function Nav() {
  

  return (
    <nav className="sticky top-0 z-50 bg-navbarDefault shadow-navbar">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex-shrink-0">
            <Image
              src="https://res.cloudinary.com/dqiehommi/image/upload/v1737838109/imagen_2025-01-15_210703968-removebg-preview_pzguoo.png"
              alt="Logo"
              width={150}
              height={150}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation menu */}
          <ul className="hidden lg:flex items-center justify-center flex-1 text-xs xl:text-sm font-semibold uppercase text-white space-x-2 xl:space-x-4 mx-4">
            {navConfig.map((item: NavItem) => (
              <li key={item.path} className="relative group">
                <Link
                  href={item.path}
                  className="py-6 px-2 hover:text-slate-300 transition duration-300 whitespace-nowrap"
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

          {/* Right side icons */}
          <div className="flex items-center gap-1">
            <CartButton />
            <UserMenu 
            />
            {/* Menu hamburguesa solo visible hasta lg */}
            <div className="lg:hidden ml-1">
              <MobileMenuToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}