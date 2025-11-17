import { useState } from "react";
import Hero from "@/components/Hero";
import ScenePlayer from "@/components/ScenePlayer";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleDemoComplete = () => {
    setDemoComplete(true);
  };

  const handleRestart = () => {
    setShowDemo(false);
    setDemoComplete(false);
  };

  if (demoComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-8 container mx-auto px-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary/50 backdrop-blur-sm border border-border mb-4">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-semibold tracking-wider text-muted-foreground">DEMO COMPLETE</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              System Ready
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            AI Crew Chief brings strategy, coaching, and engineering insight into the cockpit.
            <br />
            <span className="text-primary font-medium">Built for Toyota GR Cup.</span>
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-racing hover:shadow-racing transition-all duration-300 rounded-lg font-bold text-lg"
            >
              Restart Demo
            </button>
          </div>

          <div className="mt-16 p-8 bg-card rounded-lg border border-border max-w-3xl mx-auto text-left">
            <h3 className="text-2xl font-bold mb-4 text-primary">Key Features</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Real-time LLM analysis and strategic recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Historical race data integration for competitive insights</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Platform-specific GR86 engineering optimization</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Live telemetry monitoring and pace analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <span>Predictive tire management and degradation tracking</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (showDemo) {
    return <ScenePlayer onComplete={handleDemoComplete} />;
  }

  return (
    <>
      <Navigation />
      <Hero onStartDemo={handleStartDemo} />
    </>
  );
};

export default Index;
