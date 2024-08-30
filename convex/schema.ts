import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    projects: defineTable({
        name: v.string(),
        description: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
        apiKeys: v.array(v.id("apiKeys")),
        userId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        userProfile: v.optional(v.string()),
        userName: v.optional(v.string()),
    }),
    apiKeys: defineTable({
        projectId: v.id("projects"),
        apiKey: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
});

