"use client"
import Link from "next/link"

import { useUser } from "@clerk/nextjs"
import { useState } from "react"
export function Settings({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState("general")
    const { user } = useUser()
    if (!user) return null
    return (
        <div className="flex min-h-screen w-full flex-col">

            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav
                        className="grid gap-4 text-sm text-muted-foreground  "
                    >
                        <Link href="#" className={`font-semibold   ${activeTab === "general" ? "text-primary" : ""}`} onClick={() => setActiveTab("general")}>
                            General
                        </Link>
                        <Link href="#" className={`font-semibold ${activeTab === "security" ? "text-primary" : ""}`} onClick={() => setActiveTab("security")}    >Security</Link>
                        <Link href="#" className={`font-semibold ${activeTab === "profile" ? "text-primary" : ""}`} onClick={() => setActiveTab("profile")}>Profile</Link>
                        <Link href="/dashboard/settings/organizations" className={`font-semibold  ${activeTab === "organizations" ? "text-primary" : ""}`} onClick={() => setActiveTab("organizations")}>Organizations</Link>
                        <Link href="#" className={`font-semibold  ${activeTab === "support" ? "text-primary" : ""}`} onClick={() => setActiveTab("support")}>Support</Link>

                    </nav>
                    <div>{children}</div>
                </div>
            </main>

        </div>
    )
}
