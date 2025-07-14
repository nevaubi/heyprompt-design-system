import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

class Analytics {
  private isEnabled: boolean = true;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Respect user privacy preferences
    if (typeof window !== 'undefined') {
      this.isEnabled = !window.doNotTrack && !navigator.doNotTrack;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  track(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        url: window.location.href,
        pathname: window.location.pathname,
        userAgent: navigator.userAgent,
      },
      userId: this.userId,
    };

    // For now, just log to console
    // TODO: Send to analytics service
    console.log('Analytics Event:', eventData);

    // Store in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  page(path?: string) {
    this.track('page_view', {
      path: path || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }

  // Common events
  promptView(promptId: string, promptTitle: string) {
    this.track('prompt_viewed', {
      promptId,
      promptTitle,
    });
  }

  promptCopy(promptId: string, promptTitle: string) {
    this.track('prompt_copied', {
      promptId,
      promptTitle,
    });
  }

  promptSave(promptId: string, promptTitle: string) {
    this.track('prompt_saved', {
      promptId,
      promptTitle,
    });
  }

  promptLike(promptId: string, promptTitle: string) {
    this.track('prompt_liked', {
      promptId,
      promptTitle,
    });
  }

  search(query: string, filters: any, resultCount: number) {
    this.track('search_performed', {
      query,
      filters,
      resultCount,
    });
  }

  signUp(method: 'email' | 'google' | 'twitter') {
    this.track('user_signed_up', {
      method,
    });
  }

  signIn(method: 'email' | 'google' | 'twitter') {
    this.track('user_signed_in', {
      method,
    });
  }

  promptSubmit(promptId: string, promptTitle: string) {
    this.track('prompt_submitted', {
      promptId,
      promptTitle,
    });
  }

  featureUsed(feature: string, context?: Record<string, any>) {
    this.track('feature_used', {
      feature,
      ...context,
    });
  }
}

export const analytics = new Analytics();

// Hook for page tracking
export function usePageTracking() {
  useEffect(() => {
    analytics.page();
  }, []);
}

// Hook for user tracking
export function useUserTracking(userId: string | null) {
  useEffect(() => {
    analytics.setUserId(userId);
  }, [userId]);
}

// Privacy-friendly analytics utilities
export function initializeAnalytics() {
  // Check for consent
  const hasConsent = localStorage.getItem('analytics_consent');
  
  if (hasConsent === null) {
    // Show consent banner
    showConsentBanner();
  } else if (hasConsent === 'true') {
    // Initialize analytics
    analytics.track('session_started');
  }
}

function showConsentBanner() {
  // TODO: Implement consent banner UI
  console.log('Analytics consent banner would show here');
}

export function giveAnalyticsConsent() {
  localStorage.setItem('analytics_consent', 'true');
  analytics.track('session_started');
}

export function revokeAnalyticsConsent() {
  localStorage.setItem('analytics_consent', 'false');
  localStorage.removeItem('analytics_events');
}
