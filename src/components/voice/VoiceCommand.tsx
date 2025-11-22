import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface VoiceCommandProps {
  onCommand: (command: string, params: Record<string, string>) => void;
}

export default function VoiceCommand({ onCommand }: VoiceCommandProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          if (event.results[current].isFinal) {
            processCommand(transcriptText);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: 'Voice Recognition Error',
            description: 'Please try again or check microphone permissions.',
            variant: 'destructive',
          });
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: 'Listening...',
        description: 'Speak your command now',
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('check stock') || lowerText.includes('check availability')) {
      const productMatch = lowerText.match(/(?:check stock|check availability) (?:of |for )?(.+)/);
      if (productMatch) {
        onCommand('check_stock', { product: productMatch[1] });
        speak(`Checking stock for ${productMatch[1]}`);
      }
    } else if (lowerText.includes('create receipt')) {
      const quantityMatch = lowerText.match(/create receipt (?:for )?(\d+) (?:units? )?(?:of )?(.+)/);
      if (quantityMatch) {
        onCommand('create_receipt', { quantity: quantityMatch[1], product: quantityMatch[2] });
        speak(`Creating receipt for ${quantityMatch[1]} units of ${quantityMatch[2]}`);
      }
    } else if (lowerText.includes('create delivery')) {
      const quantityMatch = lowerText.match(/create delivery (?:for )?(\d+) (?:units? )?(?:of )?(.+)/);
      if (quantityMatch) {
        onCommand('create_delivery', { quantity: quantityMatch[1], product: quantityMatch[2] });
        speak(`Creating delivery for ${quantityMatch[1]} units of ${quantityMatch[2]}`);
      }
    } else if (lowerText.includes('show dashboard') || lowerText.includes('go to dashboard')) {
      onCommand('navigate', { page: 'dashboard' });
      speak('Opening dashboard');
    } else if (lowerText.includes('show products') || lowerText.includes('go to products')) {
      onCommand('navigate', { page: 'products' });
      speak('Opening products page');
    } else if (lowerText.includes('low stock') || lowerText.includes('show alerts')) {
      onCommand('show_alerts', {});
      speak('Showing low stock alerts');
    } else {
      toast({
        title: 'Command Not Recognized',
        description: 'Try: "Check stock of [product]" or "Create receipt for [quantity] [product]"',
      });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="h-5 w-5 text-muted-foreground" />
            Voice Commands Unavailable
          </CardTitle>
          <CardDescription>
            Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            <CardTitle>Voice Commands</CardTitle>
          </div>
          {isListening && (
            <Badge variant="default" className="animate-pulse">
              Listening...
            </Badge>
          )}
        </div>
        <CardDescription>
          Hands-free control for warehouse operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button
            size="lg"
            variant={isListening ? 'destructive' : 'default'}
            onClick={isListening ? stopListening : startListening}
            className="w-32 h-32 rounded-full"
          >
            {isListening ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </Button>
        </div>

        {transcript && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="font-medium">{transcript}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Example commands:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• "Check stock of Steel Rods"</li>
            <li>• "Create receipt for 50 units of Bolts"</li>
            <li>• "Create delivery for 20 units of Screws"</li>
            <li>• "Show dashboard"</li>
            <li>• "Show low stock alerts"</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>💡 Tip: Speak clearly and wait for the beep before speaking</p>
        </div>
      </CardContent>
    </Card>
  );
}
