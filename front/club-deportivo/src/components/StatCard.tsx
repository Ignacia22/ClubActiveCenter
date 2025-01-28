export default function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
    return (
      <div className="bg-gray-300 p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xl">{value}</p>
          </div>
        </div>
      </div>
    );
}
  