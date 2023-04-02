import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "n/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/dist/api";
import { TRPCError } from "@trpc/server";


// This is the shape of the data that we expect to receive from the client
const filterdUserForClient = ( user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  }
}

// This is the exported router that will be used in the API
export const postsRouter = createTRPCRouter({

  // This is the a get request that will return all the posts
  getAll: publicProcedure.query( async({ ctx }) => {
    const posts= await ctx.prisma.post.findMany({
      take: 100,
   
    });

    // This is the clerk client that will be used to get the user data from the database and filter it
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
      })
    ).map(filterdUserForClient);


    console.log("users ->", users)
    
    // This is the data that will be returned to the client
    return posts.map((post) => {
      
      // This is the author of the post
      const author = users.find((user) => user.id === post.authorId)

      // If the author is not found then throw an error
      if (!author || !author.username) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Author for post not found',
        })
      }

      console.log("author ->", author.username)

      // Return the post and the author
      return {
      post,
      author: {
        ...author,
        username: author.username,
      }
    }})

  }),
});
 