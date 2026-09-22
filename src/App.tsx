import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Users,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Activity,
  Coffee,
  Pill,
  Send,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  DollarSign,
  AlertTriangle,
  FileText,
  Clock,
  ArrowRight,
  User,
  Home,
  Plus,
  RefreshCw,
  Info,
  Calendar,
  Lock,
  CreditCard,
  QrCode,
  Copy,
  Unlock,
  MapPin,
  Star,
  LogOut,
  LogIn,
  Upload,
  UserX,
  Sliders,
  Check,
  Trash2,
  AlertOctagon,
  X,
  Shield,
  FileCode,
  FileCheck,
  MessageSquare,
  MessageCircle,
  Sun,
  Moon,
  Droplet,
  TrendingUp,
  TrendingDown,
  Smile,
  Briefcase,
  Mic,
  Volume2,
  Play,
  Pause,
  Paperclip,
  Phone,
  Image,
  ThumbsUp,
  RotateCcw,
  Video,
  MicOff,
  PhoneOff,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LogEntry, Caregiver, Shift, EscrowDeposit, ChatMessage, UserProfile, PatientRecord } from "./types";
import { CuidaMeLogo } from "./components/CuidaMeLogo";

const PRESET_INSTRUCTIONS = [
  {
    title: "Aferição de Sinais",
    category: "vital" as const,
    desc: "Aferir pressão arterial, temperatura e saturação de oxigênio."
  },
  {
    title: "Oferecer Água",
    category: "activity" as const,
    desc: "Oferecer copo de água (200ml) para manter hidratação ativa."
  },
  {
    title: "Dar Medicação",
    category: "medication" as const,
    desc: "Administrar os remédios prescritos conforme a receita diária."
  },
  {
    title: "Refeição / Lanche",
    category: "meal" as const,
    desc: "Ajudar a servir a refeição principal ou lanche da tarde."
  },
  {
    title: "Banho & Higiene",
    category: "activity" as const,
    desc: "Ajudar no banho diário e realizar higiene bucal/pessoal."
  }
];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const truncated = digits.slice(0, 11);
  if (truncated.length === 0) return "";
  if (truncated.length <= 2) return `(${truncated}`;
  if (truncated.length <= 6) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
  if (truncated.length <= 10) {
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 6)}-${truncated.slice(6)}`;
  }
  return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
};

export default function App() {
  // Current logged in user session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("cuideme_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Auth flow states: "login" or "register"
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"contratante" | "cuidador">("contratante");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);

  // Register form fields
  const [regRole, setRegRole] = useState<"contratante" | "cuidador">("contratante");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  // Caregiver registration sub-fields
  const [regRate, setRegRate] = useState("180");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(["Alzheimer & Demência"]);
  const [regAge, setRegAge] = useState("30");
  const [regGender, setRegGender] = useState("Feminino");
  
  // Simulated document files uploaded state (stores dummy file names once selected/dropped)
  const [rgFile, setRgFile] = useState<File | null>(null);
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [crmFile, setCrmFile] = useState<File | null>(null);

  const [rgFileName, setRgFileName] = useState("documento_rg_frente_verso.jpg");
  const [diplomaFileName, setDiplomaFileName] = useState("diploma_conclusao_tecnico.pdf");
  const [crmFileName, setCrmFileName] = useState("certidao_antecedentes_esfera_federal.pdf");

  // Contratante registration sub-fields
  const [patName, setPatName] = useState("");
  const [patAge, setPatAge] = useState("");
  const [patCondition, setPatCondition] = useState("");

  // Tab states for each role
  const [familyTab, setFamilyTab] = useState<"inicio" | "agendamento" | "conexao" | "diario" | "acompanhamento" | "seguranca">("agendamento");
  const [caregiverTab, setCaregiverTab] = useState<"plantao" | "vagas" | "chat" | "financeiro">("plantao");
  
  // Admin Tab: "espera" | "usuarios" | "plantoes" | "financeiro" | "chat"
  const [adminTab, setAdminTab] = useState<"espera" | "usuarios" | "plantoes" | "financeiro" | "chat">("espera");

  // Selected Profile state for detail view modal
  const [selectedProfileData, setSelectedProfileData] = useState<any | null>(null);

  // Community and Private chats states
  const [chatMode, setChatMode] = useState<"ai" | "cuidadores" | "contratantes" | "privado">("ai");
  const [chatInput, setChatInput] = useState("");
  const [communityMessages, setCommunityMessages] = useState<any[]>([]);
  const [communityInput, setCommunityInput] = useState("");
  
  // Private direct messages states
  const [privateMessages, setPrivateMessages] = useState<any[]>([]);
  const [selectedPrivateUser, setSelectedPrivateUser] = useState<any | null>(null);
  const [privateInput, setPrivateInput] = useState("");

  // Enhanced Chat features states
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [chatAttachment, setChatAttachment] = useState<string | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [messageReactions, setMessageReactions] = useState<Record<string, Record<string, number>>>({});
  const [activeVoicePlayingId, setActiveVoicePlayingId] = useState<string | null>(null);
  const [callModalUser, setCallModalUser] = useState<any | null>(null);
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("calling");
  
  const communityEndRef = useRef<HTMLDivElement>(null);
  const privateEndRef = useRef<HTMLDivElement>(null);

  // Audio recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingAudio) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingAudio]);

  // Caregiver dismissal states
  const [dismissingCaregiver, setDismissingCaregiver] = useState<any | null>(null);
  const [dismissReason, setDismissReason] = useState("");

  // Hiring and Payment screen states
  const [hiringCaregiver, setHiringCaregiver] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "debito" | "credito">("pix");
  const [pixCopied, setPixCopied] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  const handleConfirmPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hiringCaregiver) return;
    setIsProcessingPayment(true);

    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "system",
          title: `Depósito Escrow Efetuado (${paymentMethod.toUpperCase()})`,
          description: `A contratante ${currentUser?.name || "Lucas Albuquerque"} alocou R$ ${hiringCaregiver.dailyRate || 180},00 em garantia fiduciária para o plantonista ${hiringCaregiver.name} via ${paymentMethod === "pix" ? "PIX" : paymentMethod === "debito" ? "Cartão de Débito" : "Cartão de Crédito (" + installments + "x)"}. Diário de Bordo ativado.`,
          by: "Sistema cuide.me",
          status: "success"
        })
      });
      await refreshAppData();

      const methodLabel = paymentMethod === "pix" ? "Pix" : paymentMethod === "debito" ? "Cartão de Débito" : `Cartão de Crédito (${installments}x)`;
      setReservationSuccess(
        `Seu plantão foi reservado com ${hiringCaregiver.name}! O pagamento de R$ ${hiringCaregiver.dailyRate || 180},00 foi processado com sucesso via ${methodLabel}. O valor está retido de forma 100% segura na conta Escrow e só será liberado após a conclusão e assinatura do Diário.`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
      setHiringCaregiver(null);
      setPixCopied(false);
      setCardHolder("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      setInstallments("1");
    }
  };

  // Backend state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [escrows, setEscrows] = useState<EscrowDeposit[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for manual log creation
  const [logTitle, setLogTitle] = useState("");
  const [logDesc, setLogDesc] = useState("");
  const [logCategory, setLogCategory] = useState<"medication" | "meal" | "activity" | "vital" | "occurrence">("medication");
  const [logStatus, setLogStatus] = useState<"success" | "warning" | "info" | "alert">("success");
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Financial Dashboard States
  const [finSearch, setFinSearch] = useState("");
  const [finStatusFilter, setFinStatusFilter] = useState<"all" | "locked" | "released">("all");
  const [simAmount, setSimAmount] = useState<string>("200");

  // Search/Filter for matching caregivers
  const [matchSpecialty, setMatchSpecialty] = useState<string>("");
  const [matchQuery, setMatchQuery] = useState("");

  // Nonno Dashboard interactive states (from screenshots)
  const [nonnoPatient, setNonnoPatient] = useState<"maria" | "emanoel">("maria");
  const [nonnoCalendarDay, setNonnoCalendarDay] = useState<number>(17);
  const [selectedMonth, setSelectedMonth] = useState<number>(2); // 2 = Março (0-indexed)
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [showAllMonthsGrid, setShowAllMonthsGrid] = useState<boolean>(true);
  const [nonnoRating, setNonnoRating] = useState<number>(4);
  const [nonnoTags, setNonnoTags] = useState<string[]>(["Pontual", "Atencioso"]);
  const [nonnoComment, setNonnoComment] = useState<string>("");
  const [nonnoEvalSuccess, setNonnoEvalSuccess] = useState<boolean>(false);

  // Stateful calendar shift dates with cancellation rules
  const [confirmedDays, setConfirmedDays] = useState<number[]>([25, 26]);
  const [completedDays, setCompletedDays] = useState<number[]>([17, 18, 19, 20, 24]);
  const [simulatedToday, setSimulatedToday] = useState<number>(17);
  const [cancelStatusMsg, setCancelStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [cancellingShiftDay, setCancellingShiftDay] = useState<number | null>(null);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<"vista" | "credito">("vista");

  // Dynamic user patients list with "Add Patient" capability
  const [userPatients, setUserPatients] = useState<PatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("primary");
  const [isAddingPatient, setIsAddingPatient] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState<string>("");
  const [newPatientAge, setNewPatientAge] = useState<string>("");
  const [newPatientCondition, setNewPatientCondition] = useState<string>("");
  const [newPatientWeight, setNewPatientWeight] = useState<string>("70");

  useEffect(() => {
    if (currentUser && currentUser.role === "contratante") {
      const savedPatients = localStorage.getItem(`cuideme_patients_${currentUser.id}`);
      if (savedPatients) {
        try {
          const parsed = JSON.parse(savedPatients);
          if (parsed.length > 0) {
            setUserPatients(parsed);
            setSelectedPatientId(parsed[0].id);
            return;
          }
        } catch (e) {}
      }
      
      // If none saved, create the primary patient of the logged-in user
      const primaryPatient: PatientRecord = {
        id: "primary",
        name: currentUser.patientName || "Sr. Helvécio",
        age: currentUser.patientAge || "78",
        condition: currentUser.patientCondition || "Alzheimer moderado e hipertensão",
        weight: "78",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        pressure: "120/80",
        heartRate: "97",
        mood: "Feliz / Estável",
        waterCups: 3,
        medsCount: 5
      };
      setUserPatients([primaryPatient]);
      setSelectedPatientId("primary");
    }
  }, [currentUser]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPatientAge || !newPatientCondition) return;

    const newPatient: PatientRecord = {
      id: "patient_" + Date.now(),
      name: newPatientName,
      age: newPatientAge,
      condition: newPatientCondition,
      weight: newPatientWeight || "70",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
      pressure: "115/75",
      heartRate: "82",
      mood: "Calmo",
      waterCups: 4,
      medsCount: 2
    };

    const updated = [...userPatients, newPatient];
    setUserPatients(updated);
    setSelectedPatientId(newPatient.id);
    if (currentUser) {
      localStorage.setItem(`cuideme_patients_${currentUser.id}`, JSON.stringify(updated));
    }
    
    // Clear form and close modal
    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientCondition("");
    setNewPatientWeight("70");
    setIsAddingPatient(false);
  };

  const MONTH_NAMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const handleCancelShift = (day: number) => {
    const daysNotice = day - simulatedToday;
    if (daysNotice < 3) {
      setCancelStatusMsg({
        text: `Não é possível cancelar o plantão do dia ${day}. Regra da plataforma: Cancelamentos só podem ser realizados com antecedência mínima de 3 dias (Falta(m) ${daysNotice <= 0 ? "0" : daysNotice} dia(s)).`,
        isError: true
      });
      setCancellingShiftDay(null);
      return;
    }

    setConfirmedDays(prev => prev.filter(d => d !== day));
    setCancelStatusMsg({
      text: `Plantão do dia ${day} de ${MONTH_NAMES[selectedMonth]} de ${selectedYear} cancelado com sucesso com ${daysNotice} dias de antecedência!`,
      isError: false
    });
    setCancellingShiftDay(null);
  };

  const handleScheduleShift = (day: number) => {
    setConfirmedDays(prev => {
      if (prev.includes(day)) return prev;
      return [...prev, day].sort((a, b) => a - b);
    });
    setCancelStatusMsg({
      text: `Plantão agendado/marcado com sucesso para o dia ${day} de ${MONTH_NAMES[selectedMonth]} de ${selectedYear}!`,
      isError: false
    });
  };

  const activePatient = userPatients.find(p => p.id === selectedPatientId) || userPatients[0] || {
    id: "primary",
    name: currentUser?.patientName || "Sr. Helvécio",
    age: currentUser?.patientAge || "78",
    condition: currentUser?.patientCondition || "Alzheimer moderado e hipertensão",
    weight: "78",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    pressure: "120/80",
    heartRate: "97",
    mood: "Feliz / Estável",
    waterCups: 3,
    medsCount: 5
  };

  // Dark mode state with localStorage caching
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("cuideme_dark") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cuideme_dark", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cuideme_dark", "false");
    }
  }, [darkMode]);

  // Restrict direct contacts as requested by safety compliance rules
  const getFilteredContacts = () => {
    if (!currentUser) return [];
    return allUsers.filter(user => {
      if (user.id === currentUser.id) return false;
      
      // 1. Admin sees everyone (adm, cuidador, contratante)
      if (currentUser.role === "adm") return true;
      
      // 2. Cuidador sees only admin, and contratantes (families) that started a conversation with him
      if (currentUser.role === "cuidador") {
        if (user.role === "adm") return true;
        if (user.role === "contratante") {
          const hasMessages = privateMessages.some(msg => 
            (msg.senderId === user.id && msg.receiverId === currentUser.id) ||
            (msg.senderId === currentUser.id && msg.receiverId === user.id)
          );
          return hasMessages;
        }
        return false;
      }
      
      // 3. Contratante (Family) sees admin, and approved/messaged caregivers (cuidadores)
      if (currentUser.role === "contratante") {
        if (user.role === "adm") return true;
        if (user.role === "cuidador") {
          return user.status === "approved" || privateMessages.some(msg => 
            (msg.senderId === user.id && msg.receiverId === currentUser.id) ||
            (msg.senderId === currentUser.id && msg.receiverId === user.id)
          );
        }
        return false;
      }
      
      return false;
    });
  };

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Pre-seed some default chatbot welcomes on mounting based on active user
  useEffect(() => {
    const welcome = getWelcomeMessage(currentUser?.role || "contratante", currentUser?.name);
    setChatMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: welcome
      }
    ]);
  }, [currentUser]);

  function getWelcomeMessage(role: string, name?: string) {
    const defaultName = name || "usuário Cuida-me";
    if (role === "adm") {
      return `**Resumo Empático:** Olá, Administrador! Suas ferramentas de triagem legal, verificação jurídica e auditoria de escrow estão totalmente ativas.

**Solução Cuida-me:**
- **Triador Geral Novo:** Analise e aprove documentação obrigatória nesta aba com 1-clique para autorizar cuidadores.
- **Auditoria Financeira:** Acompanhe os fundos garantidos em Escrow e a estabilidade das famílias.
- **Roster Atualizado:** Monitore todos os cadastrados em tempo real de forma blindada.

**Próximo Passo:** Explore a aba **Cuidadores em Espera** para avaliar novas solicitações pendentes e autorizar contas de cuidadores!`;
    } else if (role === "cuidador") {
      return `**Resumo Empático:** Boas-vindas, Cuidador ${defaultName}! Estamos honrados em apoiar sua jornada e trazer estabilidade profissional de saúde.

**Solução Cuida-me:**
- **Inadimplência Zero:** Exigimos pré-pagamento em garantia (Escrow) da família contratante antes de iniciar qualquer plantão.
- **Seguro de Atividade:** Sua apólice de seguro privada para acidentes domésticos é emitida automaticamente no app.
- **Diário de Bordo:** Registre cada atividade com facilidade e monte um portfólio de reputação excelente para ganhar mais.

**Próximo Passo:** Se sua conta está pendente, aguarde a liberação do Administrador. Se já está ativa, visualize seus plantões e registre logs.`;
    } else {
      return `**Resumo Empático:** Olá, ${defaultName}! Com o Cuida-me, sua família ganha tranquilidade e segurança jurídica na contratação de profissionais certificados.

**Solução Cuida-me:**
- **Conexão Curada:** Filtre profissionais validados com COREN e certidão de antecedentes atualizada.
- **Diário de Bordo Digital:** Acompanhe medicamentos, hidratação e sinais vitais em tempo real de onde você estiver.
- **Garantia de Escrow:** Faça o depósito de segurança. O pagamento é guardado e só liberado após o fim do serviço avaliado.

**Próximo Passo:** Acesse **Conexão Curada** para buscar e entrevistar cuidadores disponíveis hoje!`;
    }
  }

  // Fetch all state from full-stack backend
  const refreshAppData = async () => {
    try {
      setIsLoading(true);
      const [logsRes, caregiversRes, shiftsRes, escrowRes, communityRes, privateRes] = await Promise.all([
        fetch("/api/logs"),
        fetch("/api/caregivers"),
        fetch("/api/shifts"),
        fetch("/api/escrow"),
        fetch("/api/chat/community"),
        fetch("/api/chat/private"),
      ]);

      const [logsData, caregiversData, shiftsData, escrowData, communityData, privateData] = await Promise.all([
        logsRes.json(),
        caregiversRes.json(),
        shiftsRes.json(),
        escrowRes.json(),
        communityRes.json(),
        privateRes.json(),
      ]);

      setLogs(logsData);
      setCaregivers(caregiversData);
      setShifts(shiftsData);
      setEscrows(escrowData);
      setCommunityMessages(communityData);
      setPrivateMessages(privateData);

      // If user is Admin, fetch active users database
      if (currentUser?.role === "adm" || currentUser) {
        const usersRes = await fetch("/api/admin/users");
        if (usersRes.ok) {
          const uData = await usersRes.json();
          setAllUsers(uData);

          // Update current user state dynamically if status shifted
          if (currentUser) {
            const currentOnServer = uData.find((u: UserProfile) => u.id === currentUser.id);
            if (currentOnServer && currentOnServer.status !== currentUser.status) {
              const updated = { ...currentUser, status: currentOnServer.status };
              setCurrentUser(updated);
              localStorage.setItem("cuideme_user", JSON.stringify(updated));
            }
          }
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados do servidor:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAppData();
    const interval = setInterval(refreshAppData, 7000);
    return () => clearInterval(interval);
  }, [currentUser?.role, currentUser?.status]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // View specific user profile details in detail view modal
  const handleViewProfile = (userId: string) => {
    // Search first in registered users
    const foundUserInAll = allUsers.find(u => u.id === userId);
    if (foundUserInAll) {
      setSelectedProfileData(foundUserInAll);
      return;
    }
    // Then in active caregivers pool
    const foundCg = caregivers.find(c => c.id === userId || c.id === `user-${userId}` || userId.includes(c.id));
    if (foundCg) {
      setSelectedProfileData({
        id: foundCg.id,
        name: foundCg.name,
        role: "cuidador",
        status: "approved",
        email: "verificado@cuida.me",
        phone: "(11) 99999-0000",
        dailyRate: foundCg.dailyRate,
        specialties: foundCg.specialties,
        avatar: foundCg.avatar,
        distance: foundCg.distance,
        rating: foundCg.rating,
        reviewsCount: foundCg.reviewsCount
      });
      return;
    }
  };

  // Send a message to the shared role community chat
  const handleSendCommunityMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!communityInput.trim() || !currentUser) return;

    try {
      const payload = {
        senderName: currentUser.name,
        senderRole: currentUser.role,
        senderAvatar: currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        content: communityInput.trim(),
        channel: chatMode === "cuidadores" ? "cuidador" : "contratante"
      };

      const res = await fetch("/api/chat/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCommunityInput("");
        await refreshAppData();
      }
    } catch (error) {
      console.error("Erro ao publicar no chat comunitário:", error);
    }
  };

  // Start a private conversation channel and switch tab
  const handleStartPrivateChat = (receiver: any) => {
    // Close profile detail modal if open
    setSelectedProfileData(null);
    // Switch chat mode to Private Messages
    setChatMode("privado");
    // Switch active dashboard tab to Chat
    if (currentUser?.role === "contratante") {
      setFamilyTab("chat");
    } else if (currentUser?.role === "cuidador") {
      setCaregiverTab("chat");
    } else if (currentUser?.role === "adm") {
      setAdminTab("chat");
    }
    // Normalize receiver ID and fields
    setSelectedPrivateUser({
      id: receiver.id,
      name: receiver.name,
      role: receiver.role || "cuidador",
      avatar: receiver.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    });
  };

  // Send message on direct private channel
  const handleSendPrivateMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!privateInput.trim() || !currentUser || !selectedPrivateUser) return;

    try {
      const payload = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        receiverId: selectedPrivateUser.id,
        receiverName: selectedPrivateUser.name,
        content: privateInput.trim()
      };

      const res = await fetch("/api/chat/private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setPrivateInput("");
        await refreshAppData();
      }
    } catch (e) {
      console.error("Erro ao publicar no chat privado:", e);
    }
  };

  // LOGIN OPERATION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!loginEmail || !loginPassword) {
      setAuthError("Forneça o login e a senha.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, role: loginRole })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        localStorage.setItem("cuideme_user", JSON.stringify(data.user));
        setAuthSuccess("Acesso autorizado!");
        setLoginEmail("");
        setLoginPassword("");
        refreshAppData();
      } else {
        setAuthError(data.error || "Credenciais inválidas. Tente novamente.");
      }
    } catch (e) {
      setAuthError("Erro ao se conectar ao servidor.");
    }
  };

  // REGISTER OPERATION (Requires document files simulation)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!regName || !regEmail || !regPhone || !regPassword) {
      setAuthError("Preencha todos os campos cadastrais.");
      return;
    }

    const rawDigits = regPhone.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      setAuthError("Por favor, insira um telefone celular válido com DDD (mínimo de 10 ou 11 dígitos).");
      return;
    }

    // MANDATORY DOCUMENT REQUIREMENT: Caregiver register must include documents
    if (regRole === "cuidador") {
      if (!rgFileName || !diplomaFileName || !crmFileName) {
        setAuthError("Cuidadores devem obrigatoriamente fornecer as fotos dos documentos necessários.");
        return;
      }
    }

    const payload = {
      email: regEmail,
      name: regName,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      specialties: regRole === "cuidador" ? selectedSpecialties : undefined,
      dailyRate: regRole === "cuidador" ? Number(regRate) : undefined,
      age: regRole === "cuidador" ? Number(regAge) : undefined,
      gender: regRole === "cuidador" ? regGender : undefined,
      patientName: regRole === "contratante" ? patName : undefined,
      patientAge: regRole === "contratante" ? patAge : undefined,
      patientCondition: regRole === "contratante" ? patCondition : undefined,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthSuccess("Cadastro efetuado! Faça login agora.");
        // Redirect to Login form
        setAuthView("login");
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
      } else {
        setAuthError(data.error || "Falha ao se cadastrar.");
      }
    } catch (e) {
      setAuthError("Erro na conexão com o servidor.");
    }
  };

  // LOGOUT OPERATION
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cuideme_user");
    setAuthSuccess("");
    setAuthError("");
  };

  // ADMIN ACTIONS: APPROVE CAREGIVER
  const handleApproveCaregiver = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/approve-caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      });

      if (res.ok) {
        refreshAppData();
      }
    } catch (e) {
      console.error("error approving", e);
    }
  };

  // ADMIN ACTIONS: REJECT CAREGIVER
  const handleRejectCaregiver = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/reject-caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      });

      if (res.ok) {
        refreshAppData();
      }
    } catch (e) {
      console.error("error rejecting", e);
    }
  };

  // ADMIN ACTIONS: DISMISS CAREGIVER (DESLIGAMENTO)
  const handleDismissCaregiver = async () => {
    if (!dismissingCaregiver) return;
    try {
      const res = await fetch("/api/admin/dismiss-caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: dismissingCaregiver.id,
          reason: dismissReason.trim() || undefined
        })
      });

      if (res.ok) {
        setDismissingCaregiver(null);
        setDismissReason("");
        refreshAppData();
      }
    } catch (e) {
      console.error("error dismissing caregiver", e);
    }
  };

  // Logbook note addition
  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTitle || !logDesc) return;

    setIsSubmittingLog(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: logCategory,
          title: logTitle,
          description: logDesc,
          by: currentUser?.role === "contratante" ? `Instrução: ${currentUser.name}` : `Cuidador: ${currentUser?.name || "João Pedro"}`,
          status: logStatus,
        }),
      });

      if (res.ok) {
        setLogTitle("");
        setLogDesc("");
        await refreshAppData();
      }
    } catch (e) {
      console.error("Erro ao publicar nota:", e);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Delete a log entry from the digital diary
  const handleDeleteLog = async (logId: string) => {
    try {
      const res = await fetch(`/api/logs/${logId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshAppData();
      }
    } catch (e) {
      console.error("Erro ao excluir nota:", e);
    }
  };

  // Accept available shift
  const handleAcceptShift = async (shiftId: string) => {
    try {
      const res = await fetch("/api/shifts/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: shiftId,
          caregiverName: currentUser?.name || "Cuidador João Pedro",
        })
      });

      if (res.ok) {
        setCaregiverTab("plantao");
        await refreshAppData();
      }
    } catch (e) {
      console.error("Erro ao aceitar plantão:", e);
    }
  };

  // Complete Shift / Release Escrow
  const handleCompleteShift = async (shiftId: string) => {
    try {
      const res = await fetch("/api/shifts/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shiftId })
      });

      if (res.ok) {
        await refreshAppData();
      }
    } catch (e) {
      console.error("Erro ao concluir plantão:", e);
    }
  };

  // Send message to Gemini Intelligent assistant
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || userInput;
    if (!textToSend.trim()) return;

    if (!customMessage) {
      setUserInput("");
    }

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      const chatHistory = chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          role: currentUser?.role === "cuidador" ? "prestador" : "contratante",
          history: chatHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newAssistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.text || "Ops, não consegui raciocinar no momento.",
        };
        setChatMessages((prev) => [...prev, newAssistantMessage]);
      } else {
        throw new Error();
      }
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: `**Resumo Empático:** Sinto muito pelo empecilho na conexão do servidor do chat inteligente.

**Solução Cuida-me:**
- **Sistema de Contingência:** Nossos servidores estão monitorando qualquer intercorrência. No entanto, o seu Diário de Bordo local e as transações de Escrow seguem blindados e operantes.
- **Proteção Integral:** Todas as informações salvas fisicamente não correm riscos e estão sincronizadas de forma criptografada.

**Próximo Passo:** Tente reenviar sua pergunta agora ou recarregue a página para reativar o motor cognitivo!`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderParsedResponse = (content: string) => {
    const lines = content.split("\n");
    let summaryText = "";
    const solutions: string[] = [];
    let nextStepText = "";

    let currentSection: "none" | "summary" | "solutions" | "next" = "none";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("**Resumo Empático:**")) {
        summaryText = trimmed.replace("**Resumo Empático:**", "").trim();
        currentSection = "summary";
        continue;
      }
      if (trimmed.startsWith("**Solução Cuida-me:**")) {
        currentSection = "solutions";
        continue;
      }
      if (trimmed.startsWith("**Próximo Passo:**")) {
        nextStepText = trimmed.replace("**Próximo Passo:**", "").trim();
        currentSection = "next";
        continue;
      }

      if (currentSection === "solutions" && (trimmed.startsWith("-") || trimmed.startsWith("*"))) {
        solutions.push(trimmed.replace(/^[-*]\s*/, "").replace(/\*\*/g, ""));
      } else if (currentSection === "solutions" && trimmed.length > 0 && solutions.length < 3) {
        solutions.push(trimmed.replace(/\*\*/g, ""));
      }
    }

    if (!summaryText && !nextStepText && solutions.length === 0) {
      return <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">{content}</div>;
    }

    return (
      <div className="space-y-4">
        {summaryText && (
          <div className="p-3 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-lg">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">Resumo Empático</span>
            <p className="text-sm font-medium text-slate-800 leading-snug">{summaryText}</p>
          </div>
        )}

        {solutions.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Solução Cuida-me</span>
            <ul className="space-y-2">
              {solutions.map((sol, index) => (
                <li key={index} className="flex items-start gap-2 bg-white p-2.5 border border-slate-100 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-700 leading-relaxed">{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextStepText && (
          <div className="pt-2">
            <div
              onClick={() => {
                const lower = nextStepText.toLowerCase();
                if (lower.includes("diário") || lower.includes("diario")) {
                  if (currentUser?.role === "contratante") setFamilyTab("diario");
                  else setCaregiverTab("plantao");
                } else if (lower.includes("especialista") || lower.includes("cuidador") || lower.includes("conexão") || lower.includes("curada")) {
                  setFamilyTab("conexao");
                } else if (lower.includes("carreira") || lower.includes("vagas")) {
                  setCaregiverTab("vagas");
                } else if (lower.includes("extrato") || lower.includes("carteira") || lower.includes("ganhos") || lower.includes("financeiro")) {
                  setCaregiverTab("financeiro");
                } else if (lower.includes("espera") || lower.includes("novos") || lower.includes("autorizar")) {
                  setAdminTab("espera");
                }
              }}
              className="group flex items-center justify-between bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Sugestão de Ação: {nextStepText}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const simulationPrompts = {
    contratante: [
      {
        label: "🚫 Fechar Contrato por Fora",
        prompt: "Quero fechar um pacote fixo por fora do app com um cuidador para economizar, ele é de confiança e aceitou. Tem problema?"
      },
      {
        label: "🩺 Mudar Dosagem de Remédio",
        prompt: "Acho que meu pai está meio agitado hoje. Posso mudar a dosagem de Donepezila de 5mg para 10mg por conta própria hoje à noite ou pedir para o cuidador?"
      },
      {
        label: "🛡️ Segurança e Antecedentes",
        prompt: "Como funciona a triagem jurídica e a validação de antecedentes certificados de vocês? Quero ter certeza total antes de deixar as chaves da casa."
      }
    ],
    cuidador: [
      {
        label: "💸 Medo de Inadimplência",
        prompt: "Já prestei serviço particular doméstico diretamente para algumas famílias e eles sumiram sem pagar. No Cuida-me, como tenho 100% de garantia?"
      },
      {
        label: "🧹 Limpeza Doméstica (Desvios)",
        prompt: "A contratante está exigindo que eu limpe a casa inteira e passe pilhas de roupas, tarefas totalmente fora do meu escopo técnico de saúde. Como o app me defende disso?"
      },
      {
        label: "💼 Entender a Taxa de 15%",
        prompt: "Por que vocês cobram 15% de taxa administrativa nos meus plantões de saúde? O que a Cuida-me de fato me entrega por esse valor?"
      }
    ],
    adm: [
      {
        label: "⚖️ Como funciona a proteção Escrow?",
        prompt: "Eu quero uma auditoria detalhada explicando de que forma o sistema de Escrow Cuida-me protege judicialmente a empresa de vínculos de desvio de função."
      }
    ]
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "medication":
        return { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-800", icon: <Pill className="w-4 h-4 text-rose-600" /> };
      case "meal":
        return { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-800", icon: <Coffee className="w-4 h-4 text-amber-600" /> };
      case "vital":
        return { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-teal-800", icon: <Heart className="w-4 h-4 text-teal-600" /> };
      case "activity":
        return { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-800", icon: <Activity className="w-4 h-4 text-blue-600" /> };
      case "occurrence":
        return { bg: "bg-red-50", border: "border-red-150", text: "text-red-900", icon: <AlertTriangle className="w-4 h-4 text-red-650" /> };
      case "system":
        return { bg: "bg-slate-50 border-emerald-500/20", border: "border-emerald-200", text: "text-emerald-800", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> };
      default:
        return { bg: "bg-gray-50", border: "border-gray-100", text: "text-gray-800", icon: <FileText className="w-4 h-4 text-gray-650" /> };
    }
  };

  const filteredCaregivers = caregivers.filter((cg) => {
    const matchesSearch = cg.name.toLowerCase().includes(matchQuery.toLowerCase()) ||
                          cg.specialties.some(s => s.toLowerCase().includes(matchQuery.toLowerCase()));
    const matchesFilter = matchSpecialty ? cg.specialties.includes(matchSpecialty) : true;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics for the admin overview
  const totalRegisteredUsers = allUsers.length;
  const pendingCgCount = allUsers.filter(u => u.role === "cuidador" && u.status === "pending_approval").length;
  const approvedCgCount = allUsers.filter(u => u.role === "cuidador" && u.status === "approved").length;
  const totalFamilies = allUsers.filter(u => u.role === "contratante").length;

  // Reaction and voice note helper functions for Chat
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessageReactions(prev => {
      const current = prev[msgId] || {};
      const count = current[emoji] || 0;
      const updated = { ...current, [emoji]: count > 0 ? 0 : 1 };
      if (updated[emoji] === 0) delete updated[emoji];
      return { ...prev, [msgId]: updated };
    });
  };

  const handleSendVoiceNote = (targetMode: "ai" | "community" | "private") => {
    const durationSec = recordingSeconds || 6;
    const durationFormatted = `0:${durationSec < 10 ? "0" + durationSec : durationSec}`;
    const voiceTag = `[AUDIO:${durationFormatted}] Mensagem de voz gravada`;

    setIsRecordingAudio(false);
    setRecordingSeconds(0);

    if (targetMode === "ai") {
      handleSendMessage(voiceTag);
    } else if (targetMode === "community") {
      setCommunityInput(voiceTag);
      setTimeout(() => handleSendCommunityMessage(), 60);
    } else if (targetMode === "private") {
      setPrivateInput(voiceTag);
      setTimeout(() => handleSendPrivateMessage(), 60);
    }
  };

  const handleSendAttachmentPreset = (type: string, targetMode: "ai" | "community" | "private") => {
    let tag = "";
    if (type === "receita") {
      tag = "[IMAGE:receita] 📷 Anexo: Foto da Receita Médica & Posologia do Dia";
    } else if (type === "boletim") {
      tag = "[IMAGE:boletim] 📊 Anexo: Boletim do Diário de Bordo (Pressão 120/80 - Glicemia 95 mg/dL)";
    } else if (type === "remedio") {
      tag = "[IMAGE:remedio] 💊 Anexo: Registro de Medicação Administrada com Sucesso";
    } else if (type === "refeicao") {
      tag = "[IMAGE:refeicao] ☕ Anexo: Foto da Refeição do Paciente (Almoço Leve)";
    }

    setChatAttachment(null);

    if (targetMode === "ai") {
      handleSendMessage(tag);
    } else if (targetMode === "community") {
      setCommunityInput(tag);
      setTimeout(() => handleSendCommunityMessage(), 60);
    } else if (targetMode === "private") {
      setPrivateInput(tag);
      setTimeout(() => handleSendPrivateMessage(), 60);
    }
  };

  const renderMessageBody = (content: string, isMe: boolean, msgId: string) => {
    if (content.includes("[AUDIO:")) {
      const match = content.match(/\[AUDIO:(.*?)\]/);
      const durationStr = match ? match[1] : "0:12";
      const isPlaying = activeVoicePlayingId === msgId;

      return (
        <div className="space-y-1.5 min-w-[210px]">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${isMe ? "bg-emerald-700/60 text-white" : "bg-slate-100 text-slate-800"}`}>
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  setActiveVoicePlayingId(null);
                } else {
                  setActiveVoicePlayingId(msgId);
                  setTimeout(() => setActiveVoicePlayingId(prev => prev === msgId ? null : prev), 6000);
                }
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform shrink-0 cursor-pointer ${
                isPlaying ? "bg-amber-400 text-slate-900 animate-pulse shadow-md" : "bg-emerald-600 text-white hover:scale-105 shadow-2xs"
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1 h-4">
                {[...Array(14)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isPlaying ? "bg-amber-400 animate-pulse" : isMe ? "bg-emerald-200" : "bg-slate-400"
                    }`}
                    style={{
                      height: isPlaying ? `${(i % 5 + 1) * 3 + 4}px` : `${(i % 3) * 3 + 4}px`
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono opacity-90">
                <span className="flex items-center gap-1 font-bold">
                  <Mic className="w-3 h-3 text-emerald-400" />
                  <span>Áudio de Voz</span>
                </span>
                <span className="font-bold">{durationStr}</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] italic opacity-80 leading-tight">
            {content.replace(/\[AUDIO:.*?\]\s*/, "")}
          </p>
        </div>
      );
    }

    if (content.includes("[IMAGE:")) {
      let imgUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80";
      if (content.includes("boletim")) {
        imgUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80";
      } else if (content.includes("refeicao")) {
        imgUrl = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=80";
      } else if (content.includes("remedio")) {
        imgUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=80";
      }

      const textWithoutImg = content.replace(/\[IMAGE:.*?\]\s*/, "");

      return (
        <div className="space-y-2 max-w-[260px]">
          <div className="overflow-hidden rounded-xl border border-black/10 shadow-sm relative group bg-slate-900">
            <img src={imgUrl} alt="Anexo do chat" className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
            <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 border border-white/20">
              <Image className="w-2.5 h-2.5 text-emerald-400" />
              <span>Anexo de Saúde</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed">{textWithoutImg}</p>
        </div>
      );
    }

    return <p className="whitespace-pre-wrap text-xs leading-relaxed">{content}</p>;
  };

  const renderReactionsBar = (msgId: string) => {
    const reactions = messageReactions[msgId] || {};
    const emojis = ["❤️", "👍", "💊", "🙏", "💡"];

    return (
      <div className="flex items-center gap-1 mt-1 flex-wrap">
        {emojis.map((emoji) => {
          const count = reactions[emoji] || 0;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => handleToggleReaction(msgId, emoji)}
              className={`text-[9px] px-1.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-0.5 ${
                count > 0
                  ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-extrabold shadow-2xs scale-105"
                  : "bg-slate-100/80 hover:bg-slate-200 border-slate-200 text-slate-600 opacity-60 hover:opacity-100"
              }`}
            >
              <span>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  // Render function for Streamlined Full-Height Chat Section
  const renderChatSection = (isFullWidth = true) => {
    const filteredContacts = getFilteredContacts();

    // Determine active target contact
    let activeContact = selectedPrivateUser;
    if (!activeContact && currentUser) {
      if (filteredContacts.length > 0) {
        activeContact = {
          id: filteredContacts[0].id,
          name: filteredContacts[0].name,
          role: filteredContacts[0].role,
          avatar: filteredContacts[0].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        };
      } else {
        activeContact = {
          id: "user-adm",
          name: "Suporte Técnico & ADM Cuida-me",
          role: "adm",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        };
      }
    }

    const handleOpenSupportChat = () => {
      const admUser = allUsers.find(u => u.role === "adm") || {
        id: "user-adm",
        name: "Suporte Técnico & ADM Cuida-me",
        role: "adm",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      };
      setSelectedPrivateUser({
        id: admUser.id,
        name: "Suporte Técnico & ADM Cuida-me",
        role: "adm",
        avatar: admUser.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      });
      setChatMode("privado");
    };

    const isSupportActive = activeContact?.role === "adm";

    return (
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col ${isFullWidth ? "h-[calc(100vh-140px)] min-h-[640px]" : "h-[670px]"} w-full overflow-hidden ${!isFullWidth ? "sticky top-[90px]" : ""}`}>
        
        {/* Call Modal Simulation Overlay */}
        <AnimatePresence>
          {callModalUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-6 shadow-2xl relative">
                <div className="relative inline-block mx-auto">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg mx-auto">
                    <img src={callModalUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt={callModalUser.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center animate-ping" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-lg text-white">{callModalUser.name}</h3>
                  <span className="text-xs text-emerald-400 font-medium block uppercase tracking-wider">
                    {callModalUser.role === "cuidador" ? "Cuidador Profissional" : callModalUser.role === "adm" ? "Administrador / Suporte" : "Família Contratante"}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono pt-1">
                    {callStatus === "calling" ? "📞 Chamada de Voz Protegida - Criptografada..." : "🟢 Chamada em andamento (00:14)"}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => setCallStatus(callStatus === "calling" ? "connected" : "calling")}
                    className={`p-3.5 rounded-full transition-all cursor-pointer ${
                      callStatus === "connected" ? "bg-amber-500 text-slate-950 hover:bg-amber-400" : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCallModalUser(null);
                      setCallStatus("calling");
                    }}
                    className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-md"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>

                <span className="text-[9px] text-slate-500 block uppercase tracking-widest pt-2">
                  Conexão Privada Auditada Cuida-me
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STREAMLINED TOP HEADER BAR */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-4 shrink-0 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-md">
          {activeContact ? (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={activeContact.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={activeContact.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 absolute bottom-0 right-0 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                    {activeContact.name}
                  </h3>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    activeContact.role === "adm"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : activeContact.role === "cuidador"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  }`}>
                    {activeContact.role === "adm" ? "Suporte ADM" : activeContact.role === "cuidador" ? "Cuidador Profissional" : "Família Contratante"}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Conexão ativa e segura no aplicativo</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xs sm:text-sm tracking-tight text-white">Central de Mensagens</h3>
                <span className="text-[10px] text-emerald-400 font-semibold block">Conversa com cuidadores e suporte</span>
              </div>
            </div>
          )}

          {/* RIGHT ACTION BUTTONS: CONTACT SELECTOR & PEDIR AJUDA (ADM) */}
          <div className="flex items-center gap-2">
            {/* Audio call button */}
            {activeContact && (
              <button
                onClick={() => {
                  setCallModalUser(activeContact);
                  setCallStatus("calling");
                }}
                className="p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow-2xs"
                title="Iniciar Chamada de Voz Criptografada"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Ligar</span>
              </button>
            )}

            {/* Contact Switcher Dropdown */}
            {filteredContacts.length > 1 && (
              <div className="relative">
                <select
                  value={activeContact?.id || ""}
                  onChange={(e) => {
                    const found = filteredContacts.find(u => u.id === e.target.value);
                    if (found) {
                      setSelectedPrivateUser({
                        id: found.id,
                        name: found.name,
                        role: found.role,
                        avatar: found.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      });
                    }
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-200 font-extrabold text-xs px-3 py-1.5 sm:py-2 rounded-xl border border-slate-700 cursor-pointer max-w-[130px] sm:max-w-[180px] truncate focus:outline-emerald-500"
                  title="Trocar de Contato"
                >
                  {filteredContacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role === "adm" ? "ADM" : c.role === "cuidador" ? "Cuidador" : "Família"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* PROMINENT PEDIR AJUDA (SUPORTE/ADM) BUTTON */}
            <button
              onClick={handleOpenSupportChat}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isSupportActive
                  ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300/80 shadow-amber-500/20 scale-102"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-lg"
              }`}
              title="Falar com a Administração e Suporte Técnico do App"
            >
              <Headphones className="w-4 h-4" />
              <span>{isSupportActive ? "Suporte Ativo (ADM)" : "Pedir Ajuda (ADM)"}</span>
            </button>
          </div>
        </div>

        {/* ================== TAB CONTENT: AI COPILOTO ================== */}
        {(chatMode === "ai" || (chatMode as string) === "copiloto") && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/60">
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} space-y-1.5`}
                  >
                    <div className="flex items-center gap-1.5">
                      {msg.role === "assistant" && (
                        <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
                          <Sparkles className="w-3 h-3" />
                        </div>
                      )}
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        {msg.role === "user" ? "Você" : "Copiloto Cuida-me (IA)"}
                      </span>
                    </div>
                    
                    <div
                      className={`p-4 rounded-2xl max-w-[92%] sm:max-w-[85%] text-xs shadow-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        renderMessageBody(msg.content, true, msg.id)
                      ) : (
                        renderParsedResponse(msg.content)
                      )}

                      {renderReactionsBar(msg.id)}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 p-3 bg-white border border-slate-200 rounded-xl max-w-max shadow-2xs">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                    <span className="font-medium">Sintonizando regras da plataforma e legislação de saúde...</span>
                  </div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Preloaded interactive prompt pills */}
            <div className="px-3.5 py-2 bg-slate-100/80 border-t border-slate-200 shrink-0">
              <span className="block text-[8px] font-extrabold text-slate-500 uppercase mb-1.5 tracking-widest">Perguntas Rápidas de Orientação</span>
              <div className="flex flex-wrap gap-1.5">
                {currentUser?.role === "adm" ? (
                  simulationPrompts.adm.map((sim, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sim.prompt)}
                      className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-2 rounded-lg transition-all font-medium cursor-pointer"
                    >
                      {sim.label}
                    </button>
                  ))
                ) : currentUser?.role === "cuidador" ? (
                  simulationPrompts.cuidador.map((sim, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sim.prompt)}
                      className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-2 rounded-lg transition-all font-medium cursor-pointer"
                    >
                      {sim.label}
                    </button>
                  ))
                ) : (
                  simulationPrompts.contratante.map((sim, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sim.prompt)}
                      className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-2 rounded-lg transition-all font-medium cursor-pointer"
                    >
                      {sim.label}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Attachment options popup menu */}
            {chatAttachment && (
              <div className="bg-emerald-50 p-2.5 border-t border-emerald-200 shrink-0 flex items-center justify-between">
                <span className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  <span>Escolha um anexo de simulação rápida:</span>
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => handleSendAttachmentPreset("receita", "ai")}
                    className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-1 rounded-md hover:bg-emerald-100 cursor-pointer"
                  >
                    📷 Receita
                  </button>
                  <button
                    onClick={() => handleSendAttachmentPreset("boletim", "ai")}
                    className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-1 rounded-md hover:bg-emerald-100 cursor-pointer"
                  >
                    📊 Boletim
                  </button>
                  <button
                    onClick={() => handleSendAttachmentPreset("refeicao", "ai")}
                    className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-1 rounded-md hover:bg-emerald-100 cursor-pointer"
                  >
                    ☕ Refeição
                  </button>
                  <button
                    onClick={() => setChatAttachment(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Voice recorder bar or Chat Input form */}
            {isRecordingAudio ? (
              <div className="p-3 bg-slate-900 text-white border-t border-slate-800 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-rose-400">
                    Gravando áudio (0:0{recordingSeconds})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsRecordingAudio(false);
                      setRecordingSeconds(0);
                    }}
                    className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSendVoiceNote("ai")}
                    className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Áudio</span>
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(chatInput);
                }}
                className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setChatAttachment(chatAttachment ? null : "open")}
                  title="Anexar Imagem / Boletim"
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsRecordingAudio(true)}
                  title="Gravar Mensagem de Voz"
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Digite sua dúvida sobre cuidadores, leitos ou regras..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-emerald-600 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

      {/* ================== TAB CONTENT: COMMUNITY CHANNELS ================== */}
      {(chatMode === "cuidadores" || chatMode === "contratantes") && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/40">
          <div className="bg-emerald-900 text-white p-3 px-4 border-b border-emerald-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wide font-display">
                {chatMode === "cuidadores" ? "Fórum Geral de Cuidadores Aprovados" : "Canal de Famílias Contratantes"}
              </span>
            </div>
            <span className="text-[9px] bg-emerald-800 text-emerald-200 font-bold px-2.5 py-0.5 rounded-full border border-emerald-700">
              {chatMode === "cuidadores" ? `${approvedCgCount} Profissionais` : `${totalFamilies} Famílias`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
            {communityMessages
              .filter(m => m.channel === (chatMode === "cuidadores" ? "cuidador" : "contratante"))
              .map((msg) => {
                const isMe = currentUser && msg.senderName === currentUser.name;
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <img
                      src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                    />
                    <div className={`space-y-1 max-w-[85%] ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 px-0.5">
                        <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                        <span className="text-[8px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded uppercase">
                          {msg.senderRole}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">• {msg.time || msg.timestamp}</span>
                      </div>
                      
                      <div className={`p-3 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs"
                      }`}>
                        {renderMessageBody(msg.content, isMe, msg.id)}
                        {renderReactionsBar(msg.id)}
                      </div>
                    </div>
                  </div>
                );
              })}
            <div ref={communityEndRef} />
          </div>

          {/* Attachment options popup menu */}
          {chatAttachment && (
            <div className="bg-emerald-50 p-2 border-t border-emerald-200 shrink-0 flex items-center justify-between">
              <span className="text-xs text-emerald-900 font-bold flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                <span>Anexar ao grupo:</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSendAttachmentPreset("receita", "community")}
                  className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
                >
                  📷 Receita
                </button>
                <button
                  onClick={() => handleSendAttachmentPreset("boletim", "community")}
                  className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
                >
                  📊 Boletim
                </button>
                <button
                  onClick={() => setChatAttachment(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Community input or voice recorder */}
          {isRecordingAudio ? (
            <div className="p-3 bg-slate-900 text-white border-t border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-rose-400">
                  Gravando voz para o grupo (0:0{recordingSeconds})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsRecordingAudio(false);
                    setRecordingSeconds(0);
                  }}
                  className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSendVoiceNote("community")}
                  className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Áudio</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChatAttachment(chatAttachment ? null : "open")}
                title="Anexar Imagem"
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsRecordingAudio(true)}
                title="Gravar Voz"
                className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={
                  chatMode === "cuidadores"
                    ? "Enviar mensagem para outros cuidadores do aplicativo..."
                    : "Enviar mensagem no grupo das famílias..."
                }
                value={communityInput}
                onChange={(e) => setCommunityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCommunityMessage()}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-emerald-600 focus:bg-white"
              />
              <button
                onClick={() => handleSendCommunityMessage()}
                disabled={!communityInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================== TAB CONTENT: PRIVATE CHATS ================== */}
      {chatMode === "privado" && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {!currentUser ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
              <Lock className="w-10 h-10 text-slate-400" />
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-slate-800">Acesso Restrito ao Direct</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Faça login na plataforma para acessar canais de conversas privadas entre famílias e cuidadores.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/40">
              
              {/* CONTACT SEARCH & REEL */}
              <div className="bg-slate-900 border-b border-slate-800 p-2.5 shrink-0 space-y-2 select-none">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>Contatos Autorizados no App</span>
                  </span>
                  
                  <div className="relative w-36">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                    <input
                      type="text"
                      placeholder="Filtrar contato..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1 pl-6 pr-2 text-[10px] text-white focus:outline-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-thin">
                  {getFilteredContacts()
                    .filter(u => u.name.toLowerCase().includes(contactSearch.toLowerCase()))
                    .map(user => {
                      const isSelected = selectedPrivateUser && selectedPrivateUser.id === user.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => setSelectedPrivateUser({
                            id: user.id,
                            name: user.name,
                            role: user.role,
                            avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                          })}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer shrink-0 border ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-400 shadow-md scale-102"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-750 border-slate-700"
                          }`}
                        >
                          <div className="relative">
                            <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-slate-900" />
                          </div>
                          <span className="truncate max-w-[100px]">{user.name.split(" ")[0]}</span>
                          <span className="text-[8px] opacity-75 uppercase">({user.role === "cuidador" ? "Cuidador" : user.role === "contratante" ? "Família" : "Admin"})</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* ACTIVE CONTACT HEADER CARD */}
              {selectedPrivateUser && (
                <div className="bg-white border-b border-slate-200 p-2.5 px-4 shrink-0 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={selectedPrivateUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={selectedPrivateUser.name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{selectedPrivateUser.name}</span>
                        <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded uppercase">
                          {selectedPrivateUser.role === "cuidador" ? "Cuidador Validado" : selectedPrivateUser.role === "contratante" ? "Família Registrada" : "Administrador"}
                        </span>
                      </h4>
                      <span className="text-[9.5px] text-emerald-600 font-medium block">
                        🟢 Conexão Ativa no App • Conversa Auditada
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCallModalUser(selectedPrivateUser);
                        setCallStatus("calling");
                      }}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-emerald-200"
                      title="Ligar em Áudio"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ligar</span>
                    </button>

                    <button
                      onClick={() => handleViewProfile(selectedPrivateUser.id)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                      title="Ver Perfil Detalhado"
                    >
                      <User className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Chat conversations history feed */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
                {!selectedPrivateUser ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">Selecione um contato para abrir o Direct</p>
                      <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                        Converse em tempo real com cuidadores e famílias com garantia de registro auditado.
                      </p>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const filteredMsgs = privateMessages.filter(
                      m => (m.senderId === currentUser.id && m.receiverId === selectedPrivateUser.id) ||
                           (m.senderId === selectedPrivateUser.id && m.receiverId === currentUser.id)
                    );

                    if (filteredMsgs.length === 0) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-400">
                          <MessageCircle className="w-8 h-8 text-emerald-500" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-800">Inicie uma conversa direta com {selectedPrivateUser.name}</p>
                            <p className="text-[10px] text-slate-500 max-w-xs">
                              Alinhe horários, medições de saúde e confirme os plantões de forma fiduciária.
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return filteredMsgs.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
                        >
                          <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">
                              {isMe ? "Você" : msg.senderName}
                            </span>
                            <span className="text-[8px] text-slate-400">• {msg.time || msg.timestamp}</span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-2xs leading-relaxed ${
                              isMe
                                ? "bg-emerald-600 text-white rounded-tr-none"
                                : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs"
                            }`}
                          >
                            {renderMessageBody(msg.content, isMe, msg.id)}
                            {renderReactionsBar(msg.id)}
                          </div>
                        </div>
                      );
                    });
                  })()
                )}
                <div ref={privateEndRef} />
              </div>

              {/* Private chat action suggestions */}
              {selectedPrivateUser && (
                <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 shrink-0">
                  <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Mensagens Rápidas de Rotina
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const bullets = selectedPrivateUser.role === "cuidador" 
                        ? [
                            { label: "💊 Confirmar medicação", prompt: `Olá ${selectedPrivateUser.name}, a medicação de pressão foi administrada no horário certinho?` },
                            { label: "📈 Solicitar glicemia", prompt: `Por favor, lembre-se de registrar a medição de glicemia no Diário de Bordo Digital.` },
                            { label: "🗓️ Prorrogar plantão", prompt: `Você teria disponibilidade para estender o plantão de sexta-feira? Faço a garantia imediata no Escrow do app.` }
                          ]
                        : [
                            { label: "📋 Rotina diária salva", prompt: `Olá ${selectedPrivateUser.name}! Já preenchi as informações de alimentação e medicação no Diário de Bordo.` },
                            { label: "☕ Reposição de lanche", prompt: `Notamos aqui que o café descafeinado acabou. Você poderia deixar mais um pacote para o próximo plantão?` },
                            { label: "🔓 Liberar Escrow", prompt: `Tudo certo por aqui! Concluí todas as orientações. Se estiver tudo OK no Diário, pode fazer a assinatura para liberação do Escrow?` }
                          ];

                      return bullets.map((bullet, i) => (
                        <button
                          key={i}
                          onClick={() => setPrivateInput(bullet.prompt)}
                          className="text-[8.5px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-0.5 px-2 rounded-lg transition-all font-medium cursor-pointer"
                        >
                          {bullet.label}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Attachment options popup menu */}
              {chatAttachment && selectedPrivateUser && (
                <div className="bg-emerald-50 p-2 border-t border-emerald-200 shrink-0 flex items-center justify-between">
                  <span className="text-xs text-emerald-900 font-bold flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Anexar documento/foto:</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSendAttachmentPreset("receita", "private")}
                      className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
                    >
                      📷 Receita
                    </button>
                    <button
                      onClick={() => handleSendAttachmentPreset("boletim", "private")}
                      className="text-[9px] bg-white text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded hover:bg-emerald-100 cursor-pointer"
                    >
                      📊 Boletim
                    </button>
                    <button
                      onClick={() => setChatAttachment(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Private message input area or Voice recorder */}
              {isRecordingAudio ? (
                <div className="p-3 bg-slate-900 text-white border-t border-slate-800 shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-rose-400">
                      Gravando voz para {selectedPrivateUser?.name.split(" ")[0]} (0:0{recordingSeconds})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsRecordingAudio(false);
                        setRecordingSeconds(0);
                      }}
                      className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSendVoiceNote("private")}
                      className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Áudio</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!selectedPrivateUser}
                    onClick={() => setChatAttachment(chatAttachment ? null : "open")}
                    title="Anexar Imagem / Boletim"
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={!selectedPrivateUser}
                    onClick={() => setIsRecordingAudio(true)}
                    title="Gravar Áudio de Voz"
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder={
                      !selectedPrivateUser 
                        ? "Selecione um contato acima..." 
                        : `Falar no privado com ${selectedPrivateUser.name.split(" ")[0]}...`
                    }
                    value={privateInput}
                    disabled={!selectedPrivateUser}
                    onChange={(e) => setPrivateInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPrivateMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-emerald-600 focus:bg-white disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSendPrivateMessage()}
                    disabled={!selectedPrivateUser || !privateInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col antialiased text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* HEADER WITH LOGOUT / BRANDING AND USER STATUS */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-45 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <CuidaMeLogo size="sm" showTagline={true} />
            {currentUser?.role === "adm" && (
              <span className="bg-purple-100 text-purple-900 dark:bg-purple-900/40 dark:text-purple-300 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 hidden xs:inline-block">ADMINISTRADOR</span>
            )}
            {currentUser?.role === "cuidador" && (
              <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 hidden xs:inline-block ${
                currentUser.status === "approved" ? "bg-teal-100 text-teal-800 dark:bg-teal-900/45 dark:text-teal-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900/45 dark:text-amber-300 animate-pulse"
              }`}>
                {currentUser.status === "approved" ? "CUIDADOR AUTORIZADO" : "ANÁLISE ADM"}
              </span>
            )}
            {currentUser?.role === "contratante" && (
              <span className="bg-indigo-100 text-indigo-900 dark:bg-indigo-900/45 dark:text-indigo-200 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 hidden xs:inline-block">FAMÍLIA</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-50 dark:bg-slate-800 p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 px-1">
                  <div className="bg-emerald-700 text-white rounded-md w-6 h-6 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left hidden md:block">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="block text-[8px] font-mono text-slate-400 dark:text-slate-400 uppercase leading-none">{currentUser.role} • ID: {currentUser.id.substring(5, 9)}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title="Sair do Sistema"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desconectar</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 mr-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Acesso seguro</span>
              </div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 transition-all cursor-pointer shadow-3xs"
              title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>

            <button
              onClick={refreshAppData}
              className="flex items-center justify-center p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 transition-all cursor-pointer"
              title="Sincronizar Dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          </div>

        </div>
      </header>

      {/* --- ENTRY POINT WORKSPACE --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PRIMARY INTERACTIVE SCREENS */}
        <section className={`${!currentUser ? "lg:col-span-8" : "lg:col-span-12"} flex flex-col gap-6`}>

          {/* 1. NOT LOGGED IN: SECURITY GATEWAY USER LOGIN & REGISTER PORTAL */}
          {!currentUser ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-xl overflow-hidden min-h-[500px] flex flex-col transition-colors">
              
              {/* Form title toggler */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <button
                  onClick={() => { setAuthView("login"); setAuthError(""); setAuthSuccess(""); }}
                  className={`flex-1 py-4 text-center font-display font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authView === "login"
                      ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Acessar Minha Conta (Entrar)</span>
                </button>
                <button
                  onClick={() => { setAuthView("register"); setAuthError(""); setAuthSuccess(""); }}
                  className={`flex-1 py-4 text-center font-display font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    authView === "register"
                      ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Cadastrar Novo Usuário</span>
                </button>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
                
                {/* Visual warning alerts */}
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-lg text-xs font-medium text-rose-800 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-650 mt-0.5" />
                    <div>{authError}</div>
                  </motion.div>
                )}

                {authSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-medium text-emerald-800 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <div>{authSuccess}</div>
                  </motion.div>
                )}

                {/* LOGIN SCREEN */}
                {authView === "login" && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1 flex flex-col items-center">
                      <CuidaMeLogo size="md" showTagline={true} />
                      <h2 className="font-display font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1">Portal de Segurança e Acesso</h2>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Escolha seu perfil de acesso para efetuar o login com segurança.</p>
                    </div>

                    {/* Separated Login Area Selector */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole("contratante");
                          setAuthError("");
                          setAuthSuccess("");
                        }}
                        className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          loginRole === "contratante"
                            ? "bg-indigo-700 text-white shadow-xs font-extrabold"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                        }`}
                      >
                        <Users className="w-4 h-4 shrink-0" />
                        <span>Acesso Família (Contratante)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginRole("cuidador");
                          setAuthError("");
                          setAuthSuccess("");
                        }}
                        className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          loginRole === "cuidador"
                            ? "bg-indigo-700 text-white shadow-xs font-extrabold"
                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                        }`}
                      >
                        <Heart className="w-4 h-4 shrink-0" />
                        <span>Acesso Cuidador</span>
                      </button>
                    </div>

                    <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 px-4 py-2.5 rounded-lg text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shrink-0" />
                      <span>
                        Você está acessando como <strong>{loginRole === "contratante" ? "FAMÍLIA (CONTRATANTE)" : "CUIDADOR PROFISSIONAL"}</strong>.
                        O Administrador pode logar por qualquer área.
                      </span>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Login / E-mail</label>
                        <input
                          type="text"
                          placeholder={loginRole === "contratante" ? "Ex: administrador ou email-da-familia@exemplo.com" : "Ex: administrador ou email-do-cuidador@exemplo.com"}
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full bg-slate-50/50 dark:bg-slate-850 border border-slate-250 dark:border-slate-700 rounded-xl p-3 text-xs focus:outline-indigo-600 dark:text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Senha de Segurança</label>
                        </div>
                        <input
                          type="password"
                          placeholder="Digite sua senha cadastrada"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full bg-slate-50/50 dark:bg-slate-850 border border-slate-250 dark:border-slate-700 rounded-xl p-3 text-xs focus:outline-indigo-600 dark:text-white"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <Lock className="w-4 h-4 text-teal-300" />
                        <span>Autenticar {loginRole === "contratante" ? "como Família" : "como Cuidador"}</span>
                      </button>
                    </form>

                    {/* Pre-seed prompt warning coordinates for the demonstration */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-750 rounded-xl space-y-2 mt-4 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[10px]">Acesso de Teste Técnico</span>
                      <div>• **Administrador:** Login: <code className="font-semibold text-blue-600 dark:text-blue-400 font-mono">administrador</code> | Senha: <code className="font-semibold text-blue-600 dark:text-blue-400 font-mono">adm4002</code> <span className="text-emerald-600 dark:text-emerald-400 font-bold">(Qualquer aba)</span></div>
                      <div>• **Cuidador Aprovado:** Login: <code className="font-semibold text-slate-600 dark:text-slate-300 font-mono">joao@example.com</code> | Senha: <code className="font-semibold text-slate-600 dark:text-slate-300 font-mono">senha</code> <span className="text-red-500 font-semibold">(Apenas aba Cuidador)</span></div>
                      <div>• **Contratante Familiar:** Login: <code className="font-semibold text-slate-600 dark:text-slate-300 font-mono">lucas@example.com</code> | Senha: <code className="font-semibold text-slate-600 dark:text-slate-300 font-mono">senha</code> <span className="text-amber-600 dark:text-amber-400 font-bold">(Apenas aba Família)</span></div>
                    </div>
                  </div>
                )}

                {/* REGISTER SCREEN */}
                {authView === "register" && (
                  <div className="space-y-6">
                    <div className="text-center space-y-1">
                      <h2 className="font-display font-extrabold text-lg text-slate-900">Nova Solicitação de Cadastro</h2>
                      <p className="text-xs text-slate-500">Crie sua conta. Novos cuidadores necessitam fornecer documentos e aguardar aprovação.</p>
                    </div>

                    {/* Selection role in signup */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRegRole("contratante")}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          regRole === "contratante"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Sou Família (Contratante)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole("cuidador")}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          regRole === "cuidador"
                            ? "bg-white text-slate-950 shadow-xs"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Sou Cuidador (Documento Obrigatório)
                      </button>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4 text-left">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Nome Completo</label>
                          <input
                            type="text"
                            placeholder="Ex: Pedro Henrique Barbosa"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Telefone Celular</label>
                          <input
                            type="text"
                            placeholder="Ex: (11) 98888-7777"
                            value={regPhone}
                            onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-teal-500"
                            maxLength={15}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Login (E-mail)</label>
                          <input
                            type="email"
                            placeholder="Ex: pedro@example.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Definir Senha</label>
                          <input
                            type="password"
                            placeholder="Min. 4 dígitos"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-teal-500"
                            required
                          />
                        </div>
                      </div>

                      {/* CONDITIONAL SUB-FORM: CONTRATANTE ADDS PATIENT PROFILE */}
                      {regRole === "contratante" && (
                        <div className="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 space-y-3">
                          <span className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wide">Dados para Conexão Curada do Paciente</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1">Nome do Paciente</label>
                              <input
                                type="text"
                                placeholder="Pai, Mãe, etc."
                                value={patName}
                                onChange={(e) => setPatName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                required={regRole === "contratante"}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1">Idade do Paciente</label>
                              <input
                                type="number"
                                placeholder="80"
                                value={patAge}
                                onChange={(e) => setPatAge(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                required={regRole === "contratante"}
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1 font-display">Doença / Limitação</label>
                              <input
                                type="text"
                                placeholder="Alzheimer, cadeirante, etc."
                                value={patCondition}
                                onChange={(e) => setPatCondition(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                required={regRole === "contratante"}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CONDITIONAL SUB-FORM: CUIDADOR MUST CHOOSE TECH HIGHLIGHTS AND SIMULATE UPLOAD */}
                      {regRole === "cuidador" && (
                        <div className="space-y-4">
                          <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100 space-y-3">
                            <span className="block text-[10px] font-bold text-emerald-900 uppercase tracking-wide">Preço Técnico, Dados Pessoais & Especialidades</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1">Valor do Plantão Diário (R$)</label>
                                <input
                                  type="number"
                                  placeholder="Ex: 190"
                                  value={regRate}
                                  onChange={(e) => setRegRate(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                  required={regRole === "cuidador"}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1">Principal Especialidade</label>
                                <select
                                  onChange={(e) => setSelectedSpecialties([e.target.value])}
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                >
                                  <option value="Alzheimer & Demência">Alzheimer / Doenças de Demência</option>
                                  <option value="Cuidados Pós-Operatórios">Recuperação e Pós-Operatórios</option>
                                  <option value="Injetáveis e Sinais">Técnico em Enfermagem (Medicamentos / Sinais)</option>
                                  <option value="Cuidados Higiênicos">Cuidador Geral de Idosos / Higienização</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1 font-display">Idade do Cuidador (Anos)</label>
                                <input
                                  type="number"
                                  placeholder="Ex: 34"
                                  value={regAge}
                                  onChange={(e) => setRegAge(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                  required={regRole === "cuidador"}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-semibold text-slate-600 uppercase mb-1 font-display">Sexo / Gênero</label>
                                <select
                                  value={regGender}
                                  onChange={(e) => setRegGender(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                >
                                  <option value="Feminino">Feminino</option>
                                  <option value="Masculino">Masculino</option>
                                  <option value="Outro">Outro</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* MANDATORY DOCUMENT FILES SELECTION SIMULATOR */}
                          <div className="bg-rose-50/30 p-4 rounded-xl border border-rose-200/50 space-y-3">
                            <div className="flex items-center gap-1.5 text-rose-800 font-extrabold text-xs">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span className="uppercase tracking-wider font-display">Envio Obrigatório de Documentos para Validação</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              Para mitigar riscos, a diretoria do Cuida-me atua com checagem policial de antecedentes, diploma oficial do conselho e COREN legítimo. Insira fotos dos documentos:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                              
                              {/* 1. ID Copy Upload Box */}
                              <div className="bg-white border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-between min-h-[90px] shadow-xs">
                                <span className="text-[9px] font-bold text-slate-700 block mb-1">1. Registro de ID (RG/CPF)</span>
                                <div className="p-1 text-slate-400 bg-slate-50 rounded-full border border-slate-100 mb-1">
                                  <Upload className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="block text-[8px] text-slate-500 underline truncate w-full max-w-[120px]">{rgFileName}</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="file-rg"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setRgFileName(e.target.files[0].name);
                                      setRgFile(e.target.files[0]);
                                    }
                                  }}
                                />
                                <label htmlFor="file-rg" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-semibold cursor-pointer block mt-1">
                                  Anexar Foto
                                </label>
                              </div>

                              {/* 2. Diploma Upload Box */}
                              <div className="bg-white border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-between min-h-[90px] shadow-xs">
                                <span className="text-[9px] font-bold text-slate-700 block mb-1">2. Diploma / COREN Cert</span>
                                <div className="p-1 text-slate-400 bg-slate-50 rounded-full border border-slate-100 mb-1">
                                  <Upload className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="block text-[8px] text-slate-500 underline truncate w-full max-w-[120px]">{diplomaFileName}</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="file-diploma"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setDiplomaFileName(e.target.files[0].name);
                                      setDiplomaFile(e.target.files[0]);
                                    }
                                  }}
                                />
                                <label htmlFor="file-diploma" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-semibold cursor-pointer block mt-1">
                                  Anexar Foto
                                </label>
                              </div>

                              {/* 3. Criminal Background certificate */}
                              <div className="bg-white border border-slate-200 rounded-lg p-2 text-center flex flex-col items-center justify-between min-h-[90px] shadow-xs">
                                <span className="text-[9px] font-bold text-slate-700 block mb-1">3. Certidão de Antecedentes</span>
                                <div className="p-1 text-slate-400 bg-slate-50 rounded-full border border-slate-100 mb-1">
                                  <Upload className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="block text-[8px] text-slate-500 underline truncate w-full max-w-[120px]">{crmFileName}</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  id="file-crm"
                                  accept="image/*,.pdf"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      setCrmFileName(e.target.files[0].name);
                                      setCrmFile(e.target.files[0]);
                                    }
                                  }}
                                />
                                <label htmlFor="file-crm" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-semibold cursor-pointer block mt-1">
                                  Anexar Foto
                                </label>
                              </div>

                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm tracking-wide shadow-sm transition-all cursor-pointer"
                      >
                        Enviar Solicitação de Cadastro no Cuida-me
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          ) : (
            
            /* 2. AUTHENTICATED WORKSPACES CONDITIONAL REDIRECTS */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden min-h-[500px] flex flex-col">

              {/* 2A. EN ESPERA / REASSURING WAITING SCREEN FOR PENDING CAREGIVERS */}
              {currentUser.role === "cuidador" && currentUser.status === "pending_approval" ? (
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
                  
                  {/* Lock pulse animation */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border border-amber-200 animate-pulse">
                      <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="absolute top-0 right-0 w-6 h-6 bg-amber-500 rounded-full text-white font-bold text-xs flex items-center justify-center">
                      !
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                      Sua conta está sob análise do administrador.
                    </h2>
                    <p className="text-sm font-bold text-slate-600">
                      Por favor, aguarde a liberação técnica do Cuida-me.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Nosso time de compliance e auditoria jurídica avalia sua solicitação técnica em até 24 horas. Verifique abaixo os dados e documentos que estão em nossa fila de auditoria.
                    </p>
                  </div>

                  {/* Exhibit submitted credentials to pending user */}
                  <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 w-full text-left space-y-3">
                    <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-1.5 flex items-center justify-between">
                      <span>Minha Ficha Enviada</span>
                      <span className="font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Aguardando Validador</span>
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>• **Nome:** {currentUser.name}</div>
                      <div>• **Telefone:** {currentUser.phone}</div>
                      <div>• **Preço Diário:** R$ {currentUser.dailyRate},00</div>
                      <div>• **E-mail:** {currentUser.email}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Documentos Enviados</span>
                      
                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-150">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-800">RG e CPF de Identidade</span>
                          <span className="block text-[8px] font-mono text-slate-500">{rgFileName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-150">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-800">Diploma Técnico de Saúde</span>
                          <span className="block text-[8px] font-mono text-slate-500">{diplomaFileName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-slate-150">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="block text-[10px] font-semibold text-slate-800">Folha de Antecedentes Criminais</span>
                          <span className="block text-[8px] font-mono text-slate-500">{crmFileName}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Dica: Você pode conversar com a IA do Cuida-me no painel ao lado enquanto nossa equipe analisa seus diplomas!
                  </div>

                </div>
              ) : currentUser.role === "cuidador" && currentUser.status === "rejected" ? (
                /* 2B. RECUSADA STATUS SCREEN */
                <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-red-150 rounded-full flex items-center justify-center border border-red-250">
                    <UserX className="w-8 h-8 text-red-650" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-display font-extrabold text-xl text-slate-900">Cadastro Não Autorizado</h2>
                    <p className="text-sm font-bold text-red-600">Documentação recusada.</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Lamentamos, mas as fotos dos documentos enviados falharam em nossos critérios de integridade jurídica ou COREN ativo junto a conselhos federais. Entre em contato com o suporte para retificar.
                    </p>
                  </div>
                </div>
              ) : currentUser.role === "adm" ? (
                
                /* =========================================
                   2C. ADMINISTRATOR EXECUTIVE WORKSPACE
                   ========================================= */
                <div className="flex-1 flex flex-col">
                  
                  {/* Admin Top Dashboard statistics bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 bg-slate-50 border-b border-slate-200">
                    <div className="p-4 border-r border-slate-200 text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contas Fila</span>
                      <span className="text-2xl font-display font-extrabold text-amber-600">{pendingCgCount}</span>
                      <span className="block text-[8px] text-amber-700 font-semibold bg-amber-50 px-1 py-0.5 rounded-full mt-1 w-max mx-auto">Ação Obrigatória</span>
                    </div>

                    <div className="p-4 border-r border-slate-200 text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cuidadores Ativos</span>
                      <span className="text-2xl font-display font-extrabold text-slate-900">{approvedCgCount}</span>
                      <span className="block text-[8px] text-emerald-800 font-semibold bg-emerald-50 px-1 py-0.5 rounded-full mt-1 w-max mx-auto">Habilitados</span>
                    </div>

                    <div className="p-4 border-r border-slate-200 text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Famílias</span>
                      <span className="text-2xl font-display font-extrabold text-slate-900">{totalFamilies}</span>
                      <span className="block text-[8px] text-slate-500 font-medium mt-1">Conexão Digital</span>
                    </div>

                    <div className="p-4 text-center">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Soma de Escrow</span>
                      <span className="text-2.5xl font-display font-extrabold text-emerald-700 flex items-center justify-center gap-0.5">
                        <Lock className="w-3.5 h-3.5" /> R$ 220
                      </span>
                      <span className="block text-[8px] text-emerald-800 font-semibold bg-emerald-50 px-1 py-0.5 rounded-full mt-1 w-max mx-auto">Garantido</span>
                    </div>
                  </div>

                  {/* Sub-tabs for administrator views */}
                  <div className="flex border-b border-slate-200 p-2 gap-2 bg-slate-100/50 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setAdminTab("espera")}
                      className={`flex-1 min-w-max py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        adminTab === "espera"
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Cuidadores em Espera ({pendingCgCount})</span>
                    </button>
                    <button
                      onClick={() => setAdminTab("usuarios")}
                      className={`flex-1 min-w-max py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        adminTab === "usuarios"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Todos os Cadastrados ({totalRegisteredUsers})</span>
                    </button>
                    <button
                      onClick={() => setAdminTab("plantoes")}
                      className={`flex-1 min-w-max py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        adminTab === "plantoes"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      <span>Plantões & Atividade</span>
                    </button>
                    <button
                      onClick={() => setAdminTab("financeiro")}
                      className={`flex-1 min-w-max py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        adminTab === "financeiro"
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Financeiro & Lucro</span>
                    </button>

                  </div>

                  {/* ADMIN VIEW TABLE - WAITING ROOM */}
                  <div className="p-5 flex-1 space-y-4">
                    {adminTab === "espera" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-sm text-slate-900">Lista Geral de Cuidadores Pendentes</h3>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Fila Necessita Verificação</span>
                        </div>

                        {allUsers.filter(u => u.role === "cuidador" && u.status === "pending_approval").length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                            <p className="text-xs font-bold text-slate-700">Nenhum cuidador na fila de aprovação documentária.</p>
                            <p className="text-[10px] text-slate-500 mt-1">Todos os prestadores cadastrados no sistema estão validados técnicos.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {allUsers.filter(u => u.role === "cuidador" && u.status === "pending_approval").map((pCaregiver) => (
                              <div key={pCaregiver.id} className="border border-amber-250/60 bg-amber-50/10 rounded-xl p-5 space-y-4 relative overflow-hidden shadow-xs">
                                
                                {/* Background pending ribbon */}
                                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl">PENDENTE</div>
                                
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                  
                                  <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <img referrerPolicy="no-referrer" src={pCaregiver.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} alt={pCaregiver.name} className="w-12 h-12 rounded-xl object-cover border-2 border-amber-200 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-display font-extrabold text-sm text-slate-900 truncate">{pCaregiver.name}</h4>
                                      <p className="text-[10.5px] text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                                        <span className="whitespace-nowrap">Celular: <strong>{pCaregiver.phone}</strong></span>
                                        <span className="text-slate-300 hidden sm:inline">|</span>
                                        <span className="truncate block max-w-full">Acesso: <strong>{pCaregiver.email}</strong></span>
                                      </p>
                                      
                                      {/* Specialties block */}
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        <span className="text-[9px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">Preço Pretendido: R$ {pCaregiver.dailyRate},00/plantão</span>
                                        {pCaregiver.specialties?.map((spec, index) => (
                                          <span key={index} className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase whitespace-nowrap">{spec}</span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Fast audit decision CTA row */}
                                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-2 pt-2 lg:pt-0 w-full lg:w-auto shrink-0">
                                    <button
                                      onClick={() => handleRejectCaregiver(pCaregiver.id)}
                                      className="flex-1 lg:flex-none border border-slate-200 hover:bg-rose-50 text-rose-600 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer whitespace-nowrap"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Recusar Cadastro</span>
                                    </button>
                                    <button
                                      onClick={() => handleApproveCaregiver(pCaregiver.id)}
                                      className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide shadow-sm transition-all flex items-center justify-center gap-1.5 select-none cursor-pointer whitespace-nowrap"
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      <span>Autorizar Conta e Ativar</span>
                                    </button>
                                  </div>

                                </div>

                                {/* UPLOADED DOCUMENTS AUDIT CARD SYSTEM (HIGH FIDELITY) */}
                                <div className="border border-slate-200 bg-white rounded-lg p-4 space-y-3">
                                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-100 pb-1.5 mb-1">
                                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Fotos dos Documentos Obrigatórios para Verificação e Validação</span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    
                                    {/* ID copy review */}
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                                      <div>
                                        <span className="block text-[10px] font-bold text-slate-800 mb-0.5">1. Cópia ID (RG/CPF)</span>
                                        <span className="block text-[8px] font-mono text-slate-500 truncate mb-1.5">{pCaregiver.documents?.idCopy.name}</span>
                                      </div>
                                      {/* Mockup photo preview */}
                                      <div className="relative aspect-video w-full rounded overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
                                        <img src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=150&q=80" className="w-full h-full object-cover" alt="ID Document mockup" />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">ID Verificado</div>
                                      </div>
                                      <span className="block text-[8px] text-slate-400 text-right">Enviado em: {pCaregiver.documents?.idCopy.submittedAt}</span>
                                    </div>

                                    {/* Diploma technical copy review */}
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                                      <div>
                                        <span className="block text-[10px] font-bold text-slate-800 mb-0.5">2. Certidão / Diploma COREN</span>
                                        <span className="block text-[8px] font-mono text-slate-500 truncate mb-1.5">{pCaregiver.documents?.diploma.name}</span>
                                      </div>
                                      {/* Mockup photo preview */}
                                      <div className="relative aspect-video w-full rounded overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
                                        <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&q=80" className="w-full h-full object-cover" alt="Diploma mockup" />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">COREN Real</div>
                                      </div>
                                      <span className="block text-[8px] text-slate-400 text-right">Enviado em: {pCaregiver.documents?.diploma.submittedAt}</span>
                                    </div>

                                    {/* Criminal records background review */}
                                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                                      <div>
                                        <span className="block text-[10px] font-bold text-slate-800 mb-0.5">3. Antecedentes Criminais</span>
                                        <span className="block text-[8px] font-mono text-slate-500 truncate mb-1.5">{pCaregiver.documents?.backgroundCheck.name}</span>
                                      </div>
                                      {/* Mockup photo preview */}
                                      <div className="relative aspect-video w-full rounded overflow-hidden shadow-inner border border-slate-200 bg-slate-200">
                                        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=150&q=80" className="w-full h-full object-cover" alt="Legal background paper" />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">Ficha Criminal Limpa</div>
                                      </div>
                                      <span className="block text-[8px] text-slate-400 text-right">Enviado em: {pCaregiver.documents?.backgroundCheck.submittedAt}</span>
                                    </div>

                                  </div>
                                </div>

                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ADMIN VIEW TABLE - REGISTERED DATABASE */}
                    {adminTab === "usuarios" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-sm text-slate-900">Histórico de Todos os Usuários do Ecossistema</h3>
                          <span className="text-[10px] text-slate-500 font-medium">Cadastrados e Criptografados no Banco de Intermediação</span>
                        </div>

                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[9px]">
                              <tr>
                                <th className="p-3">Usuário</th>
                                <th className="p-3">Tipo / Função</th>
                                <th className="p-3">Contato</th>
                                <th className="p-3">Localização/Status</th>
                                <th className="p-3 text-right">Ação</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150">
                              {allUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/55 transition-colors">
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                                        {user.name.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                        <span className="block font-bold text-slate-900">{user.name}</span>
                                        <span className="block text-[8px] font-mono text-slate-450 uppercase">{user.id}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] text-center uppercase ${
                                      user.role === "adm"
                                        ? "bg-slate-900 text-white"
                                        : user.role === "cuidador"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="block text-slate-700 font-semibold">{user.phone}</span>
                                    <span className="block text-[9px] text-slate-400 font-mono">{user.email}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                      user.status === "approved"
                                        ? "bg-teal-50 text-teal-800 border border-teal-100"
                                        : user.status === "pending_approval"
                                        ? "bg-amber-50 text-amber-800 border border-amber-100"
                                        : "bg-red-50 text-red-800 border border-red-100"
                                    }`}>
                                      {user.status}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleViewProfile(user.id)}
                                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 hover:text-slate-900 px-2.5 py-1 rounded font-bold transition-all cursor-pointer whitespace-nowrap"
                                      >
                                        Ver Perfil
                                      </button>
                                      {user.role === "cuidador" && user.status === "pending_approval" ? (
                                        <button
                                          onClick={() => handleApproveCaregiver(user.id)}
                                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold transition-all cursor-pointer whitespace-nowrap"
                                        >
                                          Aprovar
                                        </button>
                                      ) : null}
                                      {user.role === "cuidador" && user.status === "approved" ? (
                                        <button
                                          onClick={() => setDismissingCaregiver(user)}
                                          className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 px-2.5 py-1 rounded font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
                                        >
                                          <UserX className="w-3.5 h-3.5" />
                                          <span>Desligar</span>
                                        </button>
                                      ) : null}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {adminTab === "plantoes" && (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <h3 className="font-display font-extrabold text-sm text-slate-900">
                              Acompanhamento de Cuidadores Ativos & Agendamentos
                            </h3>
                            <p className="text-[10.5px] text-slate-500">
                              Monitore em tempo real quem está atuando no domicílio, quem contratou e as fichas diárias de cuidado.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded w-max">
                            Painel de Fiscalização Ativa
                          </span>
                        </div>

                        {/* Plantões Activos & Agendamentos List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {shifts.map((sh) => {
                            const isAtuando = sh.status === "in_progress";
                            const isAgendado = sh.status === "accepted";
                            const isFinalizado = sh.status === "completed";
                            const isDisponivel = sh.status === "available";

                            return (
                              <div
                                key={sh.id}
                                className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs bg-white ${
                                  isAtuando
                                    ? "border-emerald-200 bg-emerald-50/5"
                                    : isAgendado
                                    ? "border-blue-200 bg-blue-50/5"
                                    : isFinalizado
                                    ? "border-slate-200 bg-slate-50/20"
                                    : "border-slate-200 border-dashed"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                                      {sh.id.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {sh.schedule}
                                    </span>
                                  </div>

                                  <span
                                    className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                      isAtuando
                                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                        : isAgendado
                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                        : isFinalizado
                                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                                        : "bg-slate-50 text-slate-400 border border-slate-150 border-dashed"
                                    }`}
                                  >
                                    {isAtuando
                                      ? "● Em Atuação"
                                      : isAgendado
                                      ? "● Agendado"
                                      : isFinalizado
                                      ? "✓ Concluído"
                                      : "○ Vaga Aberta"}
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                  {/* Cuidador */}
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-450 shrink-0 min-w-[75px]">
                                      Cuidador:
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                      {sh.caregiverName || (isDisponivel ? "Aguardando aceite..." : "Não atribuído")}
                                    </span>
                                  </div>

                                  {/* Contratante */}
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-450 shrink-0 min-w-[75px]">
                                      Contratante:
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                      {sh.contractorName || "Família do Paciente"}
                                    </span>
                                  </div>

                                  {/* Assistido (Paciente) */}
                                  <div className="flex items-start gap-1.5">
                                    <span className="font-bold text-slate-450 shrink-0 min-w-[75px]">
                                      Paciente:
                                    </span>
                                    <div>
                                      <span className="font-bold text-slate-900 block">
                                        {sh.patientName} ({sh.patientAge})
                                      </span>
                                      <span className="text-[10px] text-slate-500 block leading-tight">
                                        {sh.condition}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Tarifa e Escrow */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[10px] font-bold text-slate-500">
                                      Preço do Plantão:
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                      R$ {sh.rate},00
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400">
                                      ({sh.escrowStatus === "funded" ? "Garantido em Escrow" : sh.escrowStatus === "released" ? "Liberado" : "Pendente"})
                                    </span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100">
                                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Requisitos & Orientações
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {sh.requirements.map((req, i) => (
                                      <span
                                        key={i}
                                        className="text-[9px] bg-slate-50 border border-slate-150 text-slate-650 font-medium px-1.5 py-0.5 rounded"
                                      >
                                        {req}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* DIÁRIO DE BORDO DIGITAL - TABELA DE LOGS DOS FAMILIARES */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-5 h-5 text-emerald-600 shrink-0" />
                              <div>
                                <h4 className="font-display font-extrabold text-sm text-slate-900">
                                  Tabela Unificada de Registro de Eventos (Diário de Bordo)
                                </h4>
                                <p className="text-[10px] text-slate-500">
                                  Esta é a tabela oficial alimentada pelos cuidadores no domicílio em tempo real. A família e o administrador acompanham juntos.
                                </p>
                              </div>
                            </div>
                          </div>

                          {logs.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-xs text-slate-500">Nenhum evento registrado no Diário de Bordo.</p>
                            </div>
                          ) : (
                            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-xs">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[9px]">
                                  <tr>
                                    <th className="p-3 w-[110px]">Horário / Data</th>
                                    <th className="p-3 w-[120px]">Categoria</th>
                                    <th className="p-3">Título / Atividade</th>
                                    <th className="p-3">Detalhamento / Descrição</th>
                                    <th className="p-3 w-[150px]">Registrado Por</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-150">
                                  {logs.map((log) => {
                                    const categoryMeta = getCategoryTheme(log.category);
                                    return (
                                      <tr key={log.id} className="hover:bg-slate-50/55 transition-colors">
                                        <td className="p-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                                          {log.time}
                                        </td>
                                        <td className="p-3">
                                          <span
                                            className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1.5 border ${categoryMeta.bg} ${categoryMeta.border} ${categoryMeta.text}`}
                                          >
                                            {categoryMeta.icon}
                                            <span>
                                              {log.category === "medication"
                                                ? "Remédio"
                                                : log.category === "meal"
                                                ? "Refeição"
                                                : log.category === "vital"
                                                ? "Sinais Vitais"
                                                : log.category === "activity"
                                                ? "Atividade"
                                                : log.category === "occurrence"
                                                ? "Ocorrência"
                                                : log.category === "system"
                                                ? "Sistema"
                                                : "Geral"}
                                            </span>
                                          </span>
                                        </td>
                                        <td className="p-3 font-bold text-slate-900">
                                          {log.title}
                                        </td>
                                        <td className="p-3 text-slate-600 text-xs leading-relaxed max-w-sm">
                                          {log.description}
                                        </td>
                                        <td className="p-3">
                                          <div className="flex items-center gap-1">
                                            <span className="font-semibold text-slate-700">{log.by}</span>
                                            {log.category === "system" && (
                                              <span className="bg-emerald-100 text-emerald-950 px-1 rounded uppercase font-black text-[7px] shrink-0">
                                                Escrow
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {adminTab === "financeiro" && (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <h3 className="font-display font-extrabold text-sm text-slate-900">
                              Auditoria Financeira & Lucro da Plataforma Cuida-me
                            </h3>
                            <p className="text-[10.5px] text-slate-500">
                              Acompanhe os fluxos de escrow, depósitos de garantia recebidos, repasses para os cuidadores e a taxa administrativa retida.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded w-max">
                            Painel de Liquidez & Taxas
                          </span>
                        </div>

                        {/* Top Financial Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Quanto entrou total (Gross revenue deposited) */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Entrada Bruta (Total)
                              </span>
                              <div className="p-1 bg-emerald-50 text-emerald-700 rounded-lg">
                                <DollarSign className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xl font-extrabold text-slate-900 block font-mono">
                                R$ {escrows.reduce((sum, es) => sum + es.amount, 0).toFixed(2)}
                              </span>
                              <span className="text-[9px] text-slate-400 block">
                                Total de depósitos de garantia (Escrow) realizados pelas famílias
                              </span>
                            </div>
                          </div>

                          {/* Lucro do App (Intermediação acumulada) */}
                          <div className="bg-teal-900 text-white rounded-xl p-4 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                                Lucro Retido do App (15%)
                              </span>
                              <div className="p-1 bg-teal-800 text-teal-200 rounded-lg">
                                <TrendingUp className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xl font-extrabold text-teal-100 block font-mono">
                                R$ {escrows.reduce((sum, es) => sum + es.feeAmount, 0).toFixed(2)}
                              </span>
                              <span className="text-[9px] text-teal-300/80 block">
                                Comissão total retida pela plataforma por intermediação de plantões
                              </span>
                            </div>
                          </div>

                          {/* Repasse Líquido aos Cuidadores (85%) */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Repasse Profissional (85%)
                              </span>
                              <div className="p-1 bg-blue-50 text-blue-700 rounded-lg">
                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xl font-bold text-blue-900 block font-mono">
                                R$ {(escrows.reduce((sum, es) => sum + es.amount, 0) - escrows.reduce((sum, es) => sum + es.feeAmount, 0)).toFixed(2)}
                              </span>
                              <span className="text-[9px] text-slate-400 block">
                                Valor destinado integralmente ao saldo dos cuidadores
                              </span>
                            </div>
                          </div>

                          {/* Escrows Ativos e Garantidos */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Retido em Garantia
                              </span>
                              <div className="p-1 bg-amber-50 text-amber-700 rounded-lg">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-xl font-bold text-amber-700 block font-mono">
                                R$ {escrows.filter(es => es.status === "locked" || es.status === "disputed").reduce((sum, es) => sum + es.amount, 0).toFixed(2)}
                              </span>
                              <span className="text-[9px] text-slate-400 block">
                                Fundos atualmente protegidos em escrow aguardando conclusão do plantão
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Fee Split Visualizer and Simulator */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Visual fee breakdown card */}
                          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                            <h4 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                              Demonstrativo de Divisão do Valor do Plantão (15% vs 85%)
                            </h4>
                            <p className="text-[10.5px] text-slate-500 leading-relaxed">
                              Cada plantão contratado transaciona os valores através do sistema de garantia Cuida-me. A família deposita 100% do valor do plantão, que fica retido até que o cuidador registre as atividades. Quando liberado, a plataforma retém 15% de taxa operacional e repassa os 85% restantes livres para a conta digital do cuidador.
                            </p>

                            <div className="space-y-2 pt-2">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-blue-750">Cuidador (85%)</span>
                                <span className="text-teal-700">Taxa Plataforma (15%)</span>
                              </div>
                              <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden flex font-mono text-[9px] text-white font-black">
                                <div className="bg-emerald-600 h-full flex items-center justify-center transition-all" style={{ width: "85%" }}>
                                  85% Repasse Cuidador
                                </div>
                                <div className="bg-teal-700 h-full flex items-center justify-center transition-all" style={{ width: "15%" }}>
                                  15% Taxa App
                                </div>
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-400">
                                <span>Garante remuneração digna ao cuidador profissional</span>
                                <span>Manutenção da plataforma, IA, suporte e segurança jurídica</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Interactive Simulator Box */}
                          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
                            <h4 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                              Simulador de Tarifação
                            </h4>
                            <p className="text-[10.5px] text-slate-500">
                              Insira um valor bruto de plantão para simular a divisão de taxas:
                            </p>
                            <div className="space-y-2">
                              <div className="relative">
                                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">R$</span>
                                <input
                                  type="number"
                                  value={simAmount}
                                  onChange={(e) => setSimAmount(e.target.value)}
                                  placeholder="Digite um valor bruto"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-xs font-bold text-slate-800 focus:outline-emerald-600"
                                />
                              </div>

                              <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 text-xs border border-slate-100">
                                <div className="flex justify-between text-slate-500">
                                  <span>Valor Pago pela Família:</span>
                                  <span className="font-semibold text-slate-800">
                                    R$ {parseFloat(simAmount || "0").toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-teal-700">
                                  <span className="font-semibold">Lucro Cuida-me (15%):</span>
                                  <span className="font-extrabold">
                                    R$ {(parseFloat(simAmount || "0") * 0.15).toFixed(2)}
                                  </span>
                                </div>
                                <div className="border-t border-slate-200 my-1 pt-1 flex justify-between text-emerald-800 font-bold">
                                  <span>Cuidador Recebe (85%):</span>
                                  <span className="font-extrabold text-sm">
                                    R$ {(parseFloat(simAmount || "0") * 0.85).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* TRANSACTION HISTORY WITH FILTERS */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                              <h4 className="font-display font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                                Histórico Detalhado de Garantias Financeiras
                              </h4>
                              <p className="text-[10px] text-slate-500">
                                Audite todas as transações, taxas geradas e status de liberação bancária das contas.
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              {/* Search Input */}
                              <input
                                type="text"
                                placeholder="Buscar por nome..."
                                value={finSearch}
                                onChange={(e) => setFinSearch(e.target.value)}
                                className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-800 focus:outline-teal-600 w-full sm:w-[150px]"
                              />

                              {/* Status Select */}
                              <select
                                value={finStatusFilter}
                                onChange={(e: any) => setFinStatusFilter(e.target.value)}
                                className="bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-700 focus:outline-teal-600 cursor-pointer"
                              >
                                <option value="all">Todos os Status</option>
                                <option value="locked">Garantias Bloqueadas</option>
                                <option value="released">Garantias Liberadas</option>
                              </select>
                            </div>
                          </div>

                          {/* Filtering list */}
                          {(() => {
                            const filteredEscrows = escrows.filter((es) => {
                              const matchesSearch =
                                es.fromName.toLowerCase().includes(finSearch.toLowerCase()) ||
                                es.toName.toLowerCase().includes(finSearch.toLowerCase()) ||
                                es.id.toLowerCase().includes(finSearch.toLowerCase());
                              const matchesStatus =
                                finStatusFilter === "all" ||
                                (finStatusFilter === "locked" && es.status === "locked") ||
                                (finStatusFilter === "released" && es.status === "released");
                              return matchesSearch && matchesStatus;
                            });

                            return filteredEscrows.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-xs text-slate-500">Nenhuma movimentação financeira encontrada para os filtros aplicados.</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-xs">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-50 text-slate-650 font-bold border-b border-slate-200 uppercase tracking-wider text-[9px]">
                                    <tr>
                                      <th className="p-3 w-[100px]">ID Garantia</th>
                                      <th className="p-3">Família (Contratante)</th>
                                      <th className="p-3">Cuidador (Beneficiário)</th>
                                      <th className="p-3 text-right">Valor Pago (Família)</th>
                                      <th className="p-3 text-right text-teal-800">Taxa Intermediação (15%)</th>
                                      <th className="p-3 text-right text-emerald-700">Líquido Profissional (85%)</th>
                                      <th className="p-3 text-center">Status Escrow</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-150">
                                    {filteredEscrows.map((es) => {
                                      const appProfit = es.feeAmount;
                                      const caregiverNet = es.amount - es.feeAmount;
                                      return (
                                        <tr key={es.id} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="p-3 font-mono font-bold text-[10px] text-slate-500 whitespace-nowrap">
                                            {es.id.toUpperCase()}
                                          </td>
                                          <td className="p-3 font-semibold text-slate-700">
                                            {es.fromName}
                                          </td>
                                          <td className="p-3 font-semibold text-slate-800">
                                            {es.toName}
                                          </td>
                                          <td className="p-3 text-right font-extrabold text-slate-900 font-mono">
                                            R$ {es.amount.toFixed(2)}
                                          </td>
                                          <td className="p-3 text-right font-bold text-teal-700 font-mono">
                                            R$ {appProfit.toFixed(2)}
                                          </td>
                                          <td className="p-3 text-right font-bold text-emerald-600 font-mono">
                                            R$ {caregiverNet.toFixed(2)}
                                          </td>
                                          <td className="p-3 text-center">
                                            <span
                                              className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                                                es.status === "locked"
                                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                                  : es.status === "released"
                                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                  : "bg-red-100 text-red-800 border border-red-200"
                                              }`}
                                            >
                                              {es.status === "locked"
                                                ? "Retido em Escrow"
                                                : es.status === "released"
                                                ? "Liberado ao Cuidador"
                                                : "Em Disputa"}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}


                  </div>
                </div>
              ) : currentUser.role === "contratante" ? (
                <div className="flex-1 flex flex-col justify-between">
                  {/* MAIN COHESIVE HEADER TABS FOR FAMILY (CONTRATANTE) */}
                  <div className="flex items-center overflow-x-auto no-scrollbar lg:grid lg:grid-cols-6 border-b border-slate-200 bg-slate-100/90 p-1.5 sm:p-2 gap-1 sm:gap-1.5 select-none shrink-0">
                    <button
                      onClick={() => setFamilyTab("agendamento")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "agendamento"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <Calendar className={`w-3.5 h-3.5 ${familyTab === "agendamento" ? "text-emerald-300" : "text-emerald-600"}`} />
                      <span>Agendamento<span className="hidden xl:inline"> & Agenda</span></span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("conexao")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "conexao"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <Search className={`w-3.5 h-3.5 ${familyTab === "conexao" ? "text-teal-300" : "text-indigo-600"}`} />
                      <span><span className="hidden xl:inline">Buscar </span>Cuidadores</span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("diario")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "diario"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${familyTab === "diario" ? "text-rose-300" : "text-rose-600"}`} />
                      <span>Diário<span className="hidden xl:inline"> de Bordo</span></span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("seguranca")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "seguranca"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${familyTab === "seguranca" ? "text-amber-300" : "text-amber-600"}`} />
                      <span>Garantia<span className="hidden xl:inline"> Escrow</span></span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("chat")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "chat"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <MessageSquare className={`w-3.5 h-3.5 ${familyTab === "chat" ? "text-indigo-300" : "text-indigo-600"}`} />
                      <span>Chat<span className="hidden xl:inline"> e Mensagens</span></span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("acompanhamento")}
                      className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                        familyTab === "acompanhamento"
                          ? "bg-indigo-800 text-white shadow-sm font-black ring-2 ring-indigo-500/30"
                          : "bg-white text-slate-700 hover:text-slate-950 border border-slate-250 hover:border-indigo-300 hover:bg-slate-50 shadow-2xs"
                      }`}
                    >
                      <User className={`w-3.5 h-3.5 ${familyTab === "acompanhamento" ? "text-teal-300" : "text-teal-600"}`} />
                      <span>Perfil<span className="hidden xl:inline"> & Saúde</span></span>
                    </button>
                  </div>

                  {familyTab === "inicio" && (
                    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6 bg-slate-50/50 min-h-full">
                      {/* Hero Greeting Banner with Cuida-me Branding */}
                      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
                        <div className="relative z-10 max-w-xl space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-teal-400/20 text-teal-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-teal-400/30">
                              Cuida-me • Cuidado que faz bem
                            </span>
                          </div>
                          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight leading-tight">
                            Olá, <span className="text-teal-300">{currentUser?.name?.split(' ')[0] || "Maria"}</span>! 👋
                          </h2>
                          <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed">
                            Como podemos te ajudar hoje? Encontre os cuidadores mais qualificados e verificados para a sua família.
                          </p>
                        </div>

                        {/* Decorative Badge Graphic */}
                        <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center w-36 h-36 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3 text-center">
                          <div className="space-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold shadow-sm">
                              👵🏻
                            </div>
                            <p className="text-[10px] font-bold text-white leading-tight">
                              Cuidado verificado e seguro
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Search Bar Pill */}
                      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2.5 pl-3">
                          <Search className="w-4 h-4 text-indigo-600 shrink-0" />
                          <input
                            type="text"
                            placeholder="Buscar cuidadores, especialidades (ex: Alzheimer, Pós-cirúrgico)..."
                            value={matchQuery}
                            onChange={(e) => setMatchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setFamilyTab("conexao");
                            }}
                            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setFamilyTab("conexao")}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Filtros avançados"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Banner Card: Encontre o cuidador ideal */}
                      <div className="bg-gradient-to-br from-indigo-50 via-purple-50/60 to-white rounded-2xl p-5 border border-indigo-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-2 max-w-md">
                          <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                            Encontre o cuidador ideal
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Busque por localização, especialidade, disponibilidade e verificação de documentos.
                          </p>
                          <button
                            onClick={() => setFamilyTab("conexao")}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer mt-2"
                          >
                            <span>Buscar cuidadores</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white/90 p-3 rounded-xl border border-indigo-100 shadow-2xs self-stretch sm:self-auto justify-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0">
                            🔍
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-bold text-slate-900 block">Busca Personalizada</span>
                            <span className="text-[10px] text-teal-700 font-bold block">100% Cuidadores COREN</span>
                          </div>
                        </div>
                      </div>

                      {/* Acesso rápido */}
                      <div className="space-y-3">
                        <h3 className="font-display font-extrabold text-sm text-slate-800 tracking-tight">
                          Acesso rápido
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Meus Agendamentos */}
                          <button
                            onClick={() => setFamilyTab("agendamento")}
                            className="bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-100/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group shadow-2xs"
                          >
                            <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">Meus Agendamentos</span>
                          </button>

                          {/* Mensagens */}
                          <button
                            onClick={() => setChatMode("cuidadores")}
                            className="bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-100/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group shadow-2xs"
                          >
                            <div className="w-11 h-11 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                              <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">Mensagens</span>
                          </button>

                          {/* Favoritos */}
                          <button
                            onClick={() => setFamilyTab("conexao")}
                            className="bg-rose-50/80 hover:bg-rose-100/90 border border-rose-100/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group shadow-2xs"
                          >
                            <div className="w-11 h-11 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                              <Heart className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">Favoritos</span>
                          </button>

                          {/* Meus Contratos */}
                          <button
                            onClick={() => setFamilyTab("seguranca")}
                            className="bg-sky-50/80 hover:bg-sky-100/90 border border-sky-100/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group shadow-2xs"
                          >
                            <div className="w-11 h-11 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                              <ClipboardList className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">Meus Contratos</span>
                          </button>
                        </div>
                      </div>

                      {/* Cuidadores em destaque */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-extrabold text-sm text-slate-800 tracking-tight">
                            Cuidadores em destaque
                          </h3>
                          <button
                            onClick={() => setFamilyTab("conexao")}
                            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Ver todos</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {filteredCaregivers.slice(0, 3).map((cg) => (
                            <div
                              key={cg.id}
                              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <img
                                      src={cg.avatar}
                                      alt={cg.name}
                                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                                      {cg.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">{cg.role}</p>
                                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span>4,9</span>
                                      <span className="text-slate-400 text-[10px] font-normal">(128 avaliações)</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleStartPrivateChat(cg)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
                                  title="Favoritar / Conversar"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Specialty Tags */}
                              <div className="flex flex-wrap gap-1">
                                {cg.specialties.slice(0, 2).map((spec, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-medium">A partir de</span>
                                  <span className="text-xs font-black text-indigo-900">R$ {cg.dailyRate},00/plantão</span>
                                </div>
                                <button
                                  onClick={() => handleStartPrivateChat(cg)}
                                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                                >
                                  Contratar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>



                      {/* Segurança em primeiro lugar Banner */}
                      <div
                        onClick={() => setFamilyTab("seguranca")}
                        className="bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100/90 rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-5 h-5 text-teal-300" />
                          </div>
                          <div>
                            <h4 className="font-display font-extrabold text-xs text-indigo-950">
                              Segurança em primeiro lugar
                            </h4>
                            <p className="text-[11px] text-indigo-800/80">
                              Todos os cuidadores passam por verificação de documentos, antecedentes e COREN.
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-indigo-700 shrink-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )}

                  {familyTab === "agendamento" && (
                    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6 bg-slate-50/50 min-h-full">
                      {/* Agendamento Hero Banner */}
                      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="bg-teal-400/20 text-teal-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-teal-400/30">
                            Agendamento & Escalas de Plantão
                          </span>
                          <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                            Agenda de Plantões & Solicitação
                          </h3>
                          <p className="text-xs text-emerald-100/90 font-medium">
                            Marque plantões, acompanhe confirmações e gerencie cancelamentos com antecedência.
                          </p>
                        </div>

                        <button
                          onClick={() => setFamilyTab("conexao")}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Solicitar Novo Plantão</span>
                        </button>
                      </div>

                      {/* Cancel Shift Modal */}
                      {cancellingShiftDay !== null && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h3 className="font-display font-bold text-sm text-slate-900">Cancelar Plantão Agendado</h3>
                              <button
                                type="button"
                                onClick={() => setCancellingShiftDay(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-4 text-xs text-slate-600">
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-2">
                                <div className="flex justify-between">
                                  <span>Data do Plantão:</span>
                                  <strong className="text-slate-900">{cancellingShiftDay} de {MONTH_NAMES[selectedMonth]} de {selectedYear}</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Dia Atual (Simulado):</span>
                                  <strong className="text-slate-900">{simulatedToday} de {MONTH_NAMES[selectedMonth]} de {selectedYear}</strong>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                                  <span>Antecedência:</span>
                                  <span className={cancellingShiftDay - simulatedToday >= 3 ? "text-emerald-600" : "text-rose-600"}>
                                    {cancellingShiftDay - simulatedToday} dias
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                                <strong className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">Regra de Cancelamento:</strong>
                                <p className="leading-relaxed text-[11px]">
                                  Os plantões agendados podem ser cancelados com **no mínimo 3 dias de antecedência** (antecedência máxima de cancelamento = 3 dias antes do plantão).
                                </p>
                              </div>

                              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                                <div>
                                  <span className="block text-[10px] font-bold uppercase text-slate-400">Status</span>
                                  <span className={`font-bold ${cancellingShiftDay - simulatedToday >= 3 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {cancellingShiftDay - simulatedToday >= 3 ? "✓ Permitido" : "❌ Bloqueado"}
                                  </span>
                                </div>
                                {cancellingShiftDay - simulatedToday < 3 && (
                                  <span className="text-[10px] font-medium text-rose-600 max-w-[200px] text-right">
                                    Falta(m) apenas {cancellingShiftDay - simulatedToday <= 0 ? 0 : cancellingShiftDay - simulatedToday} dias de antecedência.
                                  </span>
                                )}
                              </div>

                              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => setCancellingShiftDay(null)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2 rounded-lg cursor-pointer"
                                >
                                  Fechar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelShift(cancellingShiftDay)}
                                  disabled={cancellingShiftDay - simulatedToday < 3}
                                  className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    cancellingShiftDay - simulatedToday >= 3
                                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Confirmar Cancelamento</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Calendar widget */}
                      <div className="bg-white p-3 sm:p-5 border border-slate-200 rounded-2xl space-y-4 shadow-2xs">
                        
                        {/* Selector Header: Month, Year, Arrows, Direct Date Picker & Simulated Today */}
                        <div className="flex flex-col gap-3 border-b border-slate-150 pb-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                              <h4 className="font-display font-black text-sm sm:text-base text-slate-900 flex flex-wrap items-center gap-1.5">
                                <span>Agenda de Plantões •</span>
                                <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-xl border border-slate-250 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (selectedMonth === 0) {
                                        setSelectedMonth(11);
                                        setSelectedYear(y => y - 1);
                                      } else {
                                        setSelectedMonth(m => m - 1);
                                      }
                                    }}
                                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"
                                    title="Mês anterior"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-emerald-700 font-black px-1">{MONTH_NAMES[selectedMonth]} {selectedYear}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (selectedMonth === 11) {
                                        setSelectedMonth(0);
                                        setSelectedYear(y => y + 1);
                                      } else {
                                        setSelectedMonth(m => m + 1);
                                      }
                                    }}
                                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer"
                                    title="Próximo mês"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </h4>
                            </div>

                            {/* Direct Date Picker */}
                            <div className="flex items-center">
                              <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-250 shadow-2xs">
                                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-tight">Ir para data:</span>
                                <input
                                  type="date"
                                  value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(nonnoCalendarDay).padStart(2, '0')}`}
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [y, m, d] = e.target.value.split('-').map(Number);
                                      if (y && m && d) {
                                        setSelectedYear(y);
                                        setSelectedMonth(m - 1);
                                        setNonnoCalendarDay(d);
                                      }
                                    }
                                  }}
                                  className="bg-white border border-slate-200 hover:border-emerald-400 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-2xs transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Calendar representation */}
                        <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-150 overflow-hidden">
                          <div className="grid grid-cols-7 text-center text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase mb-2">
                            <span>Seg</span>
                            <span>Ter</span>
                            <span>Qua</span>
                            <span>Qui</span>
                            <span>Sex</span>
                            <span>Sáb</span>
                            <span>Dom</span>
                          </div>

                          {/* Dynamic Days Grid */}
                          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs font-bold text-slate-800">
                            {(() => {
                              const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                              const firstDayRaw = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sun
                              const startOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Seg=0
                              const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

                              const prevCells = Array.from({ length: startOffset }, (_, i) => prevMonthDays - startOffset + 1 + i);
                              const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                              return (
                                <>
                                  {/* Prev Month Days */}
                                  {prevCells.map(pDay => (
                                    <div key={`prev-${pDay}`} className="p-1 sm:p-2 text-slate-300 font-normal text-[10px] opacity-50">
                                      {pDay}
                                    </div>
                                  ))}

                                  {/* Current Month Days */}
                                  {currentDays.map(day => {
                                    const isCompleted = selectedMonth === 2 && selectedYear === 2025 && completedDays.includes(day);
                                    const isConfirmed = selectedMonth === 2 && selectedYear === 2025 && confirmedDays.includes(day);
                                    const isSelected = nonnoCalendarDay === day;
                                    const isSimToday = simulatedToday === day && selectedMonth === 2 && selectedYear === 2025;

                                    return (
                                      <button
                                        key={day}
                                        onClick={() => {
                                          setNonnoCalendarDay(day);
                                          setCancelStatusMsg(null);
                                        }}
                                        className={`p-1.5 sm:p-2.5 rounded-xl flex flex-col items-center justify-between gap-0.5 sm:gap-1 transition-all relative group cursor-pointer ${
                                          isSelected 
                                            ? "bg-indigo-900 text-white font-black scale-105 shadow-md ring-2 ring-indigo-500/40" 
                                            : isSimToday
                                              ? "bg-emerald-50 text-emerald-800 border-2 border-emerald-400 ring-2 ring-emerald-300/20 font-black"
                                              : "bg-white hover:bg-emerald-50/60 hover:border-emerald-300 border border-slate-200"
                                        }`}
                                      >
                                        <span className="relative text-[11px] sm:text-xs">
                                          {day}
                                          {isSimToday && (
                                            <span className="absolute -top-1.5 -right-2 text-[5px] sm:text-[6px] font-black uppercase text-emerald-600 tracking-tighter hidden sm:inline">Hoje</span>
                                          )}
                                        </span>
                                        
                                        <div className="flex gap-0.5 justify-center">
                                          {isCompleted && (
                                            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse" title="Plantão Concluído" />
                                          )}
                                          {isConfirmed && (
                                            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-500 rounded-full" title="Plantão Confirmado" />
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </>
                              );
                            })()}
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 pt-2.5 border-t border-slate-200 text-[9px] sm:text-[10px] font-bold text-slate-600">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                              <span>Concluído</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" />
                              <span>Confirmado</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-white border border-emerald-400 ring-2 ring-emerald-300/15 rounded-full inline-block" />
                              <span>Hoje (Simulado)</span>
                            </div>
                          </div>
                        </div>

                        {/* Toast status alert messages */}
                        {cancelStatusMsg && (
                          <div className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2.5 border animate-fade-in ${
                            cancelStatusMsg.isError 
                              ? "bg-rose-50 border-rose-200 text-rose-900" 
                              : "bg-emerald-50 border-emerald-200 text-emerald-900"
                          }`}>
                            {cancelStatusMsg.isError ? (
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              {cancelStatusMsg.text}
                            </div>
                            <button 
                              onClick={() => setCancelStatusMsg(null)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer text-[10px]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Dynamic details for the selected day */}
                        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Detalhes do Dia Selecionado: {nonnoCalendarDay} de {MONTH_NAMES[selectedMonth]} de {selectedYear}
                          </span>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                CA
                              </div>
                              <div>
                                <strong className="block text-xs text-slate-900">Carlos Amaral (Cuidador Técnico)</strong>
                                <span className="text-[10px] text-slate-500">Paciente: {activePatient.name}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                              {selectedMonth === 2 && selectedYear === 2025 && completedDays.includes(nonnoCalendarDay) ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">
                                  ✓ Plantão Concluído
                                </span>
                              ) : confirmedDays.includes(nonnoCalendarDay) ? (
                                <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:w-auto">
                                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded">
                                    ● Plantão Confirmado
                                  </span>
                                  
                                  {(() => {
                                    const daysNotice = nonnoCalendarDay - simulatedToday;
                                    const isAllowed = daysNotice >= 3;
                                    return (
                                      <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                                        <button
                                          onClick={() => setCancellingShiftDay(nonnoCalendarDay)}
                                          className="text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer bg-rose-600 hover:bg-rose-700 text-white"
                                          title="Cancelar este plantão"
                                        >
                                          <X className="w-3 h-3" />
                                          <span>Cancelar Plantão</span>
                                        </button>
                                        
                                        <span className={`text-[9px] font-bold ${isAllowed ? "text-emerald-600" : "text-rose-600"}`}>
                                          {isAllowed 
                                            ? `Permitido (${daysNotice} dias de antecedência)`
                                            : `Bloqueado (Falta(m) ${daysNotice <= 0 ? "0" : daysNotice} dias de antecedência • Mínimo de 3)`
                                          }
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:w-auto">
                                  <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded">
                                    Sem escalas previstas
                                  </span>
                                  
                                  <button
                                    onClick={() => handleScheduleShift(nonnoCalendarDay)}
                                    className="text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                                    title="Marcar plantão para este dia"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Marcar Plantão</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {familyTab === "diario" && (
                    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 pb-20 sm:pb-6">
                      
                      {/* Patient Metadata Top Header card with inline escrow toggle */}
                      <div className="bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shrink-0">
                            {currentUser?.patientName
                              ? currentUser.patientName.trim().split(/\s+/).slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
                              : "SH"}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                                {currentUser?.patientName || "Sr. Helvécio"} {currentUser?.patientName ? `(Assistido(a) de ${currentUser.name})` : "(Pai de Lucas)"}
                              </h3>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                                {currentUser?.patientCondition || "Alzheimer"}
                              </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-500">
                              {currentUser?.patientAge || "78"} anos • Monitorando Rotina Diária de Plantão
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <button
                            onClick={() => setFamilyTab("seguranca")}
                            className="w-full md:w-auto text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 transition-colors shadow-2xs click-feedback cursor-pointer group"
                            title="Visualizar histórico de depósitos garantidos"
                          >
                            <Lock className="w-3.5 h-3.5 text-emerald-600 animate-pulse group-hover:scale-110 transition-transform" />
                            <span>R$ 220,00 Protegido no Escrow</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-450 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>

                      {/* Timeline listing and annotation inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        
                        {/* Live active timeline list (8 cols) */}
                        <div className="md:col-span-8 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-emerald-600" />
                              Diário de Bordo Digital (Auditoria ao Vivo)
                            </h4>
                          </div>

                          <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-4">
                            <AnimatePresence initial={false}>
                              {logs.map((log) => {
                                const categoryMeta = getCategoryTheme(log.category);
                                return (
                                  <motion.div
                                    key={log.id}
                                    className={`p-3 rounded-xl border ${categoryMeta.border} ${categoryMeta.bg} shadow-xs relative`}
                                  >
                                    <div className="absolute -left-[23px] top-4 w-2.5 h-2.5 bg-emerald-500 rounded-full border-4 border-white shadow-xs" />
                                    
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <div className="flex items-center gap-2">
                                        {categoryMeta.icon}
                                        <span className="text-xs font-bold text-slate-900 leading-tight">{log.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500">{log.time}</span>
                                        {currentUser?.role === "contratante" && (
                                          <button
                                            onClick={() => handleDeleteLog(log.id)}
                                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                                            title="Excluir este registro"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-650 pl-6 leading-relaxed">{log.description}</p>
                                    
                                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 pl-6 text-[9px] text-slate-400">
                                      <span>Assinado por: <strong>{log.by}</strong></span>
                                      {log.category === "system" && <span className="bg-emerald-100 text-emerald-950 px-1 rounded uppercase font-bold text-[8px]">Escrow Ativo</span>}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Add instruction sidebar (4 cols) */}
                        <div className="md:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h4 className="font-display font-bold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-emerald-600" />
                            Instrução Nutricional ou Cuidado
                          </h4>
                          <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
                            O cuidador lerá e fará o checklist do item instantaneamente no domicílio.
                          </p>

                          <form onSubmit={handleAddLog} className="space-y-3">
                            <div className="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200/60 space-y-1.5">
                              <span className="block text-[9px] font-bold text-slate-650 uppercase">Modelos de Cuidado Rápido:</span>
                              <div className="flex flex-wrap gap-1">
                                {PRESET_INSTRUCTIONS.map((preset, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                      setLogTitle(preset.title);
                                      setLogDesc(preset.desc);
                                      setLogCategory(preset.category);
                                    }}
                                    className="text-[10px] bg-white hover:bg-emerald-100 hover:text-emerald-900 text-slate-750 font-bold px-2 py-1 rounded border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer select-none"
                                  >
                                    {preset.title}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Assunto / Título</label>
                              <input
                                type="text"
                                placeholder="Ex: Oferecer Copo de Água"
                                value={logTitle}
                                onChange={(e) => setLogTitle(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Detalhes de Execução</label>
                              <textarea
                                placeholder="Ex: Deixar garrafa de 300ml ao lado de repouso."
                                value={logDesc}
                                onChange={(e) => setLogDesc(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500 min-h-[60px]"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isSubmittingLog}
                              className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs"
                            >
                              Publicar Nota no Painel
                            </button>
                          </form>
                        </div>

                      </div>

                    </div>
                  )}

                  {familyTab === "conexao" && (
                    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6">
                      
                      {/* CAIXA PARA ESPECIFICAR O TIPO DE PACIENTE */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                              <UserCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-display font-extrabold text-sm text-slate-900 tracking-tight">
                                Especificar Tipo de Paciente & Necessidades
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                Selecione a condição do paciente para filtrar cuidadores certificados e especializados
                              </p>
                            </div>
                          </div>

                          {userPatients.length > 0 && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                              <span className="text-[11px]">Paciente ativo: <strong>{userPatients.find(p => p.id === selectedPatientId)?.name || "Sr. Helvécio"}</strong> ({userPatients.find(p => p.id === selectedPatientId)?.age || "78"} anos)</span>
                            </div>
                          )}
                        </div>

                        {/* Grid de Opções do Tipo de Paciente */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                          {[
                            {
                              id: "todos",
                              label: "Todos os Perfis",
                              specialty: "",
                              icon: Users,
                              desc: "Ver todos os cuidadores"
                            },
                            {
                              id: "idoso",
                              label: "Idoso & Geriatria",
                              specialty: "Acompanhamento Idosos",
                              icon: User,
                              desc: "Acompanhamento e rotina"
                            },
                            {
                              id: "alzheimer",
                              label: "Alzheimer & Demência",
                              specialty: "Alzheimer & Demência",
                              icon: Activity,
                              desc: "Estímulo cognitivo e memória"
                            },
                            {
                              id: "acamado",
                              label: "Acamado & Mobilidade",
                              specialty: "Mobilidade & Transferência",
                              icon: ShieldCheck,
                              desc: "Banho no leito e apoio"
                            },
                            {
                              id: "pos_op",
                              label: "Pós-Operatório",
                              specialty: "Pós-Operatório & Curativos",
                              icon: ClipboardList,
                              desc: "Curativos e medicação"
                            },
                            {
                              id: "paliativos",
                              label: "Cuidados Paliativos",
                              specialty: "Cuidados Paliativos",
                              icon: Heart,
                              desc: "Conforto e atenção contínua"
                            }
                          ].map((option) => {
                            const IconComp = option.icon;
                            const isSelected = matchSpecialty === option.specialty;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setMatchSpecialty(isSelected ? "" : option.specialty)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group ${
                                  isSelected
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/30"
                                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-white text-indigo-700 shadow-2xs border border-slate-200/60"}`}>
                                    <IconComp className="w-4 h-4" />
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                                  )}
                                </div>
                                <div>
                                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                                    {option.label}
                                  </h4>
                                  <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-indigo-100" : "text-slate-500"}`}>
                                    {option.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Search Input Filter */}
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex-1 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="text"
                              placeholder="Buscar por nome do cuidador, COREN ou palavra-chave..."
                              value={matchQuery}
                              onChange={(e) => setMatchQuery(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-indigo-500 focus:bg-white transition-all"
                            />
                            {matchQuery && (
                              <button
                                onClick={() => setMatchQuery("")}
                                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {matchSpecialty && (
                            <button
                              onClick={() => setMatchSpecialty("")}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Limpar Filtro</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Caregiver listing */}
                      <div className="space-y-4">
                        <h4 className="font-display font-bold text-sm text-slate-800">Cuidadores com Verificação Policial Completa</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredCaregivers.map((cg) => (
                            <div
                              key={cg.id}
                              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <img
                                      src={cg.avatar}
                                      alt={cg.name}
                                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-display font-bold text-xs text-slate-900 leading-tight">
                                      {cg.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">{cg.role}</p>
                                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span>4,9</span>
                                      <span className="text-slate-400 text-[10px] font-normal">(128 avaliações)</span>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleStartPrivateChat(cg)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-full hover:bg-rose-50 cursor-pointer"
                                  title="Favoritar / Conversar"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Specialty Tags */}
                              <div className="flex flex-wrap gap-1">
                                {cg.specialties.slice(0, 3).map((spec, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md"
                                  >
                                    {spec}
                                  </span>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-medium">A partir de</span>
                                  <span className="text-xs font-black text-indigo-900">R$ {cg.dailyRate},00/plantão</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleViewProfile(cg.id)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                                  >
                                    Perfil
                                  </button>
                                  <button
                                    onClick={() => {
                                      setHiringCaregiver(cg);
                                      setPaymentMethod("pix");
                                    }}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                                  >
                                    Contratar
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {familyTab === "chat" && (
                    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-full">
                      {renderChatSection(true)}
                    </div>
                  )}

                  {familyTab === "seguranca" && (
                    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6">
                      <div className="space-y-3">
                        <h4 className="font-display font-bold text-sm text-slate-900">Histórico de Depósitos Garantia no Escrow</h4>
                        <p className="text-xs text-slate-500">Seus valores contratados e o status de liquidação segura</p>
                      </div>

                      <div className="space-y-3">
                        {escrows.map((es) => (
                          <div key={es.id} className="border border-slate-200 bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">Registro: {es.id}</span>
                              <strong className="block text-xs text-slate-800">{es.fromName} ➔ {es.toName}</strong>
                            </div>

                            <div className="text-right">
                              <span className="block font-bold text-sm text-emerald-800">R$ {es.amount.toFixed(2)}</span>
                              <span className={`inline-block text-[8px] font-bold px-1.5 rounded uppercase ${
                                es.status === "locked" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {es.status === "locked" ? "Bloqueado na Garantia" : "Liberado ao Cuidador"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {familyTab === "acompanhamento" && (
                    <div className="space-y-6 p-4 sm:p-6 pb-20 sm:pb-6">
                      
                      {/* Brand Banner inspired by NONNO app screenshots */}
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150 pointer-events-none">
                          <Heart className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold tracking-wider text-xl font-display uppercase">Cuida-me</span>
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">CUIDANDO COM AMOR</span>
                          </div>
                          <h3 className="text-xl font-display font-black leading-tight max-w-xl">
                            Controle de saúde, gestão de equipe e financeiro simples em um só lugar.
                          </h3>
                          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg">
                            Bem-vindo ao canal integrado Cuida-me do familiar. Acompanhe os sinais biológicos, gerencie o histórico de pagamentos e avalie os plantonistas instantaneamente.
                          </p>
                        </div>
                      </div>

                      {/* Top Bento Row: Pacientes Carousel (inspired by image 1) */}
                      <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-display font-bold text-sm text-slate-900">Selecione o Paciente Assistido</h4>
                            <p className="text-[11px] text-slate-500">Clique para alternar o monitoramento de sinais clínicos e diários</p>
                          </div>
                          <div>
                            <button
                              onClick={() => setIsAddingPatient(true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors w-full sm:w-auto"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Adicionar Novo</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {userPatients.map((patient) => {
                            const isSelected = selectedPatientId === patient.id;
                            return (
                              <button
                                key={patient.id}
                                onClick={() => {
                                  setSelectedPatientId(patient.id);
                                  setNonnoPatient(patient.id === "primary" ? "maria" : "emanoel");
                                  setNonnoEvalSuccess(false);
                                }}
                                className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20"
                                    : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={patient.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                                    alt={patient.name}
                                    className="w-11 h-11 rounded-full object-cover border border-slate-250 shrink-0"
                                  />
                                  <div>
                                    <strong className="block text-xs text-slate-950 font-bold">{patient.name}</strong>
                                    <span className="block text-[10px] text-slate-500 mt-0.5">Peso: {patient.weight || "70"} kg • Idade: {patient.age} anos</span>
                                  </div>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? "translate-x-1 text-emerald-600" : ""}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Add Patient Modal */}
                      {isAddingPatient && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h3 className="font-display font-bold text-sm text-slate-900">Cadastrar Novo Paciente Assistido</h3>
                              <button
                                type="button"
                                onClick={() => setIsAddingPatient(false)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <form onSubmit={handleAddPatient} className="space-y-4">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nome Completo do Paciente</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ex: Dona Maria de Lourdes"
                                  value={newPatientName}
                                  onChange={(e) => setNewPatientName(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-emerald-600"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Idade (anos)</label>
                                  <input
                                    type="number"
                                    required
                                    placeholder="Ex: 82"
                                    value={newPatientAge}
                                    onChange={(e) => setNewPatientAge(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-emerald-600"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Peso Estimado (kg)</label>
                                  <input
                                    type="number"
                                    placeholder="Ex: 68"
                                    value={newPatientWeight}
                                    onChange={(e) => setNewPatientWeight(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-emerald-600"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase">Condição / Diagnóstico de Saúde</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ex: Parkinson leve, pós-operatório quadril"
                                  value={newPatientCondition}
                                  onChange={(e) => setNewPatientCondition(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-emerald-600"
                                />
                              </div>

                              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => setIsAddingPatient(false)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2 rounded-lg cursor-pointer"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Cadastrar Paciente</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* Cancel Shift Modal */}
                      {cancellingShiftDay !== null && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h3 className="font-display font-bold text-sm text-slate-900">Cancelar Plantão Agendado</h3>
                              <button
                                type="button"
                                onClick={() => setCancellingShiftDay(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-4 text-xs text-slate-600">
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-2">
                                <div className="flex justify-between">
                                  <span>Data do Plantão:</span>
                                  <strong className="text-slate-900">{cancellingShiftDay} de Março de 2025</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span>Dia Atual (Simulado):</span>
                                  <strong className="text-slate-900">{simulatedToday} de Março de 2025</strong>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                                  <span>Antecedência:</span>
                                  <span className={cancellingShiftDay - simulatedToday >= 3 ? "text-emerald-600" : "text-rose-600"}>
                                    {cancellingShiftDay - simulatedToday} dias
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                                <strong className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">Regra de Cancelamento:</strong>
                                <p className="leading-relaxed text-[11px]">
                                  Os plantões agendados podem ser cancelados com **no mínimo 3 dias de antecedência** (antecedência máxima de cancelamento = 3 dias antes do plantão).
                                </p>
                              </div>

                              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
                                <div>
                                  <span className="block text-[10px] font-bold uppercase text-slate-400">Status</span>
                                  <span className={`font-bold ${cancellingShiftDay - simulatedToday >= 3 ? "text-emerald-600" : "text-rose-600"}`}>
                                    {cancellingShiftDay - simulatedToday >= 3 ? "✓ Permitido" : "❌ Bloqueado"}
                                  </span>
                                </div>
                                {cancellingShiftDay - simulatedToday < 3 && (
                                  <span className="text-[10px] font-medium text-rose-600 max-w-[200px] text-right">
                                    Falta(m) apenas {cancellingShiftDay - simulatedToday <= 0 ? 0 : cancellingShiftDay - simulatedToday} dias de antecedência.
                                  </span>
                                )}
                              </div>

                              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                                <button
                                  type="button"
                                  onClick={() => setCancellingShiftDay(null)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2 rounded-lg cursor-pointer"
                                >
                                  Fechar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelShift(cancellingShiftDay)}
                                  disabled={cancellingShiftDay - simulatedToday < 3}
                                  className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                                    cancellingShiftDay - simulatedToday >= 3
                                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                  }`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Confirmar Cancelamento</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Main Layout Grid: Left column (Health & Vitais), Right column (Payments & Evaluation) */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN: Health Reports & Sinais Vitais (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                          
                          {/* Patient Health Reports (inspired by Image 3) */}
                          <div className="bg-white p-3.5 sm:p-4 border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-rose-500" />
                                <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
                                  Relatório de Saúde & Sinais Vitais ({activePatient.name})
                                </h4>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded animate-pulse">
                                ● Sincronizado ao Vivo
                              </span>
                            </div>

                            {/* Compact 4-Card Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {/* Vitals Box - Pressure */}
                              <div className="bg-rose-50/50 p-2.5 border border-rose-100/80 rounded-xl flex flex-col justify-between space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-rose-950 uppercase tracking-tight flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-rose-500" /> Pressão
                                  </span>
                                  <span className="text-[8px] font-bold text-rose-600 bg-rose-100/60 px-1 py-0.2 rounded">Estável</span>
                                </div>
                                <div className="flex items-baseline gap-1 my-0.5">
                                  <strong className="text-lg font-black font-mono text-slate-900 leading-none">
                                    {activePatient.pressure || "120/80"}
                                  </strong>
                                  <span className="text-[9px] text-slate-500 font-bold">mmHg</span>
                                </div>
                                <div className="h-4 flex items-end gap-0.5 pt-0.5">
                                  {[110, 115, 120, 118, 122, 120].map((val, i) => (
                                    <div key={i} className="flex-1 bg-rose-400 rounded-t-xs" style={{ height: `${(val - 80) * 0.8}%` }} />
                                  ))}
                                </div>
                              </div>

                              {/* Heart Rate / bpm */}
                              <div className="bg-emerald-50/50 p-2.5 border border-emerald-100/80 rounded-xl flex flex-col justify-between space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-emerald-950 uppercase tracking-tight flex items-center gap-1">
                                    <Activity className="w-3 h-3 text-emerald-500" /> Batimentos
                                  </span>
                                  <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100/60 px-1 py-0.2 rounded">Normal</span>
                                </div>
                                <div className="flex items-baseline gap-1 my-0.5">
                                  <strong className="text-lg font-black font-mono text-slate-900 leading-none">
                                    {activePatient.heartRate || "97"}
                                  </strong>
                                  <span className="text-[9px] text-slate-500 font-bold">bpm</span>
                                </div>
                                <div className="h-4 flex items-center overflow-hidden">
                                  <svg className="w-full h-3 stroke-rose-500 fill-none" viewBox="0 0 100 20" strokeWidth="2">
                                    <path d="M 0 10 Q 10 10 15 10 T 20 0 T 25 20 T 30 10 T 45 10 T 50 2 T 55 18 T 60 10 T 75 10 T 80 10 T 85 0 T 90 20 T 100 10" />
                                  </svg>
                                </div>
                              </div>

                              {/* Sleep / Sono tracker */}
                              <div className="bg-violet-50/50 p-2.5 border border-violet-100/80 rounded-xl flex flex-col justify-between space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-violet-950 uppercase tracking-tight flex items-center gap-1">
                                    <Moon className="w-3 h-3 text-violet-500" /> Sono
                                  </span>
                                  <span className="text-[8px] font-bold text-violet-700 bg-violet-100/60 px-1 py-0.2 rounded">Bom</span>
                                </div>
                                <div className="flex items-baseline gap-1 my-0.5">
                                  <strong className="text-lg font-black font-mono text-slate-900 leading-none">7h 40m</strong>
                                  <span className="text-[9px] text-slate-500 font-bold">média</span>
                                </div>
                                <div className="h-4 flex items-end gap-1">
                                  {[6, 8, 7.5, 9, 7.2, 7.6, 8.2].map((hrs, i) => (
                                    <div key={i} className="flex-1 bg-violet-500 rounded-xs" style={{ height: `${(hrs / 10) * 100}%` }} />
                                  ))}
                                </div>
                              </div>

                              {/* Mood / Humor tracker */}
                              <div className="bg-amber-50/50 p-2.5 border border-amber-100/80 rounded-xl flex flex-col justify-between space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-amber-950 uppercase tracking-tight flex items-center gap-1">
                                    <Smile className="w-3 h-3 text-amber-500" /> Humor
                                  </span>
                                  <span className="text-[8px] font-bold text-amber-700 bg-amber-100/60 px-1 py-0.2 rounded">Calmo</span>
                                </div>
                                <div className="flex items-baseline gap-1 my-0.5">
                                  <strong className="text-xs sm:text-sm font-black text-slate-900 leading-none truncate">
                                    {activePatient.mood || "Feliz / Estável"}
                                  </strong>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] text-slate-500">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                                  <span className="font-bold text-slate-700">70% Calmo</span>
                                </div>
                              </div>
                            </div>

                            {/* Compact Footer Strip for Diurese and Evacuação */}
                            <div className="bg-slate-50 p-2.5 border border-slate-150 rounded-xl grid grid-cols-2 gap-3 text-center">
                              <div className="flex items-center justify-center gap-2 border-r border-slate-200">
                                <Droplet className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[11px] font-bold text-slate-600">Diurese (Urina):</span>
                                <strong className="text-sm font-black font-mono text-slate-900">
                                  {activePatient.waterCups || 3}x
                                </strong>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-[11px] font-bold text-slate-600">Evacuação (Fezes):</span>
                                <strong className="text-sm font-black font-mono text-slate-900">
                                  {activePatient.medsCount || 2}x
                                </strong>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* RIGHT COLUMN: Payments Simple Control & Interactive Evaluation Form (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                          
                          {/* Financial simple safe control panel (inspired by Image 1) */}
                          <div className="bg-white p-3 sm:p-5 border border-slate-200 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
                                  Controle Financeiro de Plantões
                                </h4>
                              </div>
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                                Fluxo Direto
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Acompanhe seus lançamentos financeiros. Trabalhamos exclusivamente com pagamento à vista ou cartão de crédito para maior segurança.
                            </p>

                            {/* Preferred Payment Method Selector */}
                            <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-1">
                              <button
                                type="button"
                                onClick={() => setPreferredPaymentMethod("vista")}
                                className={`py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                  preferredPaymentMethod === "vista"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-transparent text-slate-650 hover:bg-slate-100"
                                }`}
                              >
                                À Vista (PIX)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreferredPaymentMethod("credito")}
                                className={`py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                  preferredPaymentMethod === "credito"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-transparent text-slate-650 hover:bg-slate-100"
                                }`}
                              >
                                Crédito (Cartão)
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              {/* Invoice 1 */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="block text-[10px] font-bold text-slate-800">10 de Junho</span>
                                  <span className="block text-[9px] text-slate-450 leading-none">
                                    {preferredPaymentMethod === "vista" ? "Pagamento à Vista (PIX)" : "Pagamento no Crédito"}
                                  </span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-mono text-xs font-extrabold text-slate-900">R$ 150,00</span>
                                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                                    Confirmado
                                  </span>
                                </div>
                              </div>

                              {/* Invoice 2 */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="block text-[10px] font-bold text-slate-800">28 de Maio</span>
                                  <span className="block text-[9px] text-slate-450 leading-none">
                                    {preferredPaymentMethod === "vista" ? "Pagamento à Vista (PIX)" : "Pagamento no Crédito"}
                                  </span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-mono text-xs font-extrabold text-slate-900">R$ 300,00</span>
                                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                                    Confirmado
                                  </span>
                                </div>
                              </div>

                              {/* Invoice 3 */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                                <div className="space-y-1">
                                  <span className="block text-[10px] font-bold text-slate-800">28 de Abril</span>
                                  <span className="block text-[9px] text-slate-450 leading-none">
                                    {preferredPaymentMethod === "vista" ? "Pagamento à Vista (PIX)" : "Pagamento no Crédito"}
                                  </span>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                  <span className="font-mono text-xs font-extrabold text-slate-900">R$ 350,00</span>
                                  <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                                    Confirmado
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => setFamilyTab("seguranca")}
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              Clique para ver a lista de pagamentos e garantias
                            </button>
                          </div>

                          {/* Evaluation Form widget (inspired by Image 4) */}
                          <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <h4 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider">
                                  Avaliar Atendimento & Plantão
                                </h4>
                              </div>
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                                Finalizado
                              </span>
                            </div>

                            {/* Shift Details Metadata */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <strong className="text-xs text-slate-800">Sábado, 8 de Junho</strong>
                                <span className="text-[10px] text-slate-500 font-medium">11:00 às 19:00 (8h)</span>
                              </div>

                              <div className="flex items-center gap-2.5 border-t border-slate-200 pt-2">
                                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  CA
                                </div>
                                <div>
                                  <strong className="block text-xs text-slate-900 leading-none">Carlos Amaral</strong>
                                  <span className="text-[9px] text-slate-450 font-medium">Técnico em Enfermagem domiciliar</span>
                                </div>
                              </div>
                            </div>

                            {/* Interactive Rating Form */}
                            {nonnoEvalSuccess ? (
                              <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-xl text-center space-y-2 animate-fade-in">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                                <strong className="text-xs text-emerald-950 block">Avaliação Enviada com Sucesso!</strong>
                                <p className="text-[10px] text-emerald-800 leading-relaxed">
                                  Sua opinião garante a excelência da plataforma. O status do Escrow foi atualizado com base no seu feedback positivo.
                                </p>
                                <button
                                  onClick={() => setNonnoEvalSuccess(false)}
                                  className="text-[10px] font-bold text-emerald-700 underline block mx-auto pt-1 cursor-pointer"
                                >
                                  Avaliar outro plantão
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="text-center space-y-1">
                                  <span className="text-xs font-bold text-slate-750 block">Como você avalia o seu plantão?</span>
                                  
                                  {/* Interactive Stars */}
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    {[1, 2, 3, 4, 5].map((starNum) => (
                                      <button
                                        key={starNum}
                                        onClick={() => setNonnoRating(starNum)}
                                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                      >
                                        <Star 
                                          className={`w-6 h-6 ${
                                            starNum <= nonnoRating 
                                              ? "text-amber-500 fill-amber-500" 
                                              : "text-slate-300"
                                          }`} 
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                    {nonnoRating === 1 && "Muito ruim"}
                                    {nonnoRating === 2 && "Ruim / Regular"}
                                    {nonnoRating === 3 && "Mediano / Bom"}
                                    {nonnoRating === 4 && "Excelente"}
                                    {nonnoRating === 5 && "Excepcional / Impecável"}
                                  </span>
                                </div>

                                {/* Tags select (inspired by image 4) */}
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block">
                                    O que pode ser destacado ou melhorado?
                                  </span>

                                  <div className="flex flex-wrap gap-1.5">
                                    {[
                                      "Pontual", "Atencioso", "Faltou", "Chegou atrasado", 
                                      "Foi rude", "Higiene impecável", "Usou muito o celular", 
                                      "Errou na medicação", "Super prestativo", "Faltou paciência"
                                    ].map((tag) => {
                                      const isSelected = nonnoTags.includes(tag);
                                      return (
                                        <button
                                          key={tag}
                                          type="button"
                                          onClick={() => {
                                            if (isSelected) {
                                              setNonnoTags(nonnoTags.filter(t => t !== tag));
                                            } else {
                                              setNonnoTags([...nonnoTags, tag]);
                                            }
                                          }}
                                          className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                                            isSelected 
                                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold" 
                                              : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                                          }`}
                                        >
                                          {tag}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Text comment box */}
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">
                                    Deixar comentário complementar
                                  </label>
                                  <textarea
                                    value={nonnoComment}
                                    onChange={(e) => setNonnoComment(e.target.value)}
                                    placeholder="Conte-nos em detalhes como foi o atendimento do plantonista..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-teal-500 min-h-[60px]"
                                  />
                                </div>

                                <button
                                  onClick={() => {
                                    setNonnoEvalSuccess(true);
                                    // Let's create a simulated log action
                                    fetch("/api/logs", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        category: "activity",
                                        title: `Avaliação do Plantonista enviada`,
                                        description: `Familiar Lucas avaliou o plantonista Carlos Amaral com ${nonnoRating} estrelas. Destaques: ${nonnoTags.join(", ")}.`,
                                        by: "Sistema cuide.me",
                                        status: "info"
                                      })
                                    }).then(() => refreshAppData());
                                  }}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center block"
                                >
                                  Concluir Avaliação do Plantão
                                </button>
                              </div>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>
                  )}



                  {/* BOTTOM NAVIGATION BAR FOR FAMILY (CONTRATANTE) - MOBILE EXCLUSIVE FIXED BAR */}
                  <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-xl">
                    <button
                      onClick={() => setFamilyTab("inicio")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        familyTab === "inicio"
                          ? "text-indigo-700 bg-indigo-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Home className={`w-5 h-5 ${familyTab === "inicio" ? "text-indigo-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Início</span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("conexao")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        familyTab === "conexao"
                          ? "text-indigo-700 bg-indigo-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Search className={`w-5 h-5 ${familyTab === "conexao" ? "text-indigo-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Busca</span>
                    </button>



                    <button
                      onClick={() => setFamilyTab("agendamento")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        familyTab === "agendamento"
                          ? "text-indigo-700 bg-indigo-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Calendar className={`w-5 h-5 ${familyTab === "agendamento" ? "text-indigo-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Agendamento</span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("chat")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        familyTab === "chat"
                          ? "text-indigo-700 bg-indigo-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <MessageSquare className={`w-5 h-5 ${familyTab === "chat" ? "text-indigo-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Chat</span>
                    </button>

                    <button
                      onClick={() => setFamilyTab("acompanhamento")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        familyTab === "acompanhamento"
                          ? "text-indigo-700 bg-indigo-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <User className={`w-5 h-5 ${familyTab === "acompanhamento" ? "text-indigo-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Perfil</span>
                    </button>
                  </div>
                </div>
              ) : (
                
                /* =========================================
                   2E. APPROVED CUIDADOR DASHBOARD TABS
                   ========================================= */
                <div className="flex-1 flex flex-col justify-between">
                  {/* CAREGIVER DASHBOARD NAVIGATION HEADER TABS */}
                  <div className="flex items-center overflow-x-auto no-scrollbar border-b border-slate-200 bg-slate-50/90 p-2 gap-1.5 select-none shrink-0">
                    <button
                      onClick={() => setCaregiverTab("plantao")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        caregiverTab === "plantao"
                          ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                          : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Meu Plantão Ativo</span>
                    </button>
                    <button
                      onClick={() => setCaregiverTab("vagas")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        caregiverTab === "vagas"
                          ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                          : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Vagas Disponíveis</span>
                    </button>

                    <button
                      onClick={() => setCaregiverTab("financeiro")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        caregiverTab === "financeiro"
                          ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                          : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Financeiro & Extrato</span>
                    </button>

                    <button
                      onClick={() => setCaregiverTab("chat")}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        caregiverTab === "chat"
                          ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                          : "bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat e Copiloto</span>
                    </button>
                  </div>
                  {caregiverTab === "plantao" && (
                    <div className="space-y-6 p-6">
                      
                      {/* Active Shift Card Header */}
                      {shifts.filter(sh => sh.status === "in_progress").length === 0 ? (
                        <div className="text-center py-12 bg-slate-55 border border-dashed rounded-xl">
                          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-bold text-slate-700">Não há nenhum plantão ativo hoje.</p>
                          <p className="text-xs text-slate-500 mt-1">Navegue na aba "Plantões Disponíveis" para se candidatar!</p>
                        </div>
                      ) : (
                        shifts.filter(sh => sh.status === "in_progress").map((sh) => (
                          <div key={sh.id} className="space-y-6">
                            
                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
                              <div>
                                <h4 className="font-display font-bold text-xs text-teal-900 border-b border-teal-100 pb-1 mb-1.5 uppercase tracking-wide">PLANTÃO EM ANDAMENTO</h4>
                                <strong className="block text-sm text-slate-900">{sh.patientName} ({sh.patientAge})</strong>
                                <span className="block text-[11px] text-slate-500">{sh.condition} • {sh.location}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-[9px] font-semibold text-slate-400 uppercase">Garantia Líquida</span>
                                <strong className="text-sm text-slate-900 block font-mono">R$ {sh.rate},00</strong>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">Escrow Autorizado</span>
                              </div>
                            </div>

                            {/* Direct log notes insertion by Caregiver */}
                            <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50">
                              <span className="block text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-teal-600" />
                                Registrar Evento de Cuidado Técnico (Mandatório Diário)
                              </span>

                              <div className="bg-slate-100/75 p-3 rounded-lg border border-slate-200 space-y-1.5">
                                <span className="block text-[9px] font-bold text-slate-600 uppercase">Modelos Rápidos (Toque para preencher):</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {PRESET_INSTRUCTIONS.map((preset, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => {
                                        setLogTitle(preset.title);
                                        setLogDesc(preset.desc);
                                        setLogCategory(preset.category);
                                      }}
                                      className="text-[10px] bg-white hover:bg-teal-50 hover:text-teal-900 text-slate-750 font-bold px-2 py-1 rounded border border-slate-200 hover:border-teal-300 transition-all cursor-pointer select-none"
                                    >
                                      {preset.title}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <form onSubmit={handleAddLog} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                                <div className="sm:col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-650 uppercase mb-1">Título do Evento</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Medicamento administrado"
                                    value={logTitle}
                                    onChange={(e) => setLogTitle(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                    required
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-[9px] font-bold text-slate-650 uppercase mb-1">Categoria</label>
                                  <select
                                    value={logCategory}
                                    onChange={(e) => setLogCategory(e.target.value as any)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                                  >
                                    <option value="medication">Medicamento Administrado</option>
                                    <option value="meal">Alimentação / Refeição</option>
                                    <option value="vital">Sinal Vital / Aferição</option>
                                    <option value="activity">Higiene / Mobilidade</option>
                                    <option value="occurrence">Ocorrência Crítica</option>
                                  </select>
                                </div>
                                <div className="sm:col-span-3">
                                  <label className="block text-[9px] font-bold text-slate-650 uppercase mb-1">Descrição</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Losartana 50mg ingerido com copo de água (200ml) sem retenção"
                                    value={logDesc}
                                    onChange={(e) => setLogDesc(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-teal-500"
                                    required
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs"
                                >
                                  Publicar Log
                                </button>
                              </form>
                            </div>

                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleCompleteShift(sh.id)}
                                className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Concluir Plantão e Solicitar Liberação do Escrow
                              </button>
                            </div>

                          </div>
                        ))
                      )}

                    </div>
                  )}

                  {caregiverTab === "vagas" && (
                    <div className="space-y-6 p-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm text-slate-900">Lista de Oportunidades com Pagamento Retido em Escrow</h4>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded">Garantia Absoluta</span>
                      </div>

                      <div className="space-y-4">
                        {shifts.filter(sh => sh.status === "available").length === 0 ? (
                          <div className="text-center py-12 border rounded-xl bg-slate-50">
                            <Sliders className="w-10 h-10 text-slate-350 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">Nenhum plantão livre disponível na sua microrregião de atuação no momento.</p>
                          </div>
                        ) : (
                          shifts.filter(sh => sh.status === "available").map((sh) => (
                            <div key={sh.id} className="border border-slate-205 bg-white rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="space-y-1.5">
                                <strong className="block text-sm text-slate-900">{sh.patientName} • {sh.patientAge}</strong>
                                <span className="block text-xs text-slate-500">{sh.condition} • {sh.location}</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sh.requirements.map((r, i) => (
                                    <span key={i} className="text-[8px] bg-slate-100 text-slate-600 font-bold px-1 rounded">{r}</span>
                                  ))}
                                </div>
                              </div>

                              <div className="text-right pt-2 md:pt-0 w-full md:w-auto space-y-2">
                                <span className="block text-slate-905 font-display font-extrabold text-sm">R$ {sh.rate},00 Líquidos</span>
                                <button
                                  onClick={() => handleAcceptShift(sh.id)}
                                  className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-4 py-2 rounded-lg cursor-pointer"
                                >
                                  Aceitar Plantão Garantido
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}



                  {caregiverTab === "financeiro" && (
                    <div className="space-y-6 p-6">
                      <div className="bg-teal-900 text-white rounded-2xl p-5 space-y-4 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 translate-y-6 translate-x-4 opacity-5 shrink-0">
                          <DollarSign className="w-48 h-48" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">Meu Extrato Blindado</span>
                        <h4 className="text-3xl font-display font-black leading-none">R$ 1.480,00</h4>
                        <p className="text-xs text-teal-200">Total disponível para saque via PIX imediata • 100% livre de inadimplência</p>
                      </div>

                      <div className="space-y-4">
                        <span className="block text-xs font-bold text-slate-900">Plantões em Curso / Retidos no Cofre</span>
                        {escrows.map((es) => (
                          <div key={es.id} className="border border-slate-200 bg-slate-50 p-4 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <strong className="block text-slate-800">{es.fromName}</strong>
                              <span className="block text-[8px] font-mono mt-0.5">{es.id} • {es.lastUpdated}</span>
                            </div>
                            <div className="text-right">
                              <span className="block font-bold text-emerald-800">R$ {(es.amount - es.feeAmount).toFixed(2)} líquido</span>
                              <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase">Sob Garantia de Escrow</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {caregiverTab === "chat" && (
                    <div className="p-4 sm:p-6 pb-20 sm:pb-6 bg-slate-50 min-h-full">
                      {renderChatSection(true)}
                    </div>
                  )}

                  {/* BOTTOM NAVIGATION BAR FOR CAREGIVER (CUIDADOR) - MOBILE EXCLUSIVE FIXED BAR */}
                  <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-xl">
                    <button
                      onClick={() => setCaregiverTab("plantao")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        caregiverTab === "plantao"
                          ? "text-emerald-700 bg-emerald-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Activity className={`w-5 h-5 ${caregiverTab === "plantao" ? "text-emerald-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Plantão</span>
                    </button>

                    <button
                      onClick={() => setCaregiverTab("vagas")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        caregiverTab === "vagas"
                          ? "text-emerald-700 bg-emerald-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Briefcase className={`w-5 h-5 ${caregiverTab === "vagas" ? "text-emerald-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Vagas</span>
                    </button>

                    <button
                      onClick={() => setCaregiverTab("financeiro")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        caregiverTab === "financeiro"
                          ? "text-emerald-700 bg-emerald-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <DollarSign className={`w-5 h-5 ${caregiverTab === "financeiro" ? "text-emerald-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Extrato</span>
                    </button>

                    <button
                      onClick={() => setCaregiverTab("chat")}
                      className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                        caregiverTab === "chat"
                          ? "text-emerald-700 bg-emerald-50/80 font-extrabold shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <MessageSquare className={`w-5 h-5 ${caregiverTab === "chat" ? "text-emerald-700 stroke-[2.5]" : "text-slate-500"}`} />
                      <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight">Chat</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </section>

        {/* RIGHT COLUMN: PREVIEW CHAT WHEN NOT LOGGED IN */}
        {!currentUser ? (
          <section className="lg:col-span-4 shrink-0">
            {renderChatSection(false)}
          </section>
        ) : null}

        {false && (
        <section className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col h-[650px] overflow-hidden sticky top-[90px]">
          
          <div className="bg-slate-900 text-white p-4 shrink-0 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xs tracking-tight">Canais de Conversação</h3>
                <span className="text-[9px] text-emerald-450 font-bold block leading-none">Intermediação e Copiloto Cuida-me</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[8px] uppercase font-bold tracking-widest text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mt-0.5" />
              <span>Conexão ativa</span>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="bg-slate-900 px-3 pb-2 pt-1 flex border-b border-slate-800 gap-1 shrink-0 select-none">
            <button
              onClick={() => setChatMode("ai")}
              className={`flex-1 text-center py-1.5 text-[8px] font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                chatMode === "ai"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              IA Copiloto
            </button>
            {(currentUser?.role === "adm" || currentUser?.role === "cuidador") && (
              <button
                onClick={() => setChatMode("cuidadores")}
                className={`flex-1 text-center py-1.5 text-[8px] font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                  chatMode === "cuidadores"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                Cuidadores
              </button>
            )}
            {(currentUser?.role === "adm" || currentUser?.role === "contratante") && (
              <button
                onClick={() => setChatMode("contratantes")}
                className={`flex-1 text-center py-1.5 text-[8px] font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                  chatMode === "contratantes"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                Famílias
              </button>
            )}
            <button
              onClick={() => {
                setChatMode("privado");
                // Pre-select a default conversation user if none is selected
                if (!selectedPrivateUser && currentUser) {
                  // Find any user that is allowed in our restricted contacts
                  const allowedContacts = getFilteredContacts();
                  const otherUser = allowedContacts.length > 0 ? allowedContacts[0] : null;
                  if (otherUser) {
                    setSelectedPrivateUser({
                      id: otherUser.id,
                      name: otherUser.name,
                      role: otherUser.role,
                      avatar: otherUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    });
                  }
                }
              }}
              className={`flex-1 text-center py-1.5 text-[8px] font-extrabold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                chatMode === "privado"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              ⚙ Privado
            </button>
          </div>

          {/* ================== TAB CONTENT: AI ASSISTANT ================== */}
          {chatMode === "ai" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Interactive Chatbot Feed Box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} space-y-1`}
                    >
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {msg.role === "user" ? "Eu (Usuário)" : "IA Cuida-me"}
                      </span>
                      
                      <div
                        className={`p-3.5 rounded-xl max-w-[90%] text-xs shadow-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-slate-800 text-white rounded-tr-none"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          renderParsedResponse(msg.content)
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 italic p-2 bg-white/70 border rounded-lg max-w-max">
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Sintonizando tom de voz e validando regras do aplicativo...</span>
                    </div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Preloaded interactive prompt pills */}
              <div className="px-4 py-2 bg-slate-100 border-t border-slate-150 shrink-0">
                <span className="block text-[8px] font-extrabold text-slate-400 uppercase mb-1.5 tracking-widest">Perguntas Rápidas de Simulação</span>
                <div className="flex flex-wrap gap-1">
                  {currentUser?.role === "adm" ? (
                    simulationPrompts.adm.map((sim, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sim.prompt)}
                        className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-1.5 rounded-md transition-all font-medium block truncate max-w-[170px] cursor-pointer"
                      >
                        {sim.label}
                      </button>
                    ))
                  ) : currentUser?.role === "cuidador" ? (
                    simulationPrompts.cuidador.map((sim, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sim.prompt)}
                        className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-1.5 rounded-md transition-all font-medium block truncate max-w-[175px] cursor-pointer"
                      >
                        {sim.label}
                      </button>
                    ))
                  ) : (
                    simulationPrompts.contratante.map((sim, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sim.prompt)}
                        className="text-[9px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-250 py-1 px-1.5 rounded-md transition-all font-medium block truncate max-w-[175px] cursor-pointer"
                      >
                        {sim.label}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Chat user text inputs */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Pergunte sobre COREN, taxa de 15%, escrow..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-emerald-600"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2 shrink-0 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================== TAB CONTENT: COMMUNITY CHATS ================== */}
          {(chatMode === "cuidadores" || chatMode === "contratantes") && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Channel metadata label */}
              <div className="bg-slate-50 border-b border-slate-150 px-4 py-2 shrink-0 flex items-center justify-between text-[10px]">
                <span className="font-extrabold text-slate-850 uppercase tracking-wider">
                  {chatMode === "cuidadores" ? "👥 Canal Comunitário: Cuidadores" : "🏡 Canal Comunitário: Contratantes"}
                </span>
                <span className="text-slate-500 font-mono font-bold uppercase text-[8px] bg-slate-155 px-1.5 rounded">
                  {chatMode === "cuidadores" ? "cuidador" : "contratante"}
                </span>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/30">
                {communityMessages.filter(msg => msg.channel === (chatMode === "cuidadores" ? "cuidador" : "contratante")).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-450 space-y-2">
                    <Sliders className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                    <p className="text-xs">Nenhuma mensagem enviada ainda. Seja o primeiro a postar!</p>
                  </div>
                ) : (
                  communityMessages
                    .filter(msg => msg.channel === (chatMode === "cuidadores" ? "cuidador" : "contratante"))
                    .map((msg) => {
                      const isMe = currentUser && msg.senderName === currentUser.name;
                      return (
                        <div key={msg.id} className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <img src={msg.senderAvatar} alt={msg.senderName} className="w-5 h-5 rounded-full object-cover border border-slate-300" />
                            <span className="font-bold text-slate-900">{msg.senderName}</span>
                            {(() => {
                              const matchUserObj = allUsers.find(u => u.name === msg.senderName);
                              if (matchUserObj && currentUser && matchUserObj.id !== currentUser.id) {
                                return (
                                  <button
                                    onClick={() => handleStartPrivateChat(matchUserObj)}
                                    title={`Conversar no privado com ${msg.senderName}`}
                                    className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer p-0.5"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </button>
                                );
                              }
                              return null;
                            })()}
                            <span className={`text-[7.5px] font-black px-1 rounded uppercase ${
                              msg.senderRole === "cuidador" 
                                ? "bg-teal-50 text-teal-800 border border-teal-100" 
                                : msg.senderRole === "contratante" 
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-105" 
                                : "bg-slate-900 text-white"
                            }`}>
                              {msg.senderRole === "cuidador" ? "Cuidador" : msg.senderRole === "contratante" ? "Família" : "Auditor"}
                            </span>
                            <span className="text-[8px] text-slate-400 font-mono ml-auto">{msg.time}</span>
                          </div>
                          
                          <div className={`p-3 rounded-xl text-xs max-w-[95%] leading-relaxed ${
                            isMe 
                              ? "bg-slate-800 text-white rounded-tl-none mr-auto" 
                              : "bg-white text-slate-805 border border-slate-200/80 rounded-tl-none shadow-3xs"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Feed simulation suggestions */}
              <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-150 shrink-0">
                <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Carregar Exemplo de Simulação</span>
                <div className="flex flex-wrap gap-1">
                  {chatMode === "cuidadores" ? (
                    <>
                      <button
                        onClick={() => setCommunityInput("Pessoal, alguém com experiência em Alzheimer pode me dar uma ajuda sobre rotina de hidratação gradual?")}
                        className="text-[8.5px] bg-white border hover:bg-slate-100 border-slate-200 font-medium text-slate-700 px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        💬 Hidratação Idosos
                      </button>
                      <button
                        onClick={() => setCommunityInput("Como faço para solicitar liberação de saldo de escrow para a minha conta digital parceira?")}
                        className="text-[8.5px] bg-white border hover:bg-slate-100 border-slate-200 font-medium text-slate-700 px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        💼 Liberação Escrow
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setCommunityInput("Quais cuidadores estão recomendados em São Paulo para pós-operatório ortopédico com transferência complexa?")}
                        className="text-[8.5px] bg-white border hover:bg-slate-100 border-slate-200 font-medium text-slate-700 px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        🔎 Pós-Operatório
                      </button>
                      <button
                        onClick={() => setCommunityInput("A taxa de intermediação de de 15% cobre cobertura para fratura de fêmur doméstica na apólice?")}
                        className="text-[8.5px] bg-white border hover:bg-slate-100 border-slate-200 font-medium text-slate-700 px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        🛡️ Benefícios Seguro
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Public post area */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    !currentUser 
                      ? "Faça login para postar na comunidade..." 
                      : chatMode === "cuidadores" 
                      ? "Envie uma mensagem para os cuidadores..." 
                      : "Escreva algo para as famílias..."
                  }
                  value={communityInput}
                  disabled={!currentUser}
                  onChange={(e) => setCommunityInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCommunityMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-emerald-600 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendCommunityMessage()}
                  disabled={!currentUser || !communityInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================== TAB CONTENT: PRIVATE CHATS ================== */}
          {chatMode === "privado" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* If no user is logged in */}
              {!currentUser ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
                  <Lock className="w-10 h-10 text-slate-400" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-sm text-slate-800">Acesso Restrito</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Faça login no painel esquerdo para acessar canais de conversas privadas entre famílias e cuidadores com garantia fiduciária Cuida-me.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/40">
                  
                  {/* Companion horizontal scroll list bar */}
                  <div className="bg-slate-900 border-b border-slate-800 px-3 py-2.5 shrink-0 flex flex-col gap-1.5 select-none">
                    <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Contatos Disponíveis no Aplicativo</span>
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 scrollbar-thin">
                      {getFilteredContacts()
                        .map(user => {
                          const isSelected = selectedPrivateUser && selectedPrivateUser.id === user.id;
                          return (
                            <button
                              key={user.id}
                              onClick={() => {
                                setSelectedPrivateUser({
                                  id: user.id,
                                  name: user.name,
                                  role: user.role,
                                  avatar: user.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                                });
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-left shrink-0 transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-emerald-600 border-emerald-500 text-white shadow-xs" 
                                  : "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white"
                              }`}
                            >
                              <img 
                                src={user.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} 
                                alt={user.name} 
                                className="w-5 h-5 rounded-full object-cover border border-slate-100/20" 
                              />
                              <div className="leading-none">
                                <span className="text-[10px] font-bold block truncate max-w-[85px]">{user.name.split(" ")[0]}</span>
                                <span className={`text-[7px] font-bold uppercase tracking-wider block mt-0.5 ${
                                  isSelected ? "text-emerald-100" : "text-slate-450"
                                }`}>
                                  {user.role === "cuidador" ? "Cuidador" : user.role === "contratante" ? "Família" : "Admin"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Private Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100/20">
                    {!selectedPrivateUser ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-405 space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-305 mx-auto animate-pulse" />
                        <p className="text-xs">Selecione um contato na barra superior para iniciar o chat privado.</p>
                      </div>
                    ) : (
                      (() => {
                        const conversationMessages = privateMessages.filter(msg => 
                          (msg.senderId === currentUser.id && msg.receiverId === selectedPrivateUser.id) ||
                          (msg.senderId === selectedPrivateUser.id && msg.receiverId === currentUser.id)
                        );

                        if (conversationMessages.length === 0) {
                          return (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                              <p className="text-xs">
                                Nenhuma mensagem privada anterior com <strong>{selectedPrivateUser.name}</strong>.
                              </p>
                              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                                Escreva uma mensagem ou envie uma das perguntas de simulação prontas abaixo!
                              </p>
                            </div>
                          );
                        }

                        return conversationMessages.map((msg) => {
                          const isSentByMe = msg.senderId === currentUser.id;
                          return (
                            <div key={msg.id} className="space-y-1">
                              {/* Message Header */}
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <img 
                                  src={isSentByMe ? (currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80") : selectedPrivateUser.avatar} 
                                  alt={msg.senderName} 
                                  className="w-4 h-4 rounded-full object-cover border border-slate-300" 
                                />
                                <span className="font-bold text-slate-900">
                                  {isSentByMe ? "Eu" : msg.senderName}
                                </span>
                                <span className="text-[8px] text-slate-400 font-mono ml-auto">{msg.time}</span>
                              </div>
                              
                              {/* Message bubble */}
                              <div className={`p-3 rounded-xl text-xs max-w-[95%] leading-relaxed ${
                                isSentByMe 
                                  ? "bg-emerald-600 text-white rounded-tr-none ml-auto" 
                                  : "bg-white text-slate-805 border border-slate-200/80 rounded-tl-none shadow-3xs"
                              }`}>
                                {msg.content}
                              </div>
                            </div>
                          );
                        });
                      })()
                    )}
                  </div>

                  {/* Private chat action suggestions / simulation bullets */}
                  {selectedPrivateUser && (
                    <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-150 shrink-0">
                      <span className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Simulações de Mensagens de Rotina</span>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const bullets = selectedPrivateUser.role === "cuidador" 
                            ? [
                                { label: "💊 Sr. Helvécio tomou remédio?", prompt: `Olá ${selectedPrivateUser.name}, o Sr. Helvécio tomou o remédio de pressão no horário certinho hoje?` },
                                { label: "📈 Registrar glicemia", prompt: `Por favor, lembre-se de registrar a medição de glicemia no Diário de Bordo Digital.` },
                                { label: "🗓️ Deseja estender plantão?", prompt: `Você teria disponibilidade para estender o plantão de sexta-feira? Faço a garantia imediata no Escrow do app.` }
                              ]
                            : [
                                { label: "📋 Rotina diária postada", prompt: `Olá ${selectedPrivateUser.name}! Já preenchi as informações de alimentação e medicação da manhã no Diário de Bordo.` },
                                { label: "☕ Falta café descafeinado", prompt: `Notamos aqui que o café descafeinado acabou. Você poderia deixar mais um pacote para o próximo plantão?` },
                                { label: "🔓 Pode liberar Escrow", prompt: `Tudo certo por aqui! Concluí todas as orientações. Se estiver tudo OK no Diário, pode fazer a assinatura para liberação do Escrow?` }
                              ];

                          return bullets.map((bullet, i) => (
                            <button
                              key={i}
                              onClick={() => setPrivateInput(bullet.prompt)}
                              className="text-[8.5px] bg-white hover:bg-slate-100 border border-slate-205 py-0.5 px-1.5 rounded transition-all font-medium cursor-pointer"
                            >
                              {bullet.label}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Private message input area */}
                  <div className="p-3 bg-white border-t border-slate-250 shrink-0 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={
                        !selectedPrivateUser 
                          ? "Selecione um contato para digitar..." 
                          : `Falar no privado com ${selectedPrivateUser.name.split(" ")[0]}...`
                      }
                      value={privateInput}
                      disabled={!selectedPrivateUser}
                      onChange={(e) => setPrivateInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendPrivateMessage()}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-emerald-600 disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleSendPrivateMessage()}
                      disabled={!selectedPrivateUser || !privateInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </section>
        )}

      </main>

      {/* ========================================================
         MODAL OVERLAYS: VISUAL DIALOGS & PROFILE VIEWERS
         ======================================================== */}
      
      {/* HIRING PAYMENT MODAL OVERLAY */}
      {hiringCaregiver && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-3 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-md w-full overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-3 sm:p-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-600/30 text-indigo-300 rounded-lg border border-indigo-500/30">
                  <DollarSign className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xs sm:text-sm text-white leading-tight">
                    Pagamento & Garantia Escrow
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    Contratação segura com retenção fiduciária
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHiringCaregiver(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-3 sm:p-4 space-y-3 overflow-y-auto">
              
              {/* Caregiver Summary Card */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <img
                    src={hiringCaregiver.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"}
                    alt={hiringCaregiver.name}
                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-900 leading-snug">{hiringCaregiver.name}</h4>
                    <p className="text-[9.5px] text-slate-500">{hiringCaregiver.role || "Cuidador de Idosos"}</p>
                    <span className="inline-block text-[8.5px] bg-emerald-100 text-emerald-800 font-bold px-1 py-0.2 rounded">
                      ✓ Profissional Verificado
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-[9px] text-slate-400 uppercase font-medium">Valor do Plantão</span>
                  <span className="text-xs font-black text-indigo-900">R$ {hiringCaregiver.dailyRate || 180},00</span>
                </div>
              </div>

              {/* Payment Methods Selector */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Forma de Pagamento
                </label>
                
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === "pix"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400/30 font-bold"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Pix</span>
                    <span className="text-[7.5px] font-extrabold text-emerald-700 bg-emerald-100 px-1 py-0.1 rounded">Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("debito")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === "debito"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-400/30 font-bold"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="text-[11px]">Débito</span>
                    <span className="text-[7.5px] font-extrabold text-indigo-700 bg-indigo-100 px-1 py-0.1 rounded">À Vista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credito")}
                    className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      paymentMethod === "credito"
                        ? "bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-400/30 font-bold"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px]">Crédito</span>
                    <span className="text-[7.5px] font-extrabold text-purple-700 bg-purple-100 px-1 py-0.1 rounded">Até 3x</span>
                  </button>
                </div>
              </div>

              {/* Payment Details per Method */}
              {paymentMethod === "pix" && (
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900">Pix Copia e Cola</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-full">Sem Taxas</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-emerald-200 text-center space-y-1.5">
                    <div className="p-1 bg-emerald-50 inline-block rounded-lg border border-emerald-100">
                      <QrCode className="w-14 h-14 text-emerald-800 mx-auto" />
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium">
                      Escaneie ou copie a chave Pix abaixo no app do seu banco:
                    </p>
                    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded border border-slate-200 font-mono text-[9px] text-slate-700 break-all">
                      <span className="truncate flex-1">00020126580014BR.GOV.BCB.PIX0136cuide-me-escrow-pix-99281726</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPixCopied(true);
                          setTimeout(() => setPixCopied(false), 2500);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[9px] font-bold px-2 py-0.5 rounded cursor-pointer shrink-0 flex items-center gap-0.5"
                      >
                        {pixCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{pixCopied ? "OK!" : "Copiar"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "debito" && (
                <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-lg p-2.5 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-900 block">Dados do Cartão de Débito</span>
                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="Ex: LUCAS ALBUQUERQUE"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-indigo-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Validade</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "credito" && (
                <div className="bg-purple-50/40 border border-purple-200/80 rounded-lg p-2.5 space-y-2">
                  <span className="text-[11px] font-bold text-purple-900 block">Dados do Cartão de Crédito</span>
                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Nome no Cartão</label>
                      <input
                        type="text"
                        placeholder="Ex: LUCAS ALBUQUERQUE"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] focus:outline-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Número do Cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Validade</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] font-mono focus:outline-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-600 uppercase mb-0.5">Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded p-1.5 text-[11px] focus:outline-purple-600"
                      >
                        <option value="1">1x R$ {hiringCaregiver.dailyRate || 180},00 (Sem juros)</option>
                        <option value="2">2x R$ {((hiringCaregiver.dailyRate || 180) / 2).toFixed(2)} (Sem juros)</option>
                        <option value="3">3x R$ {((hiringCaregiver.dailyRate || 180) / 3).toFixed(2)} (Sem juros)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Escrow Guarantee Badge */}
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 flex items-start gap-2 text-[9.5px] text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 font-bold">Garantia Escrow Cuida-me</strong>
                  <p className="leading-tight">
                    O valor fica retido com segurança na conta fiduciária do app e só é liberado para o cuidador após a validação do Diário de Bordo.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setHiringCaregiver(null)}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] py-2 px-3 rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessingPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-2 px-4 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pagar R$ {hiringCaregiver.dailyRate || 180},00</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}

      {/* RESERVATION SUCCESS OVERLAY TOAST DIALOG */}
      {reservationSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md p-6 border border-emerald-100 shadow-2xl relative space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="font-display font-extrabold text-slate-900 text-sm tracking-tight">Plantão Reservado com Sucesso!</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{reservationSuccess}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] space-y-1.5 font-medium text-slate-600">
              <span className="block font-bold text-slate-800 uppercase tracking-widest text-[8px]">Segurança Cuida-me Ativa:</span>
              <p>✓ Garantia de Pagamento Blindado em Escrow</p>
              <p>✓ Apólice de Seguro de Acidentes Domésticos Emitida</p>
              <p>✓ Auditoria do Diário de Bordo Digital</p>
            </div>

            <button
              onClick={() => setReservationSuccess(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer font-sans"
            >
              Iniciar Acompanhamento pelo Diário
            </button>
          </motion.div>
        </div>
      )}

      {/* PROFILE DETAIL VIEW MODAL OVERLAY */}
      {selectedProfileData && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200"
          >
            {/* Header portion */}
            <div className="bg-slate-950 text-white p-6 relative">
              <button 
                onClick={() => setSelectedProfileData(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 p-1.5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={selectedProfileData.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} 
                  alt={selectedProfileData.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="font-display font-extrabold text-lg tracking-tight">{selectedProfileData.name}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                      {selectedProfileData.status === "approved" ? "Verificado" : "Pendente"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-mono">
                    {selectedProfileData.role === "contratante" ? "Família / Contratante" : selectedProfileData.role || "Cuidador de Idosos Certificado"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {selectedProfileData.id}</p>
                </div>
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6 max-h-[380px] overflow-y-auto">
              
              {/* Specialties / Rates banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest block mb-1">Preço Cobrado</span>
                    <strong className="text-xl text-teal-950 font-display block">
                      R$ {selectedProfileData.dailyRate || 180},00 <span className="text-xs text-slate-500 font-normal">/ plantão</span>
                    </strong>
                  </div>
                  <p className="text-[9px] text-teal-800 mt-2 font-medium">✨ Taxa operacional e seguro de acidentes inclusos pelo app</p>
                </div>

                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1.5">Especialidades & Habilidades</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfileData.specialties && selectedProfileData.specialties.length > 0 ? (
                      selectedProfileData.specialties.map((spec: string, i: number) => (
                        <span key={i} className="text-[10px] bg-white text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic block">Prevenção Geral, Cuidados Básicos, Sinais Vitais</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Information if contratante */}
              {selectedProfileData.role === "contratante" && (
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Dados do Paciente Assistido</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase">Nome</span>
                      <span className="font-bold text-slate-900">{selectedProfileData.patientName || "Sr. Helvécio"}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase">Idade</span>
                      <span className="font-bold text-slate-900">{selectedProfileData.patientAge || "78"} anos</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase">Diagnóstico / Condição</span>
                      <span className="font-bold text-slate-900">{selectedProfileData.patientCondition || "Doença de Alzheimer e Hipertensão"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance section with verified checks */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Triagem Geral & Conformidade Jurídica</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase leading-none mb-1">Antecedentes Criminais</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold leading-none">POLICIAL OK</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase leading-none mb-1">Conselho / COREN</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold leading-none">HABILITADO & ATIVO</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase leading-none mb-1">Prova de Identidade</span>
                      <span className="text-[10px] text-emerald-700 font-extrabold leading-none">BIOMETRIA COM KYC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audited Documents Display for caregivers */}
              {selectedProfileData.role === "cuidador" && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-4 h-4 text-slate-550" /> Documentos Oficiais Arquivados
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    O administrador auditor avaliou as seguintes certidões que fundamentam a apólice de seguro contra acidentes domésticos:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-teal-600" />
                        <div>
                          <span className="block font-medium text-slate-800">Cópia do Documento de Identidade</span>
                          <span className="block text-[8.5px] text-slate-400">RG_CPF_VERIFICADO • Autenticado</span>
                        </div>
                      </div>
                      <a href="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=800&q=80" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded px-2.5 py-1">
                        Visualizar
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-teal-600" />
                        <div>
                          <span className="block font-medium text-slate-800">Diploma ou Certificação Profissional</span>
                          <span className="block text-[8.5px] text-slate-400">CERTIFICADO_ENFERMAGEM • Autenticado</span>
                        </div>
                      </div>
                      <a href="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded px-2.5 py-1">
                        Visualizar
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        <div>
                          <span className="block font-medium text-slate-800">Nada Consta Criminal Federal e Estadual</span>
                          <span className="block text-[8.5px] text-slate-400">ANTECEDENTES_CRIMINAIS_PF • Autenticado</span>
                        </div>
                      </div>
                      <a href="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded px-2.5 py-1">
                        Visualizar
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* General Contact Detail Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-205">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider mb-2">Canais Oficiais de Contato</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-705">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Telefone de Contato</span>
                    <strong className="text-slate-800">{selectedProfileData.phone || "(11) 99999-0000"}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">E-mail verificado</span>
                    <strong className="text-slate-800">{selectedProfileData.email}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedProfileData(null)}
                className="bg-slate-350 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
              >
                Voltar
              </button>
              {currentUser && selectedProfileData.id !== currentUser.id && (
                <button
                  onClick={() => handleStartPrivateChat(selectedProfileData)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer"
                >
                  Conversar no Privado
                </button>
              )}
              {selectedProfileData.role === "cuidador" && currentUser?.role === "contratante" && (
                <button
                  onClick={() => {
                    setHiringCaregiver(selectedProfileData);
                    setSelectedProfileData(null);
                    setPaymentMethod("pix");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Contratar (R$ {selectedProfileData.dailyRate || 180},00)</span>
                </button>
              )}
              {selectedProfileData.role === "cuidador" && selectedProfileData.status === "pending_approval" && currentUser?.role === "adm" && (
                <button
                  onClick={() => {
                    handleApproveCaregiver(selectedProfileData.id);
                    setSelectedProfileData(null);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer animate-pulse"
                >
                  Confirmar Triagem & Aprovar
                </button>
              )}
              {selectedProfileData.role === "cuidador" && selectedProfileData.status === "approved" && currentUser?.role === "adm" && (
                <button
                  onClick={() => {
                    setDismissingCaregiver(selectedProfileData);
                    setSelectedProfileData(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Desligar Cuidador (Suspensão)</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* DISMISSAL REASON DIALOG MODAL */}
      {dismissingCaregiver && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-red-650 border-b border-red-100 pb-3">
              <UserX className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-black text-sm uppercase tracking-tight">Desligamento de Prestador</h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-750 leading-relaxed">
                Você está prestes a desligar o cuidador <strong>{dismissingCaregiver.name}</strong> (ID: <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{dismissingCaregiver.id}</span>).
              </p>
              <p className="text-slate-500 leading-relaxed text-[10.5px]">
                Esta ação irá suspender seu login de acesso, remover seu perfil imediatamente do marketplace de novas contratações e suspender qualquer atividade pendente.
              </p>
              
              <div className="space-y-1.5 pt-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-500">Motivo Oficial para o Prontuário</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-xl focus:outline-red-505 font-sans text-xs min-h-[80px]"
                  placeholder="Ex: Falha grave de conduta assistencial, falta de pontualidade repetitiva, quebra de contratos de garantia Cuida-me, etc..."
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setDismissingCaregiver(null);
                  setDismissReason("");
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDismissCaregiver}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Confirmar Desligamento</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
