"use client";

import { usePathname } from "next/navigation";

const excludesRoutes = ["/", "/Login2", "/Registro"];

export default function ExcludedWrapped({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  if (!excludesRoutes.includes(path)) return children;
}
