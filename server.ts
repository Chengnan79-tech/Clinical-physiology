import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined. AI Tutor will be disabled.");
  }
} catch (e) {
  console.error("Failed to initialize Gemini AI SDK:", e);
}

// AI Tutor API endpoint
app.post("/api/gemini/tutor", async (req: any, res: any) => {
  if (!ai) {
    return res.status(503).json({
      error: "AI 服務暫時無法使用。請確認您的 GEMINI_API_KEY 已在祕密設定中配置。"
    });
  }

  const { message, context } = req.body;

  try {
    const promptContext = context 
      ? `目前學員正在學習生理學主題：\n主題: ${context.topic}\n模式: ${context.mode}\n當前波形參數或病例數據: ${JSON.stringify(context.data)}\n\n學員提問: ${message}`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction: `你是「醫檢師臨床生理學 AI 導師」，一個專業、親切且有耐心的醫學教育助手。
你的目標是協助醫學檢驗學系學生、醫檢師或相關學員學習臨床生理學（心電圖 ECG、肺功能 PFT、腦波 EEG、肌電圖 EMG、超音波 Ultrasound）。
你應該：
1. 深入淺出地解釋生理波形背後的電生理與物理學原理。
2. 結合臨床意義，例如為何心肌梗塞會導致 ST 段上升、阻塞型與限制型肺疾病的流量容積曲線差異、癲癇腦波特徵、神經源性肌電圖特徵、超音波二尖瓣 M 模式 D-E-F-A-C 點的意義。
3. 給予學員肯定，提供實用的判讀口訣或技巧。
4. 回答必須使用繁體中文（台灣醫學常用術語，例如「導程」而非「導聯」、「波形」而非「波形波計」、「判讀」、「二尖瓣」、「肺活量」、「肌電圖」等）。
5. 盡可能保持排版美觀、條理分明。`,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "處理 AI 請求時發生錯誤。" });
  }
});

// Serve assets / SPA
// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
