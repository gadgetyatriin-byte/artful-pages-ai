import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const incrementUsage = useMutation({
    mutationFn: async () => {
      if (!user || !profile) throw new Error("Not authenticated");

      // Reset usage if it's a new day
      const today = new Date().toISOString().split('T')[0];
      const lastReset = profile.last_reset_date;
      
      let newUsageCount = profile.usage_count + 1;
      if (lastReset !== today) {
        newUsageCount = 1;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ 
          usage_count: newUsageCount,
          last_reset_date: today
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const checkUsageLimit = (): boolean => {
    if (!profile) return false;

    const limits: Record<string, number> = {
      basic: 10,
      golden: 50,
      unlimited: Infinity,
    };

    const limit = limits[profile.plan] || 0;
    
    if (profile.usage_count >= limit) {
      toast.error("Usage limit reached! Please upgrade your plan.");
      return false;
    }
    
    return true;
  };

  return {
    profile,
    isLoading,
    incrementUsage,
    checkUsageLimit,
  };
}
