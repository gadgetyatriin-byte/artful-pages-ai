import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import jsPDF from "jspdf";

export default function PromptToBook() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { checkUsageLimit, incrementUsage, profile } = useProfile();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!checkUsageLimit()) return;

    setGenerating(true);
    setImages([]);
    
    try {
      // Generate 4-5 variations of the prompt
      const variations = [
        `${prompt} - page 1, front view`,
        `${prompt} - page 2, side angle`,
        `${prompt} - page 3, different pose`,
        `${prompt} - page 4, action scene`,
        `${prompt} - page 5, close-up detail`,
      ];

      const generatedImages: string[] = [];

      for (const variation of variations) {
        const { data, error } = await supabase.functions.invoke('generate-coloring-page', {
          body: { prompt: variation }
        });

        if (error) throw error;
        if (data.imageUrl) {
          generatedImages.push(data.imageUrl);
          setImages([...generatedImages]); // Update UI progressively
        }
      }

      await incrementUsage.mutateAsync();
      toast.success("Coloring book pages generated!");
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || "Failed to generate images");
    } finally {
      setGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    if (images.length === 0) return;

    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        
        // Add image to PDF
        const img = new Image();
        img.src = images[i];
        await new Promise((resolve) => {
          img.onload = () => {
            pdf.addImage(img, 'PNG', 10, 10, 190, 277);
            resolve(null);
          };
        });
      }

      pdf.save(`coloring-book-${Date.now()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Prompt to Book</CardTitle>
            <CardDescription>
              Generate a multi-page coloring book from a single prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="E.g., adventures of a friendly dragon"
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
                  Generating {images.length}/5 pages...
                </>
              ) : (
                "Generate 5-Page Book"
              )}
            </Button>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <>
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="space-y-2">
                      <img 
                        src={img} 
                        alt={`Page ${idx + 1}`}
                        className="w-full rounded-lg border-2 border-border"
                      />
                      <p className="text-sm text-center text-muted-foreground">
                        Page {idx + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleExportPDF} 
              className="w-full"
              disabled={generating}
            >
              <Download className="mr-2 h-4 w-4" />
              Export as PDF Book
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}
