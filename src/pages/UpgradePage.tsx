import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const planDetails = {
  basic: { name: "Basic Plan", price: "$14.97", features: ["10 generations per day", "Text to Image", "Image to Image", "Email support"] },
  golden: { name: "Golden Edition", price: "$27", features: ["50 generations per day", "All Basic features", "Prompt to Book", "Priority support"] },
  unlimited: { name: "Unlimited Access", price: "$47", features: ["Unlimited generations", "All Golden features", "Flipbook Creator", "Premium support"] },
};

export default function UpgradePage() {
  const { plan } = useParams<{ plan: "basic" | "golden" | "unlimited" }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const currentPlan = plan && planDetails[plan];

  useEffect(() => {
    const updatePlan = async () => {
      if (!user || !plan) return;

      try {
        const { error } = await supabase
          .from("profiles")
          .update({ plan })
          .eq("user_id", user.id);

        if (error) throw error;
        
        toast.success(`${currentPlan?.name} activated successfully!`);
      } catch (error: any) {
        console.error("Plan update error:", error);
        toast.error("Failed to update plan");
      }
    };

    updatePlan();
  }, [user, plan]);

  if (!currentPlan) {
    navigate("/account");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(25_100%_95%)] to-[hsl(270_80%_95%)] p-4">
      <Card className="w-full max-w-md shadow-xl border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl">{currentPlan.name} Activated!</CardTitle>
          <CardDescription className="text-lg font-semibold text-primary">
            {currentPlan.price}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {currentPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => navigate("/text-to-image")}
              className="w-full"
            >
              Start Creating
            </Button>
            <Button 
              onClick={() => navigate("/account")}
              variant="outline"
              className="w-full"
            >
              View Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
