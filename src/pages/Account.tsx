import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const planDetails = {
  basic: { name: "Basic Plan", price: "$14.97", limit: "10 generations/day", color: "bg-blue-500" },
  golden: { name: "Golden Edition", price: "$27", limit: "50 generations/day", color: "bg-yellow-500" },
  unlimited: { name: "Unlimited Access", price: "$47", limit: "Unlimited", color: "bg-purple-500" },
};

export default function Account() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const currentPlan = planDetails[profile.plan];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <CardDescription>Manage your plan and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Current Plan</h3>
              <div className="flex items-center gap-2">
                <Badge className={`${currentPlan.color} text-white`}>
                  {currentPlan.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentPlan.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentPlan.limit}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Usage Today</h3>
              <p className="text-2xl font-bold text-primary">
                {profile.usage_count}
                {profile.plan !== 'unlimited' && (
                  <span className="text-sm text-muted-foreground ml-2">
                    / {profile.plan === 'basic' ? '10' : '50'}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {profile.plan !== 'unlimited' && (
          <Card className="shadow-lg border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Upgrade Your Plan
              </CardTitle>
              <CardDescription>
                Plans can only be upgraded through WarriorPlus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 border border-border rounded-lg bg-muted/50 text-center">
                <p className="text-muted-foreground mb-2">
                  To upgrade your plan, please purchase through WarriorPlus.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your plan will be automatically activated using your purchase email.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
