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

    const role = (session.user as { role: string }).role;

    return (
        <div className="flex-1 flex bg-neutral-50 relative">
            <Sidebar role={role as "talent" | "client"} />
            <main className="pl-64 flex-1 transition-all duration-300">
                <div className="p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}