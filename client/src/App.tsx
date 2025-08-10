import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PixelNav from "./components/pixel-nav";
import Home from "./pages/home";
import Stamps from "./pages/stamps";
import Community from "./pages/community";
import Token from "./pages/token";
import Lore from "./pages/lore";

function Router() {
  return (
    <>
      <PixelNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/stamps" component={Stamps} />
        <Route path="/community" component={Community} />
        <Route path="/token" component={Token} />
        <Route path="/lore" component={Lore} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
