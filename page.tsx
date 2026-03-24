'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  Shield, Target, Database, Upload, Activity, RefreshCw, 
  MessageSquare, BarChart3, Printer, Users, Cpu, Truck, 
  Radio, Clock, AlertOctagon, GraduationCap
} from 'lucide-react';

export default function OpordStaffSystem() {
  const [mounted, setMounted] = useState(false);
  const [units, setUnits] = useState([]);
  const [analysisOutput, setAnalysisOutput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'INTEL' | 'STAFF_BOTS' | 'RISK'>('STAFF_BOTS');
  const [selectedStaff, setSelectedStaff] = useState("S3");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [missionClock, setMissionClock] = useState("00:00:00");
  const [hHour, setHHour] = useState("0600");

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef, documentTitle: `OPORD_ANNEX_${selectedStaff}` });

  useEffect(() => {
    setMounted(true);
    fetchUnits();
    const interval = setInterval(() => {
      const now = new Date();
      setMissionClock(now.toLocaleTimeString('en-GB'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnits = async () => {
    const res = await fetch('/api/opord');
    if (res.ok) setUnits(await res.json());
  };

  const handleRunBot = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('staffSection', selectedStaff);

    const res = await fetch('/api/mdmp/process', { method: 'POST', body: formData });
    const data = await res.json();
    setAnalysisOutput(data.output);
    setHHour(data.hHour);
    setIsAnalyzing(false);
  };

  if (!mounted) return null;

  const botStyles: any = {
    S2: "text-blue-400 border-l-blue-500",
    S4: "text-amber-500 border-l-amber-500",
    S6: "text-emerald-400 border-l-emerald-500",
    S9: "text-purple-400 border-l-purple-500",
    DEFAULT: "text-slate-300 border-l-slate-500"
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-blue-500/30">
      {/* COMMAND HEADER */}
      <header className="mb-6 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="bg-blue-600 p-2 rounded italic font-black text-black">V3.4</div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">Opord Staff System</h1>
            <div className="flex gap-3 text-[9px] font-mono text-slate-500 uppercase">
              <span>Station: Pinckney_MI</span>
              <span className="text-blue-500 font-bold">● System Active</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="text-right border-r border-slate-800 pr-6">
            <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-end gap-2">
              <Clock size={10}/> Mission Time (Z)
            </div>
            <div className="text-xl font-mono font-black text-blue-400 leading-none">{missionClock}</div>
          </div>
          <button onClick={() => handlePrint()} className="bg-slate-800 p-3 rounded hover:bg-slate-700 transition-all border border-slate-700">
            <Printer size={16}/>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-4">
          
          {/* ACTION BAR */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Source OPORD Analysis</label>
              <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="text-[11px] w-full bg-black/40 p-2 rounded border border-slate-800 file:bg-blue-600 file:text-white" />
            </div>
            <button onClick={handleRunBot} disabled={!selectedFile || isAnalyzing} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded font-black text-[11px] uppercase w-full md:w-auto shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
              {isAnalyzing ? "Processing..." : `Run ${selectedStaff} Sequence`}
            </button>
          </div>

          {/* STAFF BOT SELECTOR */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-1 bg-slate-900 p-1 rounded border border-slate-800">
            {["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"].map(s => (
              <button key={s} onClick={() => setSelectedStaff(s)} className={`py-3 text-xs font-black transition-all rounded ${selectedStaff === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}>{s}</button>
            ))}
          </div>

          {/* DYNAMIC OUTPUT */}
          <div ref={contentRef} className={`bg-black p-8 border-l-4 rounded-r shadow-2xl min-h-[550px] font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[600px] print:text-black print:bg-white ${botStyles[selectedStaff] || botStyles.DEFAULT}`}>
            <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black italic uppercase tracking-tighter">Annex Production: {selectedStaff}</h2>
                <p className="text-[9px] opacity-60">Status: FM 5-0 COMPLIANT // H-HOUR: {hHour}Z</p>
              </div>
              <div className="text-right">
                <div className="text-[8px] uppercase text-slate-500">Security Classification</div>
                <div className="text-[10px] font-bold text-emerald-500">UNCLASSIFIED // FOUO</div>
              </div>
            </div>
            {analysisOutput || `> MDMP SYSTEM READY. AWAITING DATA INPUT.`}
            
            {/* PRINT ONLY FOOTER */}
            <div className="hidden print:block mt-12 border-t border-black pt-4">
              <p className="font-bold uppercase underline mb-2 text-sm">Targeted Overlay Data</p>
              {units.map((u: any) => <div key={u.id} className="text-[10px]">{u.name} - {u.grid}</div>)}
            </div>
          </div>
        </div>

        {/* SIDEBAR: OVERLAY & EVENT PLANNING */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded h-full min-h-[700px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                <Database size={14}/> Tactical SITEMP
              </h3>
              <span className="text-[10px] text-slate-600 font-mono">{units.length} OBJ</span>
            </div>
            
            <div className="space-y-2 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {units.map((u: any) => (
                <div key={u.id} className="bg-black/40 border-l-2 border-blue-500 p-3 flex justify-between items-center hover:bg-slate-800 transition-all">
                  <div className="text-[11px] font-black uppercase">{u.name}<div className="text-[9px] text-slate-500 font-normal">{u.grid}</div></div>
                  <Target size={12} className="text-slate-700"/>
                </div>
              ))}
            </div>

            {/* ROTC / EVENT MODULE QUICK-VIEW */}
            <div className="mt-auto pt-6 border-t border-slate-800">
              <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <GraduationCap size={14}/> ROTC Event Planner
              </h3>
              <div className="space-y-2">
                <div className="bg-purple-600/10 border border-purple-900/30 p-3 rounded text-[10px]">
                  <div className="flex justify-between font-bold mb-1"><span>Military Ball</span><span className="text-purple-400">23 APR</span></div>
                  <div className="opacity-60 italic">Annex C Task-Org in Progress...</div>
                </div>
                <div className="bg-purple-600/10 border border-purple-900/30 p-3 rounded text-[10px]">
                  <div className="flex justify-between font-bold mb-1"><span>Commissioning</span><span className="text-purple-400">01 MAY</span></div>
                  <div className="opacity-60 italic">Syncing with University S1...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}