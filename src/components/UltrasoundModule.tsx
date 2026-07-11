import React, { useState, useEffect, useRef } from 'react';
import { Shield, Play, Pause, CheckCircle, AlertTriangle, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export interface UltrasoundModuleProps {
  mode: 'simulator' | 'quiz' | 'exam';
  onStateChange: (data: Record<string, any>) => void;
  examQuestionIndex?: number;
}

// Simulated Ultrasound quiz cases
export const ultrasoundQuizCases: QuizQuestion[] = [
  {
    id: 'us_q1',
    category: 'ultrasound',
    title: '風濕性二尖瓣狹窄 (Rheumatic Mitral Stenosis)',
    caseDescription: '一位 45 歲女性，主訴活動後極度容易喘，偶爾有咳嗽與血痰。聽診時在心尖部（Apex）可聽到舒張期滾動樣雜音（Diastolic rumbling murmur）。安排心臟超音波檢查，醫檢師著重觀察二尖瓣的前葉 M 模式波形。',
    parameters: {
      hr: 80,
      diastolicD: 0, // Normal E/A
      stenosis: 1, // Severe Mitral Stenosis
      isMS: 1
    },
    options: [
      '正常二尖瓣波形 - 典型 D-E-F-A-C 點雙峰 M 樣圖',
      '風濕性二尖瓣狹窄 (Mitral Stenosis) - 雙層增厚、EF 斜率減低、呈城牆樣 (Box/Dagger shape)',
      '左心室舒張功能不全 (Diastolic Dysfunction) - E/A 比例倒置',
      '二尖瓣脫垂 (Mitral Valve Prolapse) - 收縮中晚期後移'
    ],
    correctAnswerIndex: 1,
    explanation: '二尖瓣 M 模式超音波圖特徵為：二尖瓣前葉與後葉呈現同向運動（正常應為相反方向），瓣膜葉增厚、活動度降低，舒張期 EF 斜率（EF Slope）顯著減低，使原本的雙峰「M」形消失，變成平直、城牆樣（Box-like 或 Dagger-like）的單一增厚平原。此為極典型「二尖瓣狹窄 (Mitral Stenosis)」特徵。',
    clinicalSignificance: '風濕性心臟病是二尖瓣狹窄的最主要成因。瓣膜口狹窄阻礙舒張期血液從左心房流入左心室，導致左心房壓力增高、肺靜脈高壓，從而引發運動後喘及咳血。醫檢師在測量時，需透過多普勒測量二尖瓣最大流速與壓力減半時間 (PHT) 以估算瓣口面積。'
  },
  {
    id: 'us_q2',
    category: 'ultrasound',
    title: '左心室舒張功能不全 (LV Diastolic Dysfunction)',
    caseDescription: '一位 70 歲女性，有多年高血壓、糖尿病病史，因呼吸喘、雙下肢水腫就醫。心臟超音波顯示左心室射出率正常（LVEF = 62%，收縮功能完好）。醫檢師使用脈衝多普勒（Pulse Doppler）測量舒張期穿二尖瓣血流速。',
    parameters: {
      hr: 75,
      diastolicD: 1, // Impaired relaxation E/A < 1
      stenosis: 0,
      isDD: 1
    },
    options: [
      '二尖瓣狹窄引起的舒張期血流受阻',
      '正常舒張期穿二尖瓣血流頻譜 (E/A Ratio > 1)',
      '左心室舒張功能不全 (LV Diastolic Dysfunction) - 鬆弛受損與 E/A 倒置 (E/A < 1)',
      '心房顫動引起的舒張期血流改變'
    ],
    correctAnswerIndex: 2,
    explanation: '正常穿二尖瓣血流頻譜在舒張期有兩個波峰：E 波（舒張早期快速充盈波）與 A 波（舒張晚期心房收縮充盈波），正常 E 波高於 A 波（E/A Ratio &gt; 1）。此病例頻譜顯示 E 波變低、A 波代償性增高，導致 E/A 比值倒置且小於 1.0（E/A &lt; 1），符合「左心室舒張功能不全（鬆弛障礙型，Impaired relaxation）」。',
    clinicalSignificance: '舒張型心臟衰竭（Diastolic heart failure, HFpEF）十分常見。即使心肌收縮力（EF%）正常，若心肌順應性變差、舒張鬆弛受阻，左心室充盈壓同樣會升高，導致肺淤血。醫檢師需熟記 E/A 比值的病理學意義。'
  },
  {
    id: 'us_q3',
    category: 'ultrasound',
    title: '心房顫動下之超音波表現 (Mitral Valve in AFib)',
    caseDescription: '一位 68 歲男性，有心房顫動（AFib）病史。心臟超音波檢查時，醫檢師將 M 模式取樣線切過二尖瓣瓣葉，並同時對二尖瓣流入血流進行頻譜多普勒測量。',
    parameters: {
      hr: 110,
      diastolicD: 0,
      stenosis: 0,
      isAFib: 1
    },
    options: [
      '典型二尖瓣脫垂伴隨收縮期反流',
      '二尖瓣 M 模式與多普勒 A 波（心房收縮峰）完全消失，且心動週期極度不規則',
      '二尖瓣狹窄伴隨左心室流出道狹窄',
      '舒張功能正常，E/A 比值恆定為 1.2'
    ],
    correctAnswerIndex: 1,
    explanation: '心房顫動時，心房失去規律有效的機械性收縮（僅有快速顫動）。因此，在二尖瓣 M 模式與多普勒血流頻譜中，代表心房收縮充盈的「A 波（A-wave）」會完全消失，僅剩下單一的 E 波；且因為心室反應極不規則，每個心動週期的間距（R-R 間期）和波形振幅都呈現隨機變化。',
    clinicalSignificance: '超音波檢查是診斷與評估心房顫動對心臟功能（如心房大小、血栓形成、舒張期充盈）影響的重要工具。無 A 波是診斷心房顫動的超音波金指針。'
  }
];

export default function UltrasoundModule({ mode, onStateChange, examQuestionIndex }: UltrasoundModuleProps) {
  // Simulator Parameters
  const [hr, setHr] = useState(75);
  const [diastolicD, setDiastolicD] = useState(0); // 0: Normal (E/A > 1), 1: Impaired relaxation (E/A < 1)
  const [stenosis, setStenosis] = useState(0); // 0: Normal M-mode, 1: Severe Stenosis (Box shape, flat EF slope)

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

  const activeQuestion = ultrasoundQuizCases[currentQuizIndex];

  // Sync state to parent
  useEffect(() => {
    if (mode === 'simulator') {
      onStateChange({ hr, diastolicD, stenosis, isMS: stenosis === 1, isDD: diastolicD === 1 });
    } else {
      onStateChange({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        parameters: activeQuestion.parameters,
        userSelected: selectedOption,
        isCorrect: isAnswered ? selectedOption === activeQuestion.correctAnswerIndex : null
      });
    }
  }, [hr, diastolicD, stenosis, mode, currentQuizIndex, selectedOption, isAnswered]);

  // Load quiz or exam params
  useEffect(() => {
    if (mode === 'quiz' || mode === 'exam') {
      const p = activeQuestion.parameters;
      setHr(p.hr);
      setDiastolicD(p.diastolicD);
      setStenosis(p.stenosis);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuizIndex, mode]);

  // Render Echocardiography (M-Mode + Spectral Doppler) inside Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 300;
    canvas.width = width * dpr;
    canvas.style.width = `${width}px`;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Coordinate settings: Split vertical canvas into two panels
    // Upper panel: M-Mode Mitral Valve Anterior Leaflet (glowing cyan)
    // Lower panel: Spectral Doppler Mitral Inflow Velocity (glowing purple/violet)
    const panelHeight = height / 2;

    const mModePoints: number[] = new Array(Math.floor(width)).fill(0);
    const dopplerPoints: number[] = new Array(Math.floor(width)).fill(0);
    let scrollX = 0;

    let time = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      // Draw background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Draw panel divider & grid
      ctx.strokeStyle = '#1e1b4b'; // dark violet/indigo grid
      ctx.lineWidth = 0.5;
      const grid = 12;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, panelHeight);
      ctx.lineTo(width, panelHeight);
      ctx.stroke();

      // Update trace
      time += 1.5;
      scrollX = (scrollX + 2) % width;

      // 1. Generate physiological coordinates
      // Beats per minute converted to cycle speed
      const framesPerBeat = 3600 / hr;
      const cyclePhase = (time * (1 / framesPerBeat)) % (2 * Math.PI);

      // M-Mode Mitral Valve leaflet wave generation: standard "M" shape
      let mLeaflet = 0;
      // Spectral Doppler inflow wave generation: double peak (E wave and A wave)
      let dopFlow = 0;

      // Special check for AFib in Quiz: loss of A wave and irregular heart rate
      const isQuizAFib = (mode === 'quiz' && activeQuestion.isAFib);

      // We define cycle phases:
      // Diastole starts: Rapid opening (D point to E point)
      // Rapid passive filling: E point (peak)
      // Diastasis: Leaflet starts closing slightly (E to F point)
      // Atrial contraction: A point (leaflet re-opens slightly)
      // Systole starts: C point (complete closure)
      // Systole period: Leaflet is closed (flat line near baseline)

      const phase = cyclePhase; // 0 to 2*PI

      // We map phase (0 to 2*PI) to clinical segments:
      if (phase < Math.PI * 1.1) {
        // --- DIASTOLE (Valve Open) ---
        const diastPhase = phase / (Math.PI * 1.1); // normalized 0 to 1

        if (stenosis === 1) {
          // Mitral Stenosis: Loss of rapid mid-diastolic EF dip. Stiff leaflet forming a flat castle wall "box"
          mLeaflet = 4.5 + Math.sin(diastPhase * Math.PI) * 0.8;
          // Doppler: Very high peak velocity, extremely slow slope decay
          dopFlow = 8.0 * Math.sin(diastPhase * Math.PI * 0.8);
        } else {
          // Normal or Diastolic Dysfunction
          // E wave peak occurs early (diastPhase ~ 0.25)
          // A wave peak occurs late (diastPhase ~ 0.75)
          const eCenter = 0.25;
          const aCenter = 0.75;

          let eHeight = 5.0;
          let aHeight = 3.2;

          if (diastolicD === 1) {
            // Diastolic Dysfunction: E wave is small, A wave is very tall (E/A < 1)
            eHeight = 2.8;
            aHeight = 5.5;
          }

          if (isQuizAFib) {
            // Atrial Fibrillation: No A-wave at all
            aHeight = 0;
          }

          // Mitral Leaflet E point
          const eLeafletVal = Math.exp(-Math.pow((diastPhase - eCenter) / 0.12, 2)) * eHeight;
          // F point dip
          const fDipVal = 1.0;
          // Mitral Leaflet A point
          const aLeafletVal = Math.exp(-Math.pow((diastPhase - aCenter) / 0.12, 2)) * aHeight;

          mLeaflet = Math.max(eLeafletVal, aLeafletVal);

          // Doppler Flow: E peak and A peak
          const eFlowVal = Math.exp(-Math.pow((diastPhase - eCenter) / 0.10, 2)) * (eHeight * 1.3);
          const aFlowVal = Math.exp(-Math.pow((diastPhase - aCenter) / 0.10, 2)) * (aHeight * 1.3);

          dopFlow = Math.max(eFlowVal, aFlowVal);
        }
      } else {
        // --- SYSTOLE (Valve Closed) ---
        mLeaflet = 0.5; // baseline closed leaflet
        dopFlow = 0.1; // baseline no inflow
      }

      // Add noise to M-mode edge or Doppler envelope for realism
      if (stenosis === 1) {
        mLeaflet += (Math.random() - 0.5) * 0.25; // jittery calcified leaflet
      }

      // Doppler spectral smear simulation (filled pixels below the velocity envelope)
      // In medical Doppler, we have a filled spectral envelope, not just a line
      // We can draw a line and fill it down to baseline

      // Erase a gap ahead of sweep line
      const gap = 15;
      for (let i = 0; i < gap; i++) {
        const idx = (scrollX + i) % width;
        mModePoints[idx] = -999;
        dopplerPoints[idx] = -999;
      }

      mModePoints[scrollX] = mLeaflet;
      dopplerPoints[scrollX] = dopFlow;

      // 2. Draw Upper Panel: M-Mode二尖瓣 (Glowing Cyan/Teal)
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let isDrawingM = false;
      const mCenterY = panelHeight * 0.75; // Baseline inside upper panel

      for (let x = 0; x < width; x++) {
        const val = mModePoints[x];
        if (val === -999) {
          if (isDrawingM) {
            ctx.stroke();
            isDrawingM = false;
          }
        } else {
          const y = mCenterY - val * 10; // scale
          if (!isDrawingM) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            isDrawingM = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      if (isDrawingM) ctx.stroke();

      // 3. Draw Lower Panel: Spectral Doppler (Glowing Purple/Violet filled)
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#a855f7';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.5;

      const dopBaselineY = panelHeight + panelHeight * 0.85; // Baseline inside lower panel

      // Draw Doppler column by column to fill the spectral spectrum under the curve
      for (let x = 0; x < width; x++) {
        const val = dopplerPoints[x];
        if (val !== -999) {
          const y = dopBaselineY - val * 11;
          // Draw a vertical column line representing standard spectral Doppler smear
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)'; // filled envelope background
          ctx.beginPath();
          ctx.moveTo(x, dopBaselineY);
          ctx.lineTo(x, y + 2);
          ctx.stroke();

          // Bright edge trace
          ctx.strokeStyle = '#d8b4fe';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 1, y);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0; // reset

      // Draw Sweep Line
      ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.fillRect(scrollX - 1, 0, 3, height);

      // Labels pointing to clinical points (D, E, F, A, C) in Simulator Mode
      if (mode === 'simulator' && stenosis === 0 && diastolicD === 0) {
        ctx.fillStyle = '#67e8f9';
        ctx.font = '9px sans-serif';
        // Approximate points mapping
        const cycleX = scrollX;
        ctx.fillText("E 點 (早期快速充盈)", 20, 25);
        ctx.fillText("A 點 (心房舒張期擠壓)", 20, 38);
      }

      // Panel Header texts
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText("二尖瓣前葉 M 型超音波 (Mitral Valve Anterior Leaflet M-Mode)", 12, 18);
      ctx.fillText("穿二尖瓣血流多普勒頻譜 (Transmitral Flow Velocity Spectral Doppler)", 12, panelHeight + 18);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [hr, diastolicD, stenosis, mode, currentQuizIndex]);

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
    setLocalQuizIndex((prev) => (prev + 1) % ultrasoundQuizCases.length);
  };

  if (mode === 'exam') {
    return (
      <div className="space-y-4">
        {/* Wave Monitor Canvas */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
              超音波生理信號監測 (Echocardiography Console)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">取樣線: MV Level / Sweep: 25 mm/s</span>
          </div>
          <canvas ref={canvasRef} className="w-full bg-[#09090b] rounded-lg block" />
        </div>

        {/* Readout parameters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono justify-center shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">當前心率:</span>
            <strong className="text-cyan-400">{hr} bpm</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">舒張功能:</span>
            <strong className="text-cyan-400">{diastolicD === 1 ? '舒張功能不全 (E/A 比例倒置)' : '正常 E/A 比例'}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">瓣膜狹窄:</span>
            <strong className="text-cyan-400">{stenosis === 1 ? '重度二尖瓣狹窄 (城牆樣波型)' : '正常二尖瓣前葉雙峰'}</strong>
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
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400 animate-pulse" />
            超音波生理信號監測 (Echocardiography Console)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">取樣線: MV Level / Sweep: 25 mm/s</span>
        </div>
        <canvas ref={canvasRef} className="w-full bg-[#09090b] rounded-lg block" id="ultrasound-canvas" />
      </div>

      {/* Control Panel */}
      {mode === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Shield className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                心臟超音波參數調整 (Echocardiography Parameters)
              </h3>
            </div>

            {/* Heart Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">心率 (Heart Rate)</span>
                <span className="text-cyan-400 font-bold">{hr} bpm</span>
              </div>
              <input
                type="range"
                min="45"
                max="140"
                value={hr}
                onChange={(e) => setHr(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                id="slider-us-hr"
              />
              <p className="text-[10px] text-slate-500">
                調整心動週期。心率極快時，舒張早期 E 波與心房收縮 A 波會互相融合 (EA Fusion)。
              </p>
            </div>

            {/* Mitral Stenosis Slider */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-400 block">二尖瓣活動度 (Mitral Valve Stenosis)</label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setStenosis(val);
                      if (val === 1) setDiastolicD(0); // clear other
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      stenosis === val
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                    id={`us-stenosis-btn-${val}`}
                  >
                    {val === 0 ? '正常彈性瓣葉' : '重度二尖瓣狹窄'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                重度狹窄導致瓣膜纖維硬化、舒張期無法快速復位，M 模式呈現典型城牆平坦化波型。
              </p>
            </div>

            {/* Diastolic Dysfunction Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-400 block">舒張鬆弛功能 (Left Ventricular Relaxation)</label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setDiastolicD(val);
                      if (val === 1) setStenosis(0); // clear other
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                      diastolicD === val
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                    id={`us-diastolic-btn-${val}`}
                  >
                    {val === 0 ? '正常順應性 (E/A > 1)' : '舒張功能不全 (E/A < 1)'}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                心肌鬆弛障礙導致舒張早期被動吸血力(E波)變弱，需依賴心房收縮擠血(A波)代償。
              </p>
            </div>
          </div>

          {/* Learn Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  超音波與血流動力學速記 (Echocardiography Nuggets)
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  Ⓜ️ <strong className="text-white">M 模式二尖瓣雙峰</strong>：典型 D-E-F-A-C 五個轉折點。<strong className="text-cyan-400">E 峰</strong>為舒張早期最大充盈，<strong className="text-cyan-400">A 峰</strong>為舒張晚期心房收縮。正常前後瓣呈鏡像相反運動。
                </p>
                <p>
                  🏰 <strong className="text-white">城牆樣波形 (Box pattern)</strong>：見於風濕性二尖瓣狹窄。EF 斜率幾乎歸零，波形由「M」雙峰轉變為平坦的「城牆」樣。後葉會被拉扯而與前葉呈異常的同向運動。
                </p>
                <p>
                  📊 <strong className="text-white">多普勒 E/A 比例</strong>：評估舒張功能的首選指標。正常 <strong className="text-cyan-400">E/A &gt; 1</strong>。當左室僵硬鬆弛不全時，E 波變低，A 波代償，<strong className="text-cyan-400">E/A &lt; 1</strong>。
                </p>
                <p>
                  📭 <strong className="text-white">心房顫動 A 波缺失</strong>：心房顫動時左心房失去收縮，因此 A 峰完全消失，不論是 M 模式還是穿瓣血流譜均僅剩下 E 波。
                </p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5 mt-4">
              <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
              <p className="text-[10.5px] text-slate-400 leading-snug">
                <strong>交互操作提示：</strong>點擊「正常二尖瓣」與「二尖瓣狹窄」，對比上方 M 模式中「M雙峰」和「城牆單峰」的動態落差。
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
                超音波臨床案例測驗 ({currentQuizIndex + 1} / {ultrasoundQuizCases.length})
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
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
              <p className="text-xs font-semibold text-slate-400">請選出最符合超音波波形與病史的臨床判讀報告：</p>
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700";
                  if (selectedOption === idx) {
                    btnStyle = "bg-cyan-500/10 border-cyan-500 text-cyan-400";
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
                      id={`us-opt-${idx}`}
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
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  id="us-quiz-submit"
                >
                  提交診斷報告
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="us-quiz-next"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  下一期超音波案例
                </button>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            {isAnswered ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    血流動力及二尖瓣病生理解析
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
                  <p className="text-xs font-semibold text-slate-400">診斷報告待提交</p>
                  <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto mt-1">
                    細緻對比上方的 M 型二尖瓣葉軌跡（上圖）與穿瓣血流脈衝多普勒（下圖）的雙峰波幅比例，結合病史診斷。
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 text-[10.5px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <span className="text-cyan-400 shrink-0 font-bold">💡 AI 導師提醒：</span>
              <p>
                不清楚超音波 Doppler 測量血流速的物理多普勒頻移公式嗎？問我：「舒張期二尖瓣穿瓣血流波中，E 波與 A 波代表什麼生理事件？」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
