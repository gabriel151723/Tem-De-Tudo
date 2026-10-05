import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronDown,
  Star,
  Send,
  MessageCircle,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  Car,
  Filter,
  ArrowRight,
  Eye,
  Check,
  Menu,
  FileText,
  PackageCheck,
  Headphones,
  ThumbsUp,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AutomakerBrand {
  name: string;
  count: string;
  slug: string;
  category: 'nacional' | 'importado' | 'pesado' | 'agricola';
  badgeColor: string;
}

interface RecentSearch {
  id: string;
  brand: string;
  model: string;
  year?: string;
  category?: string;
  label: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = 'tem_de_tudo_recent_searches';

const DEFAULT_RECENT_SEARCHES: RecentSearch[] = [
  {
    id: 'toyota-hilux-2020',
    brand: 'Toyota',
    model: 'Hilux',
    year: '2020',
    category: 'Todas as Categorias',
    label: 'Toyota Hilux 2020',
    timestamp: Date.now() - 1000 * 60 * 30
  },
  {
    id: 'ford-cargo-2022',
    brand: 'Ford',
    model: 'Cargo',
    year: '2022',
    category: 'Todas as Categorias',
    label: 'Ford Cargo 2428',
    timestamp: Date.now() - 1000 * 60 * 120
  }
];

const BRANDS: AutomakerBrand[] = [
  { name: 'Toyota', count: '1.450 peças', slug: 'toyota', category: 'importado', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Mercedes-Benz', count: '2.100 peças', slug: 'mercedes', category: 'pesado', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'Ford', count: '1.890 peças', slug: 'ford', category: 'nacional', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Volkswagen', count: '2.350 peças', slug: 'volkswagen', category: 'nacional', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Scania', count: '1.120 peças', slug: 'scania', category: 'pesado', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'New Holland', count: '890 peças', slug: 'newholland', category: 'agricola', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Chevrolet', count: '1.780 peças', slug: 'chevrolet', category: 'nacional', badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { name: 'Fiat', count: '1.620 peças', slug: 'fiat', category: 'nacional', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' }
];

interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  code: string;
  price: number;
  installments: string;
  compatibility: string;
  inStock: boolean;
  image: string;
  rating: number;
  badge?: string;
  description: string;
  specs: { [key: string]: string };
}

const PRODUCTS_DATA: CatalogProduct[] = [
  {
    id: 'prod-1',
    name: 'Parachoque Dianteiro Primer Reforçado',
    brand: 'Toyota',
    category: 'Lataria & Acabamentos',
    code: 'TT-52119-0K980',
    price: 890.00,
    installments: '12x de R$ 74,16 sem juros',
    compatibility: 'Toyota Hilux SR / SRX / SW4 (2016 a 2023)',
    inStock: true,
    rating: 4.9,
    badge: 'Mais Vendido',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    description: 'Parachoque dianteiro fabricado em polímero automotivo de alta densidade com acabamento em primer especial para pintura. Encaixe padrão montadora com alinhamento perfeito nos faróis e paralamas.',
    specs: {
      'Material': 'Polipropileno Automotivo (PP)',
      'Acabamento': 'Primer protetivo pronto para pintura',
      'Padrão': 'OEM de Reposição Genuína',
      'Garantia Legal': '90 dias conforme Art. 26 do CDC'
    }
  },
  {
    id: 'prod-2',
    name: 'Grade Frontal Radiador com Filetes Cromados',
    brand: 'Toyota',
    category: 'Lataria & Acabamentos',
    code: 'TT-53111-0K670',
    price: 490.00,
    installments: '10x de R$ 49,00 sem juros',
    compatibility: 'Toyota Hilux e SW4 (2018 a 2022)',
    inStock: true,
    rating: 5.0,
    badge: 'Destaque',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    description: 'Grade dianteira colmeia com moldura cromada tripla camada. Projetada para fluxo térmico superior em regimes severos de uso urbano e rodoviário.',
    specs: {
      'Cor / Textura': 'Preto acetinado com cromo brilhante',
      'Fixação': 'Travas padrão original de fácil instalação',
      'Compatibilidade': 'Hilux Diesel 2.8 e Flex 2.7',
      'Nota Fiscal': 'Emitida em 100% dos envios'
    }
  },
  {
    id: 'prod-3',
    name: 'Parachoque Traseiro com Alojamento de Sensor',
    brand: 'Ford',
    category: 'Lataria & Acabamentos',
    code: 'FD-EB3B-17906',
    price: 760.00,
    installments: '12x de R$ 63,33 sem juros',
    compatibility: 'Ford Ranger XLT / Limited / XLS (2013 a 2022)',
    inStock: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    description: 'Parachoque traseiro em chapa de aço estrutural conformada com pintura eletrostática a pó preta anti-ferrugem. Acompanha furações para chicote e sensores.',
    specs: {
      'Estrutura': 'Aço Carbono SAE 1020 estampado',
      'Homologação': 'Preparado para engate de reboque',
      'Kit Incluso': 'Parafusos e suportes de longarina',
      'Garantia': '12 meses contra oxidação'
    }
  },
  {
    id: 'prod-4',
    name: 'Grade Frontal Inferior com Alojamento de Milha',
    brand: 'Volkswagen',
    category: 'Lataria & Acabamentos',
    code: 'VW-2H0-807-681',
    price: 320.00,
    installments: '6x de R$ 53,33 sem juros',
    compatibility: 'Volkswagen Amarok V6 / 2.0 TDI (2017 a 2023)',
    inStock: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    description: 'Moldura do defletor de ar inferior para refrigeração do intercooler e radiador de óleo com alojamento dos faróis de neblina.',
    specs: {
      'Composição': 'ABS Injetado de Alta Resistência',
      'Posição': 'Parte inferior dianteira central',
      'Instalação': 'Encaixe por presilhas de pressão'
    }
  },
  {
    id: 'prod-5',
    name: 'Par de Discos de Freio Ventilados Dianteiros',
    brand: 'Mercedes-Benz',
    category: 'Sistemas de Freio',
    code: 'MB-BD5620-VENT',
    price: 430.00,
    installments: '10x de R$ 43,00 sem juros',
    compatibility: 'Mercedes-Benz Sprinter 313 / 415 / 515 CDI',
    inStock: true,
    rating: 5.0,
    badge: 'Segurança Máxima',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    description: 'Discos de freio usinados com tolerância de batimento inferior a 0,02 mm. Liga de ferro fundido nodular com canais de ventilação aerodinâmicos.',
    specs: {
      'Diâmetro Externo': '300 mm',
      'Espessura': '28 mm (Mínima: 25 mm)',
      'Tipo de Pista': 'Ventilada com canal central',
      'Tratamento': 'Protetivo anti-corrosão na cubo'
    }
  },
  {
    id: 'prod-6',
    name: 'Kit de Amortecedores Dianteiros Pressurizados Turbogás',
    brand: 'Ford',
    category: 'Suspensão & Direção',
    code: 'COF-GP30144-PAR',
    price: 640.00,
    installments: '12x de R$ 53,33 sem juros',
    compatibility: 'Ford Cargo 815 / 816 / 1119 (Todos os anos)',
    inStock: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=600&q=80',
    description: 'Amortecedores para eixo direcional de caminhões leves e médios. Reduz o desgaste irregular dos pneus e proporciona controle firme em curvas.',
    specs: {
      'Sistema': 'Pressurizado com gás Nitrogênio N2',
      'Haste': 'Microfissurada cromada e retificada',
      'Retentor': 'Viton multi-lábio para alta temperatura'
    }
  },
  {
    id: 'prod-7',
    name: 'Kit Embreagem Completo com Platô, Disco e Atuador',
    brand: 'Scania',
    category: 'Câmbio & Embreagem',
    code: 'LUK-643-328-900',
    price: 1890.00,
    installments: '12x de R$ 157,50 sem juros',
    compatibility: 'Scania R440 / G420 / P310 Linha Pesada',
    inStock: true,
    rating: 5.0,
    badge: 'Linha Pesada',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    description: 'Embreagem de carga pesada projetada para transmissões automatizadas Opticruise e manuais. Platô autoajustável com compensação de desgaste.',
    specs: {
      'Diâmetro de Contato': '430 mm',
      'Estrias do Cubo': '10 estrias reforçadas',
      'Revestimento': 'Lona cerâmica de alta durabilidade',
      'Aplicação': 'Cavalos mecânicos e bitrens'
    }
  },
  {
    id: 'prod-8',
    name: 'Bico Injetor Common Rail Diesel Bosch Original',
    brand: 'Mercedes-Benz',
    category: 'Linha Diesel & Injeção',
    code: 'BOSCH-0445-120-212',
    price: 850.00,
    installments: '12x de R$ 70,83 sem juros',
    compatibility: 'Mercedes-Benz Accelo 815 / 1016 e Atego 1719',
    inStock: true,
    rating: 5.0,
    badge: 'Alta Precisão',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
    description: 'Injetor piezoelétrico Common Rail calibrado eletronicamente com código IMA/EMA para queima ideal de combustível, sem fumaça e com máxima potência.',
    specs: {
      'Fabricante': 'Bosch Original',
      'Pressão de Trabalho': 'Até 1.800 bar de injeção',
      'Certificado': 'Com laudo de teste em bancada digital'
    }
  }
];

const CIRCULAR_PARTS = [
  { name: 'Faróis & Lanternas', count: '+820 itens', icon: '💡', category: 'Lataria & Acabamentos' },
  { name: 'Discos de Freio', count: '+640 itens', icon: '⭕', category: 'Sistemas de Freio' },
  { name: 'Filtros de Ar & Óleo', count: '+1.200 itens', icon: '📦', category: 'Componentes de Motor' },
  { name: 'Rolamentos de Roda', count: '+430 itens', icon: '⚙️', category: 'Suspensão & Direção' },
  { name: 'Velas & Aquecedores', count: '+310 itens', icon: '⚡', category: 'Elétrica & Arrefecimento' },
  { name: 'Parabarros & Grades', count: '+550 itens', icon: '🛡️', category: 'Lataria & Acabamentos' }
];

export default function App() {
  // Vehicle selector filter
  const [selectorTab, setSelectorTab] = useState<'veiculo' | 'codigo'>('veiculo');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas as Categorias');
  const [codeInput, setCodeInput] = useState<string>('');
  const [activeVehicleFilterBanner, setActiveVehicleFilterBanner] = useState<string | null>(null);
  const [vehicleModelFilter, setVehicleModelFilter] = useState<string>('');

  // Local Storage-based Recently Searched state (max 3 items)
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 3);
        }
      }
    } catch (e) {
      console.error('Falha ao ler buscas recentes do localStorage:', e);
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  // Persist recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.slice(0, 3)));
    } catch (e) {
      console.error('Falha ao salvar buscas recentes no localStorage:', e);
    }
  }, [recentSearches]);

  // Helper to save a recent search combination (maintains max 3 in localStorage)
  const saveRecentSearch = (brand: string, model: string, year?: string, category?: string) => {
    if (!brand && !model) return;
    const brandName = brand || 'Veículo';
    const modelName = model || '';
    const yearName = year ? ` ${year}` : '';
    const label = `${brandName} ${modelName}${yearName}`.trim();
    const id = `${brand}-${model}-${year || ''}`.toLowerCase().replace(/\s+/g, '-');

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.id !== id && item.label.toLowerCase() !== label.toLowerCase());
      const newEntry: RecentSearch = {
        id,
        brand,
        model,
        year: year || '',
        category: category || 'Todas as Categorias',
        label,
        timestamp: Date.now()
      };
      const updated = [newEntry, ...filtered].slice(0, 3);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Falha ao salvar busca recente no localStorage:', err);
      }
      return updated;
    });
  };

  const removeRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Falha ao atualizar localStorage:', err);
      }
      return updated;
    });
    showToast('Busca recente removida do histórico.');
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([]));
    } catch (err) {
      console.error('Falha ao limpar histórico:', err);
    }
    showToast('Histórico de buscas recentes limpo com sucesso.');
  };

  const applyRecentSearch = (item: RecentSearch) => {
    setSelectorTab('veiculo');
    setSelectedBrand(item.brand);
    setSelectedModel(item.model);
    setSelectedYear(item.year || '');
    setSelectedCategoryFilter(item.category || 'Todas as Categorias');

    if (item.brand) {
      setBrandFilter(item.brand);
    } else {
      setBrandFilter('all');
    }
    if (item.model) {
      setVehicleModelFilter(item.model);
    } else {
      setVehicleModelFilter('');
    }
    if (item.category && item.category !== 'Todas as Categorias') {
      setActiveCategoryTab(item.category);
    } else {
      setActiveCategoryTab('Todas');
    }

    setActiveVehicleFilterBanner(item.label);
    showToast(`Filtro carregado: ${item.label}`);

    // Re-bump to top of recent searches in localStorage
    saveRecentSearch(item.brand, item.model, item.year, item.category);

    const catalogEl = document.getElementById('vitrine');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickFilterClick = (brand: string, model: string, year?: string) => {
    setSelectorTab('veiculo');
    setSelectedBrand(brand);
    setSelectedModel(model);
    setSelectedYear(year || '');
    setBrandFilter(brand);
    setVehicleModelFilter(model);
    const label = `${brand} ${model}${year ? ` ${year}` : ''}`.trim();
    setActiveVehicleFilterBanner(label);
    saveRecentSearch(brand, model, year);
    showToast(`Filtro rápido carregado: ${label}`);
    const catalogEl = document.getElementById('vitrine');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Search and Category Tabs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('Todas');

  // Cart / Quote Drawer
  const [cart, setCart] = useState<{ product: CatalogProduct; quantity: number }[]>([
    { product: PRODUCTS_DATA[0], quantity: 1 },
    { product: PRODUCTS_DATA[4], quantity: 2 }
  ]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['prod-1']);

  // Quick View Modal
  const [modalProduct, setModalProduct] = useState<CatalogProduct | null>(null);

  // Mobile Menu & Categories Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cart functions
  const addToCart = (product: CatalogProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`"${product.name}" adicionado ao seu orçamento!`);
    setCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: CatalogProduct; quantity: number }[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removido do orçamento.');
  };

  const totalCartValue = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removido dos favoritos.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Adicionado aos favoritos!');
        return [...prev, productId];
      }
    });
  };

  // Execute Vehicle Search
  const handleApplyVehicleSearch = () => {
    if (selectorTab === 'veiculo') {
      if (selectedBrand) {
        setBrandFilter(selectedBrand);
      } else {
        setBrandFilter('all');
      }
      if (selectedModel) {
        setVehicleModelFilter(selectedModel);
      } else {
        setVehicleModelFilter('');
      }
      if (selectedCategoryFilter && selectedCategoryFilter !== 'Todas as Categorias') {
        setActiveCategoryTab(selectedCategoryFilter);
      } else {
        setActiveCategoryTab('Todas');
      }
      const filterSummary = `${selectedBrand || 'Veículo'} ${selectedModel || ''} ${selectedYear || ''}`.trim();
      setActiveVehicleFilterBanner(filterSummary || 'Filtro de Veículo Aplicado');
      showToast(`Filtro aplicado: ${filterSummary || 'Veículo'}`);

      // Save to local storage recent searches (last 3 combinations)
      if (selectedBrand || selectedModel) {
        saveRecentSearch(selectedBrand, selectedModel, selectedYear, selectedCategoryFilter);
      }
    } else {
      if (codeInput.trim()) {
        setSearchQuery(codeInput.trim());
        setActiveVehicleFilterBanner(`Código OEM: ${codeInput.trim()}`);
        showToast(`Buscando por código: ${codeInput.trim()}`);
      }
    }

    // Smooth scroll to catalog
    const catalogEl = document.getElementById('vitrine');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedCategoryFilter('Todas as Categorias');
    setCodeInput('');
    setBrandFilter('all');
    setVehicleModelFilter('');
    setActiveCategoryTab('Todas');
    setSearchQuery('');
    setActiveVehicleFilterBanner(null);
    showToast('Filtros limpos. Exibindo todos os produtos.');
  };

  // WhatsApp checkout message generator
  const sendWhatsAppCart = () => {
    let msg = `*SOLICITAÇÃO DE COTAÇÃO - TEM DE TUDO AUTO PEÇAS*\n`;
    msg += `Olá, gostaria de confirmar a disponibilidade e prazo de entrega dos seguintes itens:\n\n`;

    cart.forEach((item, idx) => {
      msg += `*${idx + 1}. ${item.product.name}*\n`;
      msg += `   • Cód: ${item.product.code}\n`;
      msg += `   • Qtd: ${item.quantity} un.\n`;
      msg += `   • Subtotal: R$ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });

    msg += `*VALOR TOTAL ESTIMADO:* R$ ${totalCartValue.toFixed(2)}\n`;
    msg += `*CIDADE/ESTADO:* Salvador - BA e Região Metropolitana\n`;
    msg += `Favor confirmar estoque e condições no PIX / Cartão!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/5571989521165?text=${encoded}`, '_blank');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(prod => {
      const matchBrand =
        brandFilter === 'all' || prod.brand.toLowerCase() === brandFilter.toLowerCase();
      const matchCategory =
        activeCategoryTab === 'Todas' ||
        prod.category.toLowerCase().includes(activeCategoryTab.toLowerCase());
      const matchModel =
        !vehicleModelFilter ||
        prod.compatibility.toLowerCase().includes(vehicleModelFilter.toLowerCase()) ||
        prod.name.toLowerCase().includes(vehicleModelFilter.toLowerCase());
      const matchSearch =
        searchQuery === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.compatibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchBrand && matchCategory && matchModel && matchSearch;
    });
  }, [brandFilter, activeCategoryTab, vehicleModelFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-[#DC2626] selection:text-white">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 bg-[#0F172A] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm font-semibold pointer-events-none max-w-sm"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. TOP UTILITY BAR ================= */}
      <div className="bg-[#0F172A] text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-[#DC2626]" />
              <strong className="text-white">(71) 98952-1165</strong>
              <span className="text-slate-400 text-[11px] hidden sm:inline">(Seg a Sex 07h30 às 18h | Sáb até 13h)</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              cleidison_1000@hotmail.com
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9 no Google Maps (+340 avaliações)
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Truck className="w-3 h-3 text-slate-400" /> Despacho no mesmo dia
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantia CDC
            </span>
          </div>

        </div>
      </div>

      {/* ================= 2. MAIN HEADER ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="h-20 flex items-center justify-between gap-6">
            
            {/* Logo: Tem De Tudo Auto Peças */}
            <a href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-2 border border-slate-700 shadow-md group-hover:border-[#DC2626] transition-colors">
                <svg className="w-7 h-7 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-xl font-black tracking-tight text-[#0F172A] uppercase group-hover:text-[#DC2626] transition-colors">
                  TEM DE TUDO
                </span>
                <span className="block text-[11px] font-extrabold tracking-widest text-[#DC2626] uppercase">
                  AUTO PEÇAS & SERVIÇOS
                </span>
              </div>
            </a>

            {/* Central Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Pesquise por nome da peça, código original, veículo ou chassi..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#DC2626] focus:ring-2 focus:ring-red-100 transition-all"
                />
                <button
                  aria-label="Buscar Peça"
                  onClick={() => {
                    const catalogEl = document.getElementById('vitrine');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions: WhatsApp & Cart */}
            <div className="flex items-center gap-3 shrink-0">
              
              <a
                href="https://wa.me/5571989521165?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Tem%20De%20Tudo%20e%20gostaria%20de%20fazer%20uma%20cota%C3%A7%C3%A3o."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Atendimento WhatsApp</span>
              </a>

              {/* Cart Drawer Trigger Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCartDrawerOpen(true)}
                className="flex items-center gap-3 bg-[#DC2626] hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md relative"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <motion.span
                      key={totalCartCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-white text-[#DC2626] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow"
                    >
                      {totalCartCount}
                    </motion.span>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-[10px] font-normal block opacity-90 uppercase tracking-wider">Meu Orçamento</span>
                  <span className="font-extrabold text-xs">R$ {totalCartValue.toFixed(2)}</span>
                </div>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-black rounded-lg border border-slate-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>

          {/* Secondary Nav Bar */}
          <div className="hidden lg:flex items-center justify-between border-t border-slate-100 py-2.5 text-xs font-semibold">
            
            {/* Categories Dropdown with click outside handler */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#DC2626]" />
                <span className="uppercase tracking-wider">Categorias de Peças</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {categoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 text-slate-700"
                  >
                    {[
                      'Componentes de Motor',
                      'Sistemas de Freio',
                      'Suspensão & Direção',
                      'Câmbio & Embreagem',
                      'Linha Diesel & Injeção',
                      'Lataria & Acabamentos',
                      'Elétrica & Arrefecimento'
                    ].map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveCategoryTab(cat);
                          setCategoriesDropdownOpen(false);
                          const el = document.getElementById('vitrine');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-[#DC2626] text-xs font-semibold flex items-center justify-between transition-colors"
                      >
                        <span>{cat}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-7 text-slate-600">
              <button
                onClick={() => { setActiveCategoryTab('Todas'); setBrandFilter('all'); setSearchQuery(''); }}
                className="hover:text-[#DC2626] font-bold text-slate-900 transition-colors"
              >
                Início
              </button>
              <a href="#veiculo-selector" className="hover:text-[#DC2626] transition-colors">
                Buscar por Veículo
              </a>
              <a href="#marcas" className="hover:text-[#DC2626] transition-colors">
                Marcas Atendidas
              </a>
              <a href="#vitrine" className="hover:text-[#DC2626] transition-colors">
                Produtos em Destaque
              </a>
              <a href="#linha-diesel" className="hover:text-[#DC2626] transition-colors">
                Linha Diesel & Frotas
              </a>
              <a href="#contato" className="hover:text-[#DC2626] transition-colors">
                Atendimento & Localização
              </a>
            </div>

            <div className="text-slate-500 flex items-center gap-1.5 font-medium">
              <span>Central Salvador:</span>
              <strong className="text-slate-900 font-bold">(71) 98952-1165</strong>
            </div>

          </div>

          {/* Mobile Search input */}
          <div className="md:hidden py-3 border-t border-slate-100">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar por peça, chassi ou modelo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-xs pl-3.5 pr-10 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#DC2626]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 text-sm shadow-xl overflow-hidden"
            >
              <a onClick={() => setMobileMenuOpen(false)} href="#veiculo-selector" className="block py-2 font-semibold text-slate-700 hover:text-[#DC2626]">
                Buscar Peças por Veículo
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#marcas" className="block py-2 font-semibold text-slate-700 hover:text-[#DC2626]">
                Marcas Automotivas
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#vitrine" className="block py-2 font-semibold text-slate-700 hover:text-[#DC2626]">
                Produtos Mais Vendidos
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#linha-diesel" className="block py-2 font-semibold text-slate-700 hover:text-[#DC2626]">
                Linha Diesel & Frotas
              </a>
              <a onClick={() => setMobileMenuOpen(false)} href="#contato" className="block py-2 font-semibold text-slate-700 hover:text-[#DC2626]">
                Localização & Horários
              </a>
              <div className="pt-3 border-t border-slate-100">
                <a
                  href="https://wa.me/5571989521165"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#DC2626] text-white py-2.5 rounded-lg font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4" /> Chamar Especialista no WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= 3. HERO SECTION (Vehicle Selector & Automotive Visual) ================= */}
      <section id="veiculo-selector" className="relative hero-mesh py-12 lg:py-16 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline & Multi-Step Selector */}
            <div className="lg:col-span-8 space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-[#DC2626] font-extrabold text-xs tracking-wider uppercase mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Procedência Garantida & Nota Fiscal
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                  Peças Originais e de Reposição, com <span className="text-[#DC2626]">Garantia de Procedência</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                  Mais de 15.000 itens para carros de passeio, vans, utilitários, caminhões e tratores. Encontre a peça exata pelo modelo ou número do chassi.
                </p>
              </div>

              {/* THE SELECTOR MODULE */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 sm:p-7 card-shadow">
                
                {/* Selector Tabs */}
                <div className="flex items-center gap-4 border-b border-slate-200 pb-3 mb-4">
                  <button
                    onClick={() => setSelectorTab('veiculo')}
                    className={`text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectorTab === 'veiculo'
                        ? 'border-[#DC2626] text-[#DC2626]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    Buscar por Veículo
                  </button>
                  <button
                    onClick={() => setSelectorTab('codigo')}
                    className={`text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectorTab === 'codigo'
                        ? 'border-[#DC2626] text-[#DC2626]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Buscar por Código / Chassi
                  </button>
                </div>

                {/* Recently Searched Quick Access Chips (Persisted in localStorage - max 3 combinations) */}
                <div className="mb-4 pb-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center shrink-0">
                      <Clock className="w-3 h-3" />
                    </div>
                    <span className="text-slate-800">Buscas Recentes:</span>
                    <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">(máx. 3 no navegador)</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {recentSearches.length > 0 ? (
                      <>
                        <AnimatePresence mode="popLayout">
                          {recentSearches.map((rec) => {
                            const isCurrentActive =
                              (activeVehicleFilterBanner && activeVehicleFilterBanner.toLowerCase().includes(rec.label.toLowerCase())) ||
                              (selectedBrand.toLowerCase() === rec.brand.toLowerCase() && selectedModel.toLowerCase() === rec.model.toLowerCase());

                            return (
                              <motion.div
                                key={rec.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.03, y: -1 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => applyRecentSearch(rec)}
                                className={`group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                                  isCurrentActive
                                    ? 'bg-[#DC2626] text-white border border-[#DC2626] shadow-sm ring-2 ring-red-200'
                                    : 'bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#DC2626] border border-slate-200 hover:border-red-200'
                                }`}
                                title={`Clique para filtrar peças para ${rec.label}`}
                              >
                                <Car className={`w-3 h-3 ${isCurrentActive ? 'text-white' : 'text-slate-400 group-hover:text-[#DC2626]'} transition-colors`} />
                                <span className="font-bold">{rec.label}</span>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(rec.id, e)}
                                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ml-0.5 cursor-pointer ${
                                    isCurrentActive
                                      ? 'text-white/80 hover:text-white hover:bg-red-700'
                                      : 'text-slate-400 hover:text-white hover:bg-[#DC2626]'
                                  }`}
                                  title="Remover esta busca do histórico"
                                  aria-label={`Remover ${rec.label} do histórico`}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        <button
                          type="button"
                          onClick={clearAllRecentSearches}
                          className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors ml-1 px-1.5 py-0.5 rounded cursor-pointer"
                          title="Limpar histórico de buscas recentes"
                        >
                          Limpar tudo
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Nenhuma busca salva. Busque um veículo abaixo para criar atalhos rápidos.
                      </span>
                    )}
                  </div>
                </div>

                {selectorTab === 'veiculo' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      
                      {/* Step 1: Marca */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          1. Montadora / Marca
                        </label>
                        <select
                          value={selectedBrand}
                          onChange={e => setSelectedBrand(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:border-[#DC2626]"
                        >
                          <option value="">Selecione a Marca</option>
                          <option value="Toyota">Toyota</option>
                          <option value="Ford">Ford</option>
                          <option value="Volkswagen">Volkswagen</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                          <option value="Scania">Scania</option>
                          <option value="Chevrolet">Chevrolet</option>
                          <option value="Fiat">Fiat</option>
                          <option value="New Holland">New Holland (Agrícola)</option>
                        </select>
                      </div>

                      {/* Step 2: Modelo */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          2. Modelo do Veículo
                        </label>
                        <select
                          value={selectedModel}
                          onChange={e => setSelectedModel(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:border-[#DC2626]"
                        >
                          <option value="">Selecione o Modelo</option>
                          <option value="Hilux">Hilux</option>
                          <option value="Cargo">Cargo (815, 2428)</option>
                          <option value="Sprinter">Sprinter (313, 415, 515)</option>
                          <option value="Amarok">Amarok V6 / 2.0</option>
                          <option value="Corolla">Corolla</option>
                          <option value="Ranger">Ranger</option>
                          <option value="Scania R">Scania R440 / G420</option>
                          <option value="Trator">Trator Linha Agrícola</option>
                        </select>
                      </div>

                      {/* Step 3: Ano */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          3. Ano de Fabricação
                        </label>
                        <select
                          value={selectedYear}
                          onChange={e => setSelectedYear(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:border-[#DC2626]"
                        >
                          <option value="">Selecione o Ano</option>
                          {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010].map(y => (
                            <option key={y} value={y.toString()}>{y}</option>
                          ))}
                        </select>
                      </div>

                      {/* Step 4: Categoria */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          4. Tipo de Peça
                        </label>
                        <select
                          value={selectedCategoryFilter}
                          onChange={e => setSelectedCategoryFilter(e.target.value)}
                          className="w-full bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg p-2.5 border border-slate-200 focus:outline-none focus:border-[#DC2626]"
                        >
                          <option value="Todas as Categorias">Todas as Peças</option>
                          <option value="Lataria">Lataria & Parachoques</option>
                          <option value="Freio">Discos & Pastilhas de Freio</option>
                          <option value="Suspensão">Amortecedores & Suspensão</option>
                          <option value="Embreagem">Kits de Embreagem & Câmbio</option>
                          <option value="Motor">Motor & Pistões</option>
                          <option value="Diesel">Linha Diesel & Injeção</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-500">
                        Filtros rápidos:{' '}
                        <button
                          type="button"
                          onClick={() => handleQuickFilterClick('Toyota', 'Hilux', '2022')}
                          className="text-[#DC2626] font-semibold underline hover:text-red-800 cursor-pointer"
                        >
                          Hilux
                        </button>
                        ,{' '}
                        <button
                          type="button"
                          onClick={() => handleQuickFilterClick('Ford', 'Cargo', '2022')}
                          className="text-[#DC2626] font-semibold underline hover:text-red-800 cursor-pointer"
                        >
                          Cargo 2428
                        </button>
                        ,{' '}
                        <button
                          type="button"
                          onClick={() => handleQuickFilterClick('Mercedes-Benz', 'Sprinter', '2021')}
                          className="text-[#DC2626] font-semibold underline hover:text-red-800 cursor-pointer"
                        >
                          Sprinter
                        </button>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {activeVehicleFilterBanner && (
                          <button
                            onClick={handleClearFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Limpar
                          </button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleApplyVehicleSearch}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <Search className="w-4 h-4" />
                          <span>Buscar Peças Compatíveis</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Número da Peça, Código Original OEM ou Chassi:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ex: 52119-0K980 ou 9BWZZZ..."
                          value={codeInput}
                          onChange={e => setCodeInput(e.target.value)}
                          className="flex-1 bg-slate-50 text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#DC2626]"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleApplyVehicleSearch}
                          className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors shadow cursor-pointer"
                        >
                          <Search className="w-4 h-4" />
                          <span>Buscar</span>
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Nossa equipe confere nos sistemas técnicos de montadoras para garantir compatibilidade 100% precisa.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Right Column: Visual of Vehicle & Exploded Mechanicals */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl bg-white p-6 border border-slate-200 shadow-xl overflow-hidden card-shadow">
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[#DC2626] uppercase tracking-wider">
                    Engenharia & Reposição
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">Linha Leve & Diesel</span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-slate-900 h-64 border border-slate-800 flex items-center justify-center group">
                  <img
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=700&q=80"
                    alt="Veículo Moderno"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating mechanical callouts */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between text-white pointer-events-none">
                    <div className="flex justify-between items-start">
                      <div className="bg-black/70 backdrop-blur-xs p-2 rounded-lg text-[11px] border border-white/10">
                        <span className="text-emerald-400 font-bold block">✓ Freios Ventilados</span>
                        Alta dissipação térmica
                      </div>
                      <div className="bg-[#DC2626] text-white p-1.5 px-2.5 rounded-lg text-[11px] font-black shadow">
                        100% NOTA FISCAL
                      </div>
                    </div>

                    <div className="bg-slate-900/85 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Suspensão & Motor</span>
                        <span className="text-amber-400 font-semibold">Pronta-Entrega</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Pistões, anéis, juntas, amortecedores e kits de embreagem testados.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#DC2626]" /> Envio para todo o Brasil
                  </span>
                  <span className="text-slate-900 font-bold">Salvador - BA</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 4. BRAND GRID ================= */}
      <section id="marcas" className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Principais Marcas e Montadoras Atendidas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Selecione a marca do seu veículo para filtrar componentes específicos em nosso estoque
              </p>
            </div>
            {brandFilter !== 'all' && (
              <button
                onClick={() => setBrandFilter('all')}
                className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Limpar ({brandFilter})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {BRANDS.map((b, idx) => {
              const isSelected = brandFilter.toLowerCase() === b.name.toLowerCase();
              return (
                <motion.button
                  key={idx}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const newFilter = isSelected ? 'all' : b.name;
                    setBrandFilter(newFilter);
                    if (newFilter !== 'all') {
                      showToast(`Filtrando produtos para ${b.name}`);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-center transition-all card-shadow cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-[#DC2626] ring-2 ring-[#DC2626]'
                      : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 mx-auto rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-800 shadow-xs mb-2">
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 truncate">{b.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{b.count}</div>
                </motion.button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= 5. FEATURED PRODUCTS (Milkan Showcase) ================= */}
      <section id="vitrine" className="py-14 bg-slate-50 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-[#DC2626] uppercase tracking-wider block mb-1">
                Catálogo em Pronta-Entrega
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Produtos em Destaque & Mais Procurados
              </h2>
            </div>

            {/* Quick Filter tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Todas', 'Lataria', 'Freio', 'Suspensão', 'Diesel'].map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryTab === tab
                      ? 'bg-[#DC2626] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Banner */}
          {activeVehicleFilterBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-slate-700"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#DC2626]" />
                <span>
                  Exibindo resultados filtrados para: <strong>{activeVehicleFilterBanner}</strong> ({filteredProducts.length} itens encontrados)
                </span>
              </div>
              <button
                onClick={handleClearFilters}
                className="font-bold text-[#DC2626] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Remover Filtro
              </button>
            </motion.div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Nenhuma peça encontrada para esta combinação</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Temos mais de 15.000 peças em estoque físico que podem não estar listadas na vitrine rápida. Consulte nossos técnicos no WhatsApp.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Limpar Filtros
                </button>
                <a
                  href={`https://wa.me/5571989521165?text=${encodeURIComponent(`Olá! Gostaria de consultar se vocês têm peças para ${searchQuery || brandFilter || 'meu veículo'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#DC2626] hover:bg-red-700 text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Consultar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(prod => {
                const isFav = favorites.includes(prod.id);
                return (
                  <motion.div
                    layout
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-shadow hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Area */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Wishlist button */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleFavorite(prod.id)}
                          aria-label="Favoritar"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#DC2626] transition-colors shadow-xs cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
                        </motion.button>

                        {/* Badge */}
                        {prod.badge && (
                          <span className="absolute top-3 left-3 bg-[#DC2626] text-white font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                            {prod.badge}
                          </span>
                        )}

                        {/* Quick View Button */}
                        <button
                          onClick={() => setModalProduct(prod)}
                          className="absolute bottom-3 inset-x-4 bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-bold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Detalhes Técnicos
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span>Montadora: <strong className="text-slate-800">{prod.brand}</strong></span>
                          <span className="font-mono text-slate-600">{prod.code}</span>
                        </div>

                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#DC2626] transition-colors">
                          {prod.name}
                        </h3>

                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {prod.compatibility}
                        </p>

                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-xl font-black text-slate-950 font-heading tabular-nums">
                            R$ {prod.price.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {prod.installments}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0 space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => addToCart(prod)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Adicionar ao Orçamento</span>
                      </motion.button>

                      <a
                        href={`https://wa.me/5571989521165?text=${encodeURIComponent(`Olá! Gostaria de consultar a peça: ${prod.name} (Cód: ${prod.code}) por R$ ${prod.price.toFixed(2)}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cotar no WhatsApp</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </div>
      </section>

      {/* ================= 6. TRUST & BENEFITS STRIP ================= */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            
            <div className="space-y-2 p-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Garantia & Procedência</h3>
              <p className="text-[11px] text-slate-500">Nota fiscal em 100% das peças e Art. 26 CDC</p>
            </div>

            <div className="space-y-2 p-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Envio para Todo o Brasil</h3>
              <p className="text-[11px] text-slate-500">Expedição no mesmo dia útil com rastreamento</p>
            </div>

            <div className="space-y-2 p-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Estoque em Tempo Real</h3>
              <p className="text-[11px] text-slate-500">Mais de 15.000 peças catalogadas a pronta-entrega</p>
            </div>

            <div className="space-y-2 p-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Suporte Especializado</h3>
              <p className="text-[11px] text-slate-500">Consultoria técnica antes e depois da compra</p>
            </div>

            <div className="space-y-2 p-3 col-span-2 md:col-span-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <ThumbsUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">+98% de Satisfação</h3>
              <p className="text-[11px] text-slate-500">Nota 4.9 no Google Maps com mais de 340 avaliações</p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 7. QUICK PARTS CIRCULAR GRID ================= */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              Categorias Mais Procuradas de Giro Rápido
            </h2>
            <p className="text-xs text-slate-500">
              Acesso direto aos componentes de alta rotatividade para manutenção preventiva e corretiva
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CIRCULAR_PARTS.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setActiveCategoryTab(item.category);
                  const el = document.getElementById('vitrine');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200 text-center card-shadow hover:border-[#DC2626] transition-all group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-3">
                  {item.icon}
                </div>
                <div className="font-bold text-xs text-slate-900 group-hover:text-[#DC2626] transition-colors leading-tight">
                  {item.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{item.count}</div>
              </motion.button>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 8. PROMOTIONAL FLEET & DIESEL BANNER ================= */}
      <section id="linha-diesel" className="py-12 bg-[#0F172A] text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-[#DC2626] text-white text-[11px] font-extrabold uppercase tracking-wider">
                Condições Especiais para Frotas & Oficinas
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                Fornecimento Faturado para Empresas, Transportadoras e Construtoras
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Tabela diferenciada de preços para frotas de caminhões (Scania, Volvo, Mercedes-Benz, Ford Cargo) e maquinário pesado (tratores, motoniveladoras e motores estacionários). Prazo faturado no boleto e entrega prioritária.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DC2626]" /> Faturamento CNPJ em até 28 DDL</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DC2626]" /> Descontos progressivos por volume</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#DC2626]" /> Consultor de conta exclusivo</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="https://wa.me/5571989521165?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20tabela%20para%20Frotista%20/%20Oficina%20Mec%C3%A2nica."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#DC2626] hover:bg-red-700 text-white font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-all shadow-xl text-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Solicitar Tabela Frotista</span>
              </motion.a>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 9. FOOTER ================= */}
      <footer id="contato" className="bg-[#0F172A] text-slate-300 text-xs pt-14 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#DC2626] flex items-center justify-center text-white font-black">
                  TD
                </div>
                <div>
                  <span className="block text-base font-extrabold text-white uppercase">
                    TEM DE TUDO
                  </span>
                  <span className="block text-[10px] font-bold text-red-400 tracking-wider uppercase">
                    AUTO PEÇAS E SERVIÇOS
                  </span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Referência em peças novas e seminovas para carros, vans, caminhões e tratores. Qualidade certificada, garantia CDC e atendimento especializado para todo o território nacional.
              </p>
              <div className="pt-2 text-slate-300 space-y-1">
                <div className="font-bold text-white">Razão Social:</div>
                <div className="text-slate-400">Tem De Tudo Auto Peças e Serviços Ltda.</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                Acesso Rápido
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#veiculo-selector" className="hover:text-white transition-colors">Busca por Veículo</a></li>
                <li><a href="#marcas" className="hover:text-white transition-colors">Montadoras & Marcas</a></li>
                <li><a href="#vitrine" className="hover:text-white transition-colors">Catálogo de Produtos</a></li>
                <li><a href="#linha-diesel" className="hover:text-white transition-colors">Linha Pesada & Frotas</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                Atendimento & Suporte
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="https://wa.me/5571989521165" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cotação via WhatsApp</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Retirada em Balcão (Salvador)</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Envios Interestaduais</a></li>
                <li><a href="#contato" className="hover:text-white transition-colors">Cadastro de Oficinas</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
                Central de Contato
              </h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-bold">(71) 98952-1165</span>
                    <span className="text-[11px]">WhatsApp & Telefone Comercial</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-bold">cleidison_1000@hotmail.com</span>
                    <span className="text-[11px]">E-mail para cotações e NF-e</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-bold">Salvador - Bahia</span>
                    <span className="text-[11px]">Atendimento local e envios nacionais</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-white font-bold">Horário de Funcionamento:</span>
                    <span className="text-[11px]">Seg a Sex: 07h30 às 18h00 | Sáb: 08h às 13h</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] text-center md:text-left">
            <div>
              © {new Date().getFullYear()} Tem De Tudo Auto Peças e Serviços Ltda. Todos os direitos reservados.
            </div>
            <div>
              Formas de Pagamento: PIX com desconto · Cartão de Crédito em até 12x · Boleto Bancário Faturado
            </div>
          </div>

        </div>
      </footer>

      {/* ================= 10. CART SLIDE-OVER DRAWER ================= */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                
                {/* Header */}
                <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#DC2626]" />
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Meu Orçamento ({totalCartCount} {totalCartCount === 1 ? 'item' : 'itens'})
                    </h3>
                  </div>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <div className="font-bold text-slate-800 text-sm">Seu orçamento está vazio</div>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Navegue pelo catálogo e adicione itens para montar sua cotação instantânea.
                      </p>
                    </div>
                  ) : (
                    cart.map(({ product, quantity }) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex gap-3 items-center justify-between"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-slate-200"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Cód: {product.code}
                          </div>
                          <div className="text-xs font-black text-[#DC2626] mt-1 tabular-nums">
                            R$ {(product.price * quantity).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="p-1 px-2 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold px-2">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="p-1 px-2 hover:bg-slate-100 text-slate-600 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Subtotal estimado:</span>
                        <span className="font-bold text-slate-800 tabular-nums">R$ {totalCartValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                        <span>Desconto no PIX:</span>
                        <span>5% OFF aplicado</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                        <span>Total do Orçamento:</span>
                        <span className="text-base text-[#DC2626] tabular-nums">R$ {totalCartValue.toFixed(2)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={sendWhatsAppCart}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>Finalizar Orçamento pelo WhatsApp</span>
                    </motion.button>

                    <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Sem compromisso · Confirmação em minutos
                    </div>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 11. QUICK VIEW MODAL ================= */}
      <AnimatePresence>
        {modalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalProduct(null)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
            >
              
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-xs font-bold text-slate-500 font-mono">
                  CÓDIGO: {modalProduct.code}
                </span>
                <button
                  onClick={() => setModalProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="h-60 bg-slate-100 rounded-xl flex items-center justify-center p-4 border border-slate-200">
                    <img
                      src={modalProduct.image}
                      alt={modalProduct.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase bg-red-50 px-2 py-0.5 rounded">
                      {modalProduct.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {modalProduct.name}
                    </h3>
                    <div className="text-xs text-slate-600">
                      <strong>Compatibilidade:</strong> {modalProduct.compatibility}
                    </div>
                    <div className="text-2xl font-black text-slate-950 pt-2 tabular-nums">
                      R$ {modalProduct.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {modalProduct.installments}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    Descrição Técnica
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {modalProduct.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    Especificações do Produto
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(modalProduct.specs).map(([k, v], i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">{k}</span>
                        <span className="font-bold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
                <button
                  onClick={() => {
                    addToCart(modalProduct);
                    setModalProduct(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Adicionar ao Orçamento</span>
                </button>

                <a
                  href={`https://wa.me/5571989521165?text=${encodeURIComponent(`Olá! Gostaria de consultar detalhes da peça: ${modalProduct.name} (${modalProduct.code}).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 12. FLOATING WHATSAPP BUTTON ================= */}
      <aside aria-label="Acesso rápido WhatsApp" className="fixed bottom-6 right-6 z-40">
        <motion.a
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          href="https://wa.me/5571989521165?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20atendente%20da%20Tem%20De%20Tudo."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-colors group cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide">
            Falar no WhatsApp
          </span>
        </motion.a>
      </aside>

    </div>
  );
}
