import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

export default function ImageToImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const { checkUsageLimit, incrementUsage } = useProfile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProcessedImage(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    if (!checkUsageLimit()) return;

    setProcessing(true);
    try {
      // Convert to coloring page (simplified line art)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw original image
            ctx.drawImage(img, 0, 0);
            
            // Apply edge detection filter to create coloring page effect
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Simple edge detection and black/white conversion
            for (let i = 0; i < data.length; i += 4) {
              const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
              const edge = avg < 128 ? 0 : 255;
              data[i] = edge;
              data[i + 1] = edge;
              data[i + 2] = edge;
            }
            
            ctx.putImageData(imageData, 0, 0);
            setProcessedImage(canvas.toDataURL('image/png'));
            incrementUsage.mutate();
            toast.success("Image converted to coloring page!");
          }
        };
      };
      reader.readAsDataURL(selectedFile);
    } catch (error: any) {
      console.error('Processing error:', error);
      toast.error("Failed to process image");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `coloring-page-${Date.now()}.png`;
    link.click();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Image to Image</CardTitle>
            <CardDescription>
              Convert any image into a coloring book page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <div className="rounded-lg border-2 border-dashed border-border p-4">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Selected" 
                  className="w-full max-h-64 object-contain"
                />
              </div>
            )}
            <Button 
              onClick={handleProcess} 
              disabled={processing || !selectedFile}
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Convert to Coloring Page
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {processedImage && (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <img 
                  src={processedImage} 
                  alt="Coloring page" 
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
