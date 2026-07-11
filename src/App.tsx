import React, { useState } from 'react';
import { 
  Activity, Wind, Sparkles, Brain, Zap, Shield, Sliders, HelpCircle, 
  Heart, HeartPulse, Trophy, Award, Check, X, ChevronLeft, ChevronRight, BookOpen, AlertCircle
} from 'lucide-react';
import { ModuleType, InteractiveMode } from './types';
import ECGModule, { ecgQuizCases } from './components/ECGModule';
import PFTModule, { pftQuizCases } from './components/PFTModule';
import EEGModule, { eegQuizCases } from './components/EEGModule';
import EMGModule, { emgQuizCases } from './components/EMGModule';
import UltrasoundModule, { ultrasoundQuizCases } from './components/UltrasoundModule';
import AITutor from './components/AITutor';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('ecg');
  const [activeMode, setActiveMode] = useState<InteractiveMode>('simulator');
  const [currentModuleData, setCurrentModuleData] = useState<Record<string, any>>({});

  // Mock license exam questions (10 questions, 2 from each of the 5 modules)
  const examQuestions = [
    { id: 1, module: 'ecg' as ModuleType, localIndex: 0, question: ecgQuizCases[0], scoreWeight: 10 },
    { id: 2, module: 'ecg' as ModuleType, localIndex: 1, question: ecgQuizCases[1], scoreWeight: 10 },
    { id: 3, module: 'pft' as ModuleType, localIndex: 0, question: pftQuizCases[0], scoreWeight: 10 },
    { id: 4, module: 'pft' as ModuleType, localIndex: 1, question: pftQuizCases[1], scoreWeight: 10 },
    { id: 5, module: 'eeg' as ModuleType, localIndex: 0, question: eegQuizCases[0], scoreWeight: 10 },
    { id: 6, module: 'eeg' as ModuleType, localIndex: 1, question: eegQuizCases[1], scoreWeight: 10 },
    { id: 7, module: 'emg' as ModuleType, localIndex: 0, question: emgQuizCases[0], scoreWeight: 10 },
    { id: 8, module: 'emg' as ModuleType, localIndex: 1, question: emgQuizCases[1], scoreWeight: 10 },
    { id: 9, module: 'ultrasound' as ModuleType, localIndex: 0, question: ultrasoundQuizCases[0], scoreWeight: 10 },
    { id: 10, module: 'ultrasound' as ModuleType, localIndex: 1, question: ultrasoundQuizCases[1], scoreWeight: 10 },
  ];

  // Exam-specific states
  const [examActive, setExamActive] = useState(false);
  const [examIdx, setExamIdx] = useState(0); // 0 to 9
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({}); // examIdx -> selectedOptionIndex
  const [examSubmitted, setExamSubmitted] = useState(false);

  const handleModuleDataChange = (data: Record<string, any>) => {
    setCurrentModuleData(data);
  };

  // Synchronize active module with currently selected exam question
  React.useEffect(() => {
    if (activeMode === 'exam' && examActive && !examSubmitted) {
      setActiveModule(examQuestions[examIdx].module);
    }
  }, [examIdx, activeMode, examActive, examSubmitted]);

  // Helper to render current active learning module
  const renderActiveModule = () => {
    const examQuestionIndex = activeMode === 'exam' && examActive
      ? examQuestions[examIdx].localIndex
      : undefined;

    switch (activeModule) {
      case 'ecg':
        return <ECGModule mode={activeMode} onStateChange={handleModuleDataChange} examQuestionIndex={examQuestionIndex} />;
      case 'pft':
        return <PFTModule mode={activeMode} onStateChange={handleModuleDataChange} examQuestionIndex={examQuestionIndex} />;
      case 'eeg':
        return <EEGModule mode={activeMode} onStateChange={handleModuleDataChange} examQuestionIndex={examQuestionIndex} />;
      case 'emg':
        return <EMGModule mode={activeMode} onStateChange={handleModuleDataChange} examQuestionIndex={examQuestionIndex} />;
      case 'ultrasound':
        return <UltrasoundModule mode={activeMode} onStateChange={handleModuleDataChange} examQuestionIndex={examQuestionIndex} />;
      default:
        return <div className="text-slate-400 p-8">請選擇一個學習主題。</div>;
    }
  };

  const getModuleNameInChinese = (module: ModuleType) => {
    switch (module) {
      case 'ecg': return '心電圖判讀';
      case 'pft': return '肺功能分析';
      case 'eeg': return '腦波觀測';
      case 'emg': return '肌電圖';
      case 'ultrasound': return '心臟超音波';
      default: return '';
    }
  };

  const renderExamContent = () => {
    if (!examActive) {
      // Exam Welcome / Setup Screen
      return (
        <div className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 max-w-2xl mx-auto my-4 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              臨床生理學專技高考綜合線上模擬考
            </h2>
            <p className="text-xs text-slate-400">
              根據考選部最新「醫學檢驗師」國家考試大綱設計之電生理學判讀試驗
            </p>
          </div>

          <div className="border-t border-b border-slate-800 py-5 text-left space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="p-1 bg-emerald-500/15 text-emerald-400 rounded mt-0.5"><Check className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white block">題數與比例：</strong>
                共 10 題臨床實例（心電圖、肺功能、腦波、肌電圖、心臟超音波各 2 題），每題 10 分，總分 100 分。
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="p-1 bg-emerald-500/15 text-emerald-400 rounded mt-0.5"><Check className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white block">即時電生理波形渲染：</strong>
                本考試採用真實電生理掃描模擬，而非死記硬背之圖片。考生須仔細讀取示波器、肺計量儀及超音波影像。
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="p-1 bg-emerald-500/15 text-emerald-400 rounded mt-0.5"><Check className="w-3.5 h-3.5" /></span>
              <div>
                <strong className="text-white block">規則與提交：</strong>
                考試無倒數計時壓力，您可以自由切換題目，反覆核對。交卷後將進行自動評分，並提供詳盡診斷報告。
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setExamActive(true);
              setExamIdx(0);
              setExamAnswers({});
              setExamSubmitted(false);
              setActiveModule(examQuestions[0].module);
            }}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <BookOpen className="w-5 h-5" />
            開始模擬考並進入 CBT 系統
          </button>
        </div>
      );
    }

    if (examSubmitted) {
      // Exam Results Screen
      const score = Object.keys(examAnswers).reduce((acc, key) => {
        const idx = parseInt(key);
        const isCorrect = examAnswers[idx] === examQuestions[idx].question.correctAnswerIndex;
        return acc + (isCorrect ? 10 : 0);
      }, 0);

      const isPassed = score >= 60;

      return (
        <div className="space-y-6 p-1">
          {/* Scoreboard Card */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                🎓 模擬國考評分報告
              </div>
              <h2 className="text-xl font-bold text-white">臨床生理學與病理學綜合模考</h2>
              <p className="text-xs text-slate-400">
                115 年度第二次專門職業及技術人員高等考試醫事檢驗師
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 min-w-[120px]">
                <span className="text-[10px] text-slate-400 block font-mono">得分 / 總分</span>
                <strong className={`text-3xl font-mono ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {score} <span className="text-xs text-slate-500">/ 100</span>
                </strong>
              </div>
              <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 min-w-[120px]">
                <span className="text-[10px] text-slate-400 block font-mono">判定結果</span>
                <strong className={`text-lg block font-semibold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPassed ? '🎉 恭喜及格' : '❌ 未達及格線'}
                </strong>
              </div>
            </div>
          </div>

          {/* Feedback & Retake Option */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-300">
              {isPassed ? (
                <span className="text-emerald-400 font-medium">優異！您的生理學基礎非常紮實，具備臨床醫檢師之卓越生理學判讀實力！</span>
              ) : (
                <span className="text-amber-400 font-medium">加油！及格標準為 60 分。請利用下方題庫詳解或諮詢 AI 導師補強弱項。</span>
              )}
            </div>
            <button
              onClick={() => {
                setExamActive(false);
                setExamSubmitted(false);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0"
            >
              重新開始/重置測驗
            </button>
          </div>

          {/* Question List Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-1.5 px-1">
              <Award className="w-4 h-4 text-emerald-400" />
              試題明細與精準臨床解析
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {examQuestions.map((q, idx) => {
                const userChoice = examAnswers[idx];
                const isCorrect = userChoice === q.question.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCorrect 
                        ? 'bg-slate-900/50 border-emerald-500/15' 
                        : 'bg-slate-900/50 border-rose-500/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            q.module === 'ecg' ? 'bg-emerald-500/10 text-emerald-400' :
                            q.module === 'pft' ? 'bg-amber-500/10 text-amber-400' :
                            q.module === 'eeg' ? 'bg-cyan-500/10 text-cyan-400' :
                            q.module === 'emg' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-fuchsia-500/10 text-fuchsia-400'
                          }`}>
                            Q{idx + 1} {getModuleNameInChinese(q.module)}
                          </span>
                          <span className="text-xs font-bold text-slate-200">{q.question.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 italic">{q.question.caseDescription}</p>
                      </div>

                      <div>
                        {isCorrect ? (
                          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                            <Check className="w-4 h-4" /> 答對 (+10)
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold text-xs flex items-center gap-1">
                            <X className="w-4 h-4" /> 答錯 (0)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3 pt-3 border-t border-slate-800/60">
                      <div className="space-y-1.5 text-slate-300">
                        <div>您的答案：<span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{userChoice !== undefined ? q.question.options[userChoice] : '未作答'}</span></div>
                        <div>正確答案：<span className="text-emerald-400 font-semibold">{q.question.options[q.question.correctAnswerIndex]}</span></div>
                      </div>

                      <div className="flex items-end justify-end gap-2">
                        <button
                          onClick={() => {
                            // Load question waveform and select module
                            setExamSubmitted(false);
                            setExamIdx(idx);
                            setActiveModule(q.module);
                            // Let the tutor know by changing current data
                            handleModuleDataChange({
                              questionId: q.question.id,
                              title: q.question.title,
                              parameters: q.question.parameters,
                              userSelected: userChoice,
                              isCorrect: isCorrect
                            });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                        >
                          🔬 載入即時波形
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/40 text-[11px] text-slate-400 mt-3 space-y-1">
                      <div className="text-slate-300 font-semibold">【國考解析與臨床思維】</div>
                      <p>{q.question.explanation}</p>
                      {q.question.clinicalSignificance && (
                        <p className="text-emerald-400/80"><strong className="text-emerald-400">臨床技術點撥：</strong>{q.question.clinicalSignificance}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Exam Active, taking test
    const currentQuestion = examQuestions[examIdx];
    const userSelectedOption = examAnswers[examIdx];

    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: Case, Waveform Viewer (7 cols on md) */}
        <div className="md:col-span-7 flex flex-col space-y-4">
          {/* Clinical Case Description Card */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                臨床試題題組 {examIdx + 1} / 10
              </span>
              <span className="text-xs font-semibold text-slate-400">
                學科：{getModuleNameInChinese(currentQuestion.module)}
              </span>
            </div>
            
            <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">
              {currentQuestion.question.title}
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
              {currentQuestion.question.caseDescription}
            </p>
          </div>

          {/* Active wave monitor */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-0.5">
            {renderActiveModule()}
          </div>
        </div>

        {/* Right Column: CBT Question Navigator & Radio Options (5 cols on md) */}
        <div className="md:col-span-5 flex flex-col space-y-4">
          
          {/* CBT Question Grid Navigator */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
            <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              國考 CBT 試題卡
            </h4>
            <div className="grid grid-cols-5 gap-1.5">
              {examQuestions.map((q, idx) => {
                const isAnswered = examAnswers[idx] !== undefined;
                const isActive = examIdx === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setExamIdx(idx);
                      setActiveModule(q.module);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 ring-2 ring-emerald-500/20' 
                        : isAnswered
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-500'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Options Card */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col shadow-md">
            <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              臨床診斷選項
            </h4>

            <div className="space-y-2 flex-1">
              {currentQuestion.question.options.map((opt, oIdx) => {
                const isSelected = userSelectedOption === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      setExamAnswers(prev => ({ ...prev, [examIdx]: oIdx }));
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs font-medium border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                        : 'bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 ${
                      isSelected ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5' : 'border-slate-700 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls inside Options Card */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between gap-2">
              <button
                disabled={examIdx === 0}
                onClick={() => setExamIdx(prev => prev - 1)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                上一題
              </button>

              {examIdx < 9 ? (
                <button
                  onClick={() => setExamIdx(prev => prev + 1)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                >
                  下一題
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const unansweredCount = 10 - Object.keys(examAnswers).length;
                    if (unansweredCount > 0) {
                      if (!confirm(`⚠️ 尚有 ${unansweredCount} 題未作答！確定要交卷評分嗎？`)) {
                        return;
                      }
                    }
                    setExamSubmitted(true);
                  }}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md"
                >
                  結束測驗並交卷
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header/Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                臨床生理學學習平台
                <span className="text-[10px] font-mono font-normal bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                  CLS Edition v1.2
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">醫學檢驗與臨床生理技術互動培訓中心</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10.5px] text-slate-500 font-mono hidden md:inline">
              心電圖 • 肺功能 • 腦波 • 肌電圖 • 心臟超音波
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Learning Dashboard (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col space-y-5" id="learning-dashboard-panel">
          
          {/* Theme Selector Tab Bar (Hides in Exam mode to prevent accidental navigation) */}
          {activeMode !== 'exam' && (
            <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800/80 grid grid-cols-5 gap-1 shadow-md">
              {/* ECG */}
              <button
                onClick={() => {
                  setActiveModule('ecg');
                  setCurrentModuleData({});
                }}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModule === 'ecg'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                id="tab-ecg"
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs">心電圖判讀</span>
              </button>

              {/* PFT */}
              <button
                onClick={() => {
                  setActiveModule('pft');
                  setCurrentModuleData({});
                }}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModule === 'pft'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                id="tab-pft"
              >
                <Wind className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs">肺功能分析</span>
              </button>

              {/* EEG */}
              <button
                onClick={() => {
                  setActiveModule('eeg');
                  setCurrentModuleData({});
                }}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModule === 'eeg'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                id="tab-eeg"
              >
                <Brain className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs">腦波觀測</span>
              </button>

              {/* EMG */}
              <button
                onClick={() => {
                  setActiveModule('emg');
                  setCurrentModuleData({});
                }}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModule === 'emg'
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                id="tab-emg"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs">肌電圖</span>
              </button>

              {/* Ultrasound */}
              <button
                onClick={() => {
                  setActiveModule('ultrasound');
                  setCurrentModuleData({});
                }}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModule === 'ultrasound'
                    ? 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
                id="tab-ultrasound"
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span className="text-[10px] sm:text-xs">心臟超音波</span>
              </button>
            </div>
          )}

          {/* Mode Selector (Simulator vs Quiz vs Exam) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">學習單元模式：</span>
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => {
                    setActiveMode('simulator');
                    setCurrentModuleData({});
                    setExamActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeMode === 'simulator'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="mode-simulator"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  動態參數模擬器
                </button>
                <button
                  onClick={() => {
                    setActiveMode('quiz');
                    setCurrentModuleData({});
                    setExamActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeMode === 'quiz'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="mode-quiz"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  診斷案例測驗
                </button>
                <button
                  onClick={() => {
                    setActiveMode('exam');
                    setCurrentModuleData({});
                  }}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    activeMode === 'exam'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="mode-exam"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  模擬國家考試
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              {activeMode === 'simulator' && '💡 請拉動滑桿改變電生理參數，並觀察即時顯示波形'}
              {activeMode === 'quiz' && '📝 請結合臨床病史，選出最符合當前波形的診斷結果'}
              {activeMode === 'exam' && '🏆 CBT 國家考試系統：多學科綜合測驗（限時生理學判讀）'}
            </div>
          </div>

          {/* Module Content Viewport / Exam Viewport */}
          {activeMode === 'exam' ? (
            <div className="flex-1" id="exam-dashboard-viewport">
              {renderExamContent()}
            </div>
          ) : (
            <div className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-0.5" id="module-content-viewport">
              {renderActiveModule()}
            </div>
          )}
        </div>

        {/* Right Side: AI Mentor (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col h-[650px] lg:h-auto min-h-[500px]" id="ai-mentor-panel">
          <AITutor
            currentModule={activeModule}
            currentMode={activeMode}
            currentData={currentModuleData}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-[10.5px] space-y-1">
          <p>© 2026 臨床生理學學習平台 • 醫技專用智慧教學工具</p>
          <p>
            結合電生理、阻抗與聲學模型即時渲染，搭配 <strong className="text-slate-400">Gemini 3.5 Flash</strong> 臨床思維引導
          </p>
        </div>
      </footer>
    </div>
  );
}
