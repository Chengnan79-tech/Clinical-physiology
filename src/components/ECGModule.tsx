import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, CheckCircle, AlertTriangle, Sparkles, HelpCircle, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

export interface ECGModuleProps {
  mode: 'simulator' | 'quiz' | 'exam';
  onStateChange: (data: Record<string, any>) => void;
  examQuestionIndex?: number;
}

// Simulated ECG cases
export const ecgQuizCases: QuizQuestion[] = [
  {
    id: 'ecg_q1',
    category: 'ecg',
    title: '急性下壁心肌梗塞 (Acute Inferior STEMI)',
    caseDescription: '一位 58 歲男性，突發劇烈胸骨後壓迫性疼痛 2 小時，伴大汗淋漓與雙側肩膀放射痛。急診心電圖顯示 II、III、aVF 導程有明顯異常。',
    parameters: { hr: 85, pr: 0.15, qrs: 0.09, st: 3.5, tAmp: 5.0 },
    options: [
      '急性下壁心肌梗塞 (Acute Inferior STEMI)',
      '急性前壁心肌梗塞 (Acute Anterior STEMI)',
      '第一度房室傳導阻滯 (1st Degree AV Block)',
      '心房顫動 (Atrial Fibrillation)'
    ],
    correctAnswerIndex: 0,
    explanation: '在 II、III、aVF 導程（代表心臟下壁）中，ST 段明顯呈墓碑樣上升（ST-Elevation > 1mm）並伴有高尖 T 波，為典型急性下壁心肌梗塞。常起因於右冠狀動脈 (RCA) 阻塞。',
    clinicalSignificance: '黃金治療時間極為關鍵（Time is muscle）。醫檢師必須立即通報危急值，安排緊急心導管手術 (PCI)。'
  },
  {
    id: 'ecg_q2',
    category: 'ecg',
    title: '心房顫動伴快速心室反應 (Atrial Fibrillation with RVR)',
    caseDescription: '一位 72 歲女性，主訴近日反覆心悸、胸悶及倦怠。聽診時心音極度不規則。常規心電圖顯示 P 波消失，代之以細微不規則的顫動波，R-R 間期完全不規則。',
    parameters: { hr: 125, pr: 0, qrs: 0.08, st: 0, tAmp: 2.0 },
    isAfib: 1,
    options: [
      '心室頻脈 (Ventricular Tachycardia)',
      '第一度房室傳導阻滯 (1st Degree AV Block)',
      '心房顫動 (Atrial Fibrillation) 伴快速心室反應',
      '竇性心搏過速 (Sinus Tachycardia)'
    ],
    correctAnswerIndex: 2,
    explanation: '心電圖特徵為：P 波消失，基線出現不規則且頻率為 350-600 bpm 的 f 顫動波，且 R-R 間期絕對不規則 (Irregularly irregular)，心室率大於 100 bpm。符合心房顫動伴快速心室反應。',
    clinicalSignificance: '心房失去了有效的同步收縮，血液容易在左心耳滯留形成血栓，是缺血性中風（腦梗塞）的重要風險因子，臨床常需評估抗凝血劑 (如 Warfarin 或 NOAC) 的使用。'
  },
  {
    id: 'ecg_q3',
    category: 'ecg',
    title: '第一度房室傳導阻滯 (1st Degree AV Block)',
    caseDescription: '一位 23 歲職業馬拉松選手，接受常規運動員體檢。心電圖顯示其 PR 間期異常延長，但每個 P 波後均能正常傳導一個 QRS 波。',
    parameters: { hr: 55, pr: 0.28, qrs: 0.08, st: 0, tAmp: 2.5 },
    options: [
      '第二度 I 型房室阻滯 (Mobitz I)',
      '第一度房室傳導阻滯 (1st Degree AV Block)',
      '第三度（完全性）房室阻滯',
      '竇性心搏過緩 (Sinus Bradycardia)'
    ],
    correctAnswerIndex: 1,
    explanation: '每個 P 波後都緊跟一個 QRS 複合波（1:1 傳導），PR 間期恆定延長達 0.28 秒（正常值為 0.12 - 0.20 秒），符合第一度房室阻滯診斷。常見於迷走神經張力過高者（如運動員）或藥物影響。',
    clinicalSignificance: '通常為良性表現，無臨床症狀者不需特殊處置與治療，但須注意藥物（如 Beta-Blockers 或 Digoxin）的使用劑量。'
  },
  {
    id: 'ecg_q4',
    category: 'ecg',
    title: '心室頻脈 (Ventricular Tachycardia, VT)',
    caseDescription: '一位 65 歲男性，有陳舊性心肌梗塞病史。於加護病房監護時突然意識喪失，心電圖監控出現規律、寬大畸形的 QRS 複合波，心率達 160 bpm，無法辨認 P 波與 T 波。',
    parameters: { hr: 160, pr: 0, qrs: 0.18, st: 0, tAmp: 0 },
    isVT: 1,
    options: [
      '心室頻脈 (Ventricular Tachycardia, VT)',
      '心房顫動 (Atrial Fibrillation)',
      '陣發性室上性心搏過速 (PSVT)',
      '竇性心搏過速 (Sinus Tachycardia)'
    ],
    correctAnswerIndex: 0,
    explanation: '心電圖呈現連續 3 個或以上寬大畸形的 QRS 複合波（QRS 寬度 > 0.12 秒），心率極快且規則，與心房活動完全解離（找不到 P 波）。此為典型的心室頻脈 (VT)。',
    clinicalSignificance: '屬於可能危及生命的惡性心律不整。若患者無脈搏且意識喪失，應立即進行同步電擊（若有脈搏）或去顫電擊（無脈搏，Defibrillation）與持續 CPR。'
  },
  {
    id: 'ecg_q5',
    category: 'ecg',
    title: '心室顫動 (Ventricular Fibrillation, VF)',
    caseDescription: '一位急性心肌梗塞患者在急診室突然大叫一聲，隨即抽搐、神志不清。床邊心電圖監護儀顯示主波完全消失，基線呈現雜亂無章、振幅與頻率均不規則的波動。',
    parameters: { hr: 180, pr: 0, qrs: 0.20, st: 0, tAmp: 0 },
    isVF: 1,
    options: [
      '心室頻脈 (Ventricular Tachycardia)',
      '心室顫動 (Ventricular Fibrillation, VF)',
      '心臟停搏 (Asystole)',
      '心房顫動 (Atrial Fibrillation)'
    ],
    correctAnswerIndex: 1,
    explanation: '心電圖無正常的 P、QRS、T 波群，取而代之的是完全無規則、波幅大小不一的心室顫動波（VF waves）。此時心室無有效排血，等同心臟驟停。',
    clinicalSignificance: '這是最危急的致命性心律不整，必須在數秒內給予非同步電擊去顫 (Defibrillation) 並實施 CPR。每延遲一分鐘電擊，存活率下降 7-10%。'
  },
  {
    id: 'ecg_q6',
    category: 'ecg',
    title: '心房撲動 (Atrial Flutter, AFlut)',
    caseDescription: '一位 61 歲男性，常規體檢發現心電圖在 II、III、aVF 導程有連續、鋸齒狀 (Sawtooth) 的快速基線波動，鋸齒頻率約為 300 bpm，而心室率呈規則的 75 bpm 傳導。',
    parameters: { hr: 75, pr: 0, qrs: 0.08, st: 0, tAmp: 2.0 },
    isAFlutter: 1,
    options: [
      '心房顫動 (Atrial Fibrillation)',
      '第一度房室傳導阻滯',
      '心房撲動 (Atrial Flutter) 伴 4:1 房室傳導',
      '竇性心搏過速 (Sinus Tachycardia)'
    ],
    correctAnswerIndex: 2,
    explanation: '典型特徵為正常 P 波消失，代之以極具特徵、大小及形態一致的「鋸齒狀」撲動波（F 波），頻率常在 250-350 bpm 之間。此案例中 F 波頻率約 300 bpm，心室率 75 bpm，房室傳導比例為規律的 4:1。',
    clinicalSignificance: '多見於器質性心臟病（如二尖瓣病變、冠心病）。因其基底撲動波規則，較心房顫動更易通過射頻消融術 (Catheter Ablation) 達到根治。'
  },
  {
    id: 'ecg_q7',
    category: 'ecg',
    title: '第二度 I 型房室傳導阻滯 (Mobitz Type I / Wenckebach)',
    caseDescription: '一位 48 歲男性，偶爾感覺有「漏跳一拍」的心跳暫停感。心電圖顯示 PR 間期逐拍延長，直到一個 P 波後方的 QRS 波脫落（無法傳導），之後又重複此一循環。',
    parameters: { hr: 55, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.2 },
    isMobitzI: 1,
    options: [
      '第一度房室傳導阻滯',
      '第二度 I 型房室傳導阻滯 (Mobitz I)',
      '第二度 II 型房室傳導阻滯 (Mobitz II)',
      '第三度（完全性）房室傳導阻滯'
    ],
    correctAnswerIndex: 1,
    explanation: '此為 Wenckebach（文氏）現象：PR 間期進行性延長，伴隨 R-R 間期進行性縮短，直至一個 P 波後方的 QRS 脫落。通常病變位於房室結 (AV Node)，阻滯程度屬相對良性。',
    clinicalSignificance: '多與迷走神經張力增高、藥物影響或急性下壁心肌梗塞累及房室結血供有關。若無明顯血液動力學症狀，通常僅需密切觀察，無需植入臨時起搏器。'
  },
  {
    id: 'ecg_q8',
    category: 'ecg',
    title: '第二度 II 型房室傳導阻滯 (Mobitz Type II)',
    caseDescription: '一位 70 歲男性，主訴間歇性頭暈與黑朦。心電圖顯示 PR 間期恆定保持正常或輕度延長，但在無任何徵兆下，突然出現 P 波後面無 QRS 複合波傳導的現象（呈 3:2 或 2:1 阻滯）。',
    parameters: { hr: 45, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.0 },
    isMobitzII: 1,
    options: [
      '第一度房室傳導阻滯',
      '第二度 I 型房室傳導阻滯 (Mobitz I)',
      '第二度 II 型房室傳導阻滯 (Mobitz II)',
      '竇性心搏過緩 (Sinus Bradycardia)'
    ],
    correctAnswerIndex: 2,
    explanation: '特徵為 PR 間期保持恆定，但出現突然的 QRS 波脫落。這代表阻滯部位通常在房室束（His 束）以下，屬於傳導系統的器質性嚴重病變。',
    clinicalSignificance: 'Mobitz II 阻滯極易進展為第三度（完全性）房室傳導阻滯，導致心跳極度過緩甚至阿斯綜合徵 (Stokes-Adams attack)，是絕對需要植入永久性心臟起搏器 (Pacemaker) 的指徵。'
  },
  {
    id: 'ecg_q9',
    category: 'ecg',
    title: '第三度房室傳導阻滯 (Complete AV Block)',
    caseDescription: '一位 82 歲女性，在家中暈厥被送至急診。心電圖顯示 P 波與 QRS 複合波完全無關（房室分離），P 波頻率約 80 bpm，而 QRS 波頻率呈極慢且規律的 35 bpm，QRS 呈現寬大。',
    parameters: { hr: 38, pr: 0.16, qrs: 0.12, st: 0, tAmp: 2.0 },
    isThirdDegreeAVB: 1,
    options: [
      '第二度 II 型房室傳導阻滯',
      '第一度房室傳導阻滯',
      '第三度（完全性）房室阻滯 (Complete AV Block)',
      '高度房室傳導阻滯'
    ],
    correctAnswerIndex: 2,
    explanation: '心房與心室的電活動完全獨立，各自走各自的節律（AV Dissociation）。心房率通常大於心室率。本例中 P 波是由竇房結控制（~80 bpm），而 QRS 是由阻滯點下方的室性或交界性逸搏心律控制（~35 bpm），符合完全性房室傳導阻滯。',
    clinicalSignificance: '這是最嚴重的房室傳導故障，可導致嚴重的腦供血不足與休克。急診需立即給予阿托品（Atropine）、經皮或經靜脈臨時起搏，並儘快安排永久性起搏器植入。'
  },
  {
    id: 'ecg_q10',
    category: 'ecg',
    title: '右束支傳導阻滯 (Right Bundle Branch Block, RBBB)',
    caseDescription: '一位 35 歲男性接受兵役常規體檢，無任何自覺症狀。心電圖顯示 QRS 複合波寬度延長為 0.14s，在 V1 導程可見到典型的「兔子耳朵」(rSR\') 雙峰波，V6 導程可見寬闊的 S 波。',
    parameters: { hr: 75, pr: 0.16, qrs: 0.14, st: 0, tAmp: 2.0 },
    isRBBB: 1,
    options: [
      '左束支傳導阻滯 (LBBB)',
      '右束支傳導阻滯 (RBBB)',
      '心室早期收縮 (PVC)',
      '預激綜合徵 (WPW)'
    ],
    correctAnswerIndex: 1,
    explanation: '右束支傳導受阻使右心室去極化延遲。心電圖特徵包括：QRS 寬度 >= 0.12s，V1 或 V2 導程呈現 M 型的 rSR\' 或 rsR\' 波（兔子耳），且 I、aVL、V5、V6 導程有增寬且鈍挫的 S 波。',
    clinicalSignificance: 'RBBB 在健康人群中亦不罕見（可為先天性），通常預後良好。然而若合併有心血管疾病、心肌炎、或急性肺栓塞（Cor Pulmonale），則具有重要的診斷提示意義。'
  },
  {
    id: 'ecg_q11',
    category: 'ecg',
    title: '左束支傳導阻滯 (Left Bundle Branch Block, LBBB)',
    caseDescription: '一位 68 歲高血壓及冠心病史女性，因心悸就診。心電圖顯示 QRS 複合波寬度顯著延長至 0.15s，在 I、aVL、V5、V6 導程呈現寬大、頂端鈍挫或有切跡的 R 波，且不見 Q 波，V1-V2 呈寬深 QS 波。',
    parameters: { hr: 70, pr: 0.15, qrs: 0.15, st: -0.5, tAmp: -1.5 },
    isLBBB: 1,
    options: [
      '左束支傳導阻滯 (LBBB)',
      '右束支傳導阻滯 (RBBB)',
      '急性下壁心肌梗塞',
      '左心室肥大 (LVH)'
    ],
    correctAnswerIndex: 0,
    explanation: '左束支傳導受阻，左心室只能依靠右心室擴散而來的電信號去極化，導致 QRS 顯著增寬（>= 0.12s），V5、V6、I、aVL 等左側導程 R 波寬大、頂部粗鈍或呈 M 型切跡，且常伴隨繼發性 ST-T 改變（與主波方向相反）。符合 LBBB。',
    clinicalSignificance: '與 RBBB 不同，新發生的 LBBB 幾乎都代表器質性心臟病（如高血壓心臟病、心肌病或急性心肌梗塞）。如果新發生 LBBB 伴隨胸痛，臨床應等同於 STEMI 緊急處理！'
  },
  {
    id: 'ecg_q12',
    category: 'ecg',
    title: '高鉀血症 (Hyperkalemia)',
    caseDescription: '一位 54 歲透析患者，因未按時進行血液透析而感到極度虛弱與四肢麻木。急診抽血報告顯示血清鉀離子濃度為 7.2 mEq/L。心電圖顯示 T 波極度高尖呈帳篷樣（Tent-like），P 波幾乎消失，且 QRS 增寬。',
    parameters: { hr: 58, pr: 0, qrs: 0.13, st: 0, tAmp: 6.5 },
    isHyperkalemia: 1,
    options: [
      '低鉀血症 (Hypokalemia)',
      '急性下壁心肌梗塞 (STEMI)',
      '高鉀血症 (Hyperkalemia)',
      '高鈣血症 (Hypercalcemia)'
    ],
    correctAnswerIndex: 2,
    explanation: '血清鉀過高（> 5.5 mEq/L）時，心電圖首先出現對稱、狹窄且極度高尖的 T 波（帳篷樣 T 波）。隨著血鉀進一步升高，心房肌傳導受抑制，P 波振幅降低、增寬甚至消失（竇室傳導），且 QRS 複合波增寬，若不及時處理會演變為竇房結-心室呈正弦波。',
    clinicalSignificance: '高鉀血症是臨床高度危急值！會引發致命性心室顫動或心臟停搏。必須立即給予葡萄糖酸鈣（穩定細胞膜）、胰島素加葡萄糖、降鉀藥物，並安排緊急洗腎。'
  },
  {
    id: 'ecg_q13',
    category: 'ecg',
    title: '低鉀血症 (Hypokalemia)',
    caseDescription: '一位 32 歲女性，因嚴重腹瀉、頻繁嘔吐三天，主訴全身無力。抽血檢驗顯示血鉀為 2.4 mEq/L。心電圖檢查顯示 T 波平坦、ST 段壓低，且在 T 波後方出現明顯的正向 U 波。',
    parameters: { hr: 82, pr: 0.18, qrs: 0.08, st: -1.0, tAmp: 0.5 },
    isHypokalemia: 1,
    options: [
      '高鉀血症',
      '低鉀血症 (Hypokalemia)',
      '低鈣血症',
      '毛地黃效應'
    ],
    correctAnswerIndex: 1,
    explanation: '低鉀血症（< 3.5 mEq/L）時，心室再極化延延迟。典型心電圖表現包括：T 波振幅降低、平坦甚至倒置；ST 段壓低（>= 0.5mm）；以及在 T 波後方出現顯著的 U 波（U 波振幅 > 1mm 或 U 波 > T 波）。這常被描述為 T-U 融合。',
    clinicalSignificance: '低鉀會增加心肌興奮性，容易誘發室性早期收縮（PVC）甚至尖端扭轉型室速（Torsades de Pointes）。需積極補充鉀離子並針對病因治療。'
  },
  {
    id: 'ecg_q14',
    category: 'ecg',
    title: '預激綜合徵 (Wolff-Parkinson-White Syndrome, WPW)',
    caseDescription: '一位 19 歲大一新生，在校園體檢中無症狀。心電圖檢查發現：PR 間期顯著縮短為 0.09s，QRS 複合波增寬為 0.13s，且 QRS 起步部分呈現一個斜行緩慢的向上突起（Delta 波）。',
    parameters: { hr: 80, pr: 0.09, qrs: 0.13, st: 0, tAmp: 2.0 },
    isWPW: 1,
    options: [
      '第一度房室傳導阻滯',
      '右束支傳導阻滯 (RBBB)',
      '預激綜合徵 (WPW Syndrome)',
      '心室頻脈'
    ],
    correctAnswerIndex: 2,
    explanation: 'WPW 綜合徵是由於心房與心室之間存在一條異常的快速傳導副路（Kent 束）。這使部分心室肌被提前激發，特徵為：PR 間期縮短（< 0.12s），QRS 起步處有預激 Delta 波（δ 波），QRS 複合波增寬（> 0.11s）。',
    clinicalSignificance: 'WPW 患者雖然平時多無症狀，但副路的存在構成了解剖學上的折返環，極易誘發房室折返性心搏過速（AVRT），或在合併房顫時引發致命的心室率，需安排心導管電生理檢查與副路消融手術。'
  },
  {
    id: 'ecg_q15',
    category: 'ecg',
    title: '布魯加達氏綜合徵 (Brugada Syndrome Type 1)',
    caseDescription: '一位 38 歲健康男性，其親哥哥在一年前於睡眠中猝死（俗稱鬼壓床或賴特綜合徵）。他接受常規心電圖檢查，發現在 V1 導程有高達 3mm 的 coved-type ST 段上升，緊接著一個倒置的 T 波。',
    parameters: { hr: 72, pr: 0.16, qrs: 0.10, st: 3.0, tAmp: -2.0 },
    isBrugada: 1,
    options: [
      '急性下壁心肌梗塞',
      '急性心包炎',
      '布魯加達氏綜合徵 (Brugada Syndrome Type 1)',
      '左束支傳導阻滯'
    ],
    correctAnswerIndex: 2,
    explanation: 'Brugada 綜合徵是一種遺傳性心臟離子通道病。第一型（Type 1）特徵為右胸導程（V1-V3）ST 段呈「穹窿型 (Coved-type)」抬高 >= 2mm，且其後緊接倒置的 T 波。此綜合徵患者心臟結構正常，但有極高猝死風險。',
    clinicalSignificance: '這是亞洲年輕男性「夜間猝死綜合徵」的主要元兇，容易在夜間發作致命性多形性室速或心室顫動。對於高危患者（有暈厥史 or 家族猝死史），植入式心臟去顫器 (ICD) 是唯一被證實有效的預防手段。'
  },
  {
    id: 'ecg_q16',
    category: 'ecg',
    title: '長 QT 綜合徵 (Long QT Syndrome, LQTS)',
    caseDescription: '一位 15 歲女中學生，在學校升旗典禮時突然暈厥倒地。心電圖排除其他原因後，發現其校正後 QT 間期（QTc）顯著延長，達 520 ms（正常男性 < 450 ms，女性 < 460 ms）。',
    parameters: { hr: 60, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.0 },
    isLQTS: 1,
    options: [
      '高鉀血症',
      '長 QT 綜合徵 (Long QT Syndrome)',
      '預激綜合徵',
      '第一度房室傳導阻滯'
    ],
    correctAnswerIndex: 1,
    explanation: '長 QT 綜合徵（LQTS）是由心肌復極化延遲引起的，其特徵為 QTc 間期顯著延長。復極延遲易誘發早期後除極（EAD），從而引發尖端扭轉型心室頻脈（Torsades de Pointes）及暈厥、猝死。',
    clinicalSignificance: '可分為先天遺傳性（如 Romano-Ward 綜合徵）或後天獲得性（如低鉀、低鎂或使用促復極延遲藥物如 Quinidine、Erythromycin 等）。需避免劇烈運動，並使用 Beta-blockers 或植入 ICD 預防。'
  },
  {
    id: 'ecg_q17',
    category: 'ecg',
    title: '尖端扭轉型室速 (Torsades de Pointes, TdP)',
    caseDescription: '一位正在服用抗心律不整藥物的 67 歲女性，因突發暈厥送急診。監控儀捕捉到一段突發的室性心搏過速，其 QRS 複合波的振幅與軸向圍繞著等電位線呈現規則的螺旋狀扭轉，數秒後自行終止。',
    parameters: { hr: 170, pr: 0, qrs: 0.18, st: 0, tAmp: 0 },
    isTdP: 1,
    options: [
      '心房顫動 (Atrial Fibrillation)',
      '尖端扭轉型室速 (Torsades de Pointes, TdP)',
      '單形性心室頻脈',
      '心房撲動'
    ],
    correctAnswerIndex: 1,
    explanation: '尖端扭轉型室速（Torsades de Pointes）是一種特殊的「多形性心室頻脈」，特徵為 QRS 波尖端圍繞基線不斷扭轉，主波方向每隔 5-20 個心搏就旋轉 180 度。其發作常與先前的 QT 間期延長有關。',
    clinicalSignificance: '這是一種極危險的心律不整，容易惡化為心室顫動。首選緊急治療是靜脈注射「硫酸鎂」(Magnesium Sulfate, MgSO4)，並停用所有延長 QT 的藥物。'
  },
  {
    id: 'ecg_q18',
    category: 'ecg',
    title: '毛地黃效應 (Digitalis Effect)',
    caseDescription: '一位 73 歲心衰竭女性，長期服用強心劑 Digoxin。在常規心電圖檢查中，發現 ST 段呈特徵性的「魚鉤樣」或「勺狀 (Scooped-out)」下移，且 QT 間期縮短。她目前無噁心、視力模糊等Digoxin中毒症狀。',
    parameters: { hr: 65, pr: 0.18, qrs: 0.08, st: -2.0, tAmp: 1.0 },
    isDigitalis: 1,
    options: [
      '急性下壁心肌梗塞',
      '低鉀血症',
      '毛地黃效應 (Digitalis Effect / Digitalis Sag)',
      '慢性心肌缺血'
    ],
    correctAnswerIndex: 2,
    explanation: '毛地黃效應（Digitalis Effect）是指使用 Digoxin 後出現的特徵性心電圖改變，最典型的是 ST 段凹面向上形凹陷，與 T 波前支融合，形成「勺狀」或「魚鉤樣」改變（類似鬍子）。這代表「藥物作用」，而非必為「藥物中毒」。',
    clinicalSignificance: '醫檢師必須與心肌缺血性 ST 壓低進行鑑別。如果患者伴隨噁心、嘔吐、黃綠視、頻發 PVC 等，則需高度警惕「毛地黃中毒」，並立刻檢測血中 Digoxin 濃度。'
  },
  {
    id: 'ecg_q19',
    category: 'ecg',
    title: '急性前壁心肌梗塞 (Acute Anterior STEMI)',
    caseDescription: '一位 52 歲男性，突發持續性胸骨後劇烈壓榨痛 1 小時，向左前臂放射，含服硝酸甘油無效。心電圖顯示 V1-V4 導程出現墓碑樣 ST 段顯著抬高，符合病變定位。',
    parameters: { hr: 95, pr: 0.14, qrs: 0.09, st: 4.0, tAmp: 4.5 },
    isAnteriorSTEMI: 1,
    options: [
      '急性前壁心肌梗塞 (Acute Anterior STEMI)',
      '急性下壁心肌梗塞 (Acute Inferior STEMI)',
      '急性心包炎 (Acute Pericarditis)',
      '右束支傳導阻滯 (RBBB)'
    ],
    correctAnswerIndex: 0,
    explanation: '在心前區導程 V1、V2、V3、V4 中出現 ST 段顯著上升（超過 2mm），為典型急性前壁心肌梗塞。這通常代表冠狀動脈「左前降支 (LAD)」發生急性完全阻塞，心肌受損面積大，極易並發心臟衰竭或心源性休克。',
    clinicalSignificance: '前壁梗塞預後通常比下壁梗塞差，死亡率高。醫檢師需立即發出危急值通報，以便臨床在第一時間（門口至血管通球時間 Door-to-Balloon < 90分鐘）進行再灌注治療。'
  },
  {
    id: 'ecg_q20',
    category: 'ecg',
    title: '急性心包炎 (Acute Pericarditis)',
    caseDescription: '一位 26 歲青年男性，在一週前有感冒發燒病史。今天主訴劇烈胸痛，吸氣及仰臥時胸痛加劇，而身體前傾時疼痛能得到部分緩解。心電圖顯示：除 aVR 外，幾乎所有導程的 ST 段都呈現 Concave (凹面向上) 抬高，且伴隨 PR 段壓低。',
    parameters: { hr: 100, pr: 0.16, qrs: 0.08, st: 1.5, tAmp: 3.0 },
    isPericarditis: 1,
    options: [
      '急性心包炎 (Acute Pericarditis)',
      '急性前壁心肌梗塞 (Acute Anterior STEMI)',
      '急性下壁心肌梗塞',
      '早期再極化綜合徵'
    ],
    correctAnswerIndex: 0,
    explanation: '急性心包炎心電圖特徵：除了 aVR 導程外，全導程 ST 段呈瀰漫性、凹面向上（Concave-upward）的輕度抬高（一般 < 2-3mm），且伴有 PR 段壓低（aVR 則 PR 抬高），不伴有病理性 Q 波與互易性 ST 段壓低。',
    clinicalSignificance: '多為病毒感染所致，預後多屬良性。臨床主要使用非類固醇消炎止痛藥 (NSAIDs) 或秋水仙素 (Colchicine) 進行治療，並注意排除心包填塞（Cardiac Tamponade）。'
  },
  {
    id: 'ecg_q21',
    category: 'ecg',
    title: '心室早期收縮 (Premature Ventricular Contraction, PVC)',
    caseDescription: '一位 45 歲中年女性，主訴近日工作壓力大、常感「心跳空虛感」或「漏跳一拍」。心電圖基線大致為竇性心律，但每隔 3 個正常心搏，就會提前出現一個寬大、畸形、無前置 P 波的 QRS 複合波，且其後緊跟一個完全代償間歇。',
    parameters: { hr: 75, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.5 },
    isPVC: 1,
    options: [
      '心房顫動',
      '心房早期收縮 (PAC)',
      '心室早期收縮 (Premature Ventricular Contraction, PVC)',
      '第三度房室阻滯'
    ],
    correctAnswerIndex: 2,
    explanation: '心室早期收縮（PVC）的典型心電圖表現：1. 提前出現寬大畸形的 QRS-T 波群（QRS 寬度 > 0.12 秒）；2. 其前方無相關的 P 波；3. T 波方向通常與 QRS 主波相反；4. 有完全性代償間歇（Compensatory pause）。',
    clinicalSignificance: '偶發性 PVC 常見於健康人（因咖啡因、壓力、失眠誘發），通常無需特殊治療。但若為多源性、成對出現、或頻發（>10% 總心擊數），則需注意心肌缺血或心肌病變。'
  },
  {
    id: 'ecg_q22',
    category: 'ecg',
    title: '心房早期收縮 (Premature Atrial Contraction, PAC)',
    caseDescription: '一位 29 歲孕婦，因常覺得有心慌感就診。心電圖顯示在規律的竇性心律中，突然提前出現一個 P\' 波，其形態與正常竇性 P 波略有不同，隨後的 QRS 複合波形態完全正常，其後伴隨不完全代償間歇。',
    parameters: { hr: 78, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.5 },
    isPAC: 1,
    options: [
      '心室早期收縮 (PVC)',
      '心房早期收縮 (Premature Atrial Contraction, PAC)',
      '竇性心律不整',
      '陣發性室上性心搏過速'
    ],
    correctAnswerIndex: 1,
    explanation: '心房早期收縮（PAC）特徵：1. 提前出現一個異位 P\' 波（形態與竇性 P 波不同）；2. P\'-R 間期 > 0.12s；3. 後方的 QRS-T 波群形態多正常；4. 伴隨不完全代償間歇（即早搏前置與後置 R-R 間期之和，小於正常兩倍）。',
    clinicalSignificance: 'PAC 極其常見，多屬良性，一般無需抗心律不整藥物，但需勸導患者戒除煙酒、濃茶咖啡，並避免過度焦慮。'
  },
  {
    id: 'ecg_q23',
    category: 'ecg',
    title: '嚴重的竇性心搏過緩 (Severe Sinus Bradycardia)',
    caseDescription: '一位 89 歲高齡男性，近來常覺頭暈、行走不穩。常規心電圖檢查發現：P 波在 II 導程為正向，aVR 導程為逆向，代表竇性心律。但心率極慢，僅為 42 bpm，PR 間期及 QRS 均在正常範圍。',
    parameters: { hr: 42, pr: 0.17, qrs: 0.08, st: 0, tAmp: 2.2 },
    options: [
      '竇性心搏過緩 (Sinus Bradycardia)',
      '第三度房室阻滯',
      '逸搏心律',
      '竇房傳導阻滯'
    ],
    correctAnswerIndex: 0,
    explanation: '心電圖符合竇性心律標準（P 波在 II、III、aVF 正向，aVR 逆向），慢於 50 bpm（本例為 42 bpm），PR 間期恆定正常。符合「竇性心搏過緩」。',
    clinicalSignificance: '常見於老年人竇房結退行性變（病竇綜合徵 SSS 表現之一），或甲狀腺功能低下、β阻斷劑等藥物作用。若心率持續 < 40 bpm 且伴有暈厥、黑朦等灌流不足症狀，需考慮植入起搏器。'
  },
  {
    id: 'ecg_q24',
    category: 'ecg',
    title: '竇性心搏過速 (Sinus Tachycardia)',
    caseDescription: '一位 22 歲青年男性，因高燒 39.1°C 伴隨咳嗽送至急診。床邊心電圖顯示：規則竇性心律，但心率高達 135 bpm，PR 間期 0.12s，QRS 波形正常。',
    parameters: { hr: 135, pr: 0.12, qrs: 0.08, st: 0, tAmp: 2.0 },
    options: [
      '竇性心搏過速 (Sinus Tachycardia)',
      '陣發性室上性心搏過速 (PSVT)',
      '心房撲動',
      '心室頻脈'
    ],
    correctAnswerIndex: 0,
    explanation: '心電圖符合竇性心律（P 波方向正常），心率 > 100 bpm（本例為 135 bpm）。符合竇性心搏過速。這通常是機體對生理性或病理性刺激（如發燒、脫水、貧血、甲亢、焦慮、運動）的適應性代償反應。',
    clinicalSignificance: '體溫每升高 1°C，心率約增加 10-15 bpm。竇速主要是病因治療，無需使用抗心律不整藥物。應區別於 PSVT（PSVT 心率常更規則且一般 > 150 bpm，且突發突止）。'
  },
  {
    id: 'ecg_q25',
    category: 'ecg',
    title: '高鈣血症與短 QT 間期 (Hypercalcemia)',
    caseDescription: '一位 59 歲乳癌骨轉移女性，因意識混亂、便秘及多尿急診。生化抽血顯示血清鈣離子濃度顯著升高，達 13.5 mg/dL。心電圖特徵為 ST 段極度縮短，T 波幾乎緊跟 QRS 波之後，導致 QT 間期顯著縮短。',
    parameters: { hr: 68, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.3 },
    isHypercalcemia: 1,
    options: [
      '高鈣血症 (Hypercalcemia)',
      '低鈣血症 (Hypocalcemia)',
      '高鉀血症',
      '長 QT 綜合徵'
    ],
    correctAnswerIndex: 0,
    explanation: '血清鈣離子升高時，心肌細胞動作電位 2 期（平台期）縮短，導致心電圖上 ST 段明顯縮短甚至消失，T 波幾乎在 QRS 結束後立即開始。這使整體 QT 間期顯著縮短。符合高鈣血症。',
    clinicalSignificance: '高鈣危象會導致心律不整與神經系統損傷。醫檢師發現短 QT 間期時需提醒臨床考慮高鈣血症，給予大量生理食鹽水補水、利尿及降鈣治療。'
  },
  {
    id: 'ecg_q26',
    category: 'ecg',
    title: '低鈣血症與長 QT 間期 (Hypocalcemia)',
    caseDescription: '一位 42 歲女性，接受甲狀腺切除術後第三天，主訴手足抽搐、口周麻木（Chvostek 徵陽性）。抽血顯示血鈣 6.2 mg/dL。心電圖顯示：QRS 波形態正常，但 ST 段異常變長且平坦，導致整個 QT 間期顯著延長。',
    parameters: { hr: 70, pr: 0.16, qrs: 0.08, st: 0, tAmp: 2.2 },
    isHypocalcemia: 1,
    options: [
      '高鈣血症',
      '低鈣血症 (Hypocalcemia)',
      '低鉀血症',
      '預激綜合徵'
    ],
    correctAnswerIndex: 1,
    explanation: '血鈣降低時，心肌動作電位 2 期（平台期）延長。心電圖特徵為 ST 段顯著延長，且形態平坦，這使 T 波延遲出現，導致 QT 間期（或 QTc）顯著延長。注意：低鈣血症「僅延長 ST 段，但不改變 T 波本身的寬度或形態」，這與低鉀血症不同。',
    clinicalSignificance: '多見於甲狀旁腺功能減退或術後誤切。嚴重的 QT 延長可誘發惡性室性心律不整。應立即靜脈補鈣（如 10% 葡萄糖酸鈣）。'
  },
  {
    id: 'ecg_q27',
    category: 'ecg',
    title: '房性逸搏心律 (Atrial Escape Rhythm)',
    caseDescription: '一位 65 歲病竇綜合徵患者。心電圖基線顯示心率偏慢，在 II、III、aVF 導程可見 P 波為倒置（Negative P wave），PR 間期為 0.14s，QRS 波群正常，心率約為 50 bpm。',
    parameters: { hr: 50, pr: 0.14, qrs: 0.08, st: 0, tAmp: 2.0 },
    isAtrialEscape: 1,
    options: [
      '竇性心搏過緩',
      '心室逸搏心律',
      '房性逸搏心律 (Atrial Escape Rhythm)',
      '第一度房室阻滯'
    ],
    correctAnswerIndex: 2,
    explanation: '當竇房結興奮性降低或衝動傳導受阻時，心房內的異位起搏點（通常位於心房下部）會發出衝動進行代償。由於衝動是由下而上傳導，心電圖在下壁導程（II、III、aVF）顯示 P 波逆向（倒置 P 波），且其起搏頻率通常在 50-60 bpm 之間，稱為房性逸搏心律。',
    clinicalSignificance: '屬於傳導系統的生理性代償保護機制，主要針對竇房結功能障礙進行原發病治療，而非首選抑制該起搏點的藥物。'
  },
  {
    id: 'ecg_q28',
    category: 'ecg',
    title: '心室逸搏心律 (Ventricular Escape Rhythm)',
    caseDescription: '一位 85 歲女性，主訴眩暈、冷汗、幾近暈厥。心電圖顯示：找不到任何 P 波，且 QRS 複合波極其寬大、畸形（寬度 0.16s），心率極慢且規律，僅 30 bpm。',
    parameters: { hr: 30, pr: 0, qrs: 0.16, st: 0, tAmp: 1.8 },
    isVentricularEscape: 1,
    options: [
      '心室逸搏心律 (Ventricular Escape Rhythm)',
      '房性逸搏心律',
      '第二度 II 型房室阻滯',
      '竇性心搏過緩'
    ],
    correctAnswerIndex: 0,
    explanation: '當高位起搏點均無法發出衝動，或發生完全性房室阻滯時，心室內的起搏點（如浦金野纖維）會被動發出極慢的代償衝動。心電圖表現為：P 波消失，QRS 複合波寬大畸形，心室率極慢，一般在 20-40 bpm 之間。符合心室逸搏。',
    clinicalSignificance: '這是隨時可能發生心臟停搏的超危急情況，血液動力學極不穩定。臨床必須立即實施臨時起搏，並儘快安裝永久性心臟起搏器。'
  },
  {
    id: 'ecg_q29',
    category: 'ecg',
    title: '慢性心肌缺血與倒置 T 波 (Chronic Myocardial Ischemia)',
    caseDescription: '一位 63 歲有糖尿病及高血脂病史男性，自訴近來爬樓梯或快步行走時，胸口會悶痛、有壓迫感，休息約 5 分鐘能緩解。心電圖檢查顯示：I、V5、V6 導程有輕度 ST 段壓低，且伴有對稱性的 T 波深倒置（T-wave inversion）。',
    parameters: { hr: 70, pr: 0.15, qrs: 0.08, st: -1.5, tAmp: -3.0 },
    isIschemia: 1,
    options: [
      '急性下壁心肌梗塞',
      '慢性心肌缺血與對稱性 T 波倒置',
      '高鉀血症',
      '急性心包炎'
    ],
    correctAnswerIndex: 1,
    explanation: '慢性心肌缺血（如冠狀動脈硬化狹窄）時，心肌復極化順序改變。心電圖典型表現包括：ST 段呈水平型或下斜型壓低（>= 0.05 mV，即半格）；以及 T 波低平、雙向或深倒置。本例 ST 段壓低 1.5mm 且 T 波對稱性倒置 -3.0mm，為典型缺血表現。',
    clinicalSignificance: '代表患者心肌供血不足，常需進一步安排心臟負荷試驗、運動心電圖或冠狀動脈攝影（CTA/CAG）評估狹窄程度，並給予抗血小板及降脂藥物預防急性心梗。'
  },
  {
    id: 'ecg_q30',
    category: 'ecg',
    title: '竇性心律不整 (Sinus Arrhythmia)',
    caseDescription: '一位 18 歲健康青年女性，體檢時心音聽診發現：心率隨著她的深吸氣而逐漸加快，深呼氣時逐漸減慢，但其 P 波形態與傳導均完全正常。',
    parameters: { hr: 72, pr: 0.15, qrs: 0.08, st: 0, tAmp: 2.5 },
    isSinusArrhythmia: 1,
    options: [
      '心房顫動',
      '竇性心律不整 (Sinus Arrhythmia)',
      '心房撲動',
      '第二度 I 型房室阻滯'
    ],
    correctAnswerIndex: 1,
    explanation: '竇性心律不整（主要是呼吸性竇性心律不整）特徵為：竇性 P 波形態正常，但 R-R 間期隨呼吸週期發生規律性變化，吸氣時 R-R 縮短（心率增快），呼氣時 R-R 延長（心率減慢），最長與最短 P-P 間期之差 > 0.12 秒。',
    clinicalSignificance: '這是一種「正常的生理現象」，常見於兒童、青少年、運動員或自主神經系統調節發育健全的健康人群，代表迷走神經張力的良性調控，無需任何治療。'
  }
];

export default function ECGModule({ mode, onStateChange, examQuestionIndex }: ECGModuleProps) {
  // Simulator parameters
  const [hr, setHr] = useState(72);
  const [pr, setPr] = useState(0.16); // seconds
  const [qrs, setQrs] = useState(0.08); // seconds
  const [st, setSt] = useState(0.0); // mm (elevation/depression)
  const [tAmp, setTAmp] = useState(2.5); // mm

  // Preset selector state for Simulator
  const [selectedPresetId, setSelectedPresetId] = useState<string>('custom');

  // Control state
  const [isPlaying, setIsPlaying] = useState(true);

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
  const dataPointsRef = useRef<number[]>([]);
  const scrollOffsetRef = useRef(0);

  // Active question
  const activeQuestion = ecgQuizCases[currentQuizIndex];

  // Helper to determine active flags for current wave calculation
  const getActiveFlags = (): Partial<QuizQuestion> => {
    if (mode === 'quiz' || mode === 'exam') {
      return activeQuestion || {};
    }
    if (selectedPresetId !== 'custom') {
      return ecgQuizCases.find(c => c.id === selectedPresetId) || {};
    }
    return {};
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;
    const found = ecgQuizCases.find(c => c.id === presetId);
    if (found) {
      setHr(found.parameters.hr);
      setPr(found.parameters.pr);
      setQrs(found.parameters.qrs);
      setSt(found.parameters.st);
      setTAmp(found.parameters.tAmp);
    }
  };

  // Sync simulator state or quiz state to parent (for AI Tutor)
  useEffect(() => {
    if (mode === 'simulator') {
      onStateChange({ hr, pr, qrs, st, tAmp, selectedPresetId });
    } else {
      onStateChange({
        questionId: activeQuestion.id,
        title: activeQuestion.title,
        parameters: activeQuestion.parameters,
        userSelected: selectedOption,
        isCorrect: isAnswered ? selectedOption === activeQuestion.correctAnswerIndex : null
      });
    }
  }, [hr, pr, qrs, st, tAmp, mode, currentQuizIndex, selectedOption, isAnswered, selectedPresetId]);

  // Load quiz or exam parameters when question changes
  useEffect(() => {
    if (mode === 'quiz' || mode === 'exam') {
      const p = activeQuestion.parameters;
      setHr(p.hr);
      setPr(p.pr);
      setQrs(p.qrs);
      setSt(p.st);
      setTAmp(p.tAmp);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuizIndex, mode]);

  // Mathematical ECG wave rendering inside canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 700;
    const height = 240;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let time = 0;

    // ECG wave generator function
    // Phase goes from 0 to 1 representing one cardiac cycle
    const getEcgSignal = (phase: number, params: { hr: number, pr: number, qrs: number, st: number, tAmp: number }) => {
      const flags = getActiveFlags();

      // 1. Sinusoidal/Chaotic extreme rhythms
      // Ventricular Tachycardia (VT) - wide sinusoidal bizarre wave
      if (flags.isVT) {
        return Math.sin(phase * 2 * Math.PI) * 4.0 + Math.sin(phase * 4 * Math.PI) * 1.5;
      }

      // Ventricular Fibrillation (VF) - completely chaotic bizarre wave
      if (flags.isVF) {
        return (Math.sin(time * 0.18) * 2.5 + Math.sin(time * 0.45) * 1.5 + (Math.random() - 0.5) * 1.2) * 1.3;
      }

      // Torsades de Pointes (TdP) - polymorphic VT wrapping baseline
      if (flags.isTdP) {
        const amp = Math.sin(time * 0.08) * 3.5;
        return (Math.sin(phase * 2 * Math.PI) * amp + Math.sin(phase * 4 * Math.PI) * (amp * 0.3));
      }

      // Atrial Fibrillation (AFib) - rapid baseline f-waves
      const fWave = (flags.isAfib || flags.isAFib)
        ? Math.sin(phase * 24 * Math.PI) * 0.4 + Math.sin(phase * 48 * Math.PI) * 0.2 + (Math.random() - 0.5) * 0.15
        : 0;

      // Atrial Flutter (AFlutter) - sawtooth waves (F-waves) at 300 bpm
      const flutterWave = flags.isAFlutter
        ? (Math.abs((phase * 4) % 1.0 - 0.5) * 4.0 - 1.0) * 1.0
        : 0;

      // 2. Cardiac Cycle Timing and Conduction Blocks
      const cycle = Math.floor(time * params.hr / 3600);
      let isDropped = false;
      let prInterval = params.pr;

      // Second-Degree Type I Wenckebach (Mobitz I)
      if (flags.isMobitzI) {
        const beatNum = cycle % 4; // 4:3 block
        if (beatNum === 3) {
          isDropped = true;
        } else {
          prInterval = params.pr + (beatNum * 0.04);
        }
      }

      // Second-Degree Type II
      if (flags.isMobitzII) {
        const beatNum = cycle % 3; // 3:2 block
        if (beatNum === 2) {
          isDropped = true;
        }
      }

      // Premature Ventricular Contractions (PVC)
      const isPvcCycle = flags.isPVC && (cycle % 4 === 3);
      const pvcPhaseOffset = isPvcCycle ? 0.15 : 0; // premature
      const adjustedPhase = (phase + pvcPhaseOffset) % 1.0;

      // Premature Atrial Contractions (PAC)
      const isPacCycle = flags.isPAC && (cycle % 4 === 3);
      const pacPhaseOffset = isPacCycle ? 0.12 : 0;
      const pacPhase = (phase + pacPhaseOffset) % 1.0;

      // Render P Wave
      let pVal = 0;
      if (prInterval > 0 && !flags.isAfib && !flags.isAFib && !flags.isAFlutter && !flags.isHyperkalemia && !flags.isVentricularEscape && !flags.isThirdDegreeAVB) {
        const pCenter = 0.15;
        const pWidth = 0.08;
        const pPhaseVal = isPacCycle ? pacPhase : adjustedPhase;
        
        let pAmpMult = 1.0;
        if (flags.isAtrialEscape) {
          pAmpMult = -1.0; // Inverted P wave in Atrial Escape
        }
        
        pVal = Math.exp(-Math.pow((pPhaseVal - pCenter) / (pWidth / 2), 2)) * 1.2 * pAmpMult;
      } else if (flags.isAfib || flags.isAFib) {
        pVal = fWave;
      } else if (flags.isAFlutter) {
        pVal = flutterWave;
      } else if (flags.isThirdDegreeAVB) {
        // Complete AV dissociation: P waves at steady ~80 bpm independent of slow QRS
        const pSpeed = (80 / 60) / 60; // 80 bpm at 60 fps
        const pPhase = (time * pSpeed) % 1.0;
        pVal = Math.exp(-Math.pow((pPhase - 0.5) / 0.08, 2)) * 1.2;
      }

      // If this beat is a dropped QRS (Type I / Type II block), only return P wave
      if (isDropped) {
        return pVal;
      }

      // Shift QRS and T depending on PR interval
      const prShift = (prInterval - 0.16) * 1.2;
      const qrsCenter = 0.40 + prShift;

      // 3. QRS Configuration
      let qrsScale = params.qrs / 0.08;
      if (isPvcCycle) qrsScale = 2.0; // wide PVC

      const qWidth = 0.02 * qrsScale;
      const rWidth = 0.025 * qrsScale;
      const sWidth = 0.02 * qrsScale;

      let qrsVal = 0;

      if (isPvcCycle) {
        // PVC QRS is wide, bizarre, inverted (negative)
        const pvcQCenter = qrsCenter - 0.05;
        const rSVal = -Math.exp(-Math.pow((adjustedPhase - pvcQCenter) / 0.06, 2)) * 10.0;
        const tSVal = Math.exp(-Math.pow((adjustedPhase - (pvcQCenter + 0.18)) / 0.08, 2)) * 4.0; // compensatory inverted T
        return rSVal + tSVal;
      }

      if (flags.isWPW) {
        // Delta wave slurred upstroke
        const deltaCenter = qrsCenter - 0.035;
        const deltaVal = Math.exp(-Math.pow((adjustedPhase - deltaCenter) / 0.03, 2)) * 2.5;
        qrsVal += deltaVal;
      }

      if (flags.isRBBB) {
        // M-shaped "rabbit ears" in V1
        const r1Val = Math.exp(-Math.pow((adjustedPhase - (qrsCenter - 0.015)) / 0.015, 2)) * 8.0;
        const r2Val = Math.exp(-Math.pow((adjustedPhase - (qrsCenter + 0.015)) / 0.02, 2)) * 10.0;
        const sVal = -Math.exp(-Math.pow((adjustedPhase - (qrsCenter + 0.045)) / 0.02, 2)) * 4.0;
        qrsVal += r1Val + r2Val + sVal;
      } else if (flags.isLBBB) {
        // Wide notched QRS
        const notchedR = Math.exp(-Math.pow((adjustedPhase - qrsCenter) / 0.045, 2)) * 9.5 * (1.0 - 0.15 * Math.sin((adjustedPhase - qrsCenter) * 35));
        const sVal = -Math.exp(-Math.pow((adjustedPhase - (qrsCenter + 0.045)) / 0.02, 2)) * 2.0;
        qrsVal += notchedR + sVal;
      } else {
        // Standard QRS
        const qVal = -Math.exp(-Math.pow((adjustedPhase - (qrsCenter - 0.03)) / (qWidth / 2), 2)) * 1.5;
        const rVal = Math.exp(-Math.pow((adjustedPhase - qrsCenter) / (rWidth / 2), 2)) * 12.0;
        const sVal = -Math.exp(-Math.pow((adjustedPhase - (qrsCenter + 0.03)) / (sWidth / 2), 2)) * 3.0;
        qrsVal += qVal + rVal + sVal;
      }

      // 4. ST Segment
      let stVal = 0;
      let computedST = params.st;

      if (flags.isBrugada) {
        // Coved-type high sloping ST elevation
        if (adjustedPhase >= qrsCenter + 0.02 && adjustedPhase <= qrsCenter + 0.18) {
          stVal = 3.5 * Math.exp(-(adjustedPhase - (qrsCenter + 0.02)) / 0.06);
        }
      } else if (flags.isDigitalis) {
        // Scooped depression (mustache shape)
        if (adjustedPhase >= qrsCenter + 0.02 && adjustedPhase <= qrsCenter + 0.16) {
          const x = (adjustedPhase - (qrsCenter + 0.02)) / 0.14;
          stVal = -2.2 * Math.sin(x * Math.PI / 1.1);
        }
      } else {
        // Standard ST
        if (adjustedPhase >= qrsCenter + 0.04 && adjustedPhase <= qrsCenter + 0.15) {
          stVal = computedST;
        } else if (adjustedPhase > qrsCenter && adjustedPhase < qrsCenter + 0.04) {
          const ratio = (adjustedPhase - qrsCenter) / 0.04;
          stVal = -3.0 * (1 - ratio) + computedST * ratio;
        }
      }

      // 5. T Wave & U Wave
      let tVal = 0;
      let tCenter = qrsCenter + 0.25;
      let tWidth = 0.14;

      if (flags.isHypercalcemia) {
        tCenter = qrsCenter + 0.13; // shortened QT
      } else if (flags.isHypocalcemia || flags.isLQTS) {
        tCenter = qrsCenter + 0.36; // prolonged QT
      }

      let computedTAmp = params.tAmp;
      if (flags.isHyperkalemia) {
        // Peaked, tall T wave
        computedTAmp = 7.5;
        tWidth = 0.08; // narrow base
      } else if (flags.isBrugada) {
        computedTAmp = -2.5; // Inverted T wave
      } else if (flags.isIschemia) {
        computedTAmp = -3.5; // Symmetric deep T wave inversion
      }

      tVal = Math.exp(-Math.pow((adjustedPhase - tCenter) / (tWidth / 2), 2)) * (computedTAmp + computedST * 0.4);

      // U Wave
      let uVal = 0;
      if (flags.isHypokalemia) {
        const uCenter = tCenter + 0.15;
        uVal = Math.exp(-Math.pow((adjustedPhase - uCenter) / 0.05, 2)) * 1.5;
      }

      let finalComposite = pVal + qrsVal + stVal + tVal + uVal;

      // Baseline noise (AFib baseline or other)
      if (flags.isAfib || flags.isAFib) {
        finalComposite += fWave * 0.5;
      }

      return finalComposite;
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      // 1. Draw ECG paper grid (Millimeter red/brown grid in Dark Mode)
      ctx.fillStyle = '#0f172a'; // Deep slate background
      ctx.fillRect(0, 0, width, height);

      const minorGridSize = 6;
      const majorGridSize = minorGridSize * 5;

      // Minor grid lines
      ctx.strokeStyle = '#1e293b'; // subtle dark line
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += minorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += minorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid lines
      ctx.strokeStyle = '#334155'; // stronger grid line
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw horizontal baseline marker
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Generate and update real-time wave points
      if (isPlaying) {
        // Beats per minute converted to cycles per frame
        // hr beats per 60 seconds. At 60fps, total frames per beat = (60 * 60) / hr = 3600 / hr
        const framesPerBeat = 3600 / hr;
        const speed = 1.0 / framesPerBeat;

        // AFib has slightly irregular heart rate
        let currentSpeed = speed;
        const flags = getActiveFlags();
        if (flags.isAfib || flags.isAFib || flags.isVF || flags.isSinusArrhythmia) {
          // Add deterministic irregularity based on time
          const variation = Math.sin(time * 0.02) * 0.25 + Math.cos(time * 0.07) * 0.1;
          currentSpeed = speed * (1.0 + variation);
        }

        scrollOffsetRef.current = (scrollOffsetRef.current + currentSpeed) % 1.0;
        time += 1;

        // Add new value to scroll trace
        const val = getEcgSignal(scrollOffsetRef.current, { hr, pr, qrs, st, tAmp });
        dataPointsRef.current.push(val);
        if (dataPointsRef.current.length > width) {
          dataPointsRef.current.shift();
        }
      }

      // If points are fewer than width, initialize with flat baseline
      if (dataPointsRef.current.length === 0) {
        dataPointsRef.current = new Array(Math.floor(width)).fill(0);
      }

      // 3. Draw the ECG wave line (Glowing green neon style)
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#10b981'; // Emerald glow
      ctx.strokeStyle = '#34d399'; // Bright green trace
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const centerY = height / 2;
      const verticalScale = 8; // scale signal value to pixels

      for (let i = 0; i < dataPointsRef.current.length; i++) {
        const x = i;
        const y = centerY - (dataPointsRef.current[i] * verticalScale);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow for next drawing operations
      ctx.shadowBlur = 0;

      // 4. Interactive ECG waveform labels (only in Simulator Mode to teach waves)
      if (mode === 'simulator') {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText("ECG Lead II 模擬心律監控", 15, 20);

        // Approximate locations of waves based on phase
        const currentPhase = scrollOffsetRef.current;
        const prShift = (pr - 0.16) * 1.2;
        const qrsCenter = 0.40 + prShift;

        // Check if there is a beat currently in the visible center area (around index width * 0.6)
        // We can draw text labels pointing to P, QRS, T
        ctx.fillStyle = '#64748b';
        ctx.fillText(`HR: ${hr} bpm  |  PR: ${pr.toFixed(2)}s  |  QRS: ${qrs.toFixed(2)}s  |  ST: ${st > 0 ? '+' : ''}${st.toFixed(1)}mm`, 15, 225);
      } else {
        ctx.fillStyle = '#f43f5e';
        ctx.font = '10px monospace';
        ctx.fillText("CRITICAL MONITOR - 診斷測試中", 15, 20);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hr, pr, qrs, st, tAmp, isPlaying, mode, currentQuizIndex, selectedPresetId]);

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
    setLocalQuizIndex((prev) => (prev + 1) % ecgQuizCases.length);
  };

  if (mode === 'exam') {
    return (
      <div className="space-y-4">
        {/* Wave Monitor Frame */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? '暫停掃描' : '開始掃描'}
            </button>
          </div>

          <canvas ref={canvasRef} className="w-full bg-slate-900 rounded-lg block" />
        </div>

        {/* Readout parameters */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono justify-center shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">心跳速率 (HR):</span>
            <strong className="text-emerald-400">{hr} bpm</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">PR 間期:</span>
            <strong className="text-emerald-400">{pr.toFixed(2)}s</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">QRS 寬度:</span>
            <strong className="text-emerald-400">{qrs.toFixed(2)}s</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">ST 段偏移:</span>
            <strong className={`font-bold ${st !== 0 ? 'text-red-400' : 'text-emerald-400'}`}>{st > 0 ? '+' : ''}{st.toFixed(1)}mm</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wave Monitor Frame */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            id="ecg-play-pause-btn"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? '暫停掃描' : '開始掃描'}
          </button>
        </div>

        <canvas ref={canvasRef} className="w-full bg-slate-900 rounded-lg block" id="ecg-waveform-canvas" />
      </div>

      {/* Control / Interactive Panel */}
      {mode === 'simulator' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parameters Sliders Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-4 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                心電生理參數調整 (ECG Parameters)
              </h3>
            </div>

            {/* National Exam 30 Anomalies Dropdown */}
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800/60">
              <label htmlFor="ecg-preset-select" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                臨床國考 30 種異常心律快速模擬庫
              </label>
              <select
                id="ecg-preset-select"
                value={selectedPresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="custom">── 自訂心電生理參數 (Custom) ──</option>
                {ecgQuizCases.map((c, i) => (
                  <option key={c.id} value={c.id}>
                    考點 {i + 1}：{c.title}
                  </option>
                ))}
              </select>
              {selectedPresetId !== 'custom' && (
                <p className="text-[10px] text-emerald-400 leading-snug pt-1">
                  🔍 載入成功：{ecgQuizCases.find(c => c.id === selectedPresetId)?.caseDescription.slice(0, 52)}...
                </p>
              )}
            </div>

            {/* HR Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">心跳速率 (Heart Rate)</span>
                <span className="text-emerald-400 font-bold">{hr} bpm</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                value={hr}
                onChange={(e) => { setHr(Number(e.target.value)); setSelectedPresetId('custom'); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-ecg-hr"
              />
              <p className="text-[10px] text-slate-500">
                調節 R-R 間期。心搏過速 (&gt;100 bpm) 縮短間期，心搏過緩 (&lt;60 bpm) 延長間期。
              </p>
            </div>

            {/* PR Interval Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">PR 間期 (PR Interval)</span>
                <span className="text-emerald-400 font-bold">{pr.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.00"
                max="0.32"
                step="0.01"
                value={pr}
                onChange={(e) => { setPr(Number(e.target.value)); setSelectedPresetId('custom'); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-ecg-pr"
              />
              <p className="text-[10px] text-slate-500">
                代表心房去極化至心室開始去極化。正常 0.12 - 0.20 秒。延長多見於房室傳導阻滯。
              </p>
            </div>

            {/* QRS Width Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">QRS 寬度 (QRS Duration)</span>
                <span className="text-emerald-400 font-bold">{qrs.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.04"
                max="0.20"
                step="0.01"
                value={qrs}
                onChange={(e) => { setQrs(Number(e.target.value)); setSelectedPresetId('custom'); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-ecg-qrs"
              />
              <p className="text-[10px] text-slate-500">
                代表心室去極化時間。正常 &lt; 0.12 秒。寬大畸形多見於束支傳導阻滯或心室心律不整。
              </p>
            </div>

            {/* ST Segment Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">ST 段高度 (ST Segment)</span>
                <span className={`font-bold ${st > 0.2 ? 'text-red-400' : st < -0.2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {st > 0 ? '+' : ''}{st.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="4.0"
                step="0.1"
                value={st}
                onChange={(e) => { setSt(Number(e.target.value)); setSelectedPresetId('custom'); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-ecg-st"
              />
              <p className="text-[10px] text-slate-500">
                正常應在等電位線上。上升 (ST elevation) 為急性心肌梗塞主要特徵；下降代表心肌缺血。
              </p>
            </div>

            {/* T Wave Amplitude Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">T 波振幅 (T Wave Amplitude)</span>
                <span className="text-emerald-400 font-bold">{tAmp.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="-3.5"
                max="7.5"
                step="0.1"
                value={tAmp}
                onChange={(e) => { setTAmp(Number(e.target.value)); setSelectedPresetId('custom'); }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                id="slider-ecg-t"
              />
              <p className="text-[10px] text-slate-500">
                代表心室再極化。高尖 T 波見於急性心肌梗塞超急性期或高鉀血症；倒置見於心肌缺血。
              </p>
            </div>
          </div>

          {/* Quick Learning Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  心電圖判讀速記 (ECG Clinical Nuggets)
                </h3>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  🩺 <strong className="text-white">P 波</strong>：心房去極化（Atrial Depolarization）。波形應圓滑、在 II 導程為正向。正常寬度 &lt; 0.12 秒，高度 &lt; 2.5 mm。
                </p>
                <p>
                  ⚡ <strong className="text-white">QRS 複合波</strong>：心室去極化（Ventricular Depolarization）。代表心房收縮後心室電信號的快速傳導。正常時間為 0.06 - 0.10 秒。
                </p>
                <p>
                  🔄 <strong className="text-white">T 波</strong>：心室再極化（Ventricular Repolarization）。方向多與 QRS 主波一致。
                </p>
                <p>
                  📊 <strong className="text-white">心率估算</strong>：紙速為 25 mm/s。大格 = 0.2 秒，小格 = 0.04 秒。規則心律下，心率 = 300 / 兩個 R 波間的大格數。
                </p>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5 mt-4">
              <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[10.5px] text-slate-400 leading-snug">
                <strong>拖動左側滑桿試試：</strong>調大 PR 間期觀察 P-QRS 之間的平直段變化，或將 ST 段調高，體會什麼是急性缺血的「墓碑樣」心電圖。
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
                ECG 臨床案例測驗 ({currentQuizIndex + 1} / {ecgQuizCases.length})
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
              <p className="text-xs font-semibold text-slate-400">請選出最符合該心電圖與病史的臨床診斷：</p>
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
                      id={`ecg-opt-${idx}`}
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

            {/* Submit / Next Buttons */}
            <div className="pt-2 flex gap-3">
              {!isAnswered ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  id="ecg-quiz-submit"
                >
                  提交解答
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  id="ecg-quiz-next"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  下一題測驗
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
                    醫學原理與判讀解析
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
                      臨床醫檢意義
                    </span>
                    <p className="mt-1.5 text-slate-300">{activeQuestion.clinicalSignificance}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-slate-500">
                <HelpCircle className="w-12 h-12 text-slate-700 stroke-[1.5]" />
                <div>
                  <p className="text-xs font-semibold text-slate-400">尚未提交診斷</p>
                  <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto mt-1">
                    細心觀察上方患者的動態心電監護儀波形，結合臨床病史，選出正確的報告診斷。
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-4 text-[10.5px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-400 shrink-0 font-bold">💡 AI 導師提醒：</span>
              <p>
                如果在判讀上卡關了，可以在右側對話框直接詢問 AI 導師：「請幫我詳細分析這一題 ECG 的臨床診斷要點！」
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
