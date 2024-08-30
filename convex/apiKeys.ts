import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getApiKeys = query({
    args: { projectId: v.string() },
    handler: async (ctx, args) => {
        if (!args.projectId) return [];
        return await ctx.db
            .query("apiKeys")
            .filter((q) => q.eq(q.field("projectId"), args.projectId))
            .collect();
    }
});

export const createApiKey = mutation({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert("apiKeys", {
            projectId: args.projectId,
            apiKey: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
        });
    }
});

export const deleteApiKey = mutation({
    args: { apiKeyId: v.id("apiKeys") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.apiKeyId);
    }
});
