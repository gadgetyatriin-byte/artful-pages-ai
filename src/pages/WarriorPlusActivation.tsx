import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const planDetails = {
  basic: { 
    name: "Basic Plan", 
    price: "$14.97", 
    features: ["10 generations per day", "Text to Image", "Image to Image", "Email support"] 
  },
  golden: { 
    name: "Golden Edition", 
    price: "$27", 
    features: ["50 generations per day", "All Basic features", "Prompt to Book", "Priority support"] 
  },
  unlimited: { 
    name: "Unlimited Access", 
    price: "$47", 
    features: ["Unlimited generations", "All Golden features", "Flipbook Creator", "Premium support"] 
  },
};

export default function WarriorPlusActivation() {
  const { plan } = useParams<{ plan: "basic" | "golden" | "unlimited" }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activating, setActivating] = useState(true);
  const [activated, setActivated] = useState(false);

  const currentPlan = plan && planDetails[plan];

  useEffect(() => {
    const activatePlan = async () => {
      if (!plan || !currentPlan) {
        navigate("/");
        return;
      }

      try {
        // Get email from WarriorPlus params
        const email = searchParams.get("email") || searchParams.get("cust_email");
        const transactionId = searchParams.get("tid") || searchParams.get("transaction_id");

        if (!email) {
          toast.error("No email provided. Please contact support.");
          setActivating(false);
          return;
        }

        // Check if user exists
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .single();

        if (existingUser) {
          // Update existing user's plan
          const { error } = await supabase
            .from("profiles")
            .update({ plan })
            .eq("email", email);

          if (error) throw error;
        } else {
          // Create temporary password for new user
          const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";
          
          // Sign up new user
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: tempPassword,
            options: {
              data: {
                transaction_id: transactionId,
              }
            }
          });

          if (signUpError) throw signUpError;

          // Update plan for new user
          if (authData.user) {
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ plan })
              .eq("user_id", authData.user.id);

            if (updateError) throw updateError;
          }
        }

        setActivated(true);
        toast.success(`${currentPlan.name} activated successfully!`);
        
      } catch (error: any) {
        console.error("Activation error:", error);
        toast.error("Failed to activate plan. Please contact support.");
      } finally {
        setActivating(false);
      }
    };

    activatePlan();
  }, [plan, currentPlan, searchParams, navigate]);

  if (!currentPlan) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(25_100%_95%)] to-[hsl(270_80%_95%)] p-4">
      <Card className="w-full max-w-md shadow-xl border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {activating ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {activating ? "Activating Your Plan..." : `${currentPlan.name} Activated!`}
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-primary">
            {currentPlan.price}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {activating ? (
            <div className="text-center text-muted-foreground">
              Please wait while we set up your account...
            </div>
          ) : activated ? (
            <>
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
                  onClick={() => navigate("/auth")}
                  className="w-full"
                >
                  Login to Start Creating
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Check your email for login credentials
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                There was an issue activating your plan. Please contact support.
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
