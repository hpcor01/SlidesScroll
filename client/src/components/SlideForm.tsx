import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertSlideSchema, type InsertSlide, type DuplicateMatch } from "@/shared/schema";
import { DuplicateWarning } from "./DuplicateWarning";
import { Loader2, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SlideFormProps {
  onSuccess: () => void;
}

export function SlideForm({ onSuccess }: SlideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatch[]>([]);
  const [ignoreDuplicate, setIgnoreDuplicate] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertSlide>({
    resolver: zodResolver(insertSlideSchema),
    defaultValues: {
      assunto: "",
      texto: "",
      autor: "",
    },
  });

  const watchedTexto = form.watch("texto");
  const watchedAssunto = form.watch("assunto");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!watchedTexto || watchedTexto.length < 20) {
        setDuplicateMatches([]);
        return;
      }

      setIsCheckingDuplicates(true);
      try {
        const response = await fetch(
          `/api/slides/check-duplicate?texto=${encodeURIComponent(watchedTexto)}&assunto=${encodeURIComponent(watchedAssunto || "")}`
        );
        const data = await response.json();
        
        if (data.isDuplicate && data.matches.length > 0) {
          setDuplicateMatches(data.matches);
          setIgnoreDuplicate(false);
        } else {
          setDuplicateMatches([]);
        }
      } catch (error) {
        console.error("Erro ao verificar duplicatas:", error);
      } finally {
        setIsCheckingDuplicates(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [watchedTexto, watchedAssunto]);

  const onSubmit = async (data: InsertSlide) => {
    if (duplicateMatches.length > 0 && !ignoreDuplicate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/slides", data);
      
      toast({
        title: "Sucesso!",
        description: "Slide cadastrado com sucesso.",
      });
      
      form.reset();
      setDuplicateMatches([]);
      setIgnoreDuplicate(false);
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o slide. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedWithDuplicate = () => {
    setIgnoreDuplicate(true);
    setDuplicateMatches([]);
    form.handleSubmit(onSubmit)();
  };

  return (
    <Card data-testid="card-slide-form">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Novo Slide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {duplicateMatches.length > 0 && !ignoreDuplicate && (
              <DuplicateWarning
                matches={duplicateMatches}
                onDismiss={() => setDuplicateMatches([])}
                onProceed={handleProceedWithDuplicate}
              />
            )}

            <FormField
              control={form.control}
              name="assunto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o assunto do slide"
                      {...field}
                      data-testid="input-assunto"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o conteúdo do slide"
                      className="min-h-32 resize-none"
                      {...field}
                      data-testid="input-texto"
                    />
                  </FormControl>
                  {isCheckingDuplicates && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Verificando duplicatas...
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do autor"
                      {...field}
                      data-testid="input-autor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || (duplicateMatches.length > 0 && !ignoreDuplicate)}
              data-testid="button-submit"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Slide
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
