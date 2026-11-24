export type DiseaseCategory = 'hemorrhoid' | 'fistula' | 'abscess' | 'complication';
export type DifficultyLevel = 'assistant_gp' | 'visiting_doctor'; // 助理全科 / 进修医生
export type TabId = 'overview' | 'cases' | 'surgery' | 'anatomy' | 'complications' | 'library' | 'records';

export interface CaseQuestion {
  id: string;
  stageLabel: string; // e.g. "第一步：临床诊断与分型"
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalPearl: string;
}

export interface ClinicalCase {
  id: string;
  code: string;
  title: string;
  category: Exclude<DiseaseCategory, 'complication'>;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  patientInfo: {
    age: number;
    gender: '男' | '女';
    occupation?: string;
    chiefComplaint: string;
  };
  history: string;
  physicalExam: {
    position: string; // e.g. "截石位"
    inspection: string;
    palpation: string;
    anoscopy?: string;
  };
  auxiliaryExam: string;
  tags: string[];
  keyTakeaways: string[];
  questions: CaseQuestion[];
}

export interface AnatomyStructure {
  id: string;
  name: string;
  englishName: string;
  category: 'landmark' | 'muscle' | 'space' | 'vascular';
  summary: string;
  clinicalSignificance: string;
  surgicalWarning?: string;
  aboveVsBelow?: {
    above: string;
    below: string;
  };
}

export interface ParksFistulaType {
  id: 'intersphincteric' | 'transsphincteric' | 'suprasphincteric' | 'extrasphincteric';
  name: string;
  englishName: string;
  proportion: string;
  pathDescription: string;
  surgicalStrategy: string;
  riskLevel: '低' | '中' | '高';
}

export interface ComplicationDrill {
  id: string;
  title: string;
  postOpDay: string;
  priorSurgery: string;
  difficulty: DifficultyLevel;
  scenario: string;
  vitalsAndSigns: string;
  question: string;
  options: string[];
  correctIndex: number;
  immediateAction: string;
  contraindication: string;
  teachingExplanation: string;
}

export interface SurgeryChallenge {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  patientSummary: string;
  keyFindings: string[];
  options: {
    name: string;
    isRecommended: boolean;
    rationale: string;
  }[];
  correctIndex: number;
  indicationSummary: string;
}

export interface AssessmentAttempt {
  id: string;
  timestamp: string;
  module: 'cases' | 'surgery' | 'complications';
  itemId: string;
  itemTitle: string;
  category: DiseaseCategory;
  score: number;
  maxScore: number;
  wrongQuestionPrompts: string[];
}

export interface TraineeProfile {
  name: string;
  role: '进修医生' | '助理全科医生' | '规培医师';
  department: string;
  hospital: string;
}

export interface AppProgressState {
  profile: TraineeProfile;
  attempts: AssessmentAttempt[];
  bookmarkedIds: string[];
}
