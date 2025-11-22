'use client';

import { useState, useRef, useEffect } from 'react';
import { CornerDownLeft, Loader2, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chat, ChatInput } from '@/ai/flows/chatbot-flow';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const chatInput: ChatInput = {
            question: input,
            history: messages,
        };
        const response = await chat(chatInput);
        const modelMessage: ChatMessage = { role: 'model', content: response };
        setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
        console.error('Chatbot error:', error);
        const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render before scrolling
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
            side="top" 
            align="end" 
            className="w-[90vw] max-w-sm p-0 rounded-lg shadow-2xl border-border/50"
            sideOffset={16}
        >
          <div className="flex flex-col h-[60vh] bg-card rounded-lg">
            <header className="p-4 border-b">
                <h3 className="font-semibold text-lg flex items-center gap-2">Ask Pulse <Badge variant="secondary">AI</Badge></h3>
                <p className="text-sm text-muted-foreground">Your guide to Blood Bridge & donation.</p>
            </header>
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                        <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-muted max-w-[80%]">
                        <p className="text-sm">Hi! I'm Pulse. How can I help you today?</p>
                    </div>
                </div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                       <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                            <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-lg max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                       <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                            <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin"/>
                           <p className="text-sm">Pulse is thinking...</p>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <footer className="p-4 border-t">
                <div className="relative">
                    <Textarea
                        placeholder="Ask about donation, app features..."
                        className="pr-16"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute top-1/2 right-2 -translate-y-1/2"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        <CornerDownLeft className="h-4 w-4" />
                    </Button>
                </div>
            </footer>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
