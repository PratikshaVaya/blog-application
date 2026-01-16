import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { BlogLayout } from "./pages/BlogLayout";
import { CreateBlog } from "./pages/CreateBlog";
import { EditBlog } from "./pages/EditBlog";

/**
 * Main App Component
 * Sets up TanStack Query provider and routing
 * Uses split-panel layout for blog list and detail
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to blogs list */}
          <Route path="/" element={<Navigate to="/blogs" replace />} />
          {/* Split panel view - shows both list and detail */}
          <Route path="/blogs" element={<BlogLayout />} />
          <Route path="/blogs/:id" element={<BlogLayout />} />
          {/* Full page forms */}
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/blogs" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
