import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { scenes } from "@/data/scenes";

interface ScenePlayerProps {
  onComplete: () => void;
}

const ScenePlayer = ({ onComplete }: ScenePlayerProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scene = scenes[currentScene];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        // Auto-advance to next scene after speech ends
        setTimeout(() => {
          if (currentScene < scenes.length - 1) {
            setCurrentScene(prev => prev + 1);
          } else {
            onComplete();
          }
        }, 1500);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isPlaying && !isPaused) {
      if (scene.videoSrc && videoRef.current) {
        videoRef.current.play();
      }
      if (scene.narration) {
        speak(scene.narration);
      }
    }
  }, [currentScene, isPlaying, isPaused]);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    speechSynthesis.pause();
  };

  const handleNext = () => {
    speechSynthesis.cancel();
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <section className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Scene counter */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-semibold tracking-wider text-muted-foreground">
              SCENE {currentScene + 1} / {scenes.length}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {scene.title}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-racing transition-all duration-500"
            style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
          />
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Video/Visual section */}
            <div className="relative aspect-video bg-card rounded-lg overflow-hidden border border-border shadow-racing">
              {scene.videoSrc ? (
                <video
                  ref={videoRef}
                  src={scene.videoSrc}
                  className="w-full h-full object-cover"
                  loop
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-dark">
                  <div className="text-center p-8">
                    <Volume2 className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                    <p className="text-lg text-muted-foreground">{scene.visual}</p>
                  </div>
                </div>
              )}
              
              {/* Overlay controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-center gap-4">
                  {!isPlaying || isPaused ? (
                    <Button
                      onClick={handlePlay}
                      size="lg"
                      className="bg-gradient-racing hover:shadow-racing"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      size="lg"
                      variant="secondary"
                    >
                      <Pause className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    size="lg"
                    variant="outline"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-6">
              <div className="p-6 bg-card rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  {scene.title}
                </h2>
                {scene.visual && (
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    {scene.visual}
                  </p>
                )}
              </div>

              {/* Dialogue/Narration */}
              <div className="space-y-4">
                {scene.speaker && (
                  <div className="p-4 bg-secondary/30 rounded-lg border-l-4 border-primary">
                    <div className="text-xs font-semibold text-primary mb-2 tracking-wider">
                      {scene.speaker}
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {scene.narration}
                    </p>
                  </div>
                )}
                
                {!scene.speaker && scene.narration && (
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {scene.narration}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional info */}
              {scene.additionalInfo && (
                <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                  {scene.additionalInfo}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScenePlayer;
