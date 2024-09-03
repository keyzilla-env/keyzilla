import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProjects = query({
    args: { organizationId: v.string(),
         userId: v.string(),
         email: v.string() 
     },
    handler: async (ctx, args) => {
       if(!args.userId && !args.email){
        throw new Error("UserId or Email is required");
        }
        const userId = args.userId; 
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

export const getApiKeys = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        if (!args.projectId) return [];  
        return await ctx.db
            .query("apiKeys")
            .filter((q) => q.eq(q.field("projectId"), args.projectId))
            .collect();
    }
});



