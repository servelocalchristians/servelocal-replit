import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Opportunities from "@/pages/opportunities";
import ChurchDashboard from "@/pages/church-dashboard";
import CreateOpportunity from "@/pages/create-opportunity";
import ChurchRegistration from "@/pages/church-registration";
import About from "@/pages/about";
import AuthPage from "@/pages/auth-page";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/about" component={About} />
          <Route path="/auth" component={AuthPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/opportunities" component={Opportunities} />
          <Route path="/church-dashboard" component={ChurchDashboard} />
          <Route path="/create-opportunity" component={CreateOpportunity} />
          <Route path="/register-church" component={ChurchRegistration} />
          <Route path="/about" component={About} />
          <Route path="/auth" component={AuthPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
