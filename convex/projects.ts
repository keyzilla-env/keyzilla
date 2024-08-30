import { auth } from "@clerk/nextjs/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { QueryCtx } from "./_generated/server";

export const createProject = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        apiKeys: v.array(v.string()),
        organizationId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;


        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            description: args.description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            apiKeys: [],
            userId: userId,
            userProfile: identity.pictureUrl as string,
            userName: identity.name as string,
            organizationId: args.organizationId || undefined, // Use null for personal projects
        });

        const apiKeyIds = await Promise.all(args.apiKeys.map(async (apiKey) => {
            return await ctx.db.insert("apiKeys", {
                projectId,
                apiKey,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }));

        await ctx.db.patch(projectId, { apiKeys: apiKeyIds });

        return projectId;
    }
})


export const getProjects = query({
    args: { organizationId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId);
                } else {
                    return q.and(
                        q.eq(q.field("userId"), userId),
                        q.or(
                            q.eq(q.field("organizationId"), undefined),
                            q.eq(q.field("organizationId"), null)
                        )
                    );
                }
            }).order("desc")
            .collect();
    },
})

export const getProjectById = query({
    args: {
        name: v.string(),
        organizationId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        let project;
        if (args.organizationId) {
            project = await ctx.db.query("projects")
                .filter((q) => q.eq(q.field("name"), args.name) && q.eq(q.field("organizationId"), args.organizationId))
                .first();
        } else {
            const userId = identity.subject;
            project = await ctx.db.query("projects")
                .filter((q) => q.eq(q.field("name"), args.name) && q.eq(q.field("userId"), userId))
                .first();
        }
        return project;
    }
})

export const addApiKey = mutation({
    args: {
        projectId: v.id("projects"),
        apiKey: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("apiKeys", {
            projectId: args.projectId,
            apiKey: args.apiKey,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }
})
export const removeApiKey = mutation({
    args: {
        projectId: v.id("projects"),
        apiKey: v.string(),
    },
    handler: async (ctx, args) => {
        const apiKeyToDelete = await ctx.db
            .query("apiKeys")
            .filter((q) =>
                q.and(
                    q.eq(q.field("projectId"), args.projectId),
                    q.eq(q.field("apiKey"), args.apiKey)
                )
            )
            .first();

        if (apiKeyToDelete) {
            await ctx.db.delete(apiKeyToDelete._id);
        }
    }
})


export const getPersonalProjects = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});