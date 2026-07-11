var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ai = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined. AI Tutor will be disabled.");
  }
} catch (e) {
  console.error("Failed to initialize Gemini AI SDK:", e);
}
app.post("/api/gemini/tutor", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "AI \u670D\u52D9\u66AB\u6642\u7121\u6CD5\u4F7F\u7528\u3002\u8ACB\u78BA\u8A8D\u60A8\u7684 GEMINI_API_KEY \u5DF2\u5728\u7955\u5BC6\u8A2D\u5B9A\u4E2D\u914D\u7F6E\u3002"
    });
  }
  const { message, context } = req.body;
  try {
    const promptContext = context ? `\u76EE\u524D\u5B78\u54E1\u6B63\u5728\u5B78\u7FD2\u751F\u7406\u5B78\u4E3B\u984C\uFF1A
\u4E3B\u984C: ${context.topic}
\u6A21\u5F0F: ${context.mode}
\u7576\u524D\u6CE2\u5F62\u53C3\u6578\u6216\u75C5\u4F8B\u6578\u64DA: ${JSON.stringify(context.data)}

\u5B78\u54E1\u63D0\u554F: ${message}` : message;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        systemInstruction: `\u4F60\u662F\u300C\u91AB\u6AA2\u5E2B\u81E8\u5E8A\u751F\u7406\u5B78 AI \u5C0E\u5E2B\u300D\uFF0C\u4E00\u500B\u5C08\u696D\u3001\u89AA\u5207\u4E14\u6709\u8010\u5FC3\u7684\u91AB\u5B78\u6559\u80B2\u52A9\u624B\u3002
\u4F60\u7684\u76EE\u6A19\u662F\u5354\u52A9\u91AB\u5B78\u6AA2\u9A57\u5B78\u7CFB\u5B78\u751F\u3001\u91AB\u6AA2\u5E2B\u6216\u76F8\u95DC\u5B78\u54E1\u5B78\u7FD2\u81E8\u5E8A\u751F\u7406\u5B78\uFF08\u5FC3\u96FB\u5716 ECG\u3001\u80BA\u529F\u80FD PFT\u3001\u8166\u6CE2 EEG\u3001\u808C\u96FB\u5716 EMG\u3001\u8D85\u97F3\u6CE2 Ultrasound\uFF09\u3002
\u4F60\u61C9\u8A72\uFF1A
1. \u6DF1\u5165\u6DFA\u51FA\u5730\u89E3\u91CB\u751F\u7406\u6CE2\u5F62\u80CC\u5F8C\u7684\u96FB\u751F\u7406\u8207\u7269\u7406\u5B78\u539F\u7406\u3002
2. \u7D50\u5408\u81E8\u5E8A\u610F\u7FA9\uFF0C\u4F8B\u5982\u70BA\u4F55\u5FC3\u808C\u6897\u585E\u6703\u5C0E\u81F4 ST \u6BB5\u4E0A\u5347\u3001\u963B\u585E\u578B\u8207\u9650\u5236\u578B\u80BA\u75BE\u75C5\u7684\u6D41\u91CF\u5BB9\u7A4D\u66F2\u7DDA\u5DEE\u7570\u3001\u7672\u7647\u8166\u6CE2\u7279\u5FB5\u3001\u795E\u7D93\u6E90\u6027\u808C\u96FB\u5716\u7279\u5FB5\u3001\u8D85\u97F3\u6CE2\u4E8C\u5C16\u74E3 M \u6A21\u5F0F D-E-F-A-C \u9EDE\u7684\u610F\u7FA9\u3002
3. \u7D66\u4E88\u5B78\u54E1\u80AF\u5B9A\uFF0C\u63D0\u4F9B\u5BE6\u7528\u7684\u5224\u8B80\u53E3\u8A23\u6216\u6280\u5DE7\u3002
4. \u56DE\u7B54\u5FC5\u9808\u4F7F\u7528\u7E41\u9AD4\u4E2D\u6587\uFF08\u53F0\u7063\u91AB\u5B78\u5E38\u7528\u8853\u8A9E\uFF0C\u4F8B\u5982\u300C\u5C0E\u7A0B\u300D\u800C\u975E\u300C\u5C0E\u806F\u300D\u3001\u300C\u6CE2\u5F62\u300D\u800C\u975E\u300C\u6CE2\u5F62\u6CE2\u8A08\u300D\u3001\u300C\u5224\u8B80\u300D\u3001\u300C\u4E8C\u5C16\u74E3\u300D\u3001\u300C\u80BA\u6D3B\u91CF\u300D\u3001\u300C\u808C\u96FB\u5716\u300D\u7B49\uFF09\u3002
5. \u76E1\u53EF\u80FD\u4FDD\u6301\u6392\u7248\u7F8E\u89C0\u3001\u689D\u7406\u5206\u660E\u3002`
      }
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "\u8655\u7406 AI \u8ACB\u6C42\u6642\u767C\u751F\u932F\u8AA4\u3002" });
  }
});
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
