import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Slide } from "@shared/schema";
import { Calendar, User } from "lucide-react";

interface SlideCardProps {
  slide: Slide;
}

export function SlideCard({ slide }: SlideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (!textRef.current) return;
      
      const element = textRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxLines = 5;
      const maxHeight = lineHeight * maxLines;
      
      const tempElement = element.cloneNode(true) as HTMLPreElement;
      tempElement.style.maxHeight = 'none';
      tempElement.style.webkitLineClamp = 'unset';
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.width = element.offsetWidth + 'px';
      
      element.parentElement?.appendChild(tempElement);
      const actualHeight = tempElement.scrollHeight;
      element.parentElement?.removeChild(tempElement);
      
      setHasOverflow(actualHeight > maxHeight + 5);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [slide.texto]);

  return (
    <Card className="hover-elevate" data-testid={`card-slide-${slide.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2" data-testid={`text-assunto-${slide.id}`}>
            {slide.assunto}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <pre 
            ref={textRef}
            className={`whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed ${
              !isExpanded && hasOverflow ? 'line-clamp-5' : ''
            }`}
            data-testid={`text-texto-${slide.id}`}
          >
            {slide.texto}
          </pre>
          {hasOverflow && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary -ml-2 h-auto p-2"
              data-testid={`button-toggle-${slide.id}`}
            >
              {isExpanded ? "ver menos" : "ver mais"}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5" data-testid={`text-autor-${slide.id}`}>
            <User className="h-3.5 w-3.5" />
            <span>{slide.autor}</span>
          </div>
          <div className="flex items-center gap-1.5" data-testid={`text-data-${slide.id}`}>
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(slide.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
