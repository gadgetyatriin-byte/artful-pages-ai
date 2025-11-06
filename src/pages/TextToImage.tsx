import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export default function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { checkUsageLimit, incrementUsage } = useProfile();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!checkUsageLimit()) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-coloring-page', {
        body: { prompt }
      });

      if (error) throw error;

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        await incrementUsage.mutateAsync();
        toast.success("Coloring page generated!");
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `coloring-page-${Date.now()}.png`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Text to Image</CardTitle>
            <CardDescription>
              Generate beautiful coloring book pages from text prompts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="E.g., cute baby elephant in cartoon style for coloring book"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Coloring Page"
              )}
            </Button>
          </CardContent>
        </Card>

        {imageUrl && (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <img 
                  src={imageUrl} 
                  alt="Generated coloring page" 
                  className="w-full rounded-lg border-2 border-border"
                />
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PNG
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
