import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tag } from '@/lib/supabase';

interface FormData {
  title: string;
  description: string;
  prompt_content: string;
  token_usage: string;
  is_published: boolean;
  selectedTags: string[];
  image_url: string;
}

export function AdminPromptForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    prompt_content: '',
    token_usage: 'medium',
    is_published: true,
    selectedTags: [],
    image_url: ''
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data } = await supabase
        .from('tags')
        .select('*')
        .order('type', { ascending: true })
        .order('order_index', { ascending: true });
      
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.title.trim() || !formData.prompt_content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Insert the prompt
      const { data: prompt, error: promptError } = await supabase
        .from('prompts')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          prompt_content: formData.prompt_content.trim(),
          token_usage: formData.token_usage,
          is_published: formData.is_published,
          created_by: user.id,
          image_url: formData.image_url.trim() || null
        })
        .select()
        .single();

      if (promptError) throw promptError;

      // Add tag relationships
      if (formData.selectedTags.length > 0) {
        const tagRelations = formData.selectedTags.map(tagId => ({
          prompt_id: prompt.id,
          tag_id: tagId
        }));

        const { error: tagsError } = await supabase
          .from('prompt_tags')
          .insert(tagRelations);

        if (tagsError) throw tagsError;
      }

      toast({
        title: "Success",
        description: "Prompt created successfully",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        prompt_content: '',
        token_usage: 'medium',
        is_published: true,
        selectedTags: [],
        image_url: ''
      });

    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to create prompt",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      prompt_content: '',
      token_usage: 'medium',
      is_published: true,
      selectedTags: [],
      image_url: ''
    });
  };

  const whoForTags = tags.filter(tag => tag.type === 'who_for');
  const aiModelTags = tags.filter(tag => tag.type === 'ai_model');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Prompt
        </CardTitle>
        <CardDescription>
          Create and publish prompts directly to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter prompt title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this prompt does"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="token_usage">Token Usage</Label>
                <Select
                  value={formData.token_usage}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, token_usage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1-100 tokens)</SelectItem>
                    <SelectItem value="medium">Medium (100-500 tokens)</SelectItem>
                    <SelectItem value="high">High (500+ tokens)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_published: checked === true }))
                  }
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="prompt_content">Prompt Content *</Label>
              <Textarea
                id="prompt_content"
                value={formData.prompt_content}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt_content: e.target.value }))}
                placeholder="Enter the actual prompt content"
                rows={8}
                required
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <div>
              <Label>Who is this for? ({whoForTags.length} available)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {whoForTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={formData.selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>AI Models ({aiModelTags.length} available)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {aiModelTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={formData.selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Prompt'}
            </Button>
            <Button type="button" variant="outline" onClick={clearForm}>
              <X className="w-4 h-4 mr-2" />
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}