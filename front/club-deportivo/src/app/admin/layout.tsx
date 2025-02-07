import Sidebar from '@/components/InfoAdmin/Sidebar';

export default function AdminDashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar />
      
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}