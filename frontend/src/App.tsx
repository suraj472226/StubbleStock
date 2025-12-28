import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import AddStubble from "./pages/farmer/AddStubble";
import MyCluster from "./pages/farmer/MyCluster";
import Alternatives from "./pages/farmer/Alternatives";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import CreateDemand from "./pages/buyer/CreateDemand";
import AvailableClusters from "./pages/buyer/AvailableClusters";
import MyOrders from "./pages/buyer/MyOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/add-stubble" element={<AddStubble />} />
              <Route path="/farmer/my-cluster" element={<MyCluster />} />
              <Route path="/farmer/alternatives" element={<Alternatives />} />
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="/buyer/create-demand" element={<CreateDemand />} />
              <Route path="/buyer/available-clusters" element={<AvailableClusters />} />
              <Route path="/buyer/my-orders" element={<MyOrders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
