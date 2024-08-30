import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Toaster } from "@/components/ui/sonner"
export const metadata: Metadata = {
    title: "Keyzilla | Dashboard",
    description: "Keyzilla api key management AND Security tool",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster closeButton />
            <DashboardHeader />

            {children}
        </ThemeProvider>

    );
}
