import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    schema: z.object({
        postId: z.number(),
        title: z.string(),
        description: z.string(),
        date: z.date(),
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };