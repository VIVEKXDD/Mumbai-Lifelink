'use client';
import { useMemo } from 'react';
import { ForumPost } from '@/lib/types';
import PostCard from './post-card';
import { ImprovePostForm } from './improve-post-form';
import { useCollection, useFirestore, useUser, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, Timestamp, serverTimestamp } from 'firebase/firestore';

export default function ForumsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const postsQuery = useMemoFirebase(() => collection(firestore, 'forumThreads'), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(postsQuery);

  const sortedPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
  }, [posts]);

  const handleCreatePost = async (title: string, content: string) => {
    if (!user) {
        console.error("User not authenticated");
        return;
    }
    const newPost: Omit<ForumPost, 'id' | 'timestamp'> & { timestamp: any } = {
      title,
      content,
      userId: user.uid,
      timestamp: serverTimestamp(),
      author: user.displayName || 'Mumbaikar',
      avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
      replies: 0,
      upvotes: 0,
      downvotes: 0,
    };

    const forumThreadsRef = collection(firestore, 'forumThreads');
    await addDocumentNonBlocking(forumThreadsRef, newPost);
  };

  const handleVote = (postId: string, type: 'up' | 'down') => {
    if (!posts) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const postRef = doc(firestore, 'forumThreads', postId);
    if (type === 'up') {
      updateDocumentNonBlocking(postRef, { upvotes: post.upvotes + 1 });
    } else {
      updateDocumentNonBlocking(postRef, { downvotes: post.downvotes + 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headline">Neighborhood Forums</h2>
        <ImprovePostForm onCreatePost={handleCreatePost} />
      </div>
      <div className="space-y-4">
        {isLoading && <p>Loading posts...</p>}
        {sortedPosts && sortedPosts.map((post) => (
          <PostCard key={post.id} post={post} onVote={handleVote} />
        ))}
      </div>
    </div>
  );
}
