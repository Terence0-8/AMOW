import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AuthScreen from './components/AuthScreen';
import { useAuth } from './hooks/useAuth';
import { 
  Compass, EyeOff, ChevronRight, ArrowLeft,
  Coffee, TreePine, Theater, Home, Sparkles, Star,
  HelpCircle, Moon, Sun, CheckCircle, Ticket, 
  Archive, Plus, Trash2, Delete, Pencil, ChevronDown, AlertCircle,
  Plane, Palette, Calendar, Heart, Dices
} from 'lucide-react';

// --- LES 10 THÈMES ---
const THEMES = [
  { id: 'gastro', name: 'Gastronomie', icon: Coffee, colorLight: 'text-amber-600', colorDark: 'text-amber-300', cardLight: 'bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:shadow-amber-500/20', cardDark: 'bg-amber-950/20 border-amber-900/50 hover:border-amber-500/50 hover:shadow-amber-900/40' },
  { id: 'nature', name: 'Nature', icon: TreePine, colorLight: 'text-green-600', colorDark: 'text-green-300', cardLight: 'bg-green-50/50 border-green-200 hover:border-green-400 hover:shadow-green-500/20', cardDark: 'bg-green-950/20 border-green-900/50 hover:border-green-500/50 hover:shadow-green-900/40' },
  { id: 'culture', name: 'Culture', icon: Theater, colorLight: 'text-purple-600', colorDark: 'text-purple-300', cardLight: 'bg-purple-50/50 border-purple-200 hover:border-purple-400 hover:shadow-purple-500/20', cardDark: 'bg-purple-950/20 border-purple-900/50 hover:border-purple-500/50 hover:shadow-purple-900/40' },
  { id: 'aventure', name: 'Aventure', icon: Compass, colorLight: 'text-red-600', colorDark: 'text-red-300', cardLight: 'bg-red-50/50 border-red-200 hover:border-red-400 hover:shadow-red-500/20', cardDark: 'bg-red-950/20 border-red-900/50 hover:border-red-500/50 hover:shadow-red-900/40' },
  { id: 'cocooning', name: 'Cocooning', icon: Home, colorLight: 'text-orange-600', colorDark: 'text-orange-300', cardLight: 'bg-orange-50/50 border-orange-200 hover:border-orange-400 hover:shadow-orange-500/20', cardDark: 'bg-orange-950/20 border-orange-900/50 hover:border-orange-500/50 hover:shadow-orange-900/40' },
  { id: 'voyages', name: 'Voyages', icon: Plane, colorLight: 'text-cyan-600', colorDark: 'text-cyan-300', cardLight: 'bg-cyan-50/50 border-cyan-200 hover:border-cyan-400 hover:shadow-cyan-500/20', cardDark: 'bg-cyan-950/20 border-cyan-900/50 hover:border-cyan-500/50 hover:shadow-cyan-900/40' },
  { id: 'soirees', name: 'Soirées', icon: Moon, colorLight: 'text-indigo-600', colorDark: 'text-indigo-300', cardLight: 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-500/20', cardDark: 'bg-indigo-950/20 border-indigo-900/50 hover:border-indigo-500/50 hover:shadow-indigo-900/40' },
  { id: 'creativite', name: 'Créativité', icon: Palette, colorLight: 'text-pink-600', colorDark: 'text-pink-300', cardLight: 'bg-pink-50/50 border-pink-200 hover:border-pink-400 hover:shadow-pink-500/20', cardDark: 'bg-pink-950/20 border-pink-900/50 hover:border-pink-500/50 hover:shadow-pink-900/40' },
  { id: 'bienetre', name: 'Bien-être', icon: Sparkles, colorLight: 'text-teal-600', colorDark: 'text-teal-300', cardLight: 'bg-teal-50/50 border-teal-200 hover:border-teal-400 hover:shadow-teal-500/20', cardDark: 'bg-teal-950/20 border-teal-900/50 hover:border-teal-500/50 hover:shadow-teal-900/40' },
  { id: 'saisonnier', name: 'Saisonnier', icon: Calendar, colorLight: 'text-rose-600', colorDark: 'text-rose-300', cardLight: 'bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-rose-500/20', cardDark: 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500/50 hover:shadow-rose-900/40' },
  { id: 'calin', name: 'Câlins & Frissons', icon: Heart, colorLight: 'text-rose-600', colorDark: 'text-rose-300', cardLight: 'bg-rose-50/50 border-rose-200 hover:border-rose-400 hover:shadow-rose-500/20', cardDark: 'bg-rose-950/20 border-rose-900/50 hover:border-rose-500/50 hover:shadow-rose-900/40' },
  { id: 'jeux', name: 'Jeux', icon: Dices, colorLight: 'text-violet-600', colorDark: 'text-violet-300', cardLight: 'bg-violet-50/50 border-violet-200 hover:border-violet-400 hover:shadow-violet-500/20', cardDark: 'bg-violet-950/20 border-violet-900/50 hover:border-violet-500/50 hover:shadow-violet-900/40' }
];

// --- LES 365 IDÉES INTÉGRÉES ---
const INITIAL_ACTIVITIES = [
  // [Garder tout le contenu original des activités - je l'omets pour la clarté]
  { id: 1, themeId: 'gastro', title: 'Dîner dans un restaurant gastronomique étoilé', desc: 'Réservez des mois à l\'avance, habillez-vous chic', funny: '' },
  { id: 2, themeId: 'gastro', title: 'Brunch tardif dans un café cosy', desc: 'Journaux, croissants et pas de réveil', funny: '' },
  // ... [ajouter toutes les activités ici]
];

export default function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [isDark, setIsDark] = useState(false);
  const [activities, setActivities] = useState([]);
  
  // ✅ UTILISER LE HOOK useAuth PROFESSIONNEL
  const { currentUser, loading, logout } = useAuth();

  // ✅ REDIRECTION AUTOMATIQUE une fois authentifié
  useEffect(() => {
    console.log('🔐 Auth status:', { currentUser, loading });
    if (!loading && currentUser) {
      setCurrentView('dashboard');
    } else if (!loading && !currentUser) {
      setCurrentView('auth');
    }
  }, [currentUser, loading]);

  // ✅ Charger les activités au démarrage
  useEffect(() => {
    supabase.from('activities').select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const normalized = data.map(a => ({
            ...a,
            themeId: a.theme_id ?? a.themeId,
            desc: a.description ?? a.desc,
          }));
          setActivities([...INITIAL_ACTIVITIES, ...normalized]);
        } else {
          setActivities(INITIAL_ACTIVITIES);
        }
      });
  }, []);

  const [archives, setArchives] = useState([])
  const [archiveToDelete, setArchiveToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState('gastro'); 
  const [activeDetail, setActiveDetail] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [actForm, setActForm] = useState({ id: null, themeId: 'gastro', title: '', desc: '', funny: '' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const [activityToDelete, setActivityToDelete] = useState(null);

  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showVictory, setShowVictory] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);
  const hasTailwindCdn = Boolean(globalThis?.tailwind); 
  const [isShuffling, setIsShuffling] = useState(false);

  const [asstThemes, setAsstThemes] = useState([]);
  const [asstCards, setAsstCards] = useState([]);
  const [blindStep, setBlindStep] = useState(0); 
  const [blindSelection, setBlindSelection] = useState([]);
  const [p1Choice, setP1Choice] = useState(null);
  const [p2Choice, setP2Choice] = useState(null);

  // ✅ CORRIGER: Ajouter la vérification stricte de currentUser.id
  useEffect(() => {
    const fetchArchives = async () => {
      console.log('📦 fetchArchives called - currentUser:', currentUser);
      
      // ✅ Vérification stricte
      if (!currentUser || !currentUser.id) {
        console.warn('⚠️ Pas de currentUser.id - archives vides');
        setArchives([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('archives')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('archived_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erreur Supabase:', error);
        return;
      }
      
      console.log(`✅ ${data?.length || 0} archives trouvées pour user ${currentUser.id}`);
      if (data) setArchives(data);
    };
    
    // Fetch immédiatement quand currentUser change
    fetchArchives();
  }, [currentUser?.id]);

  const t = isDark ? {
    textMain: 'text-white',
    textMuted: 'text-white/60',
    cardBase: 'bg-white/5 border border-white/10 shadow-lg backdrop-blur-md',
    btnPrimary: 'bg-gradient-to-r from-[#6b3074] to-[#4A2545] text-white shadow-lg shadow-purple-900/50',
    btnSecondary: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
    modalBg: 'bg-[#2D142C]/95 border-purple-500/30',
    accent: 'text-purple-300',
    inputBg: 'bg-black/20 border-white/10 focus:border-purple-400 text-white placeholder-white/40',
    pinBtn: 'bg-white/10 hover:bg-white/20 text-white'
  } : {
    textMain: 'text-[#2D1B2E]', 
    textMuted: 'text-[#756677]', 
    cardBase: 'bg-white border border-[#EAE5E0] shadow-sm',
    btnPrimary: 'bg-gradient-to-r from-[#593C60] to-[#7D5385] text-white shadow-md shadow-purple-200', 
    btnSecondary: 'bg-white text-[#593C60] border-[#EAE5E0] hover:bg-[#F0EBEF]',
    modalBg: 'bg-white/95 border-[#EAE5E0]',
    accent: 'text-[#593C60]',
    inputBg: 'bg-[#F9F8F6] border-[#EAE5E0] focus:border-[#8E6494] text-[#2D1B2E] placeholder-[#756677]/60',
    pinBtn: 'bg-white border-[#EAE5E0] hover:bg-[#F0EBEF] text-[#593C60] shadow-sm'
  };

  const openAddModal = () => {
    setActForm({ id: null, themeId: activeTab, title: '', desc: '', funny: '' });
    setShowFormModal(true);
  };

  const openEditModal = (activity) => {
    setActForm({ ...activity });
    setActiveDetail(null); 
    setShowFormModal(true);
  };

  const handleSaveActivity = async () => {
    if (!actForm.title || !actForm.desc) return;
    
    // ✅ S'assurer que currentUser.id existe
    if (!currentUser?.id) {
      console.error('❌ currentUser.id manquant');
      return;
    }
    
    if (actForm.id) {
      await supabase.from('activities').update({
        theme_id: actForm.themeId, title: actForm.title,
        description: actForm.desc, funny: actForm.funny
      }).eq('id', actForm.id).eq('user_id', currentUser.id);
      setActivities(activities.map(a => a.id === actForm.id ? {...a, ...actForm} : a));
    } else {
      const { data } = await supabase.from('activities')
        .insert({ theme_id: actForm.themeId, title: actForm.title, description: actForm.desc, funny: actForm.funny, user_id: currentUser.id })      
        .select().single();
      if (data) setActivities([data, ...activities]);
    }
    setShowFormModal(false);
  };

  const confirmDelete = async () => {
    if (activityToDelete && currentUser?.id) {
      await supabase.from('activities').delete()
        .eq('id', activityToDelete.id)
        .eq('user_id', currentUser.id);    
      setActivities(activities.filter(a => a.id !== activityToDelete.id));
      setActivityToDelete(null);
      setActiveDetail(null);
    }
  };

  const confirmActivity = () => {
    setActiveDetail(null); 
    setShowVictory(true);  
    setTimeout(() => {
      setShowVictory(false);
      setCurrentActivity(activeDetail || activities.find(a => a.id === p1Choice)); 
      setCurrentView('dashboard');
    }, 2500);
  };

  const startShuffling = (callback) => {
    setIsShuffling(true);
    setTimeout(() => {
      callback();
      setIsShuffling(false);
    }, 1500);
  };

  // ✅ CORRIGER: Ajouter la vérification stricte et le console.log
  const archiveActivity = async () => {
    if (!currentUser?.id) {
      console.error('❌ currentUser.id manquant lors de l\'archivage');
      alert('Erreur: vous n\'êtes pas connecté');
      return;
    }

    console.log('📦 Archivage pour user:', currentUser.id);
    
    const { error } = await supabase.from('archives').insert({
      activity_title: currentActivity?.title,
      rating,
      comment,
      user_id: currentUser.id
    });

    if (error) {
      console.error('❌ Erreur archivage:', error);
      alert('Erreur: ' + error.message);
      return;
    }

    setShowCompletion(false)
    setShowArchiveSuccess(true)
    setTimeout(() => {
      setShowArchiveSuccess(false)
      setCurrentActivity(null)
      setRating(0)
      setComment("")
      setCurrentView('dashboard')
    }, 2500)
  }

  const renderAuth = () => (
    <AuthScreen 
      onAuth={() => {
        console.log('✅ Auth successful, redirecting...');
        setCurrentView('dashboard');
      }} 
      isDark={isDark} 
    />
  );

  const ActivityCard = ({ activity, index, onClick }) => {
    const theme = THEMES.find(t => t.id === activity.themeId);
    const Icon = theme.icon;
    const dynamicStyle = isDark ? theme.cardDark : theme.cardLight;
    const colorStyle = isDark ? theme.colorDark : theme.colorLight;

    return (
      <button 
        onClick={onClick}
        className={`w-full p-5 relative overflow-hidden flex items-center justify-between group text-left active:scale-95 transition-all duration-500 animate-deal rounded-2xl border shadow-sm ${dynamicStyle}`}
        style={{ animationDelay: `${(index % 15) * 60}ms` }} 
      >
        <Icon className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${isDark ? 'text-white' : 'text-black'}`} />
        
        <div className="pr-4 relative z-10">
          <div className="flex items-center gap-2 mb-1">
             <Icon className={`w-4 h-4 ${colorStyle}`} />
             <span className={`text-[10px] font-bold uppercase tracking-wider ${colorStyle}`}>{theme.name}</span>
          </div>
          <h3 className={`${t.textMain} font-medium text-lg leading-tight transition-colors duration-500`}>{activity.title}</h3>
          <p className={`${t.textMuted} text-sm mt-1 font-light transition-colors duration-500 line-clamp-1`}>{activity.description || activity.desc}</p>
        </div>
        
        <div className={`w-8 h-8 relative z-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-500 ${isDark ? 'bg-white/10 group-hover:bg-white/20 text-white/70 group-hover:text-white' : 'bg-white/60 border border-black/5 group-hover:bg-white text-black/40 group-hover:text-black/80 shadow-sm'}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    );
  };

  const renderFormModal = () => {
    if (!showFormModal) return null;
    const isEdit = actForm.id !== null;
    
    return (
      <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble`}>
          <h3 className={`text-2xl font-medium ${t.textMain}`}>{isEdit ? 'Modifier l\'idée' : 'Nouvelle idée'}</h3>
          
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full p-4 rounded-xl text-sm border flex items-center justify-between transition-all ${t.inputBg}`}
            >
              <div className="flex items-center gap-2">
                {React.createElement(THEMES.find(t => t.id === actForm.themeId)?.icon || HelpCircle, { className: "w-4 h-4" })}
                <span>{THEMES.find(th => th.id === actForm.themeId)?.name}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 ${t.cardBase} ${isDark ? 'bg-[#2D142C]' : 'bg-white'}`}>
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActForm({...actForm, themeId: theme.id});
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3 text-left text-sm flex items-center gap-2 transition-colors ${actForm.themeId === theme.id ? (isDark ? 'bg-purple-900/30' : 'bg-[#F0EBEF]') : 'hover:bg-black/5 dark:hover:bg-white/5'} ${t.textMain}`}
                  >
                    <theme.icon className="w-4 h-4" />
                    {theme.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <input 
            type="text" placeholder="Titre de l'activité" 
            value={actForm.title} onChange={(e) => setActForm({...actForm, title: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none ${t.inputBg}`}
          />
          <textarea 
            placeholder="Description courte..." rows="2"
            value={actForm.desc} onChange={(e) => setActForm({...actForm, desc: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none resize-none ${t.inputBg}`}
          />
          <textarea 
            placeholder="La petite phrase drôle (optionnel)..." rows="2"
            value={actForm.funny} onChange={(e) => setActForm({...actForm, funny: e.target.value})}
            className={`w-full p-4 rounded-xl text-sm border outline-none resize-none italic ${t.inputBg}`}
          />

          <div className="pt-2 flex gap-3">
            <button onClick={() => { setShowFormModal(false); setIsDropdownOpen(false); }} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Annuler
            </button>
            <button 
              onClick={handleSaveActivity} 
              disabled={!actForm.title || !actForm.desc} 
              className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${(!actForm.title || !actForm.desc) ? 'opacity-50 grayscale' : t.btnPrimary}`}
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmModal = () => {
    if (!activityToDelete) return null;
    return (
      <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble border-red-500/30 shadow-2xl shadow-red-900/20`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className={`text-2xl font-medium ${t.textMain}`}>Supprimer l'idée ?</h3>
            <p className={`${t.textMuted} text-sm mt-2 font-light`}>Êtes-vous sûr de vouloir supprimer <strong className={t.textMain}>"{activityToDelete.title}"</strong> de la liste ? Cette action est irréversible.</p>
          </div>
          
          <div className="pt-4 flex gap-3">
            <button onClick={() => setActivityToDelete(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Garder
            </button>
            <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!activeDetail) return null;
    return (
      <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-5 rounded-[2rem] animate-bubble transition-colors duration-1000`}>
          <div className="flex justify-between items-start">
            <div className="pr-2">
              <span className={`${t.accent} text-xs font-bold uppercase tracking-wider`}>Activité sélectionnée</span>
              <h3 className={`text-2xl font-medium ${t.textMain} mt-1 leading-tight`}>{activeDetail.title}</h3>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button 
                onClick={() => openEditModal(activeDetail)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-[#F0EBEF] text-[#756677] hover:text-[#593C60]'}`}
                title="Modifier"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setActivityToDelete(activeDetail)}
                className="p-2 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className={`${t.textMain} opacity-90 font-light leading-relaxed`}>{activeDetail.description || activeDetail.desc}</p>
          
          {activeDetail.funny && (
            <div className={`p-4 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-white/10 border-white/20' : 'bg-[#F9F8F6] border-[#EAE5E0]'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${isDark ? 'bg-purple-400' : 'bg-[#8E6494]'}`}></div>
              <p className={`${t.accent} text-sm italic font-medium leading-relaxed pl-2`}>
                "{activeDetail.funny}"
              </p>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button onClick={() => setActiveDetail(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Fermer
            </button>
            <button onClick={confirmActivity} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${t.btnPrimary}`}>
              On le fait !
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderArchiveSuccessScreen = () => {
    if (!showArchiveSuccess) return null;
    return (
      <div className={`absolute inset-0 z-[100] ${isDark ? 'bg-purple-950/90' : 'bg-purple-50/90'} backdrop-blur-md flex flex-col items-center justify-center p-6 transition-colors duration-500`}>
        <div className="animate-victory-pop flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner ${isDark ? 'bg-white/10' : 'bg-white shadow-purple-200/50'}`}>
            <Archive className={`w-12 h-12 ${t.accent}`} />
          </div>
          <h2 className={`text-4xl amow-font ${t.textMain} mb-3`}>Souvenir classé !</h2>
          <div className={`${t.cardBase} p-4 rounded-2xl max-w-xs mt-2`}>
            <p className={`${t.textMuted} text-sm font-light leading-relaxed`}>
              Cette activité a bien été enregistrée. Retrouvez vos notes et commentaires à tout moment dans l'onglet <strong className={t.accent}>Nos Archives</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderVictoryScreen = () => {
    if (!showVictory) return null;
    return (
      <div className={`absolute inset-0 z-[100] ${isDark ? 'bg-[#1A0B1C]/95' : 'bg-white/95'} backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-colors duration-1000`}>
        <div className="animate-victory-pop flex flex-col items-center text-center">
          <div className="text-8xl mb-6 drop-shadow-xl">🎉</div>
          <h2 className={`text-5xl amow-font ${t.textMain} mb-2 transition-colors duration-1000`}>C'est parti !</h2>
          <p className={`${t.accent} text-lg font-light transition-colors duration-1000`}>Préparez-vous pour un super moment.</p>
        </div>
      </div>
    );
  };

  const renderCompletionModal = () => {
    if (!showCompletion) return null;
    return (
      <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-5 rounded-[2rem] animate-bubble transition-colors duration-1000`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3 shadow-inner">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <h3 className={`text-2xl font-medium ${t.textMain} leading-tight`}>C'est dans la boîte !</h3>
            <p className={`${t.textMuted} text-sm mt-1 font-light`}>Comment s'est passée l'activité "{currentActivity?.title}" ?</p>
          </div>
          
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                <Star className={`w-8 h-8 transition-colors duration-300 ${rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Un petit mot pour la prochaine fois ? (Ex: Prévoir plus de fromage...)"
            className={`w-full p-4 rounded-2xl text-sm outline-none transition-all resize-none border ${t.inputBg}`}
            rows="3"
          />

          <div className="pt-2 flex gap-3">
            <button onClick={() => setShowCompletion(false)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Annuler
            </button>
            <button onClick={archiveActivity} disabled={rating === 0} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 ${rating === 0 ? 'opacity-50 grayscale cursor-not-allowed' : t.btnPrimary}`}>
              Archiver
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="dashboard-screen flex flex-col gap-4 h-full pt-2 animate-bubble overflow-y-auto pb-8 pr-1">
      {currentActivity && (
        <button 
          onClick={() => setShowCompletion(true)}
          className={`w-full flex-shrink-0 relative overflow-hidden rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 active:scale-95 transition-all text-left group border-2 border-dashed
            ${isDark ? 'bg-gradient-to-br from-yellow-600 via-amber-700 to-yellow-900 border-yellow-400/50 shadow-lg' 
                     : 'bg-gradient-to-br from-[#FFF3C7] via-[#FFD700] to-[#E5B80B] border-[#B8860B]/40 shadow-md'}`}
        >
          <div className="relative z-10 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className={`w-5 h-5 ${isDark ? 'text-yellow-300' : 'text-[#8B6508]'}`} />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-yellow-300' : 'text-[#8B6508]'}`}>Ticket d'Or • En cours</span>
            </div>
            
            <h3 className={`font-medium text-2xl leading-tight ${isDark ? 'text-white' : 'text-[#4A3800]'}`}>{currentActivity.title}</h3>
            <p className={`text-sm mt-1 font-light ${isDark ? 'text-yellow-100/80' : 'text-[#6B4E00]'}`}>{currentActivity.desc}</p>
            
            <div className={`mt-5 w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-inner border
              ${isDark ? 'bg-yellow-900/40 text-yellow-200 border-yellow-500/30 group-hover:bg-yellow-800/60' 
                       : 'bg-white/40 text-[#6B4E00] border-white/50 group-hover:bg-white/60'}`}>
              <Star className="w-4 h-4" /> Cliquer pour Noter & Archiver
            </div>
          </div>

          <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine"></div>
        </button>
      )}

      <div className="dashboard-grid grid grid-cols-2 gap-4 mt-2">
        <button onClick={() => setCurrentView('browse')} className={`dashboard-card dashboard-card--full ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group col-span-2 active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '50ms' }}>
          <div className="text-5xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">📚</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-xl transition-colors duration-700`}>Parcourir</h3>
            <p className={`${t.textMuted} text-sm mt-1 font-light transition-colors duration-700`}>Accès libre à toutes les idées</p>
          </div>
        </button>

        <button onClick={() => { setCurrentView('assisted'); setAsstCards([]); setAsstThemes([]); }} className={`dashboard-card ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '100ms' }}>
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🎲</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-lg transition-colors duration-700`}>L'Assistant</h3>
            <p className={`${t.textMuted} text-[10px] mt-1 uppercase tracking-wider transition-colors duration-700`}>Tirage au sort</p>
          </div>
        </button>

        <button onClick={() => { setCurrentView('blind'); setBlindStep(0); }} className={`dashboard-card ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group active:scale-95 transition-all duration-500 animate-deal rounded-[2.5rem]`} style={{ animationDelay: '150ms' }}>
          <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">🙈</div>
          <div className="text-center">
            <h3 className={`${t.textMain} font-medium text-lg transition-colors duration-700`}>Aveugle</h3>
            <p className={`${t.textMuted} text-[10px] mt-1 uppercase tracking-wider transition-colors duration-700`}>Pass & Play</p>
          </div>
        </button>

        <button 
          onClick={() => setCurrentView('archives')} 
          className={`dashboard-card dashboard-card--full ${t.cardBase} hover:border-[#8E6494] p-6 flex flex-col items-center justify-center gap-3 group col-span-2 active:scale-95 transition-all duration-500 animate-deal opacity-90 rounded-[2.5rem]`} 
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="text-3xl drop-shadow-sm">🗃️</div>
            <h3 className={`${t.textMain} font-medium text-xl transition-colors duration-700`}>Nos Archives</h3>
          </div>
          <div className="text-center">
            <p className={`${t.textMuted} text-xs font-light tracking-wide transition-colors duration-700`}>Retrouvez vos souvenirs</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="flex flex-col h-full relative animate-bubble">
      
      <button 
        onClick={openAddModal}
        className={`absolute bottom-4 right-2 z-20 w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all ${t.btnPrimary}`}
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="flex space-x-2 overflow-x-auto pb-4 flex-shrink-0">
        {THEMES.map((theme, index) => {
          const Icon = theme.icon;
          const isActive = activeTab === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setActiveTab(theme.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-full flex items-center gap-2 border transition-all duration-300 animate-deal ${isActive ? (isDark ? 'bg-white/20 border-white/30' : 'bg-white border-[#EAE5E0] shadow-sm') : 'bg-transparent border-transparent hover:bg-black/5'}`}
              style={{ animationDelay: `${index * 50}ms` }}
              >
              <div className={`p-1.5 rounded-full ${isActive ? (isDark ? 'bg-white/10' : 'bg-[#F9F8F6]') : 'bg-transparent'}`}>
                <Icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-white' : theme.colorLight.split(' ')[0]) : (isDark ? theme.colorDark : theme.colorLight)}`} />
              </div>
              <span className={`text-sm font-medium ${isActive ? t.textMain : t.textMuted}`}>{theme.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-24 pr-1">
        {activities.filter(a => a.themeId === activeTab).length === 0 ? (
          <div className="text-center mt-10 opacity-50">
            <p className={t.textMain}>Aucune idée ici.</p>
            <p className="text-sm">Ajoutez-en une !</p>
          </div>
        ) : (
          activities.filter(a => a.themeId === activeTab).map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              index={index} 
              onClick={() => setActiveDetail(activity)} 
            />
          ))
        )}
      </div>
    </div>
  );

  const renderShuffling = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-bubble">
      <div className="relative w-32 h-40">
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm animate-card-shuffle-1 flex items-center justify-center ${isDark ? 'bg-purple-500/20 border-purple-400/50' : 'bg-[#E5DFE6] border-[#D1C8D4] shadow-md'}`}>
          <HelpCircle className={`w-10 h-10 ${isDark ? 'text-white/50' : 'text-[#8E6494]'}`} />
        </div>
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-sm animate-card-shuffle-2 flex items-center justify-center ${isDark ? 'bg-[#4A2545]/50 border-purple-400/50' : 'bg-[#F0EBEF] border-[#D1C8D4] shadow-md'}`}>
          <HelpCircle className={`w-10 h-10 ${isDark ? 'text-white/50' : 'text-[#8E6494]'}`} />
        </div>
        <div className={`absolute inset-0 rounded-2xl border backdrop-blur-md animate-card-shuffle-3 flex items-center justify-center shadow-xl ${isDark ? 'bg-white/10 border-white/30' : 'bg-white border-[#EAE5E0]'}`}>
          <HelpCircle className={`w-12 h-12 animate-pulse ${t.accent}`} />
        </div>
      </div>
      <h2 className={`text-2xl font-light ${t.textMain} animate-pulse transition-colors duration-1000`}>Le destin travaille...</h2>
    </div>
  );

  const renderAssisted = () => {
    if (currentActivity) return renderDashboard();
    if (isShuffling) return renderShuffling();

    if (asstCards.length === 0) {
      return (
        <div className="flex flex-col h-full space-y-6 animate-bubble">
          <div className="text-center pt-2">
            <h2 className={`text-3xl amow-font ${t.textMain}`}>Moteur de Choix</h2>
            <p className={`${t.textMuted} text-sm mt-1 font-light`}>Sélectionne 3 thèmes d'inspiration</p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4 pr-1">
            {THEMES.map((theme, index) => {
              const isSelected = asstThemes.includes(theme.id);
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    if (asstThemes.includes(theme.id)) setAsstThemes(asstThemes.filter(id => id !== theme.id));
                    else if (asstThemes.length < 3) setAsstThemes([...asstThemes, theme.id]);
                  }}
                  className={`${t.cardBase} p-4 flex flex-col items-center justify-center gap-3 transition-all duration-500 animate-deal rounded-[2rem] ${isSelected ? (isDark ? 'ring-2 ring-purple-400 bg-purple-900/30 scale-105' : 'ring-2 ring-[#8E6494] bg-white scale-105 shadow-md') : 'hover:border-[#8E6494]'} ${asstThemes.length === 3 && !isSelected ? 'opacity-40 grayscale' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  disabled={asstThemes.length === 3 && !isSelected}
                >
                  <Icon className={`w-8 h-8 transition-colors duration-300 ${isSelected ? t.accent : (isDark ? theme.colorDark : theme.colorLight)}`} />
                  <span className={`${t.textMain} text-sm font-medium`}>{theme.name}</span>
                </button>
              )
            })}
          </div>

          <div className={`${t.cardBase} p-4 flex items-center justify-between mt-auto mb-4 rounded-[2rem]`}>
            <span className={`${t.textMain} text-sm font-medium`}>{asstThemes.length}/3 sélectionnés</span>
            <button 
              onClick={() => {
                startShuffling(() => {
                  const drawn = asstThemes.map(themeId => {
                    const available = activities.filter(a => a.themeId === themeId);
                    return available.length === 0 ? activities[0] : available[Math.floor(Math.random() * available.length)];
                  });
                  setAsstCards(drawn);
                });
              }}
              disabled={asstThemes.length !== 3}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 ${asstThemes.length === 3 ? t.btnPrimary : 'bg-gray-200/50 text-gray-400 cursor-not-allowed'}`}
            >
              Tirer au sort
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-6 animate-bubble">
        <div className="text-center pt-2">
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Le Destin a choisi</h2>
          <p className={`${t.textMuted} text-sm mt-1 font-light`}>Lequel vous tente le plus ?</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {asstCards.map((activity, idx) => (
            <ActivityCard 
              key={idx} 
              activity={activity} 
              index={idx} 
              onClick={() => setActiveDetail(activity)} 
            />
          ))}
        </div>
      </div>
    );
  };

  const renderBlindMode = () => {
    if (currentActivity) return renderDashboard(); 
    if (isShuffling) return renderShuffling();

    if (blindStep === 0) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-bubble">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center border shadow-xl relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white border-[#EAE5E0]'}`}>
           <span className="text-5xl absolute animate-bounce">🙈</span>
        </div>
        <div>
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Double Aveugle</h2>
          <p className={`${t.textMuted} text-sm mt-3 font-light max-w-xs mx-auto leading-relaxed`}>Chacun choisit secrètement l'activité qui lui fait envie. Si c'est la même : c'est un Match !</p>
        </div>
        <button onClick={() => {
          startShuffling(() => {
            const shuffled = [...activities].sort(() => 0.5 - Math.random());
            setBlindSelection(shuffled.slice(0, 3));
            setBlindStep(1); setP1Choice(null); setP2Choice(null);
          });
        }} className={`px-8 py-4 w-full max-w-xs mt-8 rounded-2xl font-medium active:scale-95 transition-all ${t.btnPrimary}`}>
          Commencer le jeu
        </button>
      </div>
    );

    if (blindStep === 2) return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-bubble">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center animate-pulse border ${isDark ? 'bg-purple-500/20 border-purple-400/40' : 'bg-[#F0EBEF] border-[#D1C8D4] shadow-inner'}`}>
           <Sparkles className={`w-12 h-12 ${t.accent}`} />
        </div>
        <div>
          <h2 className={`text-4xl amow-font ${t.textMain}`}>Choix validé</h2>
          <p className={`${t.textMuted} font-light mt-3 text-lg`}>Passe le téléphone à ta moitié !</p>
        </div>
        <button onClick={() => setBlindStep(3)} className={`px-10 py-4 rounded-2xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
          C'est à moi
        </button>
      </div>
    );

    if (blindStep === 4) {
      const isMatch = p1Choice === p2Choice;
      const matchedActivity = activities.find(a => a.id === p1Choice);
      
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-bubble">
          {isMatch ? (
            <>
              <div className="text-7xl animate-bounce drop-shadow-[0_0_20px_rgba(142,100,148,0.4)]">🔥</div>
              <div>
                <h2 className="text-6xl amow-font text-transparent bg-clip-text bg-gradient-to-r from-[#8E6494] to-[#4A2545] py-2">MATCH !</h2>
                <div className={`${t.cardBase} mt-6 p-4 rounded-2xl`}>
                   <p className={`${t.textMain} mt-1 text-xl font-medium`}>{matchedActivity?.title}</p>
                </div>
              </div>
              <button onClick={() => setActiveDetail(matchedActivity)} className={`px-10 py-4 rounded-2xl font-medium active:scale-95 transition-all ${t.btnPrimary}`}>
                On le fait !
              </button>
            </>
          ) : (
            <>
               <div className="text-7xl opacity-50 grayscale transition-all duration-1000">💔</div>
              <div>
                <h2 className={`text-4xl amow-font ${t.textMain}`}>Aïe, pas de match !</h2>
                <p className={`${t.textMuted} mt-3 font-light`}>Les grands esprits ne se sont pas rencontrés cette fois.</p>
              </div>
              <button onClick={() => setBlindStep(0)} className={`px-8 py-4 mt-4 rounded-2xl font-medium active:scale-95 transition-all border ${t.btnSecondary}`}>
                Retenter la chance
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full space-y-6 animate-bubble">
        <div className="text-center pt-2">
          <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-4 animate-pulse ${isDark ? 'bg-purple-500/20 border-purple-400/30 text-purple-200' : 'bg-[#F0EBEF] border-[#D1C8D4] text-[#593C60]'}`}>
            Tour du Joueur {blindStep === 1 ? '1' : '2'}
          </span>
          <h2 className={`text-3xl amow-font ${t.textMain}`}>Que veux-tu faire ?</h2>
        </div>

        <div className="flex-1 space-y-4 pr-1">
          {blindSelection.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              index={index} 
              onClick={() => {
                if (blindStep === 1) { setP1Choice(activity.id); setBlindStep(2); }
                else { setP2Choice(activity.id); setBlindStep(4); }
              }} 
            />
          ))}
        </div>
      </div>
    );
  };

  const renderArchives = () => (
    <div className="flex flex-col gap-4 h-full pt-2 animate-bubble overflow-y-auto pb-8 pr-1">
      {archives.length === 0 ? (
        <div className={`flex flex-col items-center justify-center h-full gap-3 ${t.textMuted}`}>
          <div className="text-5xl">🗃️</div>
          <p className="text-sm font-light">Aucun souvenir pour l'instant.</p>
        </div>
      ) : (
        archives.map((archive, index) => (
          <div key={archive.id} className={`${t.cardBase} p-5 rounded-2xl animate-deal relative`} style={{ animationDelay: `${index * 60}ms` }}>
            <button
              onClick={() => setArchiveToDelete(archive)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-red-500/10 text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between pr-8">
              <h3 className={`${t.textMain} font-medium text-lg`}>{archive.activity_title}</h3>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${archive.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            {archive.comment && (
              <p className={`${t.textMuted} text-sm mt-2 font-light italic`}>"{archive.comment}"</p>
            )}
            <p className={`${t.textMuted} text-xs mt-3`}>
              {new Date(archive.archived_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        ))
      )}
    </div>
  );

  const renderDeleteArchiveModal = () => {
    if (!archiveToDelete) return null;
    return (
      <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className={`${t.cardBase} ${t.modalBg} p-6 w-full max-w-sm space-y-4 rounded-[2rem] animate-bubble border-red-500/30 shadow-2xl shadow-red-900/20`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className={`text-2xl font-medium ${t.textMain}`}>Supprimer ce souvenir ?</h3>
            <p className={`${t.textMuted} text-sm mt-2 font-light`}>
              <strong className={t.textMain}>"{archiveToDelete.activity_title}"</strong> sera définitivement effacé.
            </p>
          </div>
          <div className="pt-4 flex gap-3">
            <button onClick={() => setArchiveToDelete(null)} className={`flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 border ${t.btnSecondary}`}>
              Garder
            </button>
            <button onClick={async () => {
              if (!currentUser?.id) return;
              await supabase.from('archives').delete()
                .eq('id', archiveToDelete.id)
                .eq('user_id', currentUser.id);
              setArchives(archives.filter(a => a.id !== archiveToDelete.id));
              setArchiveToDelete(null);
            }} className="flex-1 py-3 rounded-xl font-medium transition-all active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => {
    const ThemeToggle = () => (
      <button 
        onClick={() => setIsDark(!isDark)}
        className={`absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border active:scale-95 z-20 ${isDark ? 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20' : 'bg-white border-[#EAE5E0] text-[#4A2545] shadow-sm hover:bg-[#F0EBEF]'}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    );

    if (currentView === 'auth') return <ThemeToggle />;

    if (currentView === 'dashboard') {
      return (
        <header className="flex flex-col items-center justify-center p-6 pb-2 z-10 animate-in fade-in slide-in-from-top-4 relative">
          {/* Bouton Dark/Light Mode - À DROITE */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`absolute right-6 top-6 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border active:scale-95 z-20 ${isDark ? 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20' : 'bg-white border-[#EAE5E0] text-[#4A2545] shadow-sm hover:bg-[#F0EBEF]'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Logo + Titre - AU CENTRE */}
          <div className={`w-28 h-28 rounded-[2rem] overflow-hidden shadow-xl flex-shrink-0 relative group cursor-pointer hover:scale-105 transition-transform duration-500 border-4 ${isDark ? 'border-white/10 shadow-purple-900/20' : 'border-white shadow-purple-200/30 bg-white'}`}>
            <img src="logo.png" alt="AMOW Logo" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <h1 className="text-5xl amow-font mt-5 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] via-[#8E6494] to-[#593C60] drop-shadow-sm font-bold">
            AMOW
          </h1>

          {/* Logout Bouton - À GAUCHE */}
          <button
            onClick={() => { logout(); setCurrentView('auth'); }}
            className={`absolute left-6 top-6 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border active:scale-95 z-20 ${isDark ? 'bg-white/10 border-white/20 text-white/60 hover:bg-white/20' : 'bg-white border-[#EAE5E0] text-[#756677] shadow-sm hover:bg-[#F0EBEF]'}`}
            title="Se déconnecter"
          >
            <EyeOff className="w-5 h-5" />
          </button>

          {/* Profil utilisateur - À DROITE MAIS PLUS BAS */}
          <div className={`absolute right-6 bottom flex items-center gap-2 z-10 ${isDark ? 'text-white/70' : 'text-[#756677]'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-white/10' : 'bg-[#EAE5E0]'}`}>
              {currentUser?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <span className="text-sm font-medium whitespace-nowrap">{currentUser?.name || 'Chargement...'}</span>
          </div>
        </header>
      );
    }

    return (
      <header className="flex items-center justify-center p-6 z-10 relative">
        <button 
          onClick={() => { setCurrentView('dashboard'); setBlindStep(0); }}
          className={`absolute left-6 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 border active:scale-95 ${t.btnSecondary}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="flex flex-col items-center">
          <h1 className="text-3xl amow-font text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] to-[#8E6494] font-bold">
            AMOW
          </h1>
          <span className={`${t.textMuted} text-[10px] font-bold uppercase tracking-widest mt-1`}>
            {currentView === 'browse' ? 'Catégories' : currentView === 'blind' ? 'Jouer' : currentView === 'archives' ? 'Nos Archives' : 'Assistant'}
          </span>
        </div>
      </header>
    );
  };

  return (
    <div className={`min-h-screen font-sans relative ${hasTailwindCdn ? '' : 'no-tailwind'}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #000; }
        .amow-font { font-family: 'Dancing Script', cursive; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(142, 100, 148, 0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(142, 100, 148, 0.6); }
        * { scrollbar-width: thin; scrollbar-color: rgba(142, 100, 148, 0.3) transparent; }
        
        @keyframes bubbleExpand { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-bubble { animation: bubbleExpand 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        @keyframes dealCard { 0% { transform: translateY(-30px) scale(0.95); opacity: 0; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        .animate-deal { animation: dealCard 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        
        @keyframes victoryPop { 0% { transform: scale(0.5); opacity: 0; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .animate-victory-pop { animation: victoryPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes shine { 100% { left: 200%; } }
        .animate-shine { animation: shine 3s infinite; }

        @keyframes cardShuffle1 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 10;} 50% { transform: translateX(-40px) rotate(-15deg) scale(0.9); z-index: 10;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 30;} }
        @keyframes cardShuffle2 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 20;} 50% { transform: translateX(40px) rotate(15deg) scale(0.9); z-index: 20;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 10;} }
        @keyframes cardShuffle3 { 0% { transform: translateX(0) rotate(0deg) scale(1); z-index: 30;} 50% { transform: translateX(0px) translateY(-20px) scale(1.1); z-index: 30;} 100% { transform: translateX(0) rotate(0deg) scale(1); z-index: 20;} }
        .animate-card-shuffle-1 { animation: cardShuffle1 0.6s infinite ease-in-out alternate; }
        .animate-card-shuffle-2 { animation: cardShuffle2 0.6s infinite ease-in-out alternate-reverse; }
        .animate-card-shuffle-3 { animation: cardShuffle3 0.6s infinite ease-in-out alternate; }
      `}} />

      <div className="fixed inset-0 bg-[#FBF9F6] z-0 transition-opacity duration-1000"></div>
      <div className={`fixed inset-0 bg-gradient-to-br from-[#1A0B1C] via-[#2D142C] to-[#3B1932] transition-opacity duration-1000 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}></div>

      {renderArchiveSuccessScreen()}
      {renderVictoryScreen()}
      {renderDeleteConfirmModal()}
      {renderFormModal()}
      {renderDeleteArchiveModal()}

      {/* ✅ FIX: Ne rien afficher pendant le loading initial */}
      {loading ? (
        <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-center relative z-10">
          <div className="text-center space-y-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 animate-pulse ${isDark ? 'bg-white/10 border-white/20 shadow-purple-900/20' : 'border-white shadow-purple-200/30 bg-white'}`}>
              <span className="text-5xl">🔮</span>
            </div>
            <div>
              <h2 className={`text-2xl amow-font ${isDark ? 'text-white' : 'text-[#2D1B2E]'}`}>AMOW</h2>
              <p className={`text-sm mt-2 font-light ${isDark ? 'text-white/60' : 'text-[#756677]'}`}>Restauration de votre session...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto h-screen flex flex-col overflow-hidden relative z-10">
          {renderHeader()}
          <main className={`flex-1 overflow-hidden flex flex-col relative ${currentView !== 'auth' ? 'px-5 pb-6' : ''}`}>
            {currentView === 'auth' && renderAuth()}
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'browse' && renderBrowse()}
            {currentView === 'assisted' && renderAssisted()}
            {currentView === 'blind' && renderBlindMode()}
            {currentView === 'archives' && renderArchives()}
            {renderDetailModal()}
            {renderCompletionModal()}
          </main>
        </div>
      )}
    </div>
  );
}