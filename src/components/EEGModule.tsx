import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Play, Pause, CheckCircle, AlertTriangle, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export interface EEGModuleProps {
  mode: 'simulator' | 'quiz' | 'exam';
  onStateChange: (data: Record<string, any>) => void;
  examQuestionIndex?: number;
}

export const eegQuizCases: QuizQuestion[] = [
  {
    id: 'eeg_q1',
    category: 'eeg',
    title: '典型失神性癲癇 (Absence Seizure)',
    caseDescription: '一位 8 歲小學二年級學童，老師反映他在課堂上經常突然「發呆」數秒至十秒，呼喚無反應，隨後又恢復正常活動，每天發作十多次。家長帶至兒科門診，安排清醒及過度換氣 (Hyperventilation) 誘發腦波檢查。',
    parameters: {
      alertness: 4, // Seizure state
      frequency: 3,
      amplitude: 150,
      noise: 10,
      isAbsence: 1
    },
    options: [
      '正常深睡期腦波反應 (Stage N3 Sleep)',
      '失神性癲癇發作 - 典型 3Hz 棘慢複合波 (Spike-and-Wave Discharges)',
      '顳葉癲癇發作 - 局部棘波 (Focal Spike Discharges)',
      '眨眼偽差干擾 (Blink Artifact)'
    ],
    correctAnswerIndex: 1,
    explanation: '腦波特徵呈現極具特徵性的「全腦對稱、同步、廣泛性 3Hz 棘慢複合波 (Generalized 3Hz Spike-and-Wave discharges)」，振幅極高，符合兒童「典型失神性癲癇 (Absence Seizure)」發作。該波形最容易被過度換氣所誘發。',
    clinicalSignificance: '醫檢師在執行腦波檢查時，應熟悉各項過度換氣、閃光刺激 (Photic stimulation) 等誘發試驗。一旦在畫面上觀察到此等高度同步的異常棘慢波，必須記錄發作期間患者的意識狀態（如請其複誦簡單辭彙），以協助評估神經功能損害。'
  },
  {
    id: 'eeg_q2',
    category: 'eeg',
    title: '清醒閉眼與張眼反應 (Alpha Block)',
    caseDescription: '一位 26 歲健康受試者，安靜躺在檢查床上，閉眼放鬆。醫檢師引導其「張開眼睛」保持清醒。觀察枕部 (Occipital) 導程波形的頻率與波幅變化。',
    parameters: {
      alertness: 1, // Relaxed eyes closed, transitions to open
      frequency: 10,
      amplitude: 50,
      noise: 5,
      isAlphaBlock: 1
    },
    options: [
      '癲癇放電波形 (Seizure spikes)',
      '阿爾法波阻斷現象 (Alpha Block / Alpha Attenuation)',
      '睡眠梭興波與 K 複合波 (Sleep Spindle & K-Complex)',
      '肌電偽差 (Muscle Artifact)'
    ],
    correctAnswerIndex: 1,
    explanation: '放鬆閉眼時，枕部（O1, O2）腦波以規則的 8-13 Hz Alpha 波（主導節律）為主。當受試者被要求「張開眼睛」或進行心算時，Alpha 波會立即被壓制，代之以低電壓、快速的 Beta 波（14-30 Hz），此現象稱為「Alpha 阻斷 (Alpha block / Alpha attenuation)」或「去同步化 (Desynchronization)」，證實受試者皮質功能與傳導路徑健全。',
    clinicalSignificance: 'Alpha 阻斷是評估清醒腦波基本背景節律（Background rhythm）的重要步驟。若一側出現不對稱或無 Alpha 阻斷，提示該側可能有結構性腦部病變。'
  },
  {
    id: 'eeg_q3',
    category: 'eeg',
    title: '重度深睡期（N3 睡眠）波形判定',
    caseDescription: '一位 30 歲男性接受整夜多功能睡眠生理檢查 (PSG)。在深夜兩點時，中央區 (Central) 與枕部 (Occipital) 腦波圖顯示持續出現極寬大、慢速的波浪狀背景，佔據整個畫面。',
    parameters: {
      alertness: 3, // Deep sleep
      frequency: 1.5,
      amplitude: 100,
      noise: 8
    },
    options: [
      'Stage N1 淺睡期（Theta 波主導）',
      'REM 快速動眼期（鋸齒狀波）',
      'Stage N3 深睡期（Delta 慢波主導）',
      '腦死狀態 (Isopotential EEG)'
    ],
    correctAnswerIndex: 2,
    explanation: '腦波圖顯示高波幅（&gt; 75 uV）、慢速（0.5 - 2 Hz）的 Delta 波，且其比例在一個 30 秒的 Epoch 中佔據超過 20%。此為 Stage N3，即「慢波睡眠（Slow-wave sleep）/ 深睡期」。這是人體分泌生長激素、恢復體力的黃金時期。',
    clinicalSignificance: '睡眠腦波判讀是臨床生理檢查的重要項目。醫檢師需熟記各睡眠階段的腦波特徵，如 N2 期會出現睡眠梭興波 (Sleep spindles) 與 K 複合波 (K-complexes)。'
  },
  {
    id: 'eeg_q4',
    category: 'eeg',
    title: '檢查中的生理干擾：肌電偽差',
    caseDescription: '受檢者在腦波記錄過程中因為緊張、下顎緊咬，額部與顳部（F3, F4, T3, T4）導程突然出現大量極度密集、尖銳、高頻的鋸齒狀波形，蓋過了原本的腦波背景。',
    parameters: {
      alertness: 0, // Alert
      frequency: 20,
      amplitude: 30,
      noise: 60, // High muscle noise
      isMuscleArtifact: 1
    },
    options: [
      '癲癇重積狀態 (Status Epilepticus)',
      '技術性偽差 - 交流電干擾 (60Hz Interference)',
      '生理性偽差 - 肌電干擾 (Muscle/EMG Artifact)',
      '異常 Beta 頻帶過度擴散'
    ],
    correctAnswerIndex: 2,
    explanation: '此波形頻率極高（可達 50 Hz 以上），成簇成組出現，尖銳且形狀極不規則，特別侷限於顳肌與咬肌覆蓋的導程（F, T）。此為典型的「肌電偽差 (Muscle/EMG Artifact)」，是由於患者頭面部肌肉收縮產生的電位差干擾。',
    clinicalSignificance: '醫檢師必須能一眼分辨「真癲癇波」與「偽差干擾」。發現肌電偽差時，應親切安撫患者、協助調整姿勢、張口放鬆、輕輕呼吸，以消除干擾，確保波形品質。'
  }
];

export default function EEGModule({ mode, onStateChange, examQuestionIndex }: EEGModuleProps) {
  // Simulator Parameters
  const [alertness, setAlertness] = useState(1); // 0: Alert, 1: Relaxed (Eyes Closed), 2: Drowsy, 3: Deep Sleep, 4: Epilepsy Seizure
  const [frequency, setFrequency] = useState(10); // Hz base
  const [amplitude, setAmplitude] = useState(50); // uV
  const [noise, setNoise] = useState(5); // Artifact level

  // Quiz state
  const [localQuizIndex, setLocalQuizIndex] = useState(0);
  const currentQuizIndex = mode === 'exam' && examQuestionIndex !== undefined 
    ? examQuestionIndex 
    : localQuizIndex;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollOffsetRef = useRef(0);

  const activeQuestion = eegQuizCases[currentQuizIndex];

  // Map state to name
  const getAlertnessLabel = (level: number) => {
    switch (level) {
      case 0: return '專注/清醒張眼 (Beta 頻率)';
      case 1: return '放鬆/清醒閉眼 (Alpha 頻率)';
      case 2: return '淺睡/輕度朦朧 (Theta 頻率)';
      case 3: return '深睡/慢波睡眠 (Delta 頻率)';
      case 4: return '癲癇發作狀態 (棘慢波/Spikes)';
      default: return '未知';
    }
  };

  // Sync state
  useEffect(() => {
    if (mode === 'simulator') {
      onStateChange({ alertness, frequency, amplitude, noise, alertnessLabel: getAlertnessLabel(alertness) });
    } else {
      onStateChange({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        parameters: activeQuestion.parameters,
        userSelected: selectedOption,
        isCorrect: isAnswered ? selectedOption === activeQuestion.correctAnswerIndex : null
      });
    }
  }, [alertness, frequency, amplitude, noise, mode, currentQuizIndex, selectedOption, isAnswered]);

  // Sync quiz or exam params
  useEffect(() => {
    if (mode === 'quiz' || mode === 'exam') {
      const p = activeQuestion.parameters;
      setAlertness(p.alertness);
      setFrequency(p.frequency);
      setAmplitude(p.amplitude);
      setNoise(p.noise);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuizIndex, mode]);

  // Render Multi-channel EEG in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 320;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    canvas.width = width * dpr;
    canvas.style.width = `${width}px`;
    ctx.scale(dpr, dpr);

    // Channels
    const channels = ['F3 - C3', 'C3 - P3', 'P3 - O1', 'T3 - T5'];
    const channelHeight = height / channels.length;

    // We keep a history buffer of points for each channel
    const waveHistory: number[][] = Array(channels.length).fill(0).map(() => Array(Math.floor(width)).fill(0));

    let time = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      // 1. Draw Grid
      ctx.fillStyle = '#0b0f19'; // Deep blue dark grid
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 0.5;
      const gridSize = 15;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw channel dividers
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 1; i < channels.length; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * channelHeight);
        ctx.lineTo(width, i * channelHeight);
        ctx.stroke();
      }

      // 2. Generate wave point based on selected state and parameters
      time += 1.5;

      for (let ch = 0; ch < channels.length; ch++) {
        let val = 0;

        // Base electrophysiological math composition
        if (alertness === 4) {
          // Epilepsy Seizure 3Hz spike and wave
          // Combines a sharp spike (fast sine) and a slow wave (slow sine) synchronized
          const cycle = (time * 0.05) % (2 * Math.PI);
          // Spike: rapid peak
          const spike = cycle < 0.6 ? Math.sin(cycle * 10) * 1.5 : 0;
          // Wave: slower rounded dome
          const dome = Math.sin(cycle) * 1.0;
          val = (spike - dome) * amplitude * 0.4;
        } else {
          // Normal rhythms
          // 0: Alert (Beta), 1: Relaxed (Alpha), 2: Drowsy (Theta), 3: Deep Sleep (Delta)
          let freqHz = frequency;
          let ampPct = amplitude;

          if (alertness === 0) { // Beta
            freqHz = 20 + Math.sin(ch * 5) * 2;
            ampPct = amplitude * 0.4;
          } else if (alertness === 1) { // Alpha
            freqHz = 10 + Math.sin(ch * 2) * 0.5;
            // Occipital channel (ch = 2: P3-O1, ch = 3: T3-T5) has stronger Alpha rhythm
            ampPct = (ch === 2 || ch === 3) ? amplitude : amplitude * 0.5;

            // In Quiz, simulate Alpha blocking: if time is half-way, open eyes -> disappear alpha!
            if (mode === 'quiz' && activeQuestion.isAlphaBlock) {
              const sec = (time % 400);
              if (sec > 200) {
                // Eyes Open: transitions to Beta (faster, lower voltage)
                freqHz = 22;
                ampPct = amplitude * 0.25;
              }
            }
          } else if (alertness === 2) { // Theta
            freqHz = 5.5 + Math.sin(ch) * 0.5;
            ampPct = amplitude * 0.8;
          } else if (alertness === 3) { // Delta
            freqHz = 1.8 + Math.sin(ch * 3) * 0.3;
            ampPct = amplitude * 1.6;
          }

          // Composite wave: dominant wave + some random secondary waves
          const rad = (time * 0.04) * freqHz;
          val = Math.sin(rad) * ampPct * 0.4;
          val += Math.sin(rad * 2.3) * (ampPct * 0.1); // harmonics
          val += Math.sin(rad * 0.35) * (ampPct * 0.15); // slower drift
        }

        // Add muscle artifact noise (High-frequency fuzz)
        if (noise > 0) {
          // Frontal channels (F3-C3, C3-P3) get much worse muscle artifact
          const muscleFactor = (ch === 0 || ch === 1) ? 1.0 : 0.4;
          val += (Math.random() - 0.5) * noise * 0.8 * muscleFactor;
        }

        // Push and shift history
        waveHistory[ch].push(val);
        if (waveHistory[ch].length > width) {
          waveHistory[ch].shift();
        }

        // Draw Channel Wave (Glowing neon green/cyan)
        ctx.strokeStyle = ch === 2 ? '#06b6d4' : '#10b981'; // Occipital cyan, others green
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let x = 0; x < waveHistory[ch].length; x++) {
          const y = (ch * channelHeight + channelHeight / 2) - waveHistory[ch][x];
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Channel text tag
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(channels[ch], 12, ch * channelHeight + 20);

        // Highlight eyes state if doing Alpha block quiz
        if (mode === 'quiz' && activeQuestion.isAlphaBlock && ch === 2) {
          const sec = (time % 400);
          ctx.fillStyle = sec <= 200 ? '#10b981' : '#f43f5e';
          ctx.beginPath();
          ctx.arc(width - 50, ch * channelHeight + 16, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillText(sec <= 200 ? "👁️ 閉眼放鬆" : "😳 張眼警覺", width - 110, ch * channelHeight + 20);
        }
      }

      // EEG Paper Speed Label
      ctx.fillStyle = '#475569';
      ctx.font = '9px monospace';
      ctx.fillText(`濾波器: LFF 0.5Hz, HFF 70Hz | 敏感度: 7 uV/mm | 速度: 30 mm/s`, 12, height - 10);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [alertness, frequency, amplitude, noise, mode, currentQuizIndex]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === activeQuestion.correctAnswerIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setLocalQuizIndex((prev) => (prev + 1) % eegQuizCases.length);
  };

  if (mode === 'exam') {
    return (
      <div className="space-y-4">
        {/* Wave Monitor Canvas */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              4導程腦波監測儀 (4-Channel EEG Monitor)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">標準 10-20 電極系統配置</span>
          </div>
          <canvas ref={canvasRef} className="w-full bg-[#0b0f19] rounded-lg block" />
        </div>

        {/* Readout parameters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono justify-center shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">當前狀態:</span>
            <strong className="text-emerald-400">{getAlertnessLabel(alertness)}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">基礎頻率:</span>
            <strong className="text-emerald-400">{frequency} Hz</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">標準波幅:</span>
            <strong className="text-emerald-400">{amplitude} μV</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">生理干擾強度:</span>
            <strong className={`font-bold ${noise > 30 ? 'text-red-400' : 'text-emerald-400'}`}>{noise} μV</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wave Monitor Canvas */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            4導程腦波監測儀 (4-Channel EEG Monitor)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">標準 10-20 電極系統配置</span>
        </div>
        <canvas ref={canvasRef} className="w-full bg-[#0b0f19] rounded-lg block" id="eeg-canvas" />
      </div>

      {/* Control Panel */}
      {mode === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                腦電活動模擬 (EEG Activity Parameters)
              </h3>
            </div>

            {/* Consciousness State Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">受試者狀態 (State of Alertness)</label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3, 4].map((level) => {
                  let name = '';
                  let badge = '';
                  if (level === 0) { name = '張眼清醒'; badge = 'Beta'; }
                  if (level === 1) { name = '閉眼放鬆'; badge = 'Alpha'; }
                  if (level === 2) { name = '淺睡朦朧'; badge = 'Theta'; }
                  if (level === 3) { name = '深層睡眠'; badge = 'Delta'; }
                  if (level === 4) { name = '癲癇發作'; badge = 'Spike'; }

                  return (
                    <button
                      key={level}
                      onClick={() => {
                        setAlertness(level);
                        if (level === 0) { setFrequency(20); setAmplitude(30); }
                        if (level === 1) { setFrequency(10); setAmplitude(55); }
                        if (level === 2) { setFrequency(6); setAmplitude(70); }
                        if (level === 3) { setFrequency(2); setAmplitude(120); }
                        if (level === 4) { setFrequency(3); setAmplitude(160); }
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex justify-between items-center transition-all cursor-pointer ${
                        alertness === level
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                      id={`eeg-alertness-btn-${level}`}
                    >
                      <span>{name}</span>
                      <span className="text-[9px] font-mono opacity-80 px-1 bg-slate-900 border border-slate-800 rounded">
                        {badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amplitude Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">波幅電壓 (Sensitivity/Amplitude)</span>
                <span className="text-emerald-400 font-bold">{amplitude} uV</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-eeg-amp"
              />
              <p className="text-[10px] text-slate-500">
                調整電位差敏感度。正常皮質放電為 20 - 100 uV；癲癇發作或深睡慢波時波幅可顯著攀升。
              </p>
            </div>

            {/* Muscle noise Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">肌電干擾偽差 (Muscle/EMG Artifact)</span>
                <span className={`font-bold ${noise > 30 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {noise} uV
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={noise}
                onChange={(e) => setNoise(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-eeg-noise"
              />
              <p className="text-[10px] text-slate-500">
                模擬咀嚼或頭部緊繃時，前額與顳部電極收錄到的肌肉超高頻干擾，是醫檢判讀常見干擾源。
              </p>
            </div>
          </div>

          {/* Learn Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  腦波電生理速記 (EEG Medical Insights)
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  💤 <strong className="text-white">阿爾法波 (Alpha Wave)</strong>：<strong className="text-emerald-400">8-13 Hz</strong>。人體閉眼安靜、清醒放鬆時最為明顯，張眼或思考時會產生阻斷。是基本背景節律的指針。
                </p>
                <p>
                  🔥 <strong className="text-white">貝他波 (Beta Wave)</strong>：<strong className="text-emerald-400">14-30 Hz</strong>。精神集中、張眼警覺或焦慮時的主導電位。波幅最低。
                </p>
                <p>
                  🌥️ <strong className="text-white">希塔波 (Theta Wave)</strong>：<strong className="text-emerald-400">4-7 Hz</strong>。淺睡眠、疲憊、朦朧時出現。若清醒成人背景節律在此範圍代表異常慢波化。
                </p>
                <p>
                  🌀 <strong className="text-white">棘慢複合波 (Spike-and-wave)</strong>：高電壓且對稱同步的發射，是皮質神經元集體高度異常去極化與過度極化（抑制性）的電生理機制，為典型癲癇特徵。
                </p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5 mt-4">
              <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[10.5px] text-slate-400 leading-snug">
                <strong>互動探索秘訣：</strong>點擊「放鬆閉眼」，觀察下方 P3-O1（枕部）是否出現優勢 Alpha 波；再點選「癲癇發作」，欣賞極為震撼的 3Hz 同步棘慢波。
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Description and Options */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                EEG 臨床案例測驗 ({currentQuizIndex + 1} / {eegQuizCases.length})
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                得分: {quizScore}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                主題：{activeQuestion.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-lg border border-slate-800/60">
                {activeQuestion.caseDescription}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400">請選出最符合該動態腦波的臨床報告診斷：</p>
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700";
                  if (selectedOption === idx) {
                    btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                  }
                  if (isAnswered) {
                    if (idx === activeQuestion.correctAnswerIndex) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold";
                    } else if (selectedOption === idx) {
                      btnStyle = "bg-red-500/15 border-red-500 text-red-300";
                    } else {
                      btnStyle = "bg-slate-950/40 border-slate-900/60 text-slate-500 opacity-60 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left text-xs p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      id={`eeg-opt-${idx}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === activeQuestion.correctAnswerIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && selectedOption === idx && idx !== activeQuestion.correctAnswerIndex && (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit / Next */}
            <div className="pt-2 flex gap-3">
              {!isAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  id="eeg-quiz-submit"
                >
                  提交診斷報告
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="eeg-quiz-next"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  下一項診斷案例
                </button>
              )}
            </div>
          </div>

          {/* Explanation Box */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            {isAnswered ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    電生理特徵與醫檢解析
                  </h3>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-emerald-400 mr-2">
                      學理分析
                    </span>
                    <p className="mt-1.5 text-slate-300">{activeQuestion.explanation}</p>
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-amber-400 mr-2">
                      臨床醫檢實務
                    </span>
                    <p className="mt-1.5 text-slate-300">{activeQuestion.clinicalSignificance}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <HelpCircle className="w-12 h-12 text-slate-700 stroke-[1.5]" />
                <div>
                  <p className="text-xs font-semibold text-slate-400">案例報告待提交</p>
                  <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto mt-1">
                    觀察上方 4 導程動態腦波的波型變化、頻率高低與對稱性，結合病史，進行分析。
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 text-[10.5px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-400 shrink-0 font-bold">💡 AI 導師提醒：</span>
              <p>
                對腦部 10-20 電極定位系統，或是誘發試驗原理不熟嗎？直接在右側問我：「腦波檢查中的過度換氣試驗，有何生理機制？」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
