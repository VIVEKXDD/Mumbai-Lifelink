'use server';

/**
 * @fileOverview An AI agent that suggests improvements to forum posts.
 *
 * - improveForumPost - A function that handles the forum post improvement process.
 * - ImproveForumPostInput - The input type for the improveForumPost function.
 * - ImproveForumPostOutput - The return type for the improveForumPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveForumPostInputSchema = z.object({
  post: z.string().describe('The forum post to be improved.'),
});
export type ImproveForumPostInput = z.infer<typeof ImproveForumPostInputSchema>;

const ImproveForumPostOutputSchema = z.object({
  improvedPost: z.string().describe('The improved forum post.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improvement.'),
});
export type ImproveForumPostOutput = z.infer<typeof ImproveForumPostOutputSchema>;

export async function improveForumPost(input: ImproveForumPostInput): Promise<ImproveForumPostOutput> {
  return improveForumPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveForumPostPrompt',
  input: {schema: ImproveForumPostInputSchema},
  output: {schema: ImproveForumPostOutputSchema},
  prompt: `You are an AI assistant designed to help users improve their forum posts. Analyze the provided forum post and suggest improvements to make it more engaging and understandable. Provide specific suggestions and an improved version of the post.

Forum Post:
{{post}}

Instructions: Provide an improved version of the forum post, along with a list of specific suggestions that were applied to improve the post. The improvedPost field should be the full rewritten post, and the suggestions field should be a bulleted list of changes that you made.

Output both the improved post, and also the suggestions you made.
`,
});

const improveForumPostFlow = ai.defineFlow(
  {
    name: 'improveForumPostFlow',
    inputSchema: ImproveForumPostInputSchema,
    outputSchema: ImproveForumPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
