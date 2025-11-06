import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { Lock, Upload, Download, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import { jsPDF } from "jspdf";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Flipbook() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error("Please upload a valid PDF file");
      return;
    }

    setIsLoading(true);
    setPdfFile(file);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageImages: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport, canvas }).promise;
        pageImages.push(canvas.toDataURL('image/png'));
      }

      setPages(pageImages);
      setCurrentPage(0);
      toast.success(`Loaded ${pdf.numPages} pages successfully`);
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error("Failed to process PDF file");
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsPDF = () => {
    if (pages.length === 0) return;
    
    const pdf = new jsPDF();
    pages.forEach((page, index) => {
      if (index > 0) pdf.addPage();
      pdf.addImage(page, 'PNG', 0, 0, 210, 297);
    });
    pdf.save(`flipbook-${Date.now()}.pdf`);
    toast.success("PDF exported successfully");
  };

  const exportAsPNG = () => {
    if (pages.length === 0) return;
    
    pages.forEach((page, index) => {
      const link = document.createElement('a');
      link.href = page;
      link.download = `page-${index + 1}.png`;
      link.click();
    });
    toast.success(`Exported ${pages.length} PNG images`);
  };

  const exportAsJPG = () => {
    if (pages.length === 0) return;
    
    pages.forEach((page, index) => {
      const img = new Image();
      img.src = page;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        const link = document.createElement('a');
        link.href = jpgUrl;
        link.download = `page-${index + 1}.jpg`;
        link.click();
      };
    });
    toast.success(`Exported ${pages.length} JPG images`);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Flipbook Creator</CardTitle>
            <CardDescription>
              Upload a PDF and convert it into an interactive flipbook
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                size="lg"
                className="w-full max-w-md"
              >
                <Upload className="mr-2 h-5 w-5" />
                {isLoading ? "Processing..." : "Upload PDF"}
              </Button>
              {pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Loaded: {pdfFile.name} ({pages.length} pages)
                </p>
              )}
            </div>

            {/* Flipbook Preview */}
            {pages.length > 0 && (
              <div className="space-y-4">
                <div className="relative bg-muted/50 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
                  <img
                    src={pages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    className="max-w-full max-h-[600px] rounded-lg shadow-xl transition-all duration-300"
                  />
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage + 1} of {pages.length}
                  </span>
                  <Button
                    onClick={nextPage}
                    disabled={currentPage === pages.length - 1}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>

                {/* Export Options */}
                <div className="flex flex-wrap gap-3 justify-center pt-4 border-t">
                  <Button onClick={exportAsPDF} variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                  <Button onClick={exportAsPNG} variant="outline">
                    <FileImage className="mr-2 h-4 w-4" />
                    Export as PNG
                  </Button>
                  <Button onClick={exportAsJPG} variant="outline">
                    <FileImage className="mr-2 h-4 w-4" />
                    Export as JPG
                  </Button>
                </div>
              </div>
            )}

            {pages.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Upload a PDF to get started</p>
                <p className="text-sm mt-2">Create interactive flipbooks with page-turning preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
