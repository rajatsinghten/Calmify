import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, Video, Headphones } from "lucide-react";

interface MediaCardProps {
  title: string;
  duration: string;
  language: string;
  type: "audio" | "video" | "article" | "exercise";
  action: string;
  onAction: () => void;
}

const typeIcons = {
  audio: Headphones,
  video: Video,
  article: FileText,
  exercise: Play,
};

export function MediaCard({ title, duration, language, type, action, onAction }: MediaCardProps) {
  const Icon = typeIcons[type];

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {duration} • {language}
            </p>
          </div>
          <Button 
            onClick={onAction}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {action}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}