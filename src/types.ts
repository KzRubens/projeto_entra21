export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "contratante" | "cuidador" | "adm";
  status: "pending_approval" | "approved" | "rejected" | "suspended";
  
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

export interface LogEntry {
  id: string;
  time: string;
  category: "medication" | "meal" | "activity" | "vital" | "occurrence" | "system";
  title: string;
  description: string;
  by: string;
  status: "success" | "warning" | "info" | "alert";
  timestamp: string;
}

export interface Caregiver {
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

export interface Shift {
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

export interface EscrowDeposit {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  feeAmount: number;
  status: "locked" | "disputed" | "released";
  lastUpdated: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export interface CommunityMessage {
  id: string;
  senderName: string;
  senderRole: "cuidador" | "contratante" | "adm";
  senderAvatar: string;
  content: string;
  time: string;
  channel: "cuidador" | "contratante";
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  content: string;
  time: string;
  timestamp: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: string;
  condition: string;
  weight?: string;
  avatar?: string;
  pressure?: string;
  heartRate?: string;
  mood?: string;
  waterCups?: number;
  medsCount?: number;
}



