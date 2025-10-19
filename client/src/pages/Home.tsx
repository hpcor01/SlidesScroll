import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlideForm } from "@/components/SlideForm";
import { SlideCard } from "@/components/SlideCard";
import { PaginationControls } from "@/components/PaginationControls";
import type { PaginatedResponse, Slide } from "@shared/schema";
import { FileText, Loader2 } from "lucide-react";

export default function Home() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, refetch } = useQuery<PaginatedResponse<Slide>>({
    queryKey: ["/api/slides", page],
    queryFn: async () => {
      const response = await fetch(`/api/slides?page=${page}&perPage=${perPage}`);
      if (!response.ok) throw new Error("Erro ao carregar slides");
      return response.json();
    },
  });

  const handleSuccess = () => {
    setPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Gestão de Slides</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SlideForm onSuccess={handleSuccess} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Slides Cadastrados
              </h2>
              {data && data.total > 0 && (
                <span className="text-sm text-muted-foreground" data-testid="text-total-count">
                  {data.total} {data.total === 1 ? "slide" : "slides"}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12" data-testid="loading-slides">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !data || data.data.length === 0 ? (
              <div className="text-center py-12 space-y-3" data-testid="empty-state">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">Nenhum slide cadastrado</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Comece adicionando seu primeiro slide usando o formulário ao lado.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4" data-testid="slides-list">
                  {data.data.map((slide) => (
                    <SlideCard key={slide.id} slide={slide} />
                  ))}
                </div>

                <div className="pt-4">
                  <PaginationControls
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    totalItems={data.total}
                    itemsPerPage={perPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
