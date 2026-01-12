'use server';

import {
  improveForumPost,
  type ImproveForumPostInput,
  type ImproveForumPostOutput,
} from '@/ai/flows/improve-forum-post';

export async function handleImprovePost(
  input: ImproveForumPostInput
): Promise<ImproveForumPostOutput> {
  return await improveForumPost(input);
}
