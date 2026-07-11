import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CheckCircle, AlertTriangle, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export interface EMGModuleProps {
  mode: 'simulator' | 'quiz' | 'exam';
  onStateChange: (data: Record<string, any>) => void;
  examQuestionIndex?: number;
}

// Simulated EMG quiz cases
export const emgQuizCases: QuizQuestion[] = [
  {
    id: 'emg_q1',
    category: 'emg',
    title: '慢性神經源性病變 (Neurogenic Lesion)',
    caseDescription: '一位 58 歲男性，主訴右側足下垂（Foot drop）已兩個月，並伴隨小腿肌肉萎縮。安排下肢針電極肌電圖（Needle EMG）檢查。在患者用力收縮脛前肌時，醫檢師觀察到波形數量極度稀疏，但單個波幅卻非常巨大，伴隨喇叭傳來規律低沉的「擊鼓樣」啪啪聲。',
    parameters: {
      recruitment: 20, // Reduced recruitment
      spontaneous: 0,
      pathology: 1, // Neurogenic (Giant MUAPs)
      amplitude: 8.0, // High voltage
      duration: 16 // Prolonged duration
    },
    options: [
      '正常最大收縮肌電圖 - 完整干擾相 (Interference Pattern)',
      '肌原性病變 (Myopathy) - 早期募集與小波幅',
      '慢性神經源性病變 (Neurogenic Lesion) - 募集減少與巨大波',
      '重症肌無力引起的遞減反應 (Decrement Response)'
    ],
    correctAnswerIndex: 2,
    explanation: '肌電圖特徵顯示：運動單位募集數量明顯「減少（Reduced recruitment）」，但單個運動單位動作電位（MUAP）振幅顯著升高（達 8.0 mV，正常為 0.5-3 mV），且時限延長。這是因為神經受損後，存活的鄰近運動神經元產生「側支支配 (Collateral reinnervation)」而形成的「巨大運動單位電位 (Giant MUAP)」，符合慢性神經源性病變。',
    clinicalSignificance: '醫檢師操作肌電圖時，必須準確測量 MUAP 的波幅、時限及多相波比例，並仔細傾聽聲音。巨大運動單位電位在肌電圖喇叭中會發出規律、低沉、沈悶的「砰、砰」或「咚、咚」聲。'
  },
  {
    id: 'emg_q2',
    category: 'emg',
    title: '肌原性病變 (Myogenic Disease)',
    caseDescription: '一位 34 歲女性，主訴近端肢體（大腿與肩膀）逐漸無力，上下樓梯極度困難，疑似罹患多發性肌炎 (Polymyositis)。安排針電極肌電圖檢查，發現患者僅需稍微用力，螢幕上就出現極為密集的雜亂細小波形，聲音清脆。',
    parameters: {
      recruitment: 90, // Early full recruitment for low effort
      spontaneous: 0,
      pathology: 2, // Myogenic (Small short MUAPs)
      amplitude: 0.6, // Low voltage
      duration: 5 // Short duration
    },
    options: [
      '慢性神經源性病變 (Neurogenic Lesion)',
      '肌原性病變 (Myopathy) - 早期募集與短小多相波',
      '正常休息狀態肌電圖 (Complete Silence)',
      '神經肌肉接頭病變 - 重症肌無力'
    ],
    correctAnswerIndex: 1,
    explanation: '肌電圖特徵為：運動單位動作電位（MUAP）呈現「短時限（Short duration）」、「低波幅（Low amplitude）」且「多相波比例增加」，並伴隨「早期募集（Early/Full recruitment）」——即病患僅輕微用力，便需要動員大量短小的肌纖維參與以達到相同肌力，符合「肌原性病變 (Myopathy)」。',
    clinicalSignificance: '早期募集與神經源性的「募集減少」恰恰相反。在聽覺上，肌原性病變會發出極為密集、清脆尖銳的「沙沙沙」或「劈啪」聲，與正常的最大干擾相相比，音量與波幅明顯偏低。'
  },
  {
    id: 'emg_q3',
    category: 'emg',
    title: '急性失神經支配活性 (Active Denervation)',
    caseDescription: '一位 40 歲女性，在三週前發生嚴重車禍導致橈神經外傷。進行針極肌電圖檢查。當針電極插入「完全放鬆（完全不用力）」的伸指總肌內時，醫檢師觀察到大量細小、規律發放的雙相尖銳電位，聲音像雨打鐵皮、煎培根般劈啪作響。',
    parameters: {
      recruitment: 0, // Muscle is fully relaxed
      spontaneous: 1, // Active fibrillations
      pathology: 0,
      amplitude: 0.2, // Small spontaneous potentials
      duration: 2
    },
    options: [
      '正常放鬆狀態，呈電寂靜 (Electrical Silence)',
      '運動單位過度募集活性',
      '急性失神經支配 - 纖維顫動電位 (Fibrillation) 與正銳波 (Positive Sharp Waves)',
      '終板噪音 (End-plate noise)'
    ],
    correctAnswerIndex: 2,
    explanation: '正常骨骼肌在「完全放鬆」時，應呈現完全的「電寂靜 (Electrical silence)」。此病例在放鬆狀態下出現自發性放電，波形為微小的雙相尖波，符合「纖維顫動電位 (Fibrillation potential)」與「正銳波 (Positive sharp waves)」，提示肌肉失去了神經支配，處於「急性失神經支配 (Active denervation)」狀態，通常在神經受損後 2-3 週開始出現。',
    clinicalSignificance: '失神經放電在肌電圖喇叭中會發出尖銳、短促、高頻的「滴、滴」或「啪、啪」聲，極似雨滴落在鐵皮屋頂、或煎培根時油花爆裂的聲音。檢測 spontaneous activity 對評估神經受損時效極其重要。'
  }
];

export default function EMGModule({ mode, onStateChange, examQuestionIndex }: EMGModuleProps) {
  // Simulator Parameters
  const [recruitment, setRecruitment] = useState(30); // 0 (Relaxed) to 100 (Max Contraction)
  const [spontaneous, setSpontaneous] = useState(0); // 0: None, 1: Fibrillations/Positive Sharp Waves
  const [pathology, setPathology] = useState(0); // 0: Normal, 1: Neurogenic, 2: Myogenic

  // Audio Control State
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

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
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any>(null);

  const activeQuestion = emgQuizCases[currentQuizIndex];

  // Map state labels
  const getPathologyLabel = (p: number) => {
    switch (p) {
      case 0: return '正常肌肉 (Normal MUAPs)';
      case 1: return '神經源性病變 (Giant MUAPs - Reduced Recruitment)';
      case 2: return '肌原性病變 (Small MUAPs - Early Recruitment)';
      default: return '未知';
    }
  };

  // Sync state to parent
  useEffect(() => {
    if (mode === 'simulator') {
      onStateChange({
        recruitment,
        spontaneous,
        pathology,
        pathologyLabel: getPathologyLabel(pathology),
        isAudioOn: isAudioEnabled
      });
    } else {
      onStateChange({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        parameters: activeQuestion.parameters,
        userSelected: selectedOption,
        isCorrect: isAnswered ? selectedOption === activeQuestion.correctAnswerIndex : null,
        isAudioOn: isAudioEnabled
      });
    }
  }, [recruitment, spontaneous, pathology, isAudioEnabled, mode, currentQuizIndex, selectedOption, isAnswered]);

  // Load quiz or exam params
  useEffect(() => {
    if (mode === 'quiz' || mode === 'exam') {
      const p = activeQuestion.parameters;
      setRecruitment(p.recruitment);
      setSpontaneous(p.spontaneous);
      setPathology(p.pathology);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuizIndex, mode]);

  // Web Audio Synthesizer for EMG Signals
  useEffect(() => {
    if (!isAudioEnabled) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    // Initialize AudioContext lazily
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    } catch (e) {
      console.error("Browser does not support Web Audio API:", e);
      return;
    }

    const playEMGTick = (freq: number, vol: number, durationSec: number = 0.04) => {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle'; // triangle gives a nice realistic muscle thud/pop
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

      osc.start();
      osc.stop(ctx.currentTime + durationSec + 0.01);
    };

    // Trigger EMG pops periodically depending on contraction/pathology
    const triggerAudioTicks = () => {
      if (recruitment === 0 && spontaneous === 0) return;

      // Calculate triggering density based on parameters
      let tickInterval = 100; // ms between ticks
      let pitchHz = 110;
      let tickVolume = 0.08;
      let decay = 0.04;

      if (spontaneous === 1) {
        // Fibrillation potentials: very rapid, sharp, crisp high-pitch clicks
        tickInterval = 35; // 25-30 Hz
        pitchHz = 350 + Math.random() * 50;
        tickVolume = 0.04;
        decay = 0.02;
        playEMGTick(pitchHz, tickVolume, decay);
      } else {
        // Voluntary contraction
        if (recruitment > 0) {
          // Adjust interval based on recruitment level
          // 100 recruitment -> extremely fast overlapping ticks
          tickInterval = Math.max(8, 120 - recruitment * 1.1);
          tickVolume = 0.02 + (recruitment / 100) * 0.12;

          if (pathology === 1) {
            // Neurogenic (Giant Units) -> slow firing, very loud, low pitch "thuds"
            tickInterval = Math.max(25, 150 - recruitment * 0.8);
            pitchHz = 65 + Math.random() * 20; // low pitch
            tickVolume = 0.12; // louder!
            decay = 0.06; // longer duration
          } else if (pathology === 2) {
            // Myogenic (Small short units) -> extremely rapid, tiny high-pitch "crackles"
            tickInterval = Math.max(6, 80 - recruitment * 0.7);
            pitchHz = 180 + Math.random() * 80;
            tickVolume = 0.03; // quieter
            decay = 0.025; // shorter duration
          } else {
            // Normal
            pitchHz = 100 + Math.random() * 60;
          }

          // Randomize timing slightly to sound natural
          if (Math.random() < 0.9) {
            playEMGTick(pitchHz, tickVolume, decay);
          }
        }
      }
    };

    // Restart timer
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    audioIntervalRef.current = setInterval(triggerAudioTicks, 15);

    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [recruitment, spontaneous, pathology, isAudioEnabled]);

  // Render EMG Sweep Trace in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 240;
    canvas.width = width * dpr;
    canvas.style.width = `${width}px`;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const centerY = height / 2;
    const dataPoints: number[] = new Array(Math.floor(width)).fill(0);
    let sweepX = 0; // Sweep line index (erases left-to-right)

    const draw = () => {
      if (!ctx || !canvas) return;

      // We draw the sweep line erasing old data, which mimics actual medical monitors!
      // Erase a small block right in front of the sweep line
      ctx.fillStyle = '#0a0d14';
      // Complete redraw is easier for HTML5 canvas, but sweep trace can be simulated by updating a rolling buffer
      // Draw grid
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#312e81'; // central baseline
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Update data index at sweep point
      sweepX = (sweepX + 3) % width;

      // Generate signal based on recruitment and pathology
      let emgVal = 0;

      if (spontaneous === 1) {
        // Fibrillation potentials (brief sharp spikes randomly)
        if (Math.random() < 0.15) {
          // Sharp double phase spike
          emgVal = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2.0);
        }
      } else {
        if (recruitment > 0) {
          // Contraction creates dense electrical spikes (Interference Pattern)
          // We sum random waves representing multiple overlapping motor units
          const density = Math.floor(recruitment / 8) + 1;
          for (let i = 0; i < density; i++) {
            if (Math.random() < 0.45) {
              let muapHeight = 1.2;
              let muapWidth = 2;

              if (pathology === 1) {
                // Neurogenic -> Giant MUAPs (very tall, polyphasic, wider)
                muapHeight = 6.5 + Math.random() * 4;
                muapWidth = 5;
              } else if (pathology === 2) {
                // Myogenic -> Short, tiny polyphasic MUAPs
                muapHeight = 0.4 + Math.random() * 0.5;
                muapWidth = 1.2;
              } else {
                // Normal
                muapHeight = 1.5 + Math.random() * 2.0;
              }

              const sign = Math.random() > 0.5 ? 1 : -1;
              emgVal += sign * muapHeight * (Math.random() + 0.3);
            }
          }
          // Cap maximum amplitude to keep it on screen
          const limit = pathology === 1 ? 14 : 7;
          emgVal = Math.max(-limit, Math.min(limit, emgVal));
        }
      }

      // Store in buffer
      // Erase a block ahead of sweep point to avoid a continuous connected loop
      const eraseWidth = 25;
      for (let w = 0; w < eraseWidth; w++) {
        const idx = (sweepX + w) % width;
        dataPoints[idx] = 999; // 999 represents blank/erased area
      }

      dataPoints[sweepX] = emgVal;

      // Render the sweep trace in glowing yellow/gold neon
      ctx.strokeStyle = '#eab308'; // Glowing gold trace
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      let isDrawing = false;
      for (let x = 0; x < width; x++) {
        const val = dataPoints[x];
        if (val === 999) {
          // Gap: finish drawing current segment
          if (isDrawing) {
            ctx.stroke();
            isDrawing = false;
          }
        } else {
          const y = centerY - val * 8; // scaling
          if (!isDrawing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            isDrawing = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      if (isDrawing) ctx.stroke();

      // Draw vertical green patient monitor sweep bar
      ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.fillRect(sweepX - 2, 0, 4, height);

      // Info overlays
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText("針極肌電圖針頭讀取 (Needle EMG Real-time Sweep)", 15, 20);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [recruitment, spontaneous, pathology]);

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
    setLocalQuizIndex((prev) => (prev + 1) % emgQuizCases.length);
  };

  if (mode === 'exam') {
    return (
      <div className="space-y-4">
        {/* Wave Monitor Canvas */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-yellow-400" />
              肌電活動聲像儀 (EMG Audio-Visual Monitor)
            </span>
            {/* Audio toggle button */}
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10.5px] font-bold border transition-all cursor-pointer ${
                isAudioEnabled
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {isAudioEnabled ? '喇叭監控：開啟中' : '喇叭監控：靜音'}
            </button>
          </div>
          <canvas ref={canvasRef} className="w-full bg-[#111] rounded-lg block" />
        </div>

        {/* Readout parameters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono justify-center shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">肌收縮強度 (Recruitment):</span>
            <strong className="text-yellow-400">{recruitment}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">自發放電 (Spontaneous):</span>
            <strong className="text-yellow-400">{spontaneous === 1 ? '活性纖維顫動/正銳波' : '無/電寂靜'}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">病理特徵 (Pathology):</span>
            <strong className="text-yellow-400">{getPathologyLabel(pathology)}</strong>
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
          <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-yellow-400" />
            肌電活動聲像儀 (EMG Audio-Visual Monitor)
          </span>
          {/* Audio toggle button */}
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10.5px] font-bold border transition-all cursor-pointer ${
              isAudioEnabled
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            id="emg-audio-toggle"
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            {isAudioEnabled ? '喇叭監控：開啟中' : '喇叭監控：靜音'}
          </button>
        </div>
        <canvas ref={canvasRef} className="w-full bg-[#0a0d14] rounded-lg block" id="emg-canvas-trace" />
      </div>

      {/* Control Panel */}
      {mode === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Volume2 className="w-4 h-4 text-yellow-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                運動肌肉收縮模擬 (EMG Parameters)
              </h3>
            </div>

            {/* Pathology Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">肌肉病理機制 (Muscle/Nerve Status)</label>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((p) => {
                  let label = '';
                  if (p === 0) label = '正常肌肉';
                  if (p === 1) label = '神經病變';
                  if (p === 2) label = '肌肉病變';

                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setPathology(p);
                        setSpontaneous(0); // clear relax spontaneous
                      }}
                      className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                        pathology === p && spontaneous === 0
                          ? 'bg-yellow-500/15 border-yellow-500 text-yellow-400 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      }`}
                      id={`emg-pathology-btn-${p}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spontaneous Activity Switch */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-300 block font-semibold">放鬆狀態自發電位 (Active Denervation)</span>
                <span className="text-[10px] text-slate-500">模擬肌肉在不用力時的病理放電</span>
              </div>
              <button
                onClick={() => {
                  if (spontaneous === 0) {
                    setSpontaneous(1);
                    setRecruitment(0); // force relax
                  } else {
                    setSpontaneous(0);
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer ${
                  spontaneous === 1
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
                id="emg-spontaneous-btn"
              >
                {spontaneous === 1 ? '已開啟 (失神支配)' : '無自發電位'}
              </button>
            </div>

            {/* Recruitment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">肌肉用力程度 (Contraction Effort)</span>
                <span className="text-yellow-400 font-bold">{recruitment}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={recruitment}
                onChange={(e) => {
                  setRecruitment(Number(e.target.value));
                  if (Number(e.target.value) > 0) {
                    setSpontaneous(0); // deactivate relax state when contracting
                  }
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                id="slider-emg-recruitment"
              />
              <p className="text-[10px] text-slate-500">
                調大用力程度，觀察從「單個 MUAP 孤立放電」到「高密度重疊干擾相 (Interference Pattern)」的漸進募集過程。
              </p>
            </div>
          </div>

          {/* Learn Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  肌電圖聽診與判讀口訣 (EMG Acoustic Clinic)
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  🔊 <strong className="text-white">正常收縮 (Normal)</strong>：正常運動單位發放。輕度收縮發出清脆的「啪嗒、啪嗒」敲擊聲；最大收縮時如「大雨落在鐵皮屋頂上（Heavy rain）」密集。
                </p>
                <p>
                  🥁 <strong className="text-white">神經病變 (Neurogenic)</strong>：神經萎縮導致募集數量暴減。但存活的單位會極力代償，形成極大振幅與極長時限。在喇叭中呈沉悶緩慢的<strong className="text-yellow-400">「擊鼓砰砰聲」</strong>。
                </p>
                <p>
                  🐝 <strong className="text-white">肌肉病變 (Myogenic)</strong>：肌纖維本身壞死變短。雖然動員大量波形（早期募集），但每組波都極為短小。在喇叭中發出密集而微弱的<strong className="text-yellow-400">「嗡嗡沙沙聲」</strong>。
                </p>
                <p>
                  🥓 <strong className="text-white">失神支配 (Active Denervation)</strong>：完全放鬆時，失去神經的個體肌纖維發生自發顫動，在喇叭中傳出<strong className="text-yellow-400">「油炸培根時的劈啪作響」</strong>或「鐘錶滴答」聲。
                </p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5 mt-4">
              <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-[10.5px] text-slate-400 leading-snug">
                <strong>聲效學習：</strong>請務必點擊右上角<strong>「喇叭監控：開啟」</strong>，然後隨意拉動用力滑桿，聆聽並比較「神經源性巨大 thud 聲」與「正常暴雨般 static 聲」！
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                EMG 臨床案例測驗 ({currentQuizIndex + 1} / {emgQuizCases.length})
              </span>
              <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded">
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
              <p className="text-xs font-semibold text-slate-400">請選出最符合肌電圖波形與臨床病史的解答：</p>
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700";
                  if (selectedOption === idx) {
                    btnStyle = "bg-yellow-500/10 border-yellow-500 text-yellow-400";
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
                      id={`emg-opt-${idx}`}
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
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  id="emg-quiz-submit"
                >
                  提交肌電圖診斷
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="emg-quiz-next"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  下一項診斷案例
                </button>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            {isAnswered ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    醫物理與病理生理分析
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
                  <p className="text-xs font-semibold text-slate-400">分析待提交</p>
                  <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto mt-1">
                    細緻觀察上方掃描器中的電位振幅高低、發放密度，並打開右上角「喇叭監控」聆聽它的獨特聲效，結合病史診斷。
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 text-[10.5px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <span className="text-yellow-400 shrink-0 font-bold">💡 AI 導師提醒：</span>
              <p>
                對肌電圖的 MUAP（運動單位電位）時限或振幅定義有疑問？問我：「EMG 中神經源巨大波與肌肉源短小波的電生理本質是什麼？」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
