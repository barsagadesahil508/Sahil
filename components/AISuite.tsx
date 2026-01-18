
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { AIService, AspectRatio, ImageSize } from '../types';

const AISuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AIService>(AIService.SEARCH);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<string | null>(null);
  
  // Custom Controls
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [imgSize, setImgSize] = useState<ImageSize>('1K');
  const [videoAspect, setVideoAspect] = useState<'16:9' | '9:16'>('16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setFile(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const runAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      switch (activeTab) {
        case AIService.DEEP_THINK:
          setResult(await GeminiService.complexQuery(input));
          break;
        case AIService.FAST_CHAT:
          setResult(await GeminiService.fastQuery(input));
          break;
        case AIService.ANALYZE_IMAGE:
          if (!file) throw new Error("Upload an image first!");
          setResult(await GeminiService.analyzeImage(file, input));
          break;
        case AIService.ANALYZE_VIDEO:
          if (!file) throw new Error("Upload a video clip (simulated via image for demo) first!");
          setResult(await GeminiService.analyzeVideo(file, input));
          break;
        case AIService.IMAGE_GEN:
          // Mandatory check for user-selected API key for high-quality generation
          if (!await (window as any).aistudio?.hasSelectedApiKey()) {
            await (window as any).aistudio?.openSelectKey();
          }
          setResult(await GeminiService.generateImage(input, aspectRatio, imgSize));
          break;
        case AIService.ANIMATE:
          // Mandatory check for user-selected API key for Veo models
          if (!await (window as any).aistudio?.hasSelectedApiKey()) {
            await (window as any).aistudio?.openSelectKey();
          }
          setResult(await GeminiService.generateVideoFromPrompt(input, videoAspect));
          break;
        case AIService.IMAGE_EDIT:
          if (!file) throw new Error("Upload image to edit!");
          setResult(await GeminiService.editImage(file, input));
          break;
        case AIService.SEARCH:
          const searchResponse = await GeminiService.searchWithGrounding(input);
          let textOutput = searchResponse.text || "";
          // Extract URLs from groundingChunks and list them as required by guidelines
          const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          const sourceLinks = chunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => `- [${chunk.web.title}](${chunk.web.uri})`)
            .join('\n');
          
          setResult(sourceLinks ? `${textOutput}\n\n### Sources:\n${sourceLinks}` : textOutput);
          break;
        default:
          alert("Feature coming soon!");
      }
    } catch (err: any) {
      // Handle missing API key or insufficient permissions by prompting key selection
      if (err.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio?.openSelectKey();
        setResult("Error: Please select a valid paid API key to use this feature.");
      } else {
        setResult("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto bg-slate-900 border-b border-slate-800 no-scrollbar">
        {[
          { id: AIService.FAST_CHAT, icon: 'fa-bolt', label: 'Fast AI' },
          { id: AIService.DEEP_THINK, icon: 'fa-brain', label: 'Deep Think' },
          { id: AIService.IMAGE_GEN, icon: 'fa-magic', label: 'Gen Image' },
          { id: AIService.ANIMATE, icon: 'fa-film', label: 'Veo 3 Video' },
          { id: AIService.SEARCH, icon: 'fa-globe', label: 'Web Search' },
          { id: AIService.ANALYZE_IMAGE, icon: 'fa-eye', label: 'Analyze Photo' },
          { id: AIService.IMAGE_EDIT, icon: 'fa-wand-sparkles', label: 'Nano Edit' },
          { id: AIService.ANALYZE_VIDEO, icon: 'fa-video', label: 'Analyze Video' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`flex items-center gap-2 px-8 py-5 transition-all whitespace-nowrap font-black text-sm uppercase tracking-widest ${
              activeTab === tab.id ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls Area */}
          <div className="space-y-6">
            {/* File Upload Affordance */}
            {(activeTab === AIService.ANALYZE_IMAGE || activeTab === AIService.IMAGE_EDIT || activeTab === AIService.ANALYZE_VIDEO) && (
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Source Media</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/mp4" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-cyan-600 hover:bg-cyan-950/10 transition-all group"
                >
                  {file ? (
                    <img src={file} className="h-full w-full object-cover rounded-2xl" alt="Preview" />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fas fa-cloud-upload-alt text-slate-400"></i>
                      </div>
                      <span className="text-slate-500 font-bold">Select Image or Video</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Feature Specific Controls */}
            {activeTab === AIService.IMAGE_GEN && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Aspect Ratio</label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase">Size Quality</label>
                  <select 
                    value={imgSize}
                    onChange={(e) => setImgSize(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}

            {activeTab === AIService.ANIMATE && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase">Video Aspect</label>
                <div className="flex gap-4">
                  {['16:9', '9:16'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setVideoAspect(v as any)}
                      className={`flex-1 py-3 rounded-xl border font-bold transition-all ${videoAspect === v ? 'bg-cyan-600 border-cyan-500' : 'bg-slate-800 border-slate-700'}`}
                    >
                      {v === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Prompt / Query</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-600 transition-all font-medium"
                placeholder={
                  activeTab === AIService.DEEP_THINK ? "Ask a complex cinematography question..." :
                  activeTab === AIService.IMAGE_GEN ? "Describe the camera gear to visualize..." :
                  activeTab === AIService.IMAGE_EDIT ? "Add a lens flare or change the backdrop..." :
                  activeTab === AIService.SEARCH ? "Search the web for gear reviews and trends..." :
                  "What would you like LensMaster AI to do?"
                }
              />
            </div>

            <button
              disabled={loading || (!input && !file)}
              onClick={runAction}
              className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-lg rounded-2xl transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            >
              {loading ? <i className="fas fa-spinner fa-spin text-xl"></i> : <i className="fas fa-sparkles group-hover:rotate-12 transition-transform"></i>}
              {loading ? "AI IS THINKING..." : "EXECUTE AI ACTION"}
            </button>
          </div>

          {/* Result Area */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all"></div>
            <div className="relative h-full min-h-[450px] bg-slate-950 rounded-2xl border border-slate-800 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Console Output</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>

              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-700 text-center">
                  <i className="fas fa-terminal text-6xl mb-6 opacity-20"></i>
                  <p className="text-xl font-bold opacity-30">LensMaster AI is ready for input</p>
                  <p className="text-sm opacity-20 max-w-xs mt-2">Select a tool and provide a prompt to begin processing your creative vision.</p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-cyan-500 font-black animate-pulse uppercase tracking-widest text-xs">Processing via Gemini 3</p>
                </div>
              )}

              {result && (
                <div className="flex-1 overflow-y-auto custom-scrollbar animate-fade-in">
                  {typeof result === 'string' && result.startsWith('data:') && (
                    <div className="space-y-4">
                       <img src={result} className="w-full rounded-xl shadow-2xl border border-slate-800" alt="Generated" />
                       <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm">DOWNLOAD HIGH-RES</button>
                    </div>
                  )}
                  {typeof result === 'string' && result.startsWith('blob:') && (
                    <div className="space-y-4">
                      <video src={result} controls className="w-full rounded-xl shadow-2xl border border-slate-800" autoPlay loop />
                      <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all text-sm">SAVE VIDEO</button>
                    </div>
                  )}
                  {typeof result === 'string' && !result.startsWith('data:') && !result.startsWith('blob:') && (
                    <div className="prose prose-invert max-w-none text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                      {/* Simple markdown-style link rendering for search sources */}
                      {result.split('\n').map((line: string, i: number) => {
                        const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                        if (linkMatch) {
                          return <div key={i} className="my-1"><a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{linkMatch[1]}</a></div>;
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuite;
