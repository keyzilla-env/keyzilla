import { mutation } from "./_generated/server";

 export const insertUser = mutation({
     
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const user = await ctx.db.insert("users", {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            name: identity?.name as string,
            email: identity?.email as string,
        });
        return user;
    }
 })