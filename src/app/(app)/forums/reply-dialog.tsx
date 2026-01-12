'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ThumbsDown, ThumbsUp, MessageSquare } from 'lucide-react';
import { ForumPost, ForumReply } from '@/lib/types';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function formatTimestamp(timestamp: Timestamp | Date | undefined): string {
    if (!timestamp) return '';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function ReplyDialogContent({ post }: { post: ForumPost }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const repliesRef = useMemoFirebase(() => collection(firestore, 'forumThreads', post.id, 'forumPosts'), [firestore, post.id]);
  const { data: replies, isLoading: areRepliesLoading } = useCollection<ForumReply>(repliesRef);

  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleReplyVote = (replyId: string, type: 'up' | 'down') => {
    if (!replies) return;
    const reply = replies.find(r => r.id === replyId);
    if(!reply) return;

    const replyRef = doc(firestore, 'forumThreads', post.id, 'forumPosts', replyId);
     if (type === 'up') {
        updateDocumentNonBlocking(replyRef, { upvotes: reply.upvotes + 1 });
    } else {
        updateDocumentNonBlocking(replyRef, { downvotes: reply.downvotes + 1 });
    }
  };
  
  const handleAddReply = async () => {
    if (!replyContent.trim() || !post || !user) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in and write something to reply.',
        });
        return;
    }

    setIsSubmitting(true);

    try {
        const newReply = {
            userId: user.uid,
            content: replyContent,
            timestamp: serverTimestamp(),
            author: user.displayName || 'Mumbaikar',
            avatar: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
            upvotes: 0,
            downvotes: 0,
        };
        
        const repliesCollectionRef = collection(firestore, 'forumThreads', post.id, 'forumPosts');
        await addDoc(repliesCollectionRef, newReply);

        const postDocRef = doc(firestore, 'forumThreads', post.id);
        updateDocumentNonBlocking(postDocRef, { replies: (post.replies || 0) + 1 });

        setReplyContent('');
        toast({
            title: 'Success!',
            description: 'Your reply has been posted.',
        });

    } catch (error: any) {
        console.error("Error adding reply:", error);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error.message || 'Could not post your reply. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
          <CardHeader>
              <h3 className="text-lg font-semibold">Leave a Reply</h3>
          </CardHeader>
          <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="reply-content" className="sr-only">Your comment</Label>
                  <Textarea 
                      id="reply-content" 
                      placeholder="Write your reply here..." 
                      className="min-h-[120px]" 
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                  />
              </div>
              <div className="flex justify-end">
                  <Button onClick={handleAddReply} disabled={!replyContent.trim() || isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <MessageSquare className="mr-2 h-4 w-4" />}
                      {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
              </div>
          </CardContent>
      </Card>

      <div className="space-y-2">
          <h2 className="text-xl font-bold font-headline">
              Replies ({replies?.length || 0})
          </h2>
          <Separator />
      </div>

      {areRepliesLoading && <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>}
      
      <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4">
        {replies && replies.map((reply) => (
          <Card key={reply.id} className="bg-muted/50">
              <div className="flex">
                  <div className="p-4 flex flex-col items-center justify-start space-y-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReplyVote(reply.id, 'up')}>
                          <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold text-xs">{reply.upvotes - reply.downvotes}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleReplyVote(reply.id, 'down')}>
                          <ThumbsDown className="h-4 w-4" />
                      </Button>
                  </div>
                  <div className="flex-1">
                      <CardHeader className="flex-row items-center gap-4 pb-2">
                          <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.avatar} alt={reply.author} />
                          <AvatarFallback>
                              {reply.author.charAt(0).toUpperCase()}
                          </AvatarFallback>
                          </Avatar>
                          <div className="text-sm text-muted-foreground">
                          <strong>{reply.author}</strong>
                          <span className="mx-2">•</span>
                          <span>{formatTimestamp(reply.timestamp)}</span>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <p>{reply.content}</p>
                      </CardContent>
                  </div>
            </div>
          </Card>
        ))}
        {!areRepliesLoading && (!replies || replies.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
              <p>No replies yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}


export function ReplyDialog({ post, children }: { post: ForumPost, children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{post.title}</DialogTitle>
           <DialogDescription>
              Posted by {post.author} • {formatTimestamp(post.timestamp)}
           </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-base leading-relaxed border-l-4 pl-4 italic text-muted-foreground">{post.content}</p>
        </div>
        <Separator />
        <ReplyDialogContent post={post} />
      </DialogContent>
    </Dialog>
  )
}
