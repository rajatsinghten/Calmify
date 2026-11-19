import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  helpText?: string;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  placeholder = "Type a message...",
  disabled = false,
  isLoading = false,
  helpText,
  className
}: ChatInputProps) {
  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-md border-t border-border p-4",
      className
    )}>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyPress={onKeyPress}
          disabled={disabled || isLoading}
          className="flex-1 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/40"
        />
        <Button 
          onClick={onSend} 
          disabled={!value.trim() || disabled || isLoading}
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground mt-2">{helpText}</p>
      )}
    </div>
  );
}