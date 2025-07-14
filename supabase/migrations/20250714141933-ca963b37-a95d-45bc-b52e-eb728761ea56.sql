-- Add only missing tags 
INSERT INTO public.tags (name, slug, type, color, order_index) 
SELECT * FROM (VALUES
  ('Content Creators', 'content-creators', 'who_for', '#3B82F6', 1),
  ('Students', 'students', 'who_for', '#EF4444', 4),
  ('Researchers', 'researchers', 'who_for', '#8B5CF6', 5),
  ('Business', 'business', 'who_for', '#84CC16', 7),
  ('ChatGPT', 'chatgpt', 'ai_model', '#10A37F', 1),
  ('Llama', 'llama', 'ai_model', '#1F2937', 5),
  ('Midjourney', 'midjourney', 'ai_model', '#7C3AED', 6),
  ('DALL-E', 'dall-e', 'ai_model', '#059669', 7)
) AS new_tags(name, slug, type, color, order_index)
WHERE NOT EXISTS (
  SELECT 1 FROM public.tags WHERE tags.name = new_tags.name
);

-- Insert sample prompts without specific created_by (will be null for now)
INSERT INTO public.prompts (title, description, prompt_content, token_usage, view_count, copy_count, is_published) VALUES
('Professional Email Writer', 'Generate professional, concise emails for any business situation with proper tone and structure.', 'You are a professional business communication expert. Write a [TYPE OF EMAIL] email about [TOPIC] to [RECIPIENT]. The tone should be [TONE: professional/friendly/formal/urgent]. Include:

- Clear subject line
- Appropriate greeting  
- Concise main message
- Professional closing
- Proper formatting

Context: [PROVIDE CONTEXT]
Key points to include: [LIST KEY POINTS]

Make it engaging but professional, and ensure it''s actionable.', 'medium', 1247, 89, true),

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

Be constructive and explain the "why" behind your suggestions.', 'high', 2156, 156, true),

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

Make it authentic and valuable to the audience.', 'medium', 3421, 278, true),

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

Keep it accessible while maintaining scientific accuracy. Use clear, jargon-free language where possible.', 'high', 1876, 134, true),

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

Make each prompt unique and inspiring for writers of all levels.', 'low', 1654, 203, true),

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

Provide clear, actionable insights that non-technical stakeholders can understand.', 'high', 2341, 187, true);