import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Role, Article } from './types';
import * as db from './services/mockDb';
import { checkDuplicateWithGemini } from './services/geminiService';
import { ArticleList } from './components/ArticleList';

// --- Icons ---
const SunIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 24.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'ADMIN_USERS'>('LOGIN');

  // --- Theme Management ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Data Loading ---
  const refreshData = useCallback(async () => {
    // Note: mockDb is now async to simulate real DB
    const fetchedArticles = await db.getArticles();
    const fetchedUsers = await db.getUsers();
    setArticles(fetchedArticles);
    setUsers(fetchedUsers);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Handlers ---
  const handleLogin = async (username: string, role: Role) => {
    const foundUsers = await db.getUsers();
    let user = foundUsers.find(u => u.username === username);
    
    if (!user && role === Role.USER) {
        alert('Usuário não encontrado. Solicite cadastro ao administrador.');
        return;
    }

    if (user && user.password === '123') { 
        setCurrentUser(user);
        setView('DASHBOARD');
    } else {
        alert('Credenciais inválidas. (Senha padrão: 123)');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('LOGIN');
  };

  // --- Views ---
  if (!currentUser) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">
               LegalSlide <span className="text-accent font-light">Manager</span>
             </h1>
             {currentUser.role === Role.ADMIN && (
                <nav className="hidden md:flex gap-4 ml-8">
                  <button 
                    onClick={() => setView('DASHBOARD')}
                    className={`text-sm font-medium ${view === 'DASHBOARD' ? 'text-accent' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                  >
                    Slides & Artigos
                  </button>
                  <button 
                    onClick={() => setView('ADMIN_USERS')}
                    className={`text-sm font-medium ${view === 'ADMIN_USERS' ? 'text-accent' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                  >
                    Gerenciar Usuários
                  </button>
                </nav>
             )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
              Olá, <strong>{currentUser.username}</strong>
            </span>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === Role.ADMIN && view === 'ADMIN_USERS' ? (
           <AdminUsersView users={users} onRefresh={refreshData} />
        ) : (
           <DashboardView 
              currentUser={currentUser} 
              articles={articles} 
              onRefresh={refreshData} 
           />
        )}
      </main>
    </div>
  );
}

// --- Sub-Components ---

const LoginPage = ({ onLogin, isDarkMode, toggleTheme }: any) => {
  const [username, setUsername] = useState('');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
       <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Acesso ao Sistema</h2>
             <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
               {isDarkMode ? <SunIcon /> : <MoonIcon />}
             </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent outline-none transition"
                placeholder="Digite seu usuário"
              />
            </div>
            <div className="text-sm text-gray-500 italic">Senha padrão: 123</div>
            
            <button 
              onClick={() => onLogin(username, Role.USER)}
              className="w-full py-2 px-4 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition"
            >
              Entrar
            </button>
          </div>
       </div>
    </div>
  );
};

const DashboardView = ({ currentUser, articles, onRefresh }: { currentUser: User, articles: Article[], onRefresh: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Date Logic for Admin Shortcuts
  const setWeeklyFilter = () => {
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Calculate Monday (if today is Sun(0), go back 6 days. Else go back day-1)
    const diffToMon = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diffToMon));
    const friday = new Date(today.setDate(diffToMon + 4));

    setDateStart(monday.toISOString().split('T')[0]);
    setDateEnd(friday.toISOString().split('T')[0]);
  };

  const setMonthlyFilter = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setDateStart(firstDay.toISOString().split('T')[0]);
    setDateEnd(lastDay.toISOString().split('T')[0]);
  };

  const clearDateFilter = () => {
    setDateStart('');
    setDateEnd('');
  };

  // Filter Logic
  const filteredArticles = useMemo(() => {
    let result = articles;

    // 1. Text Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.subject.toLowerCase().includes(lower) || 
        a.text.toLowerCase().includes(lower) ||
        a.authorName.toLowerCase().includes(lower)
      );
    }

    // 2. Date Filter
    if (dateStart) {
      const start = new Date(dateStart);
      start.setHours(0,0,0,0);
      result = result.filter(a => new Date(a.createdAt) >= start);
    }

    if (dateEnd) {
      const end = new Date(dateEnd);
      end.setHours(23,59,59,999);
      result = result.filter(a => new Date(a.createdAt) <= end);
    }

    return result;
  }, [articles, searchTerm, dateStart, dateEnd]);

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['ID', 'Assunto', 'Texto', 'Autor', 'Data', 'Tipo', 'Arquivo'];
      const rows = filteredArticles.map(a => [
        a.id, 
        `"${a.subject.replace(/"/g, '""')}"`, 
        `"${a.text.replace(/"/g, '""')}"`, 
        a.authorName, 
        a.createdAt,
        a.type,
        a.fileName || ''
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "slides_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
        window.print(); 
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.subject.trim() || !formData.text.trim()) return;

    setLoading(true);

    // AI Check
    const result = await checkDuplicateWithGemini(formData.subject, formData.text, articles);

    if (result.isDuplicate) {
        const name = result.similarArticleAuthor || "Alguém";
        const message = `${name} já enviou um artigo com o mesmo assunto. Verifique o texto enviado para não haver duplicatas.\n\nDeseja cadastrar mesmo assim?`;
        
        const confirm = window.confirm(message);
        
        if (!confirm) {
            setLoading(false);
            return;
        }
    }

    const newArticle: Article = {
      id: crypto.randomUUID(),
      subject: formData.subject,
      text: formData.text,
      authorId: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString(),
      type: 'TEXT'
    };

    await db.saveArticle(newArticle);
    setFormData({ subject: '', text: '' });
    setShowForm(false);
    onRefresh();
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setTimeout(async () => {
       const newArticle: Article = {
         id: crypto.randomUUID(),
         subject: file.name.replace('.pptx', ''),
         text: 'Conteúdo do slide (Arquivo PPTX)',
         authorId: currentUser.id,
         authorName: currentUser.username,
         createdAt: new Date().toISOString(),
         type: 'PPTX',
         fileName: file.name
       };
       await db.saveArticle(newArticle);
       onRefresh();
       setUploadLoading(false);
       e.target.value = ''; 
    }, 1000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      await db.deleteArticle(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
       {/* Actions Bar */}
       <div className="flex flex-col gap-4">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
                <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 transition whitespace-nowrap"
                >
                <span>+ Novo Artigo</span>
                </button>
                {currentUser.role === Role.ADMIN && (
                <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer flex items-center gap-2 transition whitespace-nowrap">
                    {uploadLoading ? 'Enviando...' : 'Upload PPTX'}
                    <input type="file" accept=".pptx" className="hidden" onChange={handleFileUpload} disabled={uploadLoading} />
                </label>
                )}
            </div>

            {currentUser.role === Role.ADMIN && (
                <div className="flex gap-2">
                <button onClick={() => handleExport('csv')} className="text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                    Exportar XLSX
                </button>
                <button onClick={() => handleExport('pdf')} className="text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                    PDF
                </button>
                </div>
            )}
         </div>

         {/* Filter Section (Date & Search) */}
         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-end md:items-center justify-between border border-gray-100 dark:border-gray-700">
            <div className="flex-1 w-full space-y-2 md:space-y-0 md:flex md:gap-4 items-center">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text"
                        placeholder="Buscar por assunto, texto ou autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none text-sm"
                    />
                </div>

                {/* Date Inputs */}
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <span className="absolute -top-5 left-0 text-xs text-gray-500 dark:text-gray-400">De:</span>
                        <input 
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute -top-5 left-0 text-xs text-gray-500 dark:text-gray-400">Até:</span>
                        <input 
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>
                    {(dateStart || dateEnd) && (
                        <button onClick={clearDateFilter} className="text-xs text-red-500 hover:text-red-700 underline">
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Date Shortcuts */}
            {currentUser.role === Role.ADMIN && (
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button onClick={setWeeklyFilter} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1">
                        <CalendarIcon />
                        Semanal (Seg-Sex)
                    </button>
                    <button onClick={setMonthlyFilter} className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center gap-1">
                        <CalendarIcon />
                        Mensal
                    </button>
                </div>
            )}
         </div>
       </div>

       {/* Form Section */}
       {showForm && (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-accent animate-fade-in">
           <h3 className="text-lg font-bold mb-4 dark:text-white">Cadastrar Novo Artigo</h3>
           <form onSubmit={handleSubmitArticle} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assunto</label>
               <input 
                 required
                 type="text" 
                 value={formData.subject}
                 onChange={e => setFormData({...formData, subject: e.target.value})}
                 className="mt-1 w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo do Artigo</label>
               <textarea 
                 required
                 rows={5}
                 value={formData.text}
                 onChange={e => setFormData({...formData, text: e.target.value})}
                 className="mt-1 w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent outline-none"
               />
             </div>
             <div className="flex justify-end gap-2">
               <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
               >
                 Cancelar
               </button>
               <button 
                 type="submit" 
                 disabled={loading}
                 className="px-6 py-2 bg-accent text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
               >
                 {loading && <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                 {loading ? 'Verificando...' : 'Salvar'}
               </button>
             </div>
           </form>
         </div>
       )}

       {/* List Section */}
       <div>
         <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold dark:text-white">Slides e Artigos</h2>
             <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'item' : 'itens'}
             </span>
         </div>
         <ArticleList 
           articles={filteredArticles} 
           currentUser={currentUser} 
           onDelete={currentUser.role === Role.ADMIN ? handleDelete : undefined}
         />
       </div>
    </div>
  );
};

const AdminUsersView = ({ users, onRefresh }: { users: User[], onRefresh: () => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState<Partial<User>>({});

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser.username || !editUser.password) return;

        const u: User = {
            id: editUser.id || crypto.randomUUID(),
            username: editUser.username,
            password: editUser.password,
            role: editUser.role || Role.USER
        };

        await db.saveUser(u);
        setEditUser({});
        setIsEditing(false);
        onRefresh();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir usuário?')) {
            await db.deleteUser(id);
            onRefresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Gerenciamento de Usuários</h2>
                <button 
                  onClick={() => { setEditUser({}); setIsEditing(true); }}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                >
                    Novo Usuário
                </button>
            </div>

            {isEditing && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold mb-4 dark:text-white">{editUser.id ? 'Editar' : 'Criar'} Usuário</h3>
                    <form onSubmit={handleSaveUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                            placeholder="Username" 
                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={editUser.username || ''} 
                            onChange={e => setEditUser({...editUser, username: e.target.value})} 
                            required
                        />
                        <input 
                            placeholder="Password" 
                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={editUser.password || ''} 
                            onChange={e => setEditUser({...editUser, password: e.target.value})} 
                            required
                        />
                        <select 
                            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={editUser.role || Role.USER}
                            onChange={e => setEditUser({...editUser, role: e.target.value as Role})}
                        >
                            <option value={Role.USER}>Usuário</option>
                            <option value={Role.ADMIN}>Admin</option>
                        </select>
                        <div className="md:col-span-3 flex justify-end gap-2">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-accent text-white rounded">Salvar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuário</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => { setEditUser(u); setIsEditing(true); }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">Editar</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}