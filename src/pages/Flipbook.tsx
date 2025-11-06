import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Flipbook() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  if (profile?.plan !== 'unlimited') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Flipbook Creator</h2>
              <p className="text-muted-foreground mb-6">
                This feature is only available for Unlimited plan subscribers
              </p>
              <Button onClick={() => navigate("/account")}>
                View Upgrade Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Flipbook Creator</CardTitle>
            <CardDescription>
              Convert PDFs into interactive flipbooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Flipbook creator feature coming soon!</p>
              <p className="text-sm mt-2">Upload PDFs and create interactive page-turning experiences</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
