import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { scenes } from "@/data/scenes";
import productImage from "@/assets/ai-headset-model.png";
import dashboardCockpit from "@/assets/dashboard-cockpit.png";

interface ScenePlayerProps {
  onComplete: () => void;
}

const ScenePlayer = ({ onComplete }: ScenePlayerProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [showPermissionMessage, setShowPermissionMessage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scene = scenes[currentScene];

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const currentSpeaker = scene?.speaker;
      
      // Use different voices for Driver vs AI Crew Chief/Narrator
      if (currentSpeaker === 'Driver') {
        // Driver voice: prefer different male voice than crew chief
        const driverVoicePreferences = [
          'Microsoft Mark',
          'Mark',
          'Google US English',
          'Fred',
          'Ralph',
          'Microsoft Zira Desktop',
          'Rishi'
        ];
        
        const selectedVoice = voices.find(voice => 
          driverVoicePreferences.some(preferred => voice.name.includes(preferred))
        ) || voices.find(voice => voice.lang.includes('en') && !voice.name.includes('David'));
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0; // Normal pitch for driver
        utterance.volume = 1.0;
      } else {
        // AI Crew Chief/Narrator voice: prefer deeper male voice
        const crewChiefVoicePreferences = [
          'Microsoft David',
          'David',
          'Google UK English Male',
          'Microsoft David Desktop',
          'Google US English Male',
          'Alex',
          'Daniel'
        ];
        
        const selectedVoice = voices.find(voice => 
          crewChiefVoicePreferences.some(preferred => voice.name.includes(preferred))
        ) || voices.find(voice => voice.name.toLowerCase().includes('male'));
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 0.9; // Lower pitch for AI Crew Chief
        utterance.volume = 1.0;
      }

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
      // Skip speech synthesis for scene 1 (intro video)
      if (scene.narration && scene.narration.trim() && currentScene !== 0) {
        speak(scene.narration);
      } else if (!scene.narration || !scene.narration.trim() || currentScene === 0) {
        // Auto-advance after video ends if no narration
        if (scene.videoSrc && videoRef.current) {
          const video = videoRef.current;
          const handleVideoEnd = () => {
            setTimeout(() => {
              if (currentScene < scenes.length - 1) {
                setCurrentScene(prev => prev + 1);
              } else {
                onComplete();
              }
            }, 500);
          };
          video.addEventListener('ended', handleVideoEnd);
          return () => video.removeEventListener('ended', handleVideoEnd);
        }
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

  const handleBack = () => {
    speechSynthesis.cancel();
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
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
              ) : scene.imageSrc ? (
                <img 
                  src={dashboardCockpit} 
                  alt={scene.visual}
                  className="w-full h-full object-cover"
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
                  <Button
                    onClick={handleBack}
                    size="lg"
                    variant="outline"
                    disabled={currentScene === 0}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
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

          {/* Product Showcase */}
          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-gradient-racing opacity-20 blur-3xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8 shadow-racing hover:border-primary/60 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-block mb-3 px-4 py-1 bg-primary/20 border border-primary rounded-full">
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">
                      Actual Product
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    AI Crew Chief Device
                  </h3>
                  <p className="text-muted-foreground">
                    Professional-grade AI race engineering system designed for real-time telemetry analysis and strategic coaching.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-racing opacity-30 rounded-2xl blur-xl group-hover:opacity-50 transition-opacity duration-300" />
                    <img 
                      src={productImage} 
                      alt="AI Crew Chief Radio Device" 
                      className="relative w-64 h-64 object-cover rounded-xl shadow-2xl ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScenePlayer;
