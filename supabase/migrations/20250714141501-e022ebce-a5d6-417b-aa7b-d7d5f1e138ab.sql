-- Phase 1: Create sample data for the application

-- First, insert sample tags for categories and AI models
INSERT INTO public.tags (name, slug, type, color, order_index) VALUES
-- Categories (who_for)
('Content Creators', 'content-creators', 'who_for', '#3B82F6', 1),
('Developers', 'developers', 'who_for', '#10B981', 2),
('Marketers', 'marketers', 'who_for', '#F59E0B', 3),
('Students', 'students', 'who_for', '#EF4444', 4),
('Researchers', 'researchers', 'who_for', '#8B5CF6', 5),
('Writers', 'writers', 'who_for', '#06B6D4', 6),
('Business', 'business', 'who_for', '#84CC16', 7),
('Designers', 'designers', 'who_for', '#F97316', 8),

-- AI Models
('ChatGPT', 'chatgpt', 'ai_model', '#10A37F', 1),
('Claude', 'claude', 'ai_model', '#D97706', 2),
('Gemini', 'gemini', 'ai_model', '#4285F4', 3),
('GPT-4', 'gpt-4', 'ai_model', '#412991', 4),
('Llama', 'llama', 'ai_model', '#1F2937', 5),
('Midjourney', 'midjourney', 'ai_model', '#7C3AED', 6),
('DALL-E', 'dall-e', 'ai_model', '#059669', 7);

-- Create sample user profiles (these will be referenced by sample prompts)
INSERT INTO public.user_profiles (id, username, bio, website, twitter, github) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'promptmaster', 'AI prompt engineering expert with 5+ years experience', 'https://promptmaster.dev', '@promptmaster', 'promptmaster'),
('550e8400-e29b-41d4-a716-446655440002', 'aiexplorer', 'Content creator specializing in AI tools and workflows', 'https://aiexplorer.com', '@aiexplorer', 'aiexplorer'),
('550e8400-e29b-41d4-a716-446655440003', 'codecrafter', 'Full-stack developer passionate about AI-assisted coding', 'https://codecrafter.io', '@codecrafter', 'codecrafter'),
('550e8400-e29b-41d4-a716-446655440004', 'marketingguru', 'Digital marketing specialist leveraging AI for campaigns', NULL, '@marketingguru', NULL),
('550e8400-e29b-41d4-a716-446655440005', 'designthink', 'UX/UI designer exploring AI-powered design workflows', 'https://designthink.studio', '@designthink', 'designthink');

-- Insert sample prompts with realistic content
INSERT INTO public.prompts (title, description, prompt_content, token_usage, created_by, view_count, copy_count, is_published) VALUES
('Professional Email Writer', 'Generate professional, concise emails for any business situation with proper tone and structure.', 'You are a professional business communication expert. Write a [TYPE OF EMAIL] email about [TOPIC] to [RECIPIENT]. The tone should be [TONE: professional/friendly/formal/urgent]. Include:

- Clear subject line
- Appropriate greeting
- Concise main message
- Professional closing
- Proper formatting

Context: [PROVIDE CONTEXT]
Key points to include: [LIST KEY POINTS]

Make it engaging but professional, and ensure it''s actionable.', 'medium', '550e8400-e29b-41d4-a716-446655440001', 1247, 89, true),

('Code Review Assistant', 'Comprehensive code review with security, performance, and best practice analysis.', 'Act as a senior software engineer conducting a thorough code review. Analyze the following code and provide:

## Code to Review:
```[LANGUAGE]
[PASTE CODE HERE]
```

## Review Areas:
1. **Security**: Identify potential vulnerabilities
2. **Performance**: Suggest optimizations
3. **Best Practices**: Code style and patterns
4. **Maintainability**: Structure and readability
5. **Testing**: Coverage and edge cases

## Output Format:
- ✅ **Strengths**: What''s done well
- ⚠️ **Issues**: Problems found (with severity)
- 🔧 **Suggestions**: Specific improvements
- 📚 **Resources**: Helpful links or documentation

Be constructive and explain the "why" behind your suggestions.', 'high', '550e8400-e29b-41d4-a716-446655440003', 2156, 156, true),

('Social Media Content Creator', 'Create engaging social media posts tailored to different platforms and audiences.', 'You are a social media content strategist. Create [NUMBER] engaging posts for [PLATFORM: Instagram/Twitter/LinkedIn/TikTok] about [TOPIC].

## Requirements:
- Target audience: [DESCRIBE AUDIENCE]
- Brand voice: [VOICE: casual/professional/humorous/inspirational]
- Include relevant hashtags
- Optimal length for platform
- Call-to-action

## Content Types:
- Educational tips
- Behind-the-scenes
- User-generated content
- Trending topics
- Community engagement

For each post, provide:
1. Main caption
2. Hashtag suggestions (#)
3. Best posting time
4. Engagement strategy

Make it authentic and valuable to the audience.', 'medium', '550e8400-e29b-41d4-a716-446655440002', 3421, 278, true),

('Research Paper Summarizer', 'Extract key insights and create comprehensive summaries from academic papers and research documents.', 'You are a research analyst specializing in academic literature. Summarize the following research paper/document:

## Document:
[PASTE PAPER/LINK/ABSTRACT HERE]

## Summary Structure:
1. **Executive Summary** (2-3 sentences)
2. **Key Findings** (3-5 bullet points)
3. **Methodology** (brief overview)
4. **Implications** (practical applications)
5. **Limitations** (study constraints)
6. **Future Research** (suggested directions)

## Additional Analysis:
- Relevance score (1-10)
- Target audience
- Related papers/topics
- Practical applications

Keep it accessible while maintaining scientific accuracy. Use clear, jargon-free language where possible.', 'high', '550e8400-e29b-41d4-a716-446655440005', 1876, 134, true),

('Customer Service Response Generator', 'Create empathetic, helpful customer service responses for various scenarios and complaint types.', 'You are a customer service expert. Generate a response to the following customer inquiry/complaint:

## Customer Message:
[PASTE CUSTOMER MESSAGE HERE]

## Response Guidelines:
- Acknowledge the customer''s concern
- Show empathy and understanding
- Provide clear next steps
- Offer specific solutions
- Maintain professional tone
- Include timeline for resolution

## Response Structure:
1. **Acknowledgment**: Validate their experience
2. **Apology**: If appropriate, sincere apology
3. **Solution**: Specific steps to resolve
4. **Timeline**: When to expect resolution
5. **Follow-up**: How to contact if needed

## Tone Variations:
- Frustrated customer: Extra empathy
- Technical issue: Clear explanations
- Billing inquiry: Transparency
- Product complaint: Solution-focused

Make the customer feel heard and valued.', 'medium', '550e8400-e29b-41d4-a716-446655440004', 982, 67, true),

('Creative Writing Prompt Generator', 'Generate unique, inspiring creative writing prompts for stories, novels, and creative exercises.', 'You are a creative writing mentor. Generate [NUMBER] unique writing prompts for [GENRE: fantasy/sci-fi/mystery/romance/literary fiction/horror].

## Prompt Elements:
- **Character**: Unique protagonist with interesting background
- **Setting**: Vivid, specific location and time
- **Conflict**: Central tension or problem
- **Hook**: Intriguing opening scenario
- **Theme**: Underlying message or question

## Format for Each Prompt:
1. **One-line hook**: Grabbing opening scenario
2. **Character details**: Who is the protagonist?
3. **Setting**: Where and when does it take place?
4. **Central conflict**: What''s at stake?
5. **Twist element**: Unexpected element to explore

## Additional Options:
- Word count target
- Specific writing exercises
- Character development focus
- World-building elements

Make each prompt unique and inspiring for writers of all levels.', 'low', '550e8400-e29b-41d4-a716-446655440002', 1654, 203, true),

('Data Analysis Assistant', 'Analyze datasets and provide insights with visualization suggestions and statistical interpretations.', 'You are a data scientist. Analyze the provided dataset and generate insights:

## Dataset Information:
[DESCRIBE YOUR DATA OR PASTE SAMPLE]

## Analysis Tasks:
1. **Data Overview**: Structure, variables, data types
2. **Descriptive Statistics**: Key metrics and distributions
3. **Pattern Identification**: Trends, correlations, anomalies
4. **Insights**: Key findings and implications
5. **Visualizations**: Recommended charts and graphs
6. **Recommendations**: Actionable next steps

## Output Format:
- Executive summary
- Statistical findings
- Visual recommendations
- Business implications
- Data quality assessment
- Further analysis suggestions

## Visualization Types:
- Bar charts for categories
- Line graphs for trends
- Scatter plots for correlations
- Heatmaps for patterns
- Histograms for distributions

Provide clear, actionable insights that non-technical stakeholders can understand.', 'high', '550e8400-e29b-41d4-a716-446655440003', 2341, 187, true),

('Meeting Minutes Generator', 'Transform meeting recordings or notes into professional, structured meeting minutes with action items.', 'You are an executive assistant specializing in meeting documentation. Convert the following meeting content into professional minutes:

## Meeting Information:
- **Date**: [DATE]
- **Time**: [TIME]
- **Attendees**: [LIST ATTENDEES]
- **Meeting Type**: [TEAM SYNC/CLIENT CALL/PLANNING/REVIEW]

## Raw Content:
[PASTE MEETING NOTES/TRANSCRIPT HERE]

## Output Structure:
1. **Meeting Summary** (2-3 sentences)
2. **Key Decisions** (bullet points)
3. **Action Items** (who, what, when)
4. **Discussion Points** (main topics)
5. **Next Steps** (follow-up actions)
6. **Next Meeting** (if scheduled)

## Format:
- Clear, concise language
- Organized sections
- Actionable items highlighted
- Deadlines specified
- Responsible parties named

Make it professional and easy to reference later.', 'medium', '550e8400-e29b-41d4-a716-446655440001', 1123, 89, true),

('Product Description Writer', 'Create compelling, SEO-optimized product descriptions that convert browsers into buyers.', 'You are a copywriting expert specializing in e-commerce. Write a compelling product description for:

## Product Information:
- **Product Name**: [PRODUCT NAME]
- **Category**: [PRODUCT CATEGORY]
- **Key Features**: [LIST MAIN FEATURES]
- **Target Audience**: [WHO IS THIS FOR]
- **Price Point**: [BUDGET/MID-RANGE/PREMIUM]

## Description Elements:
1. **Headline**: Attention-grabbing title
2. **Benefits**: How it solves problems
3. **Features**: Technical specifications
4. **Social Proof**: Trust indicators
5. **Call-to-Action**: Clear next step

## Writing Style:
- Benefit-focused language
- Emotional triggers
- SEO keywords naturally integrated
- Scannable format (bullets, headers)
- Urgency or scarcity elements

## Length Options:
- Short: 50-100 words
- Medium: 150-250 words
- Long: 300-500 words

Focus on converting visitors into customers while maintaining authenticity.', 'medium', '550e8400-e29b-41d4-a716-446655440004', 1789, 145, true),

('Learning Path Creator', 'Design comprehensive learning curricula for any skill or subject with structured progression and resources.', 'You are an educational consultant. Create a comprehensive learning path for mastering [SKILL/SUBJECT]:

## Learning Path Structure:
1. **Prerequisites**: What to know before starting
2. **Learning Objectives**: Clear, measurable goals
3. **Curriculum Outline**: Step-by-step progression
4. **Time Estimates**: Realistic timeline
5. **Resources**: Books, courses, tools, practice
6. **Milestones**: Progress checkpoints
7. **Projects**: Hands-on applications

## Skill Level:
- Beginner (starting from zero)
- Intermediate (some experience)
- Advanced (looking to master)

## Format per Module:
- **Week/Phase**: Timeline
- **Topics**: What to learn
- **Activities**: How to practice
- **Resources**: Where to learn
- **Assessment**: How to measure progress

## Additional Elements:
- Common pitfalls to avoid
- Community resources
- Industry certifications
- Career applications

Make it actionable and achievable for self-directed learners.', 'high', '550e8400-e29b-41d4-a716-446655440005', 2567, 234, true),

('API Documentation Writer', 'Generate clear, comprehensive API documentation with examples and best practices.', 'You are a technical writer specializing in API documentation. Document the following API:

## API Information:
- **API Name**: [API NAME]
- **Base URL**: [BASE URL]
- **Authentication**: [AUTH METHOD]
- **Version**: [VERSION]

## Documentation Structure:
1. **Overview**: What the API does
2. **Authentication**: How to authenticate
3. **Base URL**: Endpoint information
4. **Rate Limits**: Usage restrictions
5. **Endpoints**: Available routes
6. **Examples**: Code samples
7. **Error Handling**: Common errors
8. **SDKs**: Available libraries

## For Each Endpoint:
- **Method**: GET/POST/PUT/DELETE
- **URL**: Full endpoint path
- **Parameters**: Required/optional params
- **Request Body**: Example payload
- **Response**: Success/error examples
- **Status Codes**: Possible responses

## Code Examples:
- cURL commands
- JavaScript/Python samples
- Response examples
- Error scenarios

Make it developer-friendly with clear examples and troubleshooting tips.', 'high', '550e8400-e29b-41d4-a716-446655440003', 1456, 112, true),

('Brand Storytelling Assistant', 'Craft compelling brand narratives that connect with audiences and communicate company values effectively.', 'You are a brand strategist and storyteller. Develop a compelling brand story for:

## Company Information:
- **Company Name**: [COMPANY NAME]
- **Industry**: [INDUSTRY]
- **Mission**: [COMPANY MISSION]
- **Values**: [CORE VALUES]
- **Target Audience**: [AUDIENCE DESCRIPTION]
- **Unique Value**: [WHAT MAKES YOU DIFFERENT]

## Story Elements:
1. **Origin Story**: How/why the company started
2. **Mission Statement**: Purpose and goals
3. **Values**: What you stand for
4. **Vision**: Where you''re heading
5. **Customer Impact**: Lives you''ve changed
6. **Future Goals**: What''s next

## Narrative Structure:
- **Hook**: Attention-grabbing opening
- **Challenge**: Problem you''re solving
- **Journey**: How you''re solving it
- **Transformation**: Impact you''re making
- **Future**: Vision moving forward

## Use Cases:
- Website About page
- Investor presentations
- Marketing campaigns
- Employee onboarding
- Social media content

Create an authentic, memorable story that resonates with your audience.', 'medium', '550e8400-e29b-41d4-a716-446655440004', 1834, 167, true);

-- Link prompts to relevant tags through prompt_tags table
INSERT INTO public.prompt_tags (prompt_id, tag_id) 
SELECT p.id, t.id 
FROM public.prompts p, public.tags t 
WHERE 
  -- Professional Email Writer
  (p.title = 'Professional Email Writer' AND t.slug IN ('business', 'chatgpt', 'gpt-4')) OR
  -- Code Review Assistant  
  (p.title = 'Code Review Assistant' AND t.slug IN ('developers', 'chatgpt', 'claude')) OR
  -- Social Media Content Creator
  (p.title = 'Social Media Content Creator' AND t.slug IN ('content-creators', 'marketers', 'chatgpt', 'gpt-4')) OR
  -- Research Paper Summarizer
  (p.title = 'Research Paper Summarizer' AND t.slug IN ('researchers', 'students', 'claude', 'gpt-4')) OR
  -- Customer Service Response Generator
  (p.title = 'Customer Service Response Generator' AND t.slug IN ('business', 'chatgpt', 'claude')) OR
  -- Creative Writing Prompt Generator
  (p.title = 'Creative Writing Prompt Generator' AND t.slug IN ('writers', 'content-creators', 'chatgpt', 'gpt-4')) OR
  -- Data Analysis Assistant
  (p.title = 'Data Analysis Assistant' AND t.slug IN ('developers', 'researchers', 'claude', 'gpt-4')) OR
  -- Meeting Minutes Generator
  (p.title = 'Meeting Minutes Generator' AND t.slug IN ('business', 'chatgpt', 'claude')) OR
  -- Product Description Writer
  (p.title = 'Product Description Writer' AND t.slug IN ('marketers', 'business', 'chatgpt', 'gpt-4')) OR
  -- Learning Path Creator
  (p.title = 'Learning Path Creator' AND t.slug IN ('students', 'researchers', 'claude', 'gpt-4')) OR
  -- API Documentation Writer
  (p.title = 'API Documentation Writer' AND t.slug IN ('developers', 'claude', 'gpt-4')) OR
  -- Brand Storytelling Assistant
  (p.title = 'Brand Storytelling Assistant' AND t.slug IN ('marketers', 'business', 'content-creators', 'chatgpt', 'claude'));

-- Add some sample ratings for prompts
INSERT INTO public.ratings (prompt_id, user_id, rating)
SELECT 
  p.id,
  (ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)],
  4 + (random() * 1.0)::numeric(2,1)  -- Ratings between 4.0 and 5.0
FROM public.prompts p
CROSS JOIN generate_series(1, 3); -- 3 ratings per prompt

-- Add some sample user interactions
INSERT INTO public.user_interactions (prompt_id, user_id, interaction_type)
SELECT 
  p.id,
  (ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)],
  (ARRAY['like', 'bookmark'])[floor(random() * 2 + 1)]
FROM public.prompts p
CROSS JOIN generate_series(1, 2); -- 2 interactions per prompt