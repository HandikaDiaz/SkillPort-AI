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
            <Navbar
                user={
                    session?.user
                        ? {
                              id: (session.user as any).id ?? null,
                              name: session.user.name,
                              email: session.user.email,
                              image: session.user.image,
                              role: (session.user as any).role ?? null,
                          }
                        : undefined
                }
            />
            <div className="pt-16 flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
