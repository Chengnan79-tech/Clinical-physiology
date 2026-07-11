import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, CheckCircle, AlertTriangle, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export interface PFTModuleProps {
  mode: 'simulator' | 'quiz' | 'exam';
  onStateChange: (data: Record<string, any>) => void;
  examQuestionIndex?: number;
}

// Simulated PFT quiz cases
export const pftQuizCases: QuizQuestion[] = [
  {
    id: 'pft_q1',
    category: 'pft',
    title: '重度慢性阻塞性肺病 (COPD)',
    caseDescription: '一位 65 歲男性，有 40 年抽菸史，主訴近年來活動後喘鳴、慢性咳嗽。安排肺功能檢查 (PFT) 以評估氣道阻塞情形。測得 FEV1 顯著下降，且給予支氣管擴張劑後改善幅度有限。',
    parameters: {
      fvc: 85,      // FVC % predicted
      fev1: 35,     // FEV1 % predicted
      fev1_fvc: 41, // FEV1/FVC %
      tlc: 120,     // Hyperinflation (TLC)
      rv: 160,      // Air trapping (RV)
      isObstructive: 1
    },
    options: [
      '限制型肺疾病 (Restrictive Lung Disease)',
      '阻塞型肺疾病 (Obstructive Lung Disease) - 重度',
      '正常肺功能反應 (Normal Spirometry)',
      '混合型肺部功能障礙 (Mixed Defect)'
    ],
    correctAnswerIndex: 1,
    explanation: '肺功能數據顯示 FEV1/FVC 比值為 41%（正常應 &gt; 70%），符合「阻塞型肺疾病」。其 FEV1 預測值僅有 35%（落在 30% - 50% 之間），屬於重度阻塞。且其 TLC 達 120%、RV 達 160%，顯示肺部有明顯的「過度充氣 (Hyperinflation)」與「氣體滯留 (Air trapping)」，此為典型重度 COPD（如肺氣腫）。',
    clinicalSignificance: '醫檢師操作肺功能檢查時，必須指導患者吹氣達 6 秒以上且流量平台穩定，以獲得正確的 FVC 與 FEV1。此病例之阻塞波形在 Flow-Volume loop 會呈現特徵性的「呼氣曲線凹陷 (Scooping)」。'
  },
  {
    id: 'pft_q2',
    category: 'pft',
    title: '特發性肺纖維化 (IPF)',
    caseDescription: '一位 55 歲女性，主訴乾咳、逐漸加重的進行性運動呼吸困難。胸部 X 光顯示兩側下肺野呈毛玻璃樣與網狀陰影。安排肺功能及肺泡氣體擴散量 (DLCO) 測定。',
    parameters: {
      fvc: 55,      // Severely reduced volume
      fev1: 56,
      fev1_fvc: 85, // Normal/High ratio
      tlc: 58,      // Restricted TLC
      rv: 55,       // Restricted RV
      isRestrictive: 1
    },
    options: [
      '阻塞型肺疾病 (Obstructive Lung Disease)',
      '正常肺功能反應 (Normal Spirometry)',
      '限制型肺疾病 (Restrictive Lung Disease)',
      '單純擴散障礙 (Isolated Diffusion Defect)'
    ],
    correctAnswerIndex: 2,
    explanation: '肺功能特徵為：FEV1/FVC 比值為 85%（正常或偏高，&gt; 70%），但 FVC 顯著下降至預測值的 55%。總肺量 (TLC) 僅有 58%（&lt; 80%），符合「限制型肺疾病（Restrictive Lung Disease）」。Flow-Volume loop 波形表現為整個圖形對稱縮小。',
    clinicalSignificance: '限制型肺病常見於間質性肺病（如特發性肺纖維化 IPF）、塵肺症、脊椎側彎或重症肌無力患者。由於肺泡間質纖維化，肺部順應性（Compliance）降低，導致充氣容量變小。'
  },
  {
    id: 'pft_q3',
    category: 'pft',
    title: '支氣管氣喘急性發作',
    caseDescription: '一位 22 歲女大學生，在接觸貓咪後突然劇烈咳嗽、呼吸急促，並能聽到明顯哮喘音。被送至急診時，Flow-Volume loop 的呼氣曲線呈現明顯向內凹陷。',
    parameters: {
      fvc: 80,
      fev1: 52,
      fev1_fvc: 52,
      tlc: 100,
      rv: 110,
      isObstructive: 1
    },
    options: [
      '阻塞型障礙，多見於支氣管氣喘發作 (Asthma)',
      '限制型障礙，多見於肺纖維化 (IPF)',
      '胸壁畸形引起的限制型功能降低',
      '正常肺計量功能'
    ],
    correctAnswerIndex: 0,
    explanation: '數據呈現 FEV1/FVC 比值降低（52% &lt; 70%），且 FEV1 % 僅 52% 預測值，顯示有顯著的氣道阻塞。呼氣流速曲線出現明顯凹陷（Coving/Scooping），為典型「氣喘 (Asthma)」發作。給予速效型支氣管擴張劑 (SABA) 後，FEV1 通常可有顯著的可逆性改善（改善 &gt; 12% 且 &gt; 200ml）。',
    clinicalSignificance: '支氣管舒張試驗（Bronchodilator Reversibility Test, BDR）是醫檢生理學重要考點，有助於鑑別氣喘（具高度可逆性）與 COPD（可逆性較差）。'
  }
];

export default function PFTModule({ mode, onStateChange, examQuestionIndex }: PFTModuleProps) {
  // Simulator parameters (Expressed in % of predicted values)
  const [fvc, setFvc] = useState(100); // 40 - 120%
  const [fev1, setFev1] = useState(100); // 30 - 120%
  const [tlc, setTlc] = useState(100); // 40 - 130%
  const [rv, setRv] = useState(100); // 40 - 200%

  // Quiz state
  const [localQuizIndex, setLocalQuizIndex] = useState(0);
  const currentQuizIndex = mode === 'exam' && examQuestionIndex !== undefined 
    ? examQuestionIndex 
    : localQuizIndex;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeQuestion = pftQuizCases[currentQuizIndex];

  // Calculated dynamic values
  const simulatedFev1Fvc = fvc > 0 ? Math.min(95, Math.round((fev1 / fvc) * 80)) : 80;

  // Sync to parent
  useEffect(() => {
    if (mode === 'simulator') {
      onStateChange({ fvc, fev1, tlc, rv, fev1FvcRatio: simulatedFev1Fvc });
    } else {
      onStateChange({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        parameters: activeQuestion.parameters,
        userSelected: selectedOption,
        isCorrect: isAnswered ? selectedOption === activeQuestion.correctAnswerIndex : null
      });
    }
  }, [fvc, fev1, tlc, rv, simulatedFev1Fvc, mode, currentQuizIndex, selectedOption, isAnswered]);

  // Load quiz or exam params
  useEffect(() => {
    if (mode === 'quiz' || mode === 'exam') {
      const p = activeQuestion.parameters;
      setFvc(p.fvc);
      setFev1(p.fev1);
      setTlc(p.tlc);
      setRv(p.rv);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuizIndex, mode]);

  // Draw Flow-Volume Loop in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 280;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Coordinate conversion variables
    const margin = 40;
    const chartWidth = width - margin * 2;
    const chartHeight = height - margin * 2;
    const centerY = margin + chartHeight * 0.65; // Shift baseline down because expiration flow (positive) has larger range than inspiration

    // Clear Canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = margin; x <= margin + chartWidth; x += chartWidth / 10) {
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, margin + chartHeight);
      ctx.stroke();
    }
    for (let y = margin; y <= margin + chartHeight; y += chartHeight / 8) {
      ctx.beginPath();
      ctx.moveTo(margin, y);
      ctx.lineTo(margin + chartWidth, y);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    // X-axis (Volume L)
    ctx.beginPath();
    ctx.moveTo(margin, centerY);
    ctx.lineTo(margin + chartWidth, centerY);
    ctx.stroke();
    // Y-axis (Flow L/s)
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + chartHeight);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText("流量 Flow (L/s) [呼氣]", margin + 5, margin + 12);
    ctx.fillText("[吸氣]", margin + 5, margin + chartHeight + 15);
    ctx.fillText("容積 Volume (L)", margin + chartWidth - 80, centerY - 8);

    // Origin labels
    ctx.fillText("0", margin - 12, centerY + 3);
    ctx.fillText("TLC (高容積)", margin, centerY + 15);
    ctx.fillText("RV (低容積)", margin + chartWidth * 0.8, centerY + 15);

    // Helpers to scale values to pixels
    const scaleX = (volPct: number) => {
      // PFT curves plot TLC on left, RV on right. Higher volumes to the left.
      // Scale 0% to 150% predicted
      return margin + (volPct / 150) * chartWidth * 0.8;
    };

    const scaleY = (flow: number) => {
      // Flow plots upwards for expiration (positive), downwards for inspiration (negative)
      // Max expiratory flow normal is around 10 L/s, min inspiratory normal is -6 L/s
      // Scale flow from +12 to -8 L/s
      const range = 20; // total range
      const ratio = (12 - flow) / range;
      return margin + ratio * chartHeight;
    };

    // 1. Draw PREDICTED Normal Curve (as reference in dotted gray/green)
    const drawPftCurve = (
      fvcPct: number,
      fevPct: number,
      tlcPct: number,
      rvPct: number,
      color: string,
      lineWidth: number,
      isDashed: boolean,
      isSimulated: boolean
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (isDashed) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();

      // We establish endpoints based on TLC and RV
      const tlcPointX = scaleX(100 - (tlcPct - 100) * 0.4); // Left point (larger TLC shifts left)
      const rvPointX = scaleX(100 + (rvPct - 100) * 0.4 + (100 - fvcPct) * 0.5); // Right point

      // Start expiration at TLC
      ctx.moveTo(tlcPointX, centerY);

      // Peak Expiratory Flow (PEF). PEF occurs early in volume expiration (approx 15% of the way from TLC to RV)
      const pefX = tlcPointX + (rvPointX - tlcPointX) * 0.15;
      const pefY = scaleY(10 * (fevPct / 100)); // peak flow proportional to FEV1%

      // Handle obstructive shape (scooping) vs restrictive shape (straight line but narrow)
      // During expiration (from PEF to RV), draw points along the curve
      const steps = 30;
      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps; // 0 to 1
        const x = pefX + (rvPointX - pefX) * ratio;

        let flow = 0;
        if (isSimulated && (fevPct / fvcPct < 0.75)) {
          // Obstructive "Scooped" curve
          // We use a power function to scoop the curve downwards
          const factor = Math.pow(1 - ratio, 2.2); // high exponent creates scooping
          flow = 10 * (fevPct / 100) * factor;
        } else {
          // Normal or Restrictive straight-line descent
          flow = 10 * (fevPct / 100) * (1 - ratio);
        }

        // Clip flow at 0
        flow = Math.max(0, flow);

        // First link TLC to PEF
        if (i === 1) {
          ctx.quadraticCurveTo(tlcPointX + (pefX - tlcPointX) * 0.5, scaleY(10 * (fevPct / 100) * 0.6), pefX, pefY);
        }

        ctx.lineTo(x, scaleY(flow));
      }

      // Draw Inspiratory Loop (Semicircle below baseline)
      ctx.setLineDash([]); // Always solid for inspiratory loop
      ctx.moveTo(rvPointX, centerY);
      // Beautiful arc back to TLC
      const inspiratoryPeakY = scaleY(-5 * (fvcPct / 100)); // proportional to FVC
      ctx.quadraticCurveTo(
        tlcPointX + (rvPointX - tlcPointX) * 0.5,
        inspiratoryPeakY,
        tlcPointX,
        centerY
      );

      ctx.stroke();
    };

    // Draw Reference Predicted curve (solid grey)
    drawPftCurve(100, 100, 100, 100, 'rgba(148, 163, 184, 0.35)', 1.5, true, false);

    // Draw Active Patient's curve (glowing neon orange/amber)
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#f59e0b'; // Amber glow
    drawPftCurve(fvc, fev1, tlc, rv, '#f59e0b', 2.5, false, true);
    ctx.shadowBlur = 0; // reset

    // Add overlay legend text
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.fillText("--- 預測正常參考線 (Predicted Reference)", margin + 20, margin + 40);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText("—— 當前病患測試線 (Patient Active)", margin + 20, margin + 55);

  }, [fvc, fev1, tlc, rv, mode, currentQuizIndex]);

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
    setLocalQuizIndex((prev) => (prev + 1) % pftQuizCases.length);
  };

  if (mode === 'exam') {
    return (
      <div className="space-y-4">
        {/* PFT Graph View */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              流量-容積曲線 (Flow-Volume Loop)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">紙速單位: 標準比例 L vs L/s</span>
          </div>
          <canvas ref={canvasRef} className="w-full bg-slate-900 rounded-lg block" />
        </div>

        {/* Readout parameters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono justify-center shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">FVC %預測:</span>
            <strong className="text-amber-400">{fvc}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">FEV1 %預測:</span>
            <strong className="text-amber-400">{fev1}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">FEV1/FVC 比值:</span>
            <strong className={`font-bold ${simulatedFev1Fvc < 70 ? 'text-red-400' : 'text-emerald-400'}`}>{simulatedFev1Fvc}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">TLC %預測:</span>
            <strong className="text-amber-400">{tlc}%</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">RV %預測:</span>
            <strong className="text-amber-400">{rv}%</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PFT Graph View */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            流量-容積曲線 (Flow-Volume Loop)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">紙速單位: 標準比例 L vs L/s</span>
        </div>
        <canvas ref={canvasRef} className="w-full bg-slate-900 rounded-lg block" id="pft-loop-canvas" />
      </div>

      {/* Control / Interactive Panel */}
      {mode === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Wind className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                肺計量參數調整 (Spirometry Parameters)
              </h3>
            </div>

            {/* FVC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">用力肺活量 (FVC % predicted)</span>
                <span className="text-amber-400 font-bold">{fvc}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                value={fvc}
                onChange={(e) => setFvc(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                id="slider-pft-fvc"
              />
              <p className="text-[10px] text-slate-500">
                代表肺部能呼出的最大總體積。正常 &gt; 80%。限制型肺病會顯著降低 FVC。
              </p>
            </div>

            {/* FEV1 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">第一秒用力呼氣量 (FEV1 % predicted)</span>
                <span className="text-amber-400 font-bold">{fev1}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                value={fev1}
                onChange={(e) => setFev1(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                id="slider-pft-fev1"
              />
              <p className="text-[10px] text-slate-500">
                第一秒內呼出的體積，反映氣道通暢度。正常 &gt; 80%。阻塞型肺疾病會大幅下降。
              </p>
            </div>

            {/* FEV1/FVC Ratio Indicator (Read-only calculated) */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400 block font-semibold">一秒率 FEV1 / FVC 比值</span>
                <span className="text-[10px] text-slate-500">阻塞型診斷黃金標準：正常需 &gt; 70%</span>
              </div>
              <span className={`text-lg font-bold font-mono ${simulatedFev1Fvc < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                {simulatedFev1Fvc}%
              </span>
            </div>

            {/* TLC Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">總肺量 (TLC % predicted)</span>
                <span className="text-amber-400 font-bold">{tlc}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="130"
                value={tlc}
                onChange={(e) => setTlc(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                id="slider-pft-tlc"
              />
              <p className="text-[10px] text-slate-500">
                最大吸氣末肺內氣體總量。限制型肺病 TLC &lt; 80%；阻塞型（如肺氣腫）可能因過度充氣而 &gt; 120%。
              </p>
            </div>

            {/* RV Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">功能殘氣量 (RV % predicted)</span>
                <span className="text-amber-400 font-bold">{rv}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={rv}
                onChange={(e) => setRv(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                id="slider-pft-rv"
              />
              <p className="text-[10px] text-slate-500">
                用力呼氣後肺內殘留的氣量。氣道阻塞病患因「氣體滯留」，殘氣量 RV 會顯著升高。
              </p>
            </div>
          </div>

          {/* Quick Learning Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  肺功能學理速記 (PFT Clinical Pearls)
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  🟢 <strong className="text-white">阻塞型 (Obstructive)</strong>：一秒率 <strong className="text-amber-400">FEV1/FVC &lt; 70%</strong>。最典型特徵是呼氣曲線中後段凹陷（呼氣流速在低肺容積時快速下降）。見於 COPD、氣喘。
                </p>
                <p>
                  🔴 <strong className="text-white">限制型 (Restrictive)</strong>：一秒率 FEV1/FVC 正常（&gt; 70%），但 <strong className="text-amber-400">FVC &lt; 80%</strong> 且總肺量 <strong className="text-amber-400">TLC &lt; 80%</strong>。典型特徵是曲線形狀正常，但整個體積軸明顯「縮小、變窄」。見於間質性肺纖維化。
                </p>
                <p>
                  🔵 <strong className="text-white">混合型 (Mixed)</strong>：一秒率 FEV1/FVC &lt; 70% 且 TLC &lt; 80%。同時合併氣道阻塞與肺實質容積受限。
                </p>
                <p>
                  💨 <strong className="text-white">DLCO 擴散量</strong>：代表肺泡毛細血管膜的氣體交換能力。肺纖維化及肺氣腫會導致 DLCO 下降；氣喘患者的 DLCO 通常正常。
                </p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5 mt-4">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-[10.5px] text-slate-400 leading-snug">
                <strong>拖動左側滑桿試試：</strong>將 FEV1 降到 40%、FVC 保持 90%，觀察曲線是如何「內凹」的；或將 FVC 和 TLC 同時調低至 55%，觀察「限制型」對稱縮小波形。
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question and Options */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                PFT 臨床案例測驗 ({currentQuizIndex + 1} / {pftQuizCases.length})
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
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

            {/* Display case parameters as standard clinical table */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850/80 space-y-1.5">
              <p className="text-[10px] text-slate-500 font-mono">PFT Report Data / 臨床肺功能檢驗數值表：</p>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">FVC %預測</span>
                  <span className="text-slate-200 font-bold">{activeQuestion.parameters.fvc}%</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">FEV1 %預測</span>
                  <span className="text-slate-200 font-bold">{activeQuestion.parameters.fev1}%</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">FEV1 / FVC</span>
                  <span className={`font-bold ${activeQuestion.parameters.fev1_fvc < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {activeQuestion.parameters.fev1_fvc}%
                  </span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">TLC %預測</span>
                  <span className="text-slate-200 font-bold">{activeQuestion.parameters.tlc}%</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">RV %預測</span>
                  <span className="text-slate-200 font-bold">{activeQuestion.parameters.rv}%</span>
                </div>
                <div className="p-1.5 bg-slate-900 rounded">
                  <span className="text-slate-500 block">DLCO %預測</span>
                  <span className="text-slate-200 font-bold">
                    {activeQuestion.parameters.isRestrictive ? '52% (低下)' : '78% (正常)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400">請選出最符合該檢驗數據與病史的臨床判讀：</p>
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700";
                  if (selectedOption === idx) {
                    btnStyle = "bg-amber-500/10 border-amber-500 text-amber-400";
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
                      id={`pft-opt-${idx}`}
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
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  id="pft-quiz-submit"
                >
                  提交分析報告
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="pft-quiz-next"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  下一期案例測驗
                </button>
              )}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 shadow-md flex flex-col justify-between">
            {isAnswered ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    醫計量分析與病理機制
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
                      醫檢師臨床考量
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
                    細緻觀察上方橙色用力呼氣環與預測參考虛線的重疊情況，結合數據表判斷限制型或阻塞型病理特徵。
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 text-[10.5px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <span className="text-amber-400 shrink-0 font-bold">💡 AI 導師提醒：</span>
              <p>
                可於右側與我對話。你可以輸入：「請幫我對比阻塞性（COPD）與限制性（纖維化）肺功能檢查的特徵！」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
