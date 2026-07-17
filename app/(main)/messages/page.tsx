"use client";

import { useSession } from "next-auth/react";
import ChatLayout from "@/components/layouts/ChatLayout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessagesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
            </div>
        );
    }

    const role = session?.user?.role || "talent";

    return (
        <div className="flex-1 flex flex-col p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
            <ChatLayout userRole={role as "client" | "talent"} />
        </div>
    );
}
