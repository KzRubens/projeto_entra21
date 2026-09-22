import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// In-Memory Data Store for the cuide.me simulation
interface LogEntry {
  id: string;
  time: string;
  category: "medication" | "meal" | "activity" | "vital" | "occurrence" | "system";
  title: string;
  description: string;
  by: string;
  status: "success" | "warning" | "info" | "alert";
  timestamp: Date;
}

interface Caregiver {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  avatar: string;
  distance: string;
  specialties: string[];
  backgroundChecked: boolean;
  diplomaValidated: boolean;
  kycDone: boolean;
  dailyRate: number;
  rating: number;
  reviewsCount: number;
  age?: number;
  gender?: string;
}

interface Shift {
  id: string;
  patientName: string;
  patientAge: string;
  condition: string;
  location: string;
  schedule: string;
  rate: number;
  requirements: string[];
  status: "available" | "accepted" | "in_progress" | "completed";
  escrowStatus: "pending" | "funded" | "released";
  logsCount: number;
  caregiverName?: string;
  contractorName?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "contratante" | "cuidador" | "adm";
  status: "pending_approval" | "approved" | "rejected" | "suspended";
  password?: string;
  
  // Caregiver fields
  specialties?: string[];
  dailyRate?: number;
  avatar?: string;
  distance?: string;
  rating?: number;
  reviewsCount?: number;
  age?: number;
  gender?: string;
  
  // Documents submitted (for caregivers)
  documents?: {
    idCopy: { name: string; url: string; submittedAt: string };
    diploma: { name: string; url: string; submittedAt: string };
    backgroundCheck: { name: string; url: string; submittedAt: string };
  };
  
  // Contratante specific fields
  patientName?: string;
  patientAge?: string;
  patientCondition?: string;
}

// Seed initial users list
let users: UserProfile[] = [
  {
    id: "user-adm",
    email: "administrador",
    name: "Administrador Geral",
    phone: "(11) 99999-4002",
    role: "adm",
    status: "approved",
    password: "adm4002" // Hardcoded matching constraints
  },
  {
    id: "user-lucas",
    email: "lucas@example.com",
    name: "Lucas Albuquerque",
    phone: "(11) 98765-4321",
    role: "contratante",
    status: "approved",
    password: "senha",
    patientName: "Sr. Helvécio",
    patientAge: "78",
    patientCondition: "Alzheimer moderado e hipertensão"
  },
  {
    id: "user-maria",
    email: "maria@example.com",
    name: "Maria Eduarda Ribeiro",
    phone: "(11) 91234-5678",
    role: "cuidador",
    status: "approved",
    password: "senha",
    specialties: ["Injetáveis", "Cuidados Pós-Operatórios", "Pacientes com Alzheimer", "Sinais Vitais Complexos"],
    dailyRate: 220,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    distance: "1.2 km",
    rating: 4.9,
    reviewsCount: 37,
    age: 29,
    gender: "Feminino",
    documents: {
      idCopy: { name: "ID_MARIA_ED_RG.jpg", url: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&q=80", submittedAt: "15/06/2026" },
      diploma: { name: "DIPLOMA_ENFERMAGEM_MARIA.pdf", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80", submittedAt: "15/06/2026" },
      backgroundCheck: { name: "ANTECEDENTES_CRIMINAIS_MARIA.pdf", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80", submittedAt: "15/06/2026" }
    }
  },
  {
    id: "user-joao",
    email: "joao@example.com",
    name: "João Pedro Santos",
    phone: "(11) 92222-3333",
    role: "cuidador",
    status: "approved",
    password: "senha",
    specialties: ["Transferência de Pacientes", "Alzheimer & Demência", "Auxílio em Fisioterapia", "Prevenção de Quedas"],
    dailyRate: 180,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    distance: "2.5 km",
    rating: 4.8,
    reviewsCount: 24,
    age: 34,
    gender: "Masculino",
    documents: {
      idCopy: { name: "RG_JOAO_PEDRO.png", url: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&q=80", submittedAt: "14/06/2026" },
      diploma: { name: "CERTIDÃO_CUIDADOR_SENAC.pdf", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80", submittedAt: "14/06/2026" },
      backgroundCheck: { name: "NADA_CONSTA_FEDERAL_JOAO.pdf", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80", submittedAt: "14/06/2026" }
    }
  },
  // PENDING FOR INSTRUCTION CRITERIA
  {
    id: "user-pedro",
    email: "pedro@example.com",
    name: "Pedro Henrique Barbosa",
    phone: "(11) 97777-8888",
    role: "cuidador",
    status: "pending_approval",
    password: "senha",
    specialties: ["Cuidados Higiênicos", "Prevenção de Escaras", "Auxílio Alimentação"],
    dailyRate: 190,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    distance: "4.8 km",
    rating: 4.5,
    reviewsCount: 3,
    age: 30,
    gender: "Masculino",
    documents: {
      idCopy: { name: "PEDRO_BARBOSA_ID_COPY.jpg", url: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&q=80", submittedAt: "16/06/2026" },
      diploma: { name: "ESPECIALIZACAO_TECNICO_IDOSOS.pdf", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80", submittedAt: "16/06/2026" },
      backgroundCheck: { name: "CERTIDAO_CRIMES_SAO_PAULO.pdf", url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80", submittedAt: "16/06/2026" }
    }
  }
];

// Seed Initial Data
let logs: LogEntry[] = [
  {
    id: "log-1",
    time: "08:00",
    category: "medication",
    title: "Medicamento Administrado",
    description: "Losartana 50mg administrado com sucesso após o desjejum. Copo cheio de água (200ml).",
    by: "Cuidador João Pedro",
    status: "success",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "log-2",
    time: "08:15",
    category: "vital",
    title: "Aferição de Sinais Vitais",
    description: "Pressão Arterial: 12/8 mmHg (excelente), Frequência Cardíaca: 71 bpm, Oxigenação: 98%. Patient estável e comunicativo.",
    by: "Cuidador João Pedro",
    status: "info",
    timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000),
  },
  {
    id: "log-3",
    time: "09:30",
    category: "meal",
    title: "Café da Manhã Completo",
    description: "Mingau de aveia morno com fatias de mamão. Ingestão de 150ml de água de coco. Boa aceitação oral (100%).",
    by: "Cuidador João Pedro",
    status: "success",
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: "log-4",
    time: "11:00",
    category: "activity",
    title: "Caminhada e Mobilidade",
    description: "Caminhada de 15 minutos no pátio interno da residência com auxílio de andador. Sem sinais de fadiga ou tontura.",
    by: "Cuidador João Pedro",
    status: "success",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

const caregivers: Caregiver[] = [
  {
    id: "cg-1",
    name: "Maria Eduarda Ribeiro",
    role: "Técnica em Enfermagem & Cuidadora de Idosos",
    matchScore: 98,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    distance: "1.2 km",
    specialties: ["Injetáveis", "Cuidados Pós-Operatórios", "Pacientes com Alzheimer", "Sinais Vitais Complexos"],
    backgroundChecked: true,
    diplomaValidated: true,
    kycDone: true,
    dailyRate: 220,
    rating: 4.9,
    reviewsCount: 37,
    age: 29,
    gender: "Feminino",
  },
  {
    id: "cg-2",
    name: "João Pedro Santos",
    role: "Cuidador de Idosos & Socorrista Certificado",
    matchScore: 94,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    distance: "2.5 km",
    specialties: ["Transferência de Pacientes", "Alzheimer & Demência", "Auxílio em Fisioterapia", "Prevenção de Quedas"],
    backgroundChecked: true,
    diplomaValidated: true,
    kycDone: true,
    dailyRate: 180,
    rating: 4.8,
    reviewsCount: 24,
    age: 34,
    gender: "Masculino",
  },
  {
    id: "cg-3",
    name: "Ana Carolina Albuquerque",
    role: "Enfermeira Obstétrica & Cuidadora Pediátrica",
    matchScore: 89,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    distance: "3.1 km",
    specialties: ["Cuidados Infantis", "Primeiros Socorros Pediátricos", "Pós-parto & Recém-nascidos", "Paciente PCD"],
    backgroundChecked: true,
    diplomaValidated: true,
    kycDone: true,
    dailyRate: 250,
    rating: 5.0,
    reviewsCount: 19,
    age: 41,
    gender: "Feminino",
  }
];

let shifts: Shift[] = [
  {
    id: "shift-1",
    patientName: "Sr. Helvécio (Pai de Lucas)",
    patientAge: "78 anos",
    condition: "Alzheimer moderado e hipertensão sob controle",
    location: "Bairro Jardim Paulistano, São Paulo - SP (1.2 km)",
    schedule: "Hoje, das 08:00 às 18:00",
    rate: 187,
    requirements: ["Administração de Losartana", "Auxílio em andador", "Diário de Bordo active"],
    status: "in_progress",
    escrowStatus: "funded",
    logsCount: 4,
    caregiverName: "João Pedro Santos",
    contractorName: "Lucas Albuquerque"
  },
  {
    id: "shift-2",
    patientName: "Dona Dirce Castro",
    patientAge: "84 anos",
    condition: "Pós-operatório de fratura de fêmur (mobilidade reduzida)",
    location: "Bairro Pinheiros, São Paulo - SP (2.8 km)",
    schedule: "Amanhã, das 09:00 às 19:00",
    rate: 212,
    requirements: ["Prevenção de escaras", "Monitoramento de curativos", "Cuidados higiênicos", "Técnico em Enfermagem"],
    status: "available",
    escrowStatus: "pending",
    logsCount: 0,
    contractorName: "Família Castro"
  }
];

// Active Escrow Deposit Simulator
interface EscrowDeposit {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  feeAmount: number;
  status: "locked" | "disputed" | "released";
  lastUpdated: Date;
}

let escrows: EscrowDeposit[] = [
  {
    id: "esc-101",
    fromName: "Lucas Albuquerque (Família)",
    toName: "João Pedro Santos (Prestador)",
    amount: 220.00,
    feeAmount: 33.00,
    status: "locked",
    lastUpdated: new Date()
  }
];

// Private Message Simulator
interface PrivateMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  content: string;
  time: string;
  timestamp: Date;
}

let privateMessages: PrivateMessage[] = [
  {
    id: "pmsg-1",
    senderId: "user-joao",
    senderName: "João Pedro Santos",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    receiverId: "user-lucas",
    receiverName: "Lucas Albuquerque",
    content: "Olá Lucas! Já dei a medicação da tarde para o Sr. Helvécio e registrei no Diário de Bordo. Ele está descansando agora.",
    time: "14:15",
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: "pmsg-2",
    senderId: "user-lucas",
    senderName: "Lucas Albuquerque",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    receiverId: "user-joao",
    receiverName: "João Pedro Santos",
    content: "Excelente, João! Obrigado pela pontualidade. Estava olhando os batimentos e a saturação e estão ótimos no Diário.",
    time: "14:20",
    timestamp: new Date(Date.now() - 3600000 * 2 + 300000)
  },
  {
    id: "pmsg-3",
    senderId: "user-lucas",
    senderName: "Lucas Albuquerque",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    receiverId: "user-maria",
    receiverName: "Maria Eduarda Ribeiro",
    content: "Olá Maria Eduarda! Gostei muito das suas qualificações de enfermagem. Você tem disponibilidade para cobrir um plantão de final de semana quinzenal?",
    time: "11:30",
    timestamp: new Date(Date.now() - 3600000 * 5)
  },
  {
    id: "pmsg-4",
    senderId: "user-maria",
    senderName: "Maria Eduarda Ribeiro",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    receiverId: "user-lucas",
    receiverName: "Lucas Albuquerque",
    content: "Olá Lucas! Tenho sim, podemos alinhar sim. Com o Diário de Bordo Ativo e o Escrow do app a gente consegue planejar as vindas sem problemas.",
    time: "11:45",
    timestamp: new Date(Date.now() - 3600000 * 5 + 900000)
  }
];

// Community Chat Message Simulator
interface CommunityMessage {
  id: string;
  senderName: string;
  senderRole: "cuidador" | "contratante" | "adm";
  senderAvatar: string;
  content: string;
  time: string;
  channel: "cuidador" | "contratante";
}

let communityMessages: CommunityMessage[] = [
  // Caregivers Group Chat
  {
    id: "comm-1",
    senderName: "Maria Eduarda Ribeiro",
    senderRole: "cuidador",
    senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    content: "Pessoal, vocês já usaram o novo Diário de Bordo para rotina de medicação? Facilita muito mostrar para a família que as dosagens estão no horário certinho! ⏰",
    time: "10:30",
    channel: "cuidador"
  },
  {
    id: "comm-2",
    senderName: "João Pedro Santos",
    senderRole: "cuidador",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "Uso em todos os plantões! Lucas gosta muito de receber as atualizações fiduciárias ao vivo. O Escrow garante o nosso pagamento sem estresse.",
    time: "10:45",
    channel: "cuidador"
  },
  {
    id: "comm-3",
    senderName: "Ana Carolina Albuquerque",
    senderRole: "cuidador",
    senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    content: "Exatamente! Antigamente eu tomava muito calote fechando 'por fora'. A taxa de 15% da cuide.me vale cada centavo pelo seguro contra acidentes domésticos e pelo Escrow de garantia.",
    time: "11:05",
    channel: "cuidador"
  },
  // Employers / Hirers Group Chat
  {
    id: "comm-4",
    senderName: "Lucas Albuquerque",
    senderRole: "contratante",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    content: "Olá pessoal! Contratei o João Pedro Santos aqui pela plataforma para cuidar do meu pai (Sr. Helvécio) e a experiência está sendo fantástica. Alguém já contratou a Maria Eduarda?",
    time: "09:15",
    channel: "contratante"
  },
  {
    id: "comm-5",
    senderName: "Mariana Fonseca",
    senderRole: "contratante",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    content: "Sim, Lucas! A Maria Eduarda cuidou do pós-operatório da minha mãe mês passado. Super pontual, o COREN dela está todo validado aqui pelo app do cuide.me. Altamente qualificada!",
    time: "09:32",
    channel: "contratante"
  },
  {
    id: "comm-6",
    senderName: "Lucas Albuquerque",
    senderRole: "contratante",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    content: "Excelente! É muito bom ter essa checagem policial de antecedentes criminais ativa antes de colocar alguém em casa. Dá uma paz de espírito sem igual.",
    time: "09:40",
    channel: "contratante"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy-loaded Gemini SDK setup
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not defined in environment variables. Ensure it is configured in Secrets.");
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || "dummy-key-for-now",
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // --- AUTHENTICATION ENDPOINTS ---

  app.post("/api/auth/register", (req, res) => {
    const { email, name, phone, role, password, specialties, dailyRate, avatar, age, gender, patientName, patientAge, patientCondition } = req.body;
    
    if (!email || !name || !phone || !password) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    // Check pre-existence
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "E-mail ou login já cadastrado no sistema." });
    }

    const isCaregiver = role === "cuidador";
    
    // Core rule requirement: Caregiver registration demands uploading mock documents (provided here default mock metadata)
    const newUserId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: newUserId,
      email,
      name,
      phone,
      role: role || "contratante",
      status: isCaregiver ? "pending_approval" : "approved",
      password,
      dailyRate: dailyRate ? Number(dailyRate) : (isCaregiver ? 180 : undefined),
      specialties: specialties || (isCaregiver ? ["Cuidados Gerais", "Acompanhamento"] : undefined),
      avatar: avatar || (isCaregiver 
        ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" 
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"),
      distance: isCaregiver ? "3.5 km" : undefined,
      rating: isCaregiver ? 5.0 : undefined,
      reviewsCount: isCaregiver ? 0 : undefined,
      age: age ? Number(age) : (isCaregiver ? 30 : undefined),
      gender: gender || (isCaregiver ? "Feminino" : undefined),
      patientName: isCaregiver ? undefined : patientName,
      patientAge: isCaregiver ? undefined : patientAge,
      patientCondition: isCaregiver ? undefined : patientCondition
    };

    if (isCaregiver) {
      // Build mandatory files structure for pending caregivers so the administrator views it
      newUser.documents = {
        idCopy: {
          name: `DOCUMENTO_RG_CPF_${name.toUpperCase().replace(/\s+/g, "_")}.pdf`,
          url: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&q=80",
          submittedAt: new Date().toLocaleDateString("pt-BR")
        },
        diploma: {
          name: `DIPLOMA_TECNICO_${name.toUpperCase().replace(/\s+/g, "_")}.pdf`,
          url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80",
          submittedAt: new Date().toLocaleDateString("pt-BR")
        },
        backgroundCheck: {
          name: `CERTIDAO_CRIMINAL_ANTECEDENTES_${name.toUpperCase().replace(/\s+/g, "_")}.pdf`,
          url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80",
          submittedAt: new Date().toLocaleDateString("pt-BR")
        }
      };
    }

    users.push(newUser);

    // Send a system activity feed log
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: isCaregiver ? "Novo Cuidador em Validação" : "Nova Família Cadastrada",
      description: isCaregiver 
        ? `O profissional ${name} solicitou cadastro. Status: Em espera de aprovação do administrador.`
        : `A contratante ${name} ingressou na cuide.me e está apta para postar plantões e depositar em Escrow.`,
      by: "Sistema cuide.me",
      status: isCaregiver ? "warning" : "success",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.status(201).json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, status: newUser.status } });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail/Login e Senha são obrigatórios." });
    }

    // Special admin logic: login `administrador` + password `adm4002`
    if (email.trim() === "administrador" && password.trim() === "adm4002") {
      const adminUser = users.find(u => u.role === "adm");
      if (adminUser) {
        return res.json({ success: true, user: adminUser });
      } else {
        // Fallback recreate admin if missing
        const freshAdmin: UserProfile = {
          id: "user-adm",
          email: "administrador",
          name: "Administrador Geral",
          phone: "(11) 99999-4002",
          role: "adm",
          status: "approved",
          password: "adm4002"
        };
        users.push(freshAdmin);
        return res.json({ success: true, user: freshAdmin });
      }
    }

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return res.status(401).json({ error: "Credenciais inválidas. Verifique seu login e senha." });
    }

    // Separated login validation: o admin ("adm") entra por qualquer um.
    if (found.role !== "adm" && role && found.role !== role) {
      const roleText = role === "contratante" ? "Família (Contratante)" : "Cuidador";
      const userRoleText = found.role === "contratante" ? "Família (Contratante)" : "Cuidador";
      return res.status(403).json({
        error: `Este usuário é um ${userRoleText}. Por favor, acesse a aba correta para entrar.`
      });
    }

    res.json({ success: true, user: found });
  });

  // --- ADMIN RESTRICTED ENDPOINTS ---

  app.get("/api/admin/users", (req, res) => {
    // Returns full registered list of users
    res.json(users);
  });

  app.post("/api/admin/approve-caregiver", (req, res) => {
    const { id } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Cuidador não encontrado no cadastro." });
    }

    const caregiverUser = users[userIndex];
    caregiverUser.status = "approved";

    // Append authorized caregiver into standard available caregivers marketplace pool list
    const isAlreadyInPool = caregivers.some(cg => cg.id === id);
    if (!isAlreadyInPool) {
      caregivers.push({
        id: caregiverUser.id,
        name: caregiverUser.name,
        role: caregiverUser.specialties ? caregiverUser.specialties[0] + " & Cuidador" : "Cuidador de Idosos Certificado",
        matchScore: 90 + Math.floor(Math.random() * 10), // Give high matched score dynamically
        avatar: caregiverUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        distance: caregiverUser.distance || "3.5 km",
        specialties: caregiverUser.specialties || ["Cuidados Gerais", "Sinais Vitais"],
        backgroundChecked: true,
        diplomaValidated: true,
        kycDone: true,
        dailyRate: caregiverUser.dailyRate || 180,
        rating: caregiverUser.rating || 5.0,
        reviewsCount: caregiverUser.reviewsCount || 0,
        age: caregiverUser.age,
        gender: caregiverUser.gender
      });
    }

    // Add log
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: "Cadastro de Cuidador Validado",
      description: `O Administrador aprovou a conta de ${caregiverUser.name}. Diploma e antecedentes criminais foram auditados e o cuidador agora está visível no marketplace e habilitado para plantões.`,
      by: "Sistema cuide.me",
      status: "success",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.json({ success: true, user: caregiverUser });
  });

  app.post("/api/admin/reject-caregiver", (req, res) => {
    const { id } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Cuidador não encontrado no cadastro." });
    }

    const caregiverUser = users[userIndex];
    caregiverUser.status = "rejected";

    // Remove from matching marketplace pool as well
    const poolIndex = caregivers.findIndex(cg => cg.id === id);
    if (poolIndex !== -1) {
      caregivers.splice(poolIndex, 1);
    }

    // Add log
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: "Cadastro de Cuidador Rejeitado",
      description: `O Administrador reprovou a conta e os documentos de ${caregiverUser.name} devido a falha na verificação de autenticidade documental.`,
      by: "Administração cuide.me",
      status: "alert",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.json({ success: true, user: caregiverUser });
  });

  app.post("/api/admin/dismiss-caregiver", (req, res) => {
    const { id, reason } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Cuidador não encontrado no cadastro." });
    }

    const caregiverUser = users[userIndex];
    caregiverUser.status = "suspended";

    // Remove from matching marketplace pool immediately
    const poolIndex = caregivers.findIndex(cg => cg.id === id);
    if (poolIndex !== -1) {
      caregivers.splice(poolIndex, 1);
    }

    // Add log entry detailing the offboarding/termination
    const reasonText = reason || "Desligamento administrativo preventivo de conformidade ou inatividade";
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: "Desligamento de Cuidador Executado",
      description: `O cuidador ${caregiverUser.name} foi desligado da plataforma pelo Administrador. Motivo: ${reasonText}. Sua conta foi suspensa e ele foi deslistado do marketplace de novos plantões.`,
      by: "Administração cuide.me",
      status: "alert",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.json({ success: true, user: caregiverUser });
  });

  // --- STANDARD APPLICATION ENDPOINTS ---

  // 1. Digital Logbook API
  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  app.post("/api/logs", (req, res) => {
    const { category, title, description, by, status, time } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const now = new Date();
    const formattedTime = time || now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: formattedTime,
      category: category || "activity",
      title,
      description,
      by: by || "Prestador cuide.me",
      status: status || "info",
      timestamp: now,
    };

    logs.unshift(newLog);

    // Update in_progress shift logs counter
    shifts = shifts.map(sh => {
      if (sh.status === "in_progress") {
        return { ...sh, logsCount: sh.logsCount + 1 };
      }
      return sh;
    });

    res.status(201).json(newLog);
  });

  app.delete("/api/logs/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = logs.length;
    logs = logs.filter(log => log.id !== id);
    if (logs.length < initialLength) {
      // Decrement shifts log count if there is an active shift
      shifts = shifts.map(sh => {
        if (sh.status === "in_progress" && sh.logsCount > 0) {
          return { ...sh, logsCount: sh.logsCount - 1 };
        }
        return sh;
      });
      return res.json({ success: true, message: "Log excluído com sucesso." });
    }
    return res.status(404).json({ error: "Log não encontrado." });
  });

  // 2. Caregivers & Matching API
  app.get("/api/caregivers", (req, res) => {
    res.json(caregivers);
  });

  // 3. Shifts Feed & System State API
  app.get("/api/shifts", (req, res) => {
    res.json(shifts);
  });

  app.post("/api/shifts/accept", (req, res) => {
    const { id, caregiverName } = req.body;
    const shift = shifts.find(sh => sh.id === id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found." });
    }

    if (shift.status !== "available") {
      return res.status(400).json({ error: "Shift is already taken or finished." });
    }

    // Accept shifts logic
    shifts = shifts.map(sh => {
      if (sh.id === id) {
        return {
          ...sh,
          status: "in_progress",
          escrowStatus: "funded",
          caregiverName: caregiverName || "João Pedro Santos",
          contractorName: sh.contractorName || "Família Contratante"
        };
      }
      return sh;
    });

    // Create a funded Escrow record
    const newEscrow: EscrowDeposit = {
      id: `esc-${Date.now()}`,
      fromName: "Família Contratante",
      toName: caregiverName || "Prestador Atribuído",
      amount: Math.round(shift.rate / 0.85),
      feeAmount: Math.round((shift.rate / 0.85) * 0.15),
      status: "locked",
      lastUpdated: new Date()
    };
    escrows.push(newEscrow);

    // Append system automated log
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: "Garantia de Plantão Ativada",
      description: `O Cuidador ${caregiverName || "certificado"} aceitou o plantão. Os fundos de R$ ${(shift.rate / 0.85).toFixed(2)} foram garantidos em Escrow e a apólice de seguro contra acidentes domésticos foi emitida automaticamente.`,
      by: "Sistema cuide.me",
      status: "success",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.json({ success: true, updatedShift: shifts.find(sh => sh.id === id) });
  });

  app.post("/api/shifts/complete", (req, res) => {
    const { id } = req.body;
    const shift = shifts.find(sh => sh.id === id);
    if (!shift) {
      return res.status(404).json({ error: "Shift not found." });
    }

    shifts = shifts.map(sh => {
      if (sh.id === id) {
        return {
          ...sh,
          status: "completed",
          escrowStatus: "released"
        };
      }
      return sh;
    });

    // Release escrows
    escrows = escrows.map(esc => {
      return { ...esc, status: "released", lastUpdated: new Date() };
    });

    // Append completed log
    const systemLog: LogEntry = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      category: "system",
      title: "Plantão Concluído & Escrow Liberado",
      description: "Diário de bordo finalizado e aceito pela família. Pagamento creditado e disponível na carteira virtual do cuidador.",
      by: "Financeiro cuide.me",
      status: "success",
      timestamp: new Date()
    };
    logs.unshift(systemLog);

    res.json({ success: true, updatedShift: shifts.find(sh => sh.id === id) });
  });

  app.get("/api/escrow", (req, res) => {
    res.json(escrows);
  });

  // --- COMMUNITY CHAT ENDPOINTS ---
  app.get("/api/chat/community", (req, res) => {
    res.json(communityMessages);
  });

  app.post("/api/chat/community", (req, res) => {
    const { senderName, senderRole, senderAvatar, content, channel } = req.body;
    if (!content || !channel) {
      return res.status(400).json({ error: "Content and channel are required." });
    }

    const newMessage: CommunityMessage = {
      id: `comm-${Date.now()}`,
      senderName: senderName || "Usuário Anônimo",
      senderRole: senderRole || "contratante",
      senderAvatar: senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      content,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      channel
    };

    communityMessages.push(newMessage);
    res.status(201).json(newMessage);
  });

  // --- PRIVATE CHAT ENDPOINTS ---
  app.get("/api/chat/private", (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const filtered = privateMessages.filter(
        msg => msg.senderId === userId || msg.receiverId === userId
      );
      return res.json(filtered);
    }
    res.json(privateMessages);
  });

  app.post("/api/chat/private", (req, res) => {
    const { senderId, senderName, senderAvatar, receiverId, receiverName, content } = req.body;
    if (!content || !senderId || !receiverId) {
      return res.status(400).json({ error: "Sender ID, Receiver ID, and Content are required." });
    }

    const newMessage: PrivateMessage = {
      id: `priv-${Date.now()}`,
      senderId,
      senderName: senderName || "Usuário",
      senderAvatar: senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80",
      receiverId,
      receiverName: receiverName || "Destinatário",
      content,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date()
    };

    privateMessages.push(newMessage);
    res.status(201).json(newMessage);
  });

  // 4. Coprehensive intelligent Gemini Assistant API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, role, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const client = getGeminiClient();
      const userRole = role === "prestador" ? "PRESTADOR (CUIDADOR)" : "CONTRATANTE (A FAMÍLIA)";

      const systemInstruction = `Você é o motor de inteligência e assistente virtual do aplicativo "cuide.me".
Sua principal função é atuar na plataforma de marketplace e gestão de rotinas de saúde, conectando famílias a cuidadores certificados (atendendo idosos, PCDs, pós-operatório e infantil).
Seu objetivo é mitigar o estresse das contratações informais, garantindo segurança jurídica, previsibilidade operacional e tranquilidade familiar.

DIVERSIDADE DE SINTONIA: Você deve identificar e sintonizar seu tom de voz de acordo com o lado do marketplace que está interagindo. O usuário que está conversando com você atualmente é classificado como: ${userRole}.

## SE O USUÁRIO FOR A CONTRATANTE (A FAMÍLIA)
- Perfil: Pessoas com rotina intensa (ex: corporativa), sobrecarregadas física e mentalmente, que buscam profissionais validados para cuidar de familiares à distância.
- Dores a resolver: Medo de maus-tratos/negligência, falta de relatórios confiáveis e necessidade de substituição de emergência.
- Tom de Voz: Acolhedor, empático, transparente e focado em transmitir auditoria e confiança.

## SE O USUÁRIO FOR O PRESTADOR (O CUIDADOR PROFISSIONAL)
- Perfil: Profissionais de saúde autônomos (técnicos em enfermagem, cuidadores de idosos) buscando estabilidade e captação de clientes.
- Dores a resolver: Inadimplência, longos períodos sem contratos e desvios de função no ambiente doméstico.
- Tom de Voz: Parceiro, profissional, focado na valorização técnica e na garantia de recebimento pontual.

## REGRAS DE NEGÓCIO E RESTRIÇÕES MANDATÓRIAS (CRÍTICAS)
1. Proibição Médica: Nunca forneça diagnósticos, avaliações de saúde de caráter clínico, nem altere dosagens de medicamentos ou prescreva substâncias. Se o usuário questionar ou tentar alterar prescrições, avise que isso transgride os padrões de biossegurança de um cuidador cuide.me e sugira contato imediato com o médico responsável do paciente para retificar receita.
2. Retenção na Plataforma: Se houver qualquer indício, menção ou sugestão de tentar fechar contrato ou combinar pagamento "por fora" do aplicativo, reforce imediatamente os benefícios gigantescos de se manter no app:
   - Proteção do Escrow (Pagamento retido em conta de garantia do app e liberado de forma justa).
   - Seguro de Acidentes Domésticos exclusivo.
   - Respaldo jurídico e suporte do plantão para prevenção contra desvio de função.
   - Adiantamento de recebíveis e histórico reputacional para novos contratos.
3. Valor de Monetização: Diga que a taxa de 15% cobrada pela cuide.me é investida diretamente na triagem de antecedentes (policial, civil, de crédito), validação de diplomas/COREN junto a conselhos de classe, seguro contra acidentes domésticos e no desenvolvimento tecnológico do Diário de Bordo Digital em tempo real.

## FORMATO DE RESPOSTA EXCLUSIVO (MANDATÓRIO)
Sua resposta DEVE SEMPRE possuir estritamente o formato estrutural abaixo em Markdown, sem adição de textos de introdução ou de conclusão que fujam destas tags:

**Resumo Empático:** [Escreva aqui uma única frase que resuma de forma acolhedora a dor, dúvida ou comemoração declarada pelo usuário]

**Solução cuide.me:**
- [Ponto 1: Apresente de forma direta uma solução da cuide.me relacionada a Diário de Bordo, Escrow ou Conexão Curada]
- [Ponto 2: Explique o funcionamento prático deste recurso e como protege o usuário]
- [Ponto 3: Um terceiro ganho indiscutível (como seguro, validações ou antecedente comprovado)]

**Próximo Passo:** [Chamada para ação ultra direta do que ele deve clicar ou fazer na tela, de acordo com o contexto. Exemplos: "Acesse o Diário de Bordo", "Busque um cuidador cadastrado", "Verifique o saldo no extrato", "Atualize seus diplomas no Perfil"]

Responda sempre com clareza, em português do Brasil, sem gírias corporativas duras ou termos excessivamente distantes, abraçando calorosamente o problema do usuário.`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const h of history) {
          contents.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (e: any) {
      console.error("Gemini Error:", e);
      res.status(500).json({ error: e.message || "Erro na inteligência artificial." });
    }
  });

  // Serve static assets in production or use Vite dev server in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
