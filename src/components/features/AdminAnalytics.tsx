import { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalPrompts: number;
  totalUsers: number;
  totalViews: number;
  totalCopies: number;
  recentPrompts: number;
  recentUsers: number;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get total counts
      const [promptsResult, usersResult] = await Promise.all([
        supabase.from('prompts').select('id, view_count, copy_count, created_at', { count: 'exact' }),
        supabase.from('user_profiles').select('id, created_at', { count: 'exact' })
      ]);

      const prompts = promptsResult.data || [];
      const users = usersResult.data || [];

      // Calculate totals
      const totalViews = prompts.reduce((sum, prompt) => sum + (prompt.view_count || 0), 0);
      const totalCopies = prompts.reduce((sum, prompt) => sum + (prompt.copy_count || 0), 0);

      // Calculate recent activity (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const recentPrompts = prompts.filter(p => 
        new Date(p.created_at) > weekAgo
      ).length;
      
      const recentUsers = users.filter(u => 
        new Date(u.created_at) > weekAgo
      ).length;

      setAnalytics({
        totalPrompts: promptsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalViews,
        totalCopies,
        recentPrompts,
        recentUsers
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Failed to load analytics data
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Total Prompts",
      value: analytics.totalPrompts,
      icon: FileText,
      description: `${analytics.recentPrompts} added this week`
    },
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      description: `${analytics.recentUsers} joined this week`
    },
    {
      title: "Total Views",
      value: analytics.totalViews,
      icon: TrendingUp,
      description: "Across all prompts"
    },
    {
      title: "Total Copies",
      value: analytics.totalCopies,
      icon: BarChart3,
      description: "Prompts copied by users"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Detailed analytics and insights coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Advanced analytics features including charts, user engagement metrics, 
            and detailed prompt performance data will be available in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}