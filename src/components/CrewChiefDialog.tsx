import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CrewChiefDialogProps {
  carContext?: any;
}

export const CrewChiefDialog = ({ carContext }: CrewChiefDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [showPermissionMessage, setShowPermissionMessage] = useState(false);
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        handleAskQuestion(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Recognition Error",
          description: "Could not understand speech. Please try again.",
          variant: "destructive",
        });
      };
    }
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately after permission is granted
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionGranted(true);
      setShowPermissionMessage(false);
      toast({
        title: "Permission Granted",
        description: "You can now ask questions to the AI Crew Chief.",
      });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setShowPermissionMessage(true);
      toast({
        title: "Permission Required",
        description: "Microphone access is required to ask questions.",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    if (!micPermissionGranted) {
      setShowPermissionMessage(true);
      return;
    }

    try {
      setQuestion("");
      setAnswer("");
      setIsRecording(true);
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in this browser.",
          variant: "destructive",
        });
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      toast({
        title: "Recording Error",
        description: "Could not access microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleAskQuestion = async (questionText: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('crew-chief-qa', {
        body: { 
          question: questionText,
          carContext 
        }
      });

      if (error) throw error;

      if (data.answer) {
        setAnswer(data.answer);
        speakAnswer(data.answer);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI Crew Chief.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to use a natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = ['Microsoft David', 'David', 'Google US English', 'Alex', 'Daniel', 'Samantha'];
      const selectedVoice = voices.find(voice => 
        preferredVoices.some(pref => voice.name.includes(pref))
      ) || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <Mic className="mr-2 h-5 w-5" />
          Talk to Crew Chief
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Volume2 className="h-6 w-6 text-primary" />
            AI Crew Chief Q&A
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Recording Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full ${
                isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isRecording ? (
                <MicOff className="h-12 w-12" />
              ) : (
                <Mic className="h-12 w-12" />
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Listening... Click to stop' : 'Click to ask a question'}
            </p>
            
            {showPermissionMessage && !micPermissionGranted && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center max-w-md">
                <p className="text-yellow-200 mb-3">
                  Please allow microphone access in your browser to ask questions. Click the button below to grant permission.
                </p>
                <Button
                  onClick={requestMicrophonePermission}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  Allow Microphone
                </Button>
              </div>
            )}
          </div>

          {/* Question Display */}
          {question && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm font-semibold text-muted-foreground mb-1">Your Question:</p>
              <p className="text-foreground">{question}</p>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm font-medium">Analyzing...</p>
            </div>
          )}

          {/* Answer Display */}
          {answer && (
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-primary">Crew Chief Response:</p>
                {isSpeaking && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={stopSpeaking}
                    className="h-8"
                  >
                    <Volume2 className="h-4 w-4 mr-1 animate-pulse" />
                    Stop
                  </Button>
                )}
              </div>
              <p className="text-foreground leading-relaxed">{answer}</p>
            </div>
          )}

          {/* Instructions */}
          {!question && !isRecording && (
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Ask questions like:</p>
              <ul className="space-y-1">
                <li>"Should I pit now?"</li>
                <li>"How are my tires?"</li>
                <li>"What's my pace compared to the leader?"</li>
                <li>"When should I push harder?"</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
