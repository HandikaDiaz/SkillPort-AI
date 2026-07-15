import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/navbar/Sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const role = (session.user as any)?.role ?? "talent";

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar user={session.user} />
            <Sidebar role={role as "talent" | "client"} />
            <main className="pt-16 pl-64 transition-all duration-300">
                <div className="p-6 lg:p-8 max-w-[1440px]">
                    {children}
                </div>
            </main>
        </div>
    );
}