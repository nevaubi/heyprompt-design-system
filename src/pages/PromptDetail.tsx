import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { PromptCard } from '@/components/features/PromptCard';
import { RatingComponent } from '@/components/features/RatingComponent';
import { CommentsSection } from '@/components/features/CommentsSection';
import { useAuth } from '@/contexts/AuthContext';
import { usePromptActions } from '@/hooks/usePromptActions';
import { supabase } from '@/integrations/supabase/client';
import { 
  Copy, 
  Heart, 
  Bookmark, 
  Share2, 
  Twitter, 
  Link as LinkIcon,
  Flag,
  Edit,
  Star,
  Eye,
  MessageCircle,
  Clock,
  Zap,
  Brain,
  Sparkles,
  Code,
  ArrowLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PromptDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  tokenUsage: 'low' | 'medium' | 'high';
  rating: number;
  totalRatings: number;
  saves: number;
  copies: number;
  views: number;
  comments: number;
  likes: number;
  tags: string[];
  aiModels: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    bio?: string;
  };
  isBookmarked: boolean;
  isLiked: boolean;
  examples?: {
    input: string;
    output: string;
  }[];
}

interface SimilarPrompt {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  saves: number;
  copies: number;
  comments: number;
  likes: number;
  whoFor: string[];
  aiModels: string[];
  tokenUsage: 'Low' | 'Medium' | 'High';
  author: {
    name: string;
    avatar?: string;
  };
  isBookmarked: boolean;
  isLiked: boolean;
}

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);
  const [similarPrompts, setSimilarPrompts] = useState<SimilarPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showRemixEditor, setShowRemixEditor] = useState(false);

  const {
    handleCopyPrompt,
    handleLikePrompt,
    handleBookmarkPrompt,
  } = usePromptActions();

  useEffect(() => {
    if (id) {
      fetchPromptDetails();
      fetchSimilarPrompts();
    }
  }, [id]);

  const fetchPromptDetails = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement actual API call
      // Mock data for now
      const mockPrompt: PromptDetail = {
        id: id!,
        title: 'Advanced Code Review Assistant',
        description: 'A comprehensive prompt designed to help you conduct thorough, professional code reviews with focus on security, performance, and best practices.',
        content: `Please review the following code and provide detailed feedback on:

1. **Code Quality & Style**
   - Adherence to coding standards
   - Readability and maintainability
   - Naming conventions

2. **Security Considerations**
   - Potential security vulnerabilities
   - Input validation and sanitization
   - Authentication and authorization issues

3. **Performance Analysis**
   - Time and space complexity
   - Potential bottlenecks
   - Optimization opportunities

4. **Best Practices**
   - Design patterns usage
   - Error handling
   - Testing considerations

5. **Suggestions for Improvement**
   - Refactoring recommendations
   - Alternative approaches
   - Documentation improvements

Code to review:
[INSERT CODE HERE]

Please provide your feedback in a structured format with specific examples and actionable recommendations.`,
        tokenUsage: 'high',
        rating: 4.8,
        totalRatings: 45,
        saves: 123,
        copies: 456,
        views: 1234,
        comments: 12,
        likes: 89,
        tags: ['Developers', 'Code Review', 'Security'],
        aiModels: ['GPT-4', 'Claude'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        author: {
          id: 'user1',
          username: 'CodeMaster',
          avatar: '',
          bio: 'Senior Software Engineer with 10+ years experience'
        },
        isBookmarked: false,
        isLiked: false,
        examples: [
          {
            input: 'React component code snippet',
            output: 'Detailed review with security and performance feedback'
          }
        ]
      };

      setPrompt(mockPrompt);
      
      // Increment view count
      // TODO: Implement actual view count increment
      
    } catch (error) {
      console.error('Error fetching prompt details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prompt details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarPrompts = async () => {
    // TODO: Implement actual similar prompts fetch
    const mockSimilar: SimilarPrompt[] = [
      {
        id: '2',
        title: 'Security Audit Assistant',
        description: 'Comprehensive security audit prompt for applications',
        rating: 4.6,
        reviewCount: 32,
        saves: 87,
        copies: 234,
        comments: 8,
        likes: 45,
        whoFor: ['Developers'],
        aiModels: ['GPT-4'],
        tokenUsage: 'High',
        author: { name: 'SecExpert' },
        isBookmarked: false,
        isLiked: false,
      },
      // Add more similar prompts...
    ];
    
    setSimilarPrompts(mockSimilar);
  };

  const handleShare = async (platform: 'twitter' | 'link') => {
    const url = window.location.href;
    const text = `Check out this prompt: ${prompt?.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied!',
          description: 'Prompt link has been copied to clipboard',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy link',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRemix = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to remix prompts',
        variant: 'destructive',
      });
      return;
    }
    
    setCustomPrompt(prompt?.content || '');
    setShowRemixEditor(true);
  };

  const saveRemix = async () => {
    // TODO: Implement remix save functionality
    toast({
      title: 'Remix saved!',
      description: 'Your customized prompt has been saved to your library',
    });
    setShowRemixEditor(false);
  };

  const getTokenUsageIcon = (usage: string) => {
    switch (usage) {
      case 'low': return Zap;
      case 'medium': return Brain;
      case 'high': return Sparkles;
      default: return Zap;
    }
  };

  const getTokenUsageColor = (usage: string) => {
    switch (usage) {
      case 'low': return 'text-success-foreground bg-success/10 dark:bg-success/20';
      case 'medium': return 'text-warning-foreground bg-warning/10 dark:bg-warning/20';
      case 'high': return 'text-error-foreground bg-error/10 dark:bg-error/20';
      default: return 'text-muted-foreground bg-muted/50 dark:bg-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <h1 className="text-2xl font-bold mb-2">Prompt not found</h1>
            <p className="text-muted-foreground mb-4">
              The prompt you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/browse')}>
              Browse Prompts
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const TokenIcon = getTokenUsageIcon(prompt.tokenUsage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {prompt.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    {prompt.copies.toLocaleString()} copies
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {prompt.likes.toLocaleString()} likes
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
                  </div>
                </div>

                {/* Tags and Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getTokenUsageColor(prompt.tokenUsage)} flex items-center gap-1`}>
                    <TokenIcon className="w-3 h-3" />
                    {prompt.tokenUsage} usage
                  </Badge>
                  {prompt.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                  {prompt.aiModels.map(model => (
                    <Badge key={model} variant="secondary">{model}</Badge>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={prompt.author.avatar} />
                    <AvatarFallback>
                      {prompt.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">@{prompt.author.username}</p>
                    <p className="text-sm text-muted-foreground">{prompt.author.bio}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleCopyPrompt(prompt.content, prompt.title)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleBookmarkPrompt(prompt.id)}
                    className={prompt.isBookmarked ? 'text-primary' : ''}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${prompt.isBookmarked ? 'fill-current' : ''}`} />
                    {prompt.isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleLikePrompt(prompt.id)}
                    className={prompt.isLiked ? 'text-heart' : ''}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${prompt.isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button variant="outline" onClick={handleRemix}>
                    <Edit className="w-4 h-4 mr-2" />
                    Remix
                  </Button>
                  <Button variant="outline" onClick={() => handleShare('link')}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>

            {/* Prompt Content */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Prompt</h2>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {prompt.content}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyPrompt(prompt.content, prompt.title)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </Card>

            {/* Examples */}
            {prompt.examples && prompt.examples.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Example Usage</h2>
                {prompt.examples.map((example, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Input:</h3>
                      <div className="bg-muted p-3 rounded text-sm">
                        {example.input}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Expected Output:</h3>
                      <div className="bg-muted p-3 rounded text-sm">
                        {example.output}
                      </div>
                    </div>
                    {index < prompt.examples!.length - 1 && <Separator />}
                  </div>
                ))}
              </Card>
            )}

            {/* Remix Editor */}
            {showRemixEditor && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Remix This Prompt</h2>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[200px] font-mono"
                  placeholder="Customize the prompt..."
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowRemixEditor(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveRemix}>
                    Save Remix
                  </Button>
                </div>
              </Card>
            )}

            {/* Comments Section */}
            <CommentsSection 
              promptId={prompt.id}
              onCommentCountChange={(count) => {
                setPrompt(prev => prev ? { ...prev, comments: count } : null);
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating */}
            <RatingComponent
              promptId={prompt.id}
              averageRating={prompt.rating}
              totalRatings={prompt.totalRatings}
              onRatingUpdate={(newRating, newTotal) => {
                setPrompt(prev => prev ? {
                  ...prev,
                  rating: newRating,
                  totalRatings: newTotal
                } : null);
              }}
            />

            {/* Share Options */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Share</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShare('link')}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </Card>

            {/* Report */}
            <Card className="p-4">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Flag className="w-4 h-4 mr-2" />
                Report inappropriate content
              </Button>
            </Card>
          </div>
        </div>

        {/* Similar Prompts */}
        {similarPrompts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarPrompts.map((similarPrompt) => (
                <PromptCard
                  key={similarPrompt.id}
                  prompt={similarPrompt}
                  onCardClick={(id) => navigate(`/prompts/${id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}