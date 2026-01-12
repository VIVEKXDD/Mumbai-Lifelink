'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ForumPost } from '@/lib/types';
import { ThumbsDown, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Timestamp } from 'firebase/firestore';
import { ReplyDialog } from './reply-dialog';

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


export default function PostCard({ post, onVote }: { post: ForumPost, onVote: (postId: string, type: 'up' | 'down') => void }) {
  return (
    <Card className="hover:bg-accent/50 transition-colors flex">
      <div className="p-4 flex flex-col items-center justify-start space-y-1 bg-muted/50 rounded-l-lg">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onVote(post.id, 'up')}>
            <ThumbsUp className="h-5 w-5" />
        </Button>
        <span className="font-bold text-sm">{post.upvotes - post.downvotes}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onVote(post.id, 'down')}>
            <ThumbsDown className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>
                  {post.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-headline">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Posted by {post.author}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground line-clamp-2">{post.content}</p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground flex justify-between items-center">
            <ReplyDialog post={post}>
              <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply ({post.replies})
              </Button>
            </ReplyDialog>
          <span>{formatTimestamp(post.timestamp)}</span>
        </CardFooter>
      </div>
    </Card>
  );
}
