import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, Home } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-racing">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            location.pathname === "/" 
              ? "bg-gradient-racing text-primary-foreground shadow-glow" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4" />
          <span className="font-semibold">Home</span>
        </Link>
        
        <Link
          to="/heartbeat"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
            location.pathname === "/heartbeat"
              ? "bg-gradient-racing text-primary-foreground shadow-glow"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          <Activity className="h-4 w-4" />
          <span className="font-semibold">HeartBeat</span>
        </Link>
      </div>
    </nav>
  );
};
