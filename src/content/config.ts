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

const comments = defineCollection({
    type: 'data',
    schema: z.object({
        postSlug: z.string(),
        author: z.string(),
        message: z.string(),
        date: z.string(),
    }),
});

export const collections = { blog, comments };