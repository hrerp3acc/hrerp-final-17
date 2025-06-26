
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingProgress {
  id: string;
  user_id: string;
  current_step: number;
  completed_steps: number[];
  is_completed: boolean;
  started_at: string;
  completed_at: string;
  updated_at: string;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  isOptional?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to HR Management',
    description: 'Get started with your new HR management system',
    component: 'welcome'
  },
  {
    id: 2,
    title: 'Set Up Your Profile',
    description: 'Complete your personal information and preferences',
    component: 'profile'
  },
  {
    id: 3,
    title: 'Configure Notifications',
    description: 'Choose how you want to receive updates and alerts',
    component: 'notifications'
  },
  {
    id: 4,
    title: 'Explore Key Features',
    description: 'Take a tour of the main features available to you',
    component: 'features'
  }
];

export const useOnboarding = () => {
  const { user } = useUser();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      let { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // Create initial progress if none exists
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            current_step: 1,
            completed_steps: []
          })
          .select()
          .single();

        if (insertError) throw insertError;
        data = newData;
      }

      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch onboarding progress');
    } finally {
      setLoading(false);
    }
  };

  const completeStep = async (stepId: number) => {
    if (!user?.id || !progress) return null;

    try {
      const completedSteps = [...progress.completed_steps, stepId];
      const nextStep = Math.min(stepId + 1, ONBOARDING_STEPS.length + 1);
      const isCompleted = completedSteps.length >= ONBOARDING_STEPS.length;

      const updates: any = {
        completed_steps: completedSteps,
        current_step: isCompleted ? ONBOARDING_STEPS.length : nextStep,
        updated_at: new Date().toISOString()
      };

      if (isCompleted) {
        updates.is_completed = true;
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProgress(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete step');
      return null;
    }
  };

  const skipOnboarding = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          current_step: ONBOARDING_STEPS.length,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProgress(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip onboarding');
      return null;
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user?.id]);

  return {
    progress,
    steps: ONBOARDING_STEPS,
    loading,
    error,
    completeStep,
    skipOnboarding,
    refetch: fetchProgress
  };
};
