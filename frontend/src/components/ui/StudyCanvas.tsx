import React, { useEffect, useRef, useState } from 'react';
import { PenTool, Download, ListChecks, Network } from 'lucide-react';
import mermaid from 'mermaid';

interface StudyCanvasProps {
  mermaidCode?: string;
  guideText?: string;
  onCompile?: (selectedQuestions: string[]) => void;
}

export const StudyCanvas: React.FC<StudyCanvasProps> = ({ mermaidCode, guideText, onCompile }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState([
    { id: 1, text: "Compare FIFO and LRU page replacement algorithms under heavy memory load.", selected: true },
    { id: 2, text: "Explain Thrashing and its impact on CPU utilization.", selected: false },
    { id: 3, text: "Describe the Banker's Algorithm with a resource allocation graph.", selected: false },
  ]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#ffffff',
        primaryTextColor: '#0f0f0f',
        primaryBorderColor: '#0f0f0f',
        lineColor: '#0f0f0f',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#fff',
      },
      fontFamily: 'JetBrains Mono',
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
      mermaid.render('mermaid-svg', mermaidCode).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      });
    }
  }, [mermaidCode]);

  const handleToggle = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, selected: !q.selected } : q));
  };

  const handleCompileClick = () => {
    const selected = questions.filter(q => q.selected).map(q => q.text);
    if (onCompile && selected.length > 0) {
      onCompile(selected);
    } else if (selected.length === 0) {
      alert("Please select at least one question to compile.");
    }
  };

  const handleExport = () => {
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compiled Academic Study Guide</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #0f0f0f; background-color: #ffffff; }
        .guide-text { white-space: pre-wrap; font-size: 15px; margin-bottom: 40px; }
        .diagram-container { border: 2px solid #0f0f0f; padding: 20px; background: #fff; display: flex; justify-content: center; overflow: auto; box-shadow: 4px 4px 0px 0px rgba(15,15,15,1); }
        h2 { font-family: monospace; text-transform: uppercase; border-bottom: 2px solid #0f0f0f; padding-bottom: 5px; margin-top: 40px; }
    </style>
</head>
<body>
    <h2>📚 Compiled Study Guide</h2>
    <div class="guide-text">${guideText ? guideText.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'No text available.'}</div>
`;
    
    if (mermaidCode && mermaidRef.current) {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);
        
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        content += `<h2>Accompanying Diagram</h2>\n`;
        content += `<div class="diagram-container">\n${source}\n</div>\n`;
      }
    }

    content += `</body>\n</html>`;

    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `academic_guide_${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-brutal-white flex flex-col min-h-[33%] overflow-hidden relative">
      <div className="bg-brutal-black text-brutal-white font-mono text-[10px] p-2 flex items-center justify-between border-b-2 border-brutal-black">
        <span className="uppercase tracking-widest font-bold flex items-center gap-2">
          <PenTool className="w-3.5 h-3.5 text-brutal-orange" />
          📊 Study Guides & Canvas Visuals
        </span>
      </div>
      
      <div className="p-4 flex-1 flex flex-col overflow-y-auto">
        {!mermaidCode ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3 border-b border-brutal-gray-medium pb-2">
              <ListChecks className="w-4 h-4 text-brutal-black" />
              <span className="text-[10px] font-mono text-brutal-black uppercase tracking-widest font-bold">Compiled Question Bank</span>
            </div>
            
            <div className="space-y-2 mb-4 flex-1">
              {questions.map((q) => (
                <div key={q.id} className="flex items-start gap-2 text-[11px] font-sans text-brutal-black">
                  <input 
                    type="checkbox" 
                    checked={q.selected} 
                    onChange={() => handleToggle(q.id)}
                    className="mt-0.5 accent-brutal-black"
                  />
                  <span className={q.selected ? "font-bold" : "text-brutal-gray-dark"}>{q.text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleCompileClick}
              className="w-full bg-brutal-black text-brutal-white font-mono text-[10px] font-bold py-2 px-3 border border-brutal-black shadow-[2px_2px_0px_0px_rgba(15,15,15,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,15,15,1)] transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-3 h-3" />
              [COMPILE GUIDE FOR SELECTED QUESTIONS]
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
             <div className="flex items-center justify-between mb-3 border-b border-brutal-gray-medium pb-2">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-brutal-black" />
                <span className="text-[10px] font-mono text-brutal-black uppercase tracking-widest font-bold">Interactive Canvas</span>
              </div>
              <button 
                onClick={handleExport}
                className="text-[9px] bg-brutal-black text-brutal-white font-mono px-2 py-1 uppercase border border-brutal-black hover:bg-brutal-orange hover:text-brutal-black transition-colors"
              >
                [EXPORT FULL GUIDE]
              </button>
            </div>
            
            <div className="flex-1 border-2 border-brutal-black bg-brutal-white flex items-center justify-center overflow-auto p-4" ref={mermaidRef}>
              {/* Mermaid SVG renders here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
