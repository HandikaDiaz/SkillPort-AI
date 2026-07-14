import LandingPage from "@/components/pages/LandingPage";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log('====================================');
  console.log("session", session);
  console.log('====================================');
  return (
    <div className="min-h-screen bg-white">
      <LandingPage />
    </div>
  );
}
