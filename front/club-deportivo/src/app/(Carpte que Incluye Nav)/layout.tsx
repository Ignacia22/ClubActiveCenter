import Nav from "@/components/Nav";

export default function OrganizedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow pt-16">{children}</div>
      <div className="py-4"></div>
    </div>
  );
}
