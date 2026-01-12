'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { handleImprovePost } from './actions';
import type { ImproveForumPostOutput } from '@/ai/flows/improve-forum-post';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export function ImprovePostForm({ onCreatePost }: { onCreatePost: (title: string, content: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<ImproveForumPostOutput | null>(
    null
  );
  const { toast } = useToast();

  const onImprove = async () => {
    if (!content) return;
    setIsImproving(true);
    setSuggestion(null);
    try {
      const result = await handleImprovePost({ post: content });
      setSuggestion(result);
    } catch (error) {
      console.error('Failed to improve post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not get AI suggestions. Please try again.',
      });
    } finally {
      setIsImproving(false);
    }
  };

  const useSuggestion = () => {
    if (suggestion) {
      setContent(suggestion.improvedPost);
      setSuggestion(null);
    }
  };

  const createPost = () => {
    onCreatePost(title, content);
    toast({
      title: 'Post Created!',
      description: 'Your new post has been added to the forum.',
    });
    setOpen(false);
    setTitle('');
    setContent('');
    setSuggestion(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wand2 className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Create a New Post</DialogTitle>
          <DialogDescription>
            Share something with your neighborhood. Use the AI assistant to
            improve your post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A catchy title for your post"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[200px]"
              />
            </div>
            <Button
              onClick={onImprove}
              disabled={isImproving || !content}
              className="w-full"
            >
              {isImproving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Improve with AI
            </Button>
          </div>
          <div className="flex flex-col">
            <Label className="mb-2">AI Suggestions</Label>
            <div className="border rounded-lg bg-muted/50 p-4 flex-1 h-full min-h-[250px] relative">
              {isImproving && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {suggestion ? (
                <div className="space-y-4 animate-in fade-in-50">
                  <div>
                    <h4 className="font-semibold mb-2">Improved Post:</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "{suggestion.improvedPost}"
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Suggestions:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {suggestion.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={useSuggestion}
                    size="sm"
                    className="w-full mt-4"
                  >
                    Use this Suggestion
                  </Button>
                </div>
              ) : (
                !isImproving && (
                  <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                    <Sparkles className="w-8 h-8 mb-2" />
                    <p>AI suggestions will appear here.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={createPost}
            disabled={!title || !content}
          >
            Create Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
