import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DuplicateMatch } from "@shared/schema";
import { AlertTriangle, X } from "lucide-react";

interface DuplicateWarningProps {
  matches: DuplicateMatch[];
  onDismiss: () => void;
  onProceed: () => void;
}

export function DuplicateWarning({ matches, onDismiss, onProceed }: DuplicateWarningProps) {
  const highestMatch = matches[0];
  const similarityPercent = Math.round(highestMatch.similarity * 100);
  
  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return "destructive";
    if (similarity >= 0.6) return "default";
    return "secondary";
  };

  return (
    <Alert className="border-chart-3 bg-chart-3/10" data-testid="alert-duplicate-warning">
      <AlertTriangle className="h-4 w-4 text-chart-3" />
      <AlertTitle className="flex items-center justify-between">
        <span>Possível duplicata detectada</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 -mr-2 -mt-1"
          data-testid="button-dismiss-warning"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="space-y-3 mt-2">
        <p className="text-sm">
          Encontramos {matches.length} slide{matches.length > 1 ? "s" : ""} similar{matches.length > 1 ? "es" : ""} ao que você está tentando cadastrar:
        </p>
        <div className="space-y-2">
          {matches.slice(0, 3).map((match) => (
            <div
              key={match.slide.id}
              className="rounded-md bg-background/50 p-3 space-y-1.5"
              data-testid={`duplicate-match-${match.slide.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm line-clamp-1">{match.slide.assunto}</p>
                <Badge variant={getSimilarityColor(match.similarity)} className="shrink-0">
                  {Math.round(match.similarity * 100)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {match.slide.texto}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="flex-1"
            data-testid="button-cancel"
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onProceed}
            className="flex-1"
            data-testid="button-proceed"
          >
            Continuar mesmo assim
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
