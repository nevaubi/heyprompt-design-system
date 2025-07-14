import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PromptCard } from '@/components/features/PromptCard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Github,
  Star,
  Users,
  BookmarkCheck,
  Settings,
  UserPlus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  website?: string;
  twitter?: string;
  github?: string;
  created_at: string;
}

interface UserStats {
  promptCount: number;
  totalSaves: number;
  averageRating: number;
  followerCount: number;
  followingCount: number;
}

interface UserPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  rating: number;
  reviewCount: number;
  saves: number;
  copies: number;
  comments: number;
  likes: number;
  whoFor: string[];
  aiModels: string[];
  tokenUsage: 'low' | 'medium' | 'high';
  author: {
    name: string;
    avatar?: string;
  };
  isBookmarked: boolean;
  isLiked: boolean;
}

function UserProfileContent() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    promptCount: 0,
    totalSaves: 0,
    averageRating: 0,
    followerCount: 0,
    followingCount: 0,
  });
  const [prompts, setPrompts] = useState<UserPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = user && profile && user.id === profile.id;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);
        fetchUserPrompts(profileData.id);
        fetchUserStats(profileData.id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPrompts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('created_by', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our interface
      const transformedPrompts: UserPrompt[] = data.map((prompt: any) => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.prompt_content,
        rating: 4.5, // TODO: Calculate from ratings table
        reviewCount: 8, // TODO: Count from ratings table
        saves: 0, // TODO: Count from user_interactions
        copies: prompt.copy_count || 0,
        comments: 0, // TODO: Count from comments table
        likes: 0, // TODO: Count from user_interactions
        whoFor: ['Developers'], // TODO: Join with tags
        aiModels: ['GPT-4'], // TODO: Join with tags
        tokenUsage: prompt.token_usage as 'low' | 'medium' | 'high',
        author: {
          name: profile?.username || 'Anonymous',
        },
        isBookmarked: false, // TODO: Check user_interactions
        isLiked: false, // TODO: Check user_interactions
      }));

      setPrompts(transformedPrompts);
    } catch (error) {
      console.error('Error fetching user prompts:', error);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      // TODO: Implement proper stats calculation from database
      setStats({
        promptCount: prompts.length,
        totalSaves: 1200,
        averageRating: 4.5,
        followerCount: 150,
        followingCount: 75,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to follow users',
        variant: 'destructive',
      });
      return;
    }

    try {
      // TODO: Implement follow functionality
      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? 'Unfollowed' : 'Following',
        description: `You are ${isFollowing ? 'no longer following' : 'now following'} ${profile?.username}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update follow status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg mb-6" />
            <div className="h-6 bg-muted rounded w-1/3 mb-4" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <h1 className="text-2xl font-bold mb-2">User not found</h1>
            <p className="text-muted-foreground">
              The user "{username}" does not exist or has been removed.
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">@{profile.username}</h1>
                  {profile.bio && (
                    <p className="text-muted-foreground mb-4">{profile.bio}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      onClick={handleFollow}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 mb-6">
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Website
                  </a>
                )}
                {profile.twitter && (
                  <a 
                    href={`https://twitter.com/${profile.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    @{profile.twitter}
                  </a>
                )}
                {profile.github && (
                  <a 
                    href={`https://github.com/${profile.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    {profile.github}
                  </a>
                )}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{stats.promptCount}</span>
                  <span className="text-muted-foreground">Prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-semibold">{stats.totalSaves.toLocaleString()}</span>
                  <span className="text-muted-foreground">Total Saves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-star" />
                  <span className="font-semibold">{stats.averageRating}</span>
                  <span className="text-muted-foreground">Avg Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stats.followerCount}</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{stats.followingCount}</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="prompts">Published Prompts</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="space-y-6">
            {prompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No prompts published yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "Start sharing your prompts with the community" 
                    : `${profile.username} hasn't published any prompts yet`
                  }
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
              <p className="text-muted-foreground">
                Collections feature coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

export default function UserProfile() {
  return (
    <ProtectedRoute>
      <UserProfileContent />
    </ProtectedRoute>
  );
}