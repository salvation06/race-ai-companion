import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Activity, Home } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed left-4 top-4 z-50 py-4 px-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-racing">
      <div className="flex flex-col items-center gap-3">
        <Link
          to="/"
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
            location.pathname === "/" 
              ? "bg-gradient-racing text-primary-foreground shadow-glow" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title="Home"
        >
          <Home className="h-5 w-5" />
        </Link>
        
        <Link
          to="/heartbeat"
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
            location.pathname === "/heartbeat"
              ? "bg-gradient-racing text-primary-foreground shadow-glow"
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title="HeartBeat"
        >
          <Activity className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
};
