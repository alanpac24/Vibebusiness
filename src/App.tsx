import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import IdeaRefiner from "./pages/IdeaRefiner";
import MarketResearch from "./pages/MarketResearch";
import OfferDesign from "./pages/OfferDesign";
import PricingStrategy from "./pages/PricingStrategy";
import GTMPlanner from "./pages/GTMPlanner";
import MessagingCopy from "./pages/MessagingCopy";
import Financials from "./pages/Financials";
import RiskCompliance from "./pages/RiskCompliance";
import InvestorOnePager from "./pages/InvestorOnePager";
import RunsPage from "./pages/RunsPage";
import AgentsLibrary from "./pages/AgentsLibrary";
import WorkflowDetail from "./pages/WorkflowDetail";
import Auth from "./pages/Auth";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - no layout */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            
            {/* Protected routes - with layout */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/idea-refiner" element={<Layout><IdeaRefiner /></Layout>} />
            <Route path="/market-research" element={<Layout><MarketResearch /></Layout>} />
            <Route path="/offer-design" element={<Layout><OfferDesign /></Layout>} />
            <Route path="/pricing-strategy" element={<Layout><PricingStrategy /></Layout>} />
            <Route path="/gtm-planner" element={<Layout><GTMPlanner /></Layout>} />
            <Route path="/messaging-copy" element={<Layout><MessagingCopy /></Layout>} />
            <Route path="/financials" element={<Layout><Financials /></Layout>} />
            <Route path="/risk-compliance" element={<Layout><RiskCompliance /></Layout>} />
            <Route path="/investor-one-pager" element={<Layout><InvestorOnePager /></Layout>} />
            <Route path="/runs" element={<Layout><RunsPage /></Layout>} />
            <Route path="/agents" element={<Layout><AgentsLibrary /></Layout>} />
            <Route path="/workflow/:id" element={<Layout><WorkflowDetail /></Layout>} />
            
            {/* Redirects for backward compatibility */}
            <Route path="/market-sizing" element={<Navigate to="/market-research" replace />} />
            <Route path="/offer-packaging" element={<Navigate to="/offer-design" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
