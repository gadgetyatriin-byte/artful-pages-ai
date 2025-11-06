import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Auth from "./pages/Auth";
import TextToImage from "./pages/TextToImage";
import ImageToImage from "./pages/ImageToImage";
import PromptToBook from "./pages/PromptToBook";
import Flipbook from "./pages/Flipbook";
import Account from "./pages/Account";
import UpgradePage from "./pages/UpgradePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import WarriorPlusActivation from "./pages/WarriorPlusActivation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/text-to-image" replace />} />
            
            <Route path="/text-to-image" element={
              <ProtectedRoute>
                <TextToImage />
              </ProtectedRoute>
            } />
            <Route path="/image-to-image" element={
              <ProtectedRoute>
                <ImageToImage />
              </ProtectedRoute>
            } />
            <Route path="/prompt-to-book" element={
              <ProtectedRoute>
                <PromptToBook />
              </ProtectedRoute>
            } />
            <Route path="/flipbook" element={
              <ProtectedRoute>
                <Flipbook />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            
            <Route path="/upgrade/:plan" element={
              <ProtectedRoute>
                <UpgradePage />
              </ProtectedRoute>
            } />
            
            {/* WarriorPlus Integration Routes */}
            <Route path="/warriorplus/:plan" element={<WarriorPlusActivation />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
