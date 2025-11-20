import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import helmetImage from "@/assets/ai-chief-helmet.png";

interface HeroProps {
  onStartDemo: () => void;
}

const Hero = ({ onStartDemo }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo/Brand */}
        <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm font-semibold tracking-wider text-muted-foreground">TOYOTA GR RACING</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            X-RaceIQ
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light tracking-wide">
          AI CREW CHIEF SYSTEM
        </p>

        <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto font-light">
          Real-time LLM-powered racing strategist designed for the GR86 platform.
          <br />
          <span className="text-primary font-medium">Every millisecond matters.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onStartDemo}
            size="lg"
            className="group relative bg-gradient-racing hover:shadow-racing transition-all duration-300 text-lg px-8 py-6 font-bold"
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            START DEMO
            <div className="absolute inset-0 bg-gradient-racing opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          </Button>
          
          <Button
            onClick={() => window.location.href = '/heartbeat'}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-bold border-2 hover:border-primary hover:text-primary transition-all duration-300"
          >
            LIVE HEARTBEAT DASHBOARD
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl font-bold text-primary mb-2">&lt; 100ms</div>
            <div className="text-sm text-muted-foreground">Response Time</div>
          </div>
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-sm text-muted-foreground">LLM Analysis</div>
          </div>
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
            <div className="text-3xl font-bold text-primary mb-2">GR86</div>
            <div className="text-sm text-muted-foreground">Platform Optimized</div>
          </div>
        </div>

        {/* AI Chief Radio Helmet Showcase */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-card/30 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 md:p-12 hover:border-primary/50 transition-all duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-bold tracking-wider text-primary">HARDWARE</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  AI CHIEF RADIO™
                </h2>
                <p className="text-muted-foreground text-lg font-light">
                  Helmet-mounted AI race engineer for Toyota GR Cup
                </p>
              </div>
              
              <div className="relative">
                <img 
                  src={helmetImage} 
                  alt="AI Chief Radio Helmet System" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
