import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RatingComponentProps {
  promptId: string;
  averageRating: number;
  totalRatings: number;
  onRatingUpdate?: (newRating: number, newTotal: number) => void;
}

interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export function RatingComponent({ 
  promptId, 
  averageRating, 
  totalRatings,
  onRatingUpdate 
}: RatingComponentProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [distribution, setDistribution] = useState<RatingDistribution>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserRating();
    }
    fetchRatingDistribution();
  }, [user, promptId]);

  const fetchUserRating = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('user_id', user?.id)
        .eq('prompt_id', promptId)
        .single();

      if (!error && data) {
        setUserRating(data.rating);
      }
    } catch (error) {
      // User hasn't rated yet
    }
  };

  const fetchRatingDistribution = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('prompt_id', promptId);

      if (error) throw error;

      const dist: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(({ rating }) => {
        dist[rating as keyof RatingDistribution]++;
      });

      setDistribution(dist);
    } catch (error) {
      console.error('Error fetching rating distribution:', error);
    }
  };

  const submitRating = async (rating: number) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to rate prompts',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          prompt_id: promptId,
          rating: rating,
        });

      if (error) throw error;

      setUserRating(rating);
      
      // Update local distribution
      const newDist = { ...distribution };
      if (userRating > 0) {
        newDist[userRating as keyof RatingDistribution]--;
      }
      newDist[rating as keyof RatingDistribution]++;
      setDistribution(newDist);

      // Calculate new average
      const totalVotes = Object.values(newDist).reduce((sum, count) => sum + count, 0);
      const weightedSum = Object.entries(newDist).reduce((sum, [rating, count]) => 
        sum + (parseInt(rating) * count), 0
      );
      const newAverage = totalVotes > 0 ? weightedSum / totalVotes : 0;

      onRatingUpdate?.(newAverage, totalVotes);

      toast({
        title: 'Rating submitted',
        description: `You rated this prompt ${rating} star${rating !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= rating;
      const isHovered = interactive && starNumber <= hoveredRating;
      
      return (
        <button
          key={i}
          disabled={!interactive || isSubmitting}
          className={`${interactive ? 'hover:scale-110 transition-transform' : 'cursor-default'}`}
          onMouseEnter={() => interactive && setHoveredRating(starNumber)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          onClick={() => interactive && submitRating(starNumber)}
        >
          <Star
            className={`w-5 h-5 ${
              isFilled || isHovered
                ? 'fill-star text-star'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      );
    });
  };

  const getDistributionPercentage = (count: number) => {
    return totalRatings > 0 ? (count / totalRatings) * 100 : 0;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Average Rating Display */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">
            Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Distribution */}
        {totalRatings > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Rating Distribution</h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm w-4">{rating}</span>
                <Star className="w-3 h-3 fill-star text-star" />
                <Progress 
                  value={getDistributionPercentage(distribution[rating as keyof RatingDistribution])} 
                  className="flex-1 h-2"
                />
                <span className="text-xs text-muted-foreground w-8">
                  {distribution[rating as keyof RatingDistribution]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* User Rating Section */}
        {user && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">
              {userRating > 0 ? 'Your Rating' : 'Rate this prompt'}
            </h4>
            <div className="flex items-center space-x-2">
              {renderStars(userRating || hoveredRating, true)}
              {userRating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  You rated {userRating} star{userRating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {!user && (
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to rate this prompt
            </p>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}