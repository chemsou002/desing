import { createRouter, publicQuery } from "./middleware";
import { createGoogleOAuthHandler, findUserByGoogleId, upsertGoogleUser } from "./google-auth";
import { z } from "zod";

export const googleAuthRouter = createRouter({
  login: publicQuery
    .input(z.object({ idToken: z.string() }))
    .mutation(async ({ input }) => {
      // This is handled by the HTTP endpoint in boot.ts
      return { success: true };
    }),
});
