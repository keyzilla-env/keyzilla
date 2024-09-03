import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Find user by email
        const users = await clerkClient().users.getUserList({ emailAddress: [email] });
        
        if (!users.data || users.data.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = users.data[0];
        
        if (!user || !user.id) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 500 });
        }

        const organizations = await clerkClient.users.getOrganizationMembershipList({ userId: user.id });

        console.log("Raw organizations data:", organizations); // Add this line for debugging

        const orgData = organizations.data && organizations.data.length > 0
            ? organizations.data.map(org => ({
                id: org.organization.id,
                name: org.organization.name,
                role: org.role 
            }))
            : [];

        return NextResponse.json({
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress || null,
            organizations: orgData
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 });
    }
}
