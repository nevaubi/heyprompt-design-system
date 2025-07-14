import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PromptFormData {
  title: string;
  description: string;
  content: string;
  tokenUsage: 'low' | 'medium' | 'high';
  whoFor: string[];
  aiModels: string[];
  example: string;
  isDraft: boolean;
}

const WHO_FOR_OPTIONS = [
  'Developers', 'Designers', 'Marketers', 'Writers', 'Entrepreneurs', 
  'Students', 'Researchers', 'Content Creators', 'Sales Teams', 'HR Professionals'
];

const AI_MODEL_OPTIONS = [
  'GPT-4', 'GPT-3.5', 'Claude', 'Gemini', 'Llama', 'PaLM', 'Mistral'
];

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Title and description' },
  { id: 'content', title: 'Prompt Content', description: 'The actual prompt' },
  { id: 'tags', title: 'Tags & Settings', description: 'Categories and models' },
  { id: 'example', title: 'Example Usage', description: 'Show how it works' },
  { id: 'review', title: 'Review & Publish', description: 'Final review' },
];

export default function SubmitPrompt() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    description: '',
    content: '',
    tokenUsage: 'medium',
    whoFor: [],
    aiModels: [],
    example: '',
    isDraft: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof PromptFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: 'whoFor' | 'aiModels', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 1: return formData.content.trim() !== '';
      case 2: return formData.whoFor.length > 0 && formData.aiModels.length > 0;
      case 3: return true; // Example is optional
      case 4: return true; // Review step
      default: return false;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('prompts')
        .insert({
          title: formData.title,
          description: formData.description,
          prompt_content: formData.content,
          token_usage: formData.tokenUsage,
          created_by: user?.id,
          is_published: false,
        });

      if (error) throw error;

      toast({
        title: 'Draft saved',
        description: 'Your prompt has been saved as a draft.',
      });

      navigate('/library');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Error',
        description: 'Failed to save draft',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishPrompt = async () => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('prompts')
        .insert({
          title: formData.title,
          description: formData.description,
          prompt_content: formData.content,
          token_usage: formData.tokenUsage,
          created_by: user?.id,
          is_published: true,
        });

      if (error) throw error;

      toast({
        title: 'Prompt published!',
        description: 'Your prompt is now live and available to the community.',
      });

      navigate('/browse');
    } catch (error) {
      console.error('Error publishing prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish prompt',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/browse')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          <h1 className="text-3xl font-bold mb-2">Submit a Prompt</h1>
          <p className="text-muted-foreground">Share your prompt with the community</p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{STEPS[currentStep].title}</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <p className="text-sm text-muted-foreground">{STEPS[currentStep].description}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Step 0: Basic Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Prompt Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Enter a catchy title for your prompt"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Describe what your prompt does and how it helps users"
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Prompt Content */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="content">Prompt Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => updateFormData('content', e.target.value)}
                      placeholder="Enter your prompt here. Use [variables] for dynamic parts."
                      className="mt-2 min-h-[300px] font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Tip: Use square brackets [like this] for variables that users should replace
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="token-usage">Token Usage</Label>
                    <Select value={formData.tokenUsage} onValueChange={(value) => updateFormData('tokenUsage', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Simple, short responses</SelectItem>
                        <SelectItem value="medium">Medium - Balanced responses</SelectItem>
                        <SelectItem value="high">High - Complex, detailed responses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Tags & Settings */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Who is this for?</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {WHO_FOR_OPTIONS.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`who-for-${option}`}
                            checked={formData.whoFor.includes(option)}
                            onCheckedChange={() => toggleArrayValue('whoFor', option)}
                          />
                          <label htmlFor={`who-for-${option}`} className="text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Compatible AI Models</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {AI_MODEL_OPTIONS.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ai-model-${option}`}
                            checked={formData.aiModels.includes(option)}
                            onCheckedChange={() => toggleArrayValue('aiModels', option)}
                          />
                          <label htmlFor={`ai-model-${option}`} className="text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Example Usage */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="example">Example Usage (Optional)</Label>
                    <Textarea
                      id="example"
                      value={formData.example}
                      onChange={(e) => updateFormData('example', e.target.value)}
                      placeholder="Show an example of how to use this prompt and what kind of output to expect"
                      className="mt-2 min-h-[200px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This helps users understand how to use your prompt effectively
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Publish */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Ready to Publish
                    </h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">{formData.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{formData.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.whoFor.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        {formData.aiModels.map((model) => (
                          <Badge key={model} variant="secondary">{model}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={saveDraft}
                    disabled={isSubmitting || !isStepValid(0)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  {currentStep === STEPS.length - 1 ? (
                    <Button 
                      onClick={publishPrompt}
                      disabled={isSubmitting || !isStepValid(currentStep)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publish Prompt
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Title</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.title || 'Enter a title...'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || 'Enter a description...'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Token Usage</h4>
                  <Badge variant="secondary" className="text-xs">
                    {formData.tokenUsage}
                  </Badge>
                </div>
                {formData.whoFor.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm">Who For</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.whoFor.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {formData.whoFor.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{formData.whoFor.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}