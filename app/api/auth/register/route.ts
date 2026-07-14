import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Semua field wajib diisi" },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userId = await fetchMutation(api.user.create, {
            name,
            email,
            emailVerified: Date.now(),
            passwordHash: hashedPassword,
        });

        return NextResponse.json(
            { message: "Registrasi berhasil", userId },
            { status: 201 },
        );
    } catch (error: any) {
        if (error.message?.includes("already exists")) {
            return NextResponse.json(
                { error: "Email sudah terdaftar" },
                { status: 409 },
            );
        }
        return NextResponse.json(
            { error: "Terjadi kesalahan" },
            { status: 500 },
        );
    }
}