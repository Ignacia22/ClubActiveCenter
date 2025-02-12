import InfoHome from "@/components/HomeInfo/InfoHome";
import ChatComponent from "../../components/ChatComponent";

export default function Home() {
  return (
    <main>
      {/* Container Section */}
      <div className="hero text-white">
        {/* Info Section */}
        <InfoHome />
      </div>
    </main>
  );
}
