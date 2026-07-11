export type ModuleType = 'ecg' | 'pft' | 'eeg' | 'emg' | 'ultrasound';

export type InteractiveMode = 'simulator' | 'quiz' | 'exam';

export interface QuizQuestion {
  id: string;
  category: ModuleType;
  title: string;
  caseDescription: string;
  // Dynamic parameters for the simulator to draw the pathological waveform
  parameters: Record<string, number>;
  // Multiple choice options
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  clinicalSignificance: string;
  isVT?: number;
  isAfib?: number;
  isAlphaBlock?: number;
  isAbsence?: number;
  isMuscleArtifact?: number;
  isMS?: number;
  isDD?: number;
  isAFib?: number;
  isAFlutter?: number;
  isMobitzI?: number;
  isMobitzII?: number;
  isThirdDegreeAVB?: number;
  isRBBB?: number;
  isLBBB?: number;
  isHyperkalemia?: number;
  isHypokalemia?: number;
  isWPW?: number;
  isBrugada?: number;
  isLQTS?: number;
  isTdP?: number;
  isDigitalis?: number;
  isAnteriorSTEMI?: number;
  isPericarditis?: number;
  isPVC?: number;
  isPAC?: number;
  isHypercalcemia?: number;
  isHypocalcemia?: number;
  isAtrialEscape?: number;
  isVentricularEscape?: number;
  isIschemia?: number;
  isSinusArrhythmia?: number;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
