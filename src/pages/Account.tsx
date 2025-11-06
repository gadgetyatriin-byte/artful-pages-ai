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
                Unlock more generations and exclusive features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {profile.plan === 'basic' && (
                  <>
                    <Card className="border-yellow-500">
                      <CardHeader>
                        <CardTitle>Golden Edition</CardTitle>
                        <CardDescription>$27</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>✓ 50 generations per day</li>
                          <li>✓ All basic features</li>
                          <li>✓ Priority support</li>
                        </ul>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => navigate("/upgrade/golden")}
                        >
                          Upgrade to Golden
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-500">
                      <CardHeader>
                        <CardTitle>Unlimited Access</CardTitle>
                        <CardDescription>$47</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>✓ Unlimited generations</li>
                          <li>✓ Flipbook creator access</li>
                          <li>✓ All features unlocked</li>
                          <li>✓ Premium support</li>
                        </ul>
                        <Button 
                          className="w-full mt-4"
                          onClick={() => navigate("/upgrade/unlimited")}
                        >
                          Upgrade to Unlimited
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
                {profile.plan === 'golden' && (
                  <Card className="border-purple-500">
                    <CardHeader>
                      <CardTitle>Unlimited Access</CardTitle>
                      <CardDescription>$47</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✓ Unlimited generations</li>
                        <li>✓ Flipbook creator access</li>
                        <li>✓ All features unlocked</li>
                        <li>✓ Premium support</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => navigate("/upgrade/unlimited")}
                      >
                        Upgrade to Unlimited
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
