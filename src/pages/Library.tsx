import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PromptCard } from '@/components/features/PromptCard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Plus, 
  FolderPlus, 
  BookmarkCheck,
  Upload,
  SortAsc,
  Filter
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SavedPrompt {
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
  tokenUsage: 'Low' | 'Medium' | 'High';
  author: {
    name: string;
    avatar?: string;
  };
  isBookmarked: boolean;
  isLiked: boolean;
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  promptCount: number;
  createdAt: string;
}

export default function Library() {
  const { user } = useAuth();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedPrompts();
      fetchFolders();
    }
  }, [user]);

  const fetchSavedPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select(`
          prompt_id,
          prompts (
            id,
            title,
            description,
            prompt_content,
            copy_count,
            view_count,
            created_by,
            user_profiles (
              username
            )
          )
        `)
        .eq('user_id', user?.id)
        .eq('interaction_type', 'bookmark');

      if (error) throw error;

      // Transform data to match our interface
      const transformedPrompts: SavedPrompt[] = data.map((item: any) => ({
        id: item.prompt_id,
        title: item.prompts.title,
        description: item.prompts.description,
        content: item.prompts.prompt_content,
        rating: 4.5, // TODO: Calculate from ratings table
        reviewCount: 12, // TODO: Count from ratings table
        saves: 0, // TODO: Count from user_interactions
        copies: item.prompts.copy_count || 0,
        comments: 0, // TODO: Count from comments table
        likes: 0, // TODO: Count from user_interactions
        whoFor: ['Developers'], // TODO: Join with tags
        aiModels: ['GPT-4'], // TODO: Join with tags
        tokenUsage: 'Medium' as const,
        author: {
          name: item.prompts.user_profiles?.username || 'Anonymous',
        },
        isBookmarked: true,
        isLiked: false, // TODO: Check user_interactions
      }));

      setSavedPrompts(transformedPrompts);
    } catch (error) {
      console.error('Error fetching saved prompts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved prompts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    // TODO: Implement folders table and fetch user folders
    setFolders([
      { id: '1', name: 'Favorites', description: 'My favorite prompts', promptCount: 12, createdAt: '2024-01-15' },
      { id: '2', name: 'Work Projects', description: 'Prompts for work', promptCount: 8, createdAt: '2024-01-20' },
    ]);
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      // TODO: Implement folder creation in database
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        description: newFolderDescription,
        promptCount: 0,
        createdAt: new Date().toISOString(),
      };

      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setNewFolderDescription('');
      setIsCreateFolderOpen(false);

      toast({
        title: 'Folder created',
        description: `"${newFolderName}" has been created.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const filteredPrompts = savedPrompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">Organize and manage your saved prompts</p>
          </div>

          <Tabs defaultValue="saved" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4" />
                Saved Prompts
              </TabsTrigger>
              <TabsTrigger value="folders" className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4" />
                My Folders
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                My Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search saved prompts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <SortAsc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Saved Prompts Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-64 animate-pulse bg-muted" />
                  ))}
                </div>
              ) : filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookmarkCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No saved prompts yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start bookmarking prompts to build your personal library
                  </p>
                  <Button>Browse Prompts</Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="folders" className="space-y-6">
              {/* Create Folder Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Folders</h2>
                <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="folder-name">Folder Name</Label>
                        <Input
                          id="folder-name"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="folder-description">Description (Optional)</Label>
                        <Textarea
                          id="folder-description"
                          value={newFolderDescription}
                          onChange={(e) => setNewFolderDescription(e.target.value)}
                          placeholder="Describe this folder"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createFolder} disabled={!newFolderName.trim()}>
                          Create Folder
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Folders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <Card key={folder.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <FolderPlus className="w-8 h-8 text-primary" />
                      <Badge variant="secondary">{folder.promptCount}</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{folder.name}</h3>
                    {folder.description && (
                      <p className="text-sm text-muted-foreground mb-4">{folder.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(folder.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="submissions" className="space-y-6">
              <div className="text-center py-12">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Share your prompts with the community
                </p>
                <Button>Submit a Prompt</Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}