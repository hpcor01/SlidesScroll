import React from 'react';
import { Article, Role, User } from '../src/types';

interface ArticleListProps {
  articles: Article[];
  currentUser: User;
  onDelete?: (id: string) => void;
  onEdit?: (article: Article) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, currentUser, onDelete, onEdit }) => {
  
  if (articles.length === 0) {
    return <p className="text-center text-gray-500 py-8">Nenhum artigo ou slide encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between transition hover:shadow-lg border border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${article.type === 'PPTX' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                {article.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(article.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{article.subject}</h3>
            
            {article.type === 'TEXT' ? (
               <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-4 whitespace-pre-wrap">
                 {article.text}
               </p>
            ) : (
              <div className="text-gray-600 dark:text-gray-300 text-sm mb-4 italic flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                Arquivo: {article.fileName}
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Autor: <span className="font-medium">{article.authorName}</span>
            </p>
          </div>

          {currentUser.role === Role.ADMIN && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <button 
                onClick={() => onEdit && onEdit(article)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs py-2 px-3 rounded"
              >
                Editar
              </button>
              <button 
                onClick={() => onDelete && onDelete(article.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs py-2 px-3 rounded"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
