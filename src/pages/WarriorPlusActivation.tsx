import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const planNames = {
  basic: "Basic Plan",
  golden: "Golden Edition",
  unlimited: "Unlimited Access",
};

export default function WarriorPlusActivation() {
  const { plan } = useParams<{ plan: "basic" | "golden" | "unlimited" }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planName = plan && planNames[plan];

  useEffect(() => {
    const activatePlan = async () => {
      if (!plan || !planName) {
        navigate("/");
        return;
      }

      try {
        // Get email from WarriorPlus params
        const email = searchParams.get("email") || searchParams.get("cust_email");

        if (!email) {
          setError("No email provided. Please contact support.");
          setProcessing(false);
          return;
        }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!existingUser) {
          setError("No account found for this email. Please sign up using your WarriorPlus purchase email first.");
          setProcessing(false);
          return;
        }

        // Update existing user's plan
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ plan })
          .eq("email", email);

        if (updateError) throw updateError;

        // Success - redirect to main app
        toast.success(`Your ${planName} has been activated successfully!`);
        setTimeout(() => {
          navigate("/text-to-image");
        }, 1500);
        
      } catch (error: any) {
        console.error("Activation error:", error);
        setError("Failed to activate plan. Please contact support.");
        setProcessing(false);
      }
    };

    activatePlan();
  }, [plan, planName, searchParams, navigate]);

  if (!planName) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(25_100%_95%)] to-[hsl(270_80%_95%)] p-4">
      <Card className="w-full max-w-md shadow-xl border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {processing ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : error ? (
              <AlertCircle className="h-8 w-8 text-destructive" />
            ) : null}
          </div>
          <CardTitle className="text-2xl">
            {processing ? "Activating Your Plan..." : error ? "Activation Failed" : "Success!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {processing ? (
            <p className="text-center text-muted-foreground">
              Please wait while we activate your {planName}...
            </p>
          ) : error ? (
            <p className="text-center text-muted-foreground">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
