"use client";
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

// Suppress React 19 false-positive warning about next-themes' inline <script> tag.
// next-themes injects a script to prevent FOUC; React 19 incorrectly flags this.
// See: https://github.com/pacocoursey/next-themes/issues/329
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const origError = console.error;
    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === "string" &&
            args[0].includes("Encountered a script tag")
        ) {
            return;
        }
        origError.apply(console, args);
    };
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme={false}>
            {children}
        </ThemeProvider>
    );
}