import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <Navbar user={session?.user} />
            <div className="pt-16 flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
