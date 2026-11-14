'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type LabTab = 'tokens' | 'raf' | 'fsm' | 'workflow' | 'api' | 'agent';
const tabs: { id: LabTab; label: string }[] = [
  { id: 'tokens', label: 'Design Token Synthesizer' },
  { id: 'raf', label: '60 FPS RAF Profiler' },
  { id: 'fsm', label: 'Deterministic FSM State' },
  { id: 'workflow', label: 'AI Workflow Builder' },
  { id: 'api', label: 'API Execution Monitor' },
  { id: 'agent', label: 'AI Agent State Machine' },
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function EngineeringLab() {
  const [tab, setTab] = useState<LabTab>('tokens');
  const [spacing, setSpacing] = useState(8);
  const [ratio, setRatio] = useState(1.25);
  const [hue, setHue] = useState(84);
  const [profiling, setProfiling] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [drops, setDrops] = useState(0);
  const [frameHistory, setFrameHistory] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrame = useRef(0);
  const frameCount = useRef(0);
  const [fsm, setFsm] = useState('IDLE');
  const [fsmLog, setFsmLog] = useState<string[]>(['State machine initialized with state: IDLE']);
  const [workflowNodes, setWorkflowNodes] = useState(['Webhook Trigger', 'AI Classification', 'Condition: Qualified?', 'CRM Update']);
  const [workflowStatus, setWorkflowStatus] = useState('Ready to execute');
  const [workflowLog, setWorkflowLog] = useState<string[]>([]);
  const [apiMethod, setApiMethod] = useState('GET');
  const [apiEndpoint, setApiEndpoint] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [apiStatus, setApiStatus] = useState('Idle');
  const [apiCode, setApiCode] = useState('—');
  const [apiDuration, setApiDuration] = useState('—');
  const [apiBody, setApiBody] = useState('No response yet. Run a request to inspect the response.');
  const [agentState, setAgentState] = useState('IDLE');
  const [agentLog, setAgentLog] = useState<string[]>(['Agent initialized. Awaiting an instruction.']);

 
  const scale = useMemo(() => Array.from({ length: 6 }, (_, i) => Math.round(spacing * Math.pow(ratio, i) * 10) / 10), [spacing, ratio]);
  const tokens = `:root {\n  --space-unit: ${spacing}px;\n  --type-ratio: ${ratio};\n  --brand-hue: ${hue};\n  --brand: hsl(${hue} 78% 62%);\n${scale.map((v, i) => `  --type-${i + 1}: ${v}px;`).join('\n')}\n}`;

  useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  const stopProfiler = () => {
    setProfiling(false);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };
  const startProfiler = () => {
    if (profiling) return;
    setProfiling(true); setFrameHistory([]); setDrops(0); setFps(0); setLatency(0);
    lastFrame.current = 0; frameCount.current = 0;
    const tick = (time: number) => {
      if (!lastFrame.current) lastFrame.current = time;
      const delta = time - lastFrame.current;
      lastFrame.current = time;
      frameCount.current += 1;
      setLatency(Math.round(delta * 100) / 100);
      setFps(delta > 0 ? Math.round(1000 / delta) : 0);
      if (delta > 20) setDrops(v => v + 1);
      setFrameHistory(v => [...v.slice(-19), Math.round(delta * 100) / 100]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const triggerFsm = (next: string) => {
    const allowed: Record<string, string[]> = { IDLE: ['FETCHING'], FETCHING: ['SUCCESS', 'ERROR', 'IDLE'], SUCCESS: ['IDLE', 'FETCHING'], ERROR: ['IDLE', 'FETCHING'] };
    if (!allowed[fsm]?.includes(next)) { setFsmLog(v => [`Rejected invalid transition: ${fsm} → ${next}`, ...v].slice(0, 8)); return; }
    setFsm(next); setFsmLog(v => [`${new Date().toLocaleTimeString()}  ${fsm} → ${next}`, ...v].slice(0, 8));
  };

  const runWorkflow = () => {
    setWorkflowStatus('Running'); setWorkflowLog([]);
    const steps = ['Webhook received payload', 'AI Classification completed', 'Condition evaluated: Qualified = true', 'CRM record updated successfully', 'Workflow completed'];
    steps.forEach((step, i) => setTimeout(() => {
      setWorkflowLog(v => [...v, `${new Date().toLocaleTimeString()}  ${step}`]);
      if (i === steps.length - 1) setWorkflowStatus('Success');
    }, (i + 1) * 450));
  };

  const runApi = async () => {
    setApiStatus('Sending'); setApiCode('—'); setApiDuration('—'); setApiBody('Waiting for response…');
    const start = performance.now();
    try {
      const response = await fetch(apiEndpoint, { method: apiMethod, headers: { Accept: 'application/json' } });
      const elapsed = Math.round(performance.now() - start);
      const raw = await response.text();
      let formatted = raw;
      try { formatted = JSON.stringify(JSON.parse(raw), null, 2); } catch {}
      setApiCode(String(response.status)); setApiDuration(`${elapsed} ms`); setApiStatus(response.ok ? 'Success' : 'HTTP Error'); setApiBody(formatted.slice(0, 6000));
    } catch (error) {
      setApiDuration(`${Math.round(performance.now() - start)} ms`); setApiStatus('Network Error'); setApiBody(error instanceof Error ? error.message : 'Request failed. Check the endpoint and browser CORS policy.');
    }
  };

  const agentTransition = (next: string) => {
    const allowed: Record<string, string[]> = { IDLE: ['REASONING'], REASONING: ['TOOL_CALL', 'COMPLETED', 'FAILED'], TOOL_CALL: ['OBSERVING', 'FAILED'], OBSERVING: ['REASONING', 'COMPLETED', 'FAILED'], COMPLETED: ['IDLE'], FAILED: ['IDLE'] };
    if (!allowed[agentState]?.includes(next)) { setAgentLog(v => [`Blocked transition ${agentState} → ${next}`, ...v].slice(0, 10)); return; }
    setAgentState(next); setAgentLog(v => [`${new Date().toLocaleTimeString()}  ${agentState} → ${next}`, ...v].slice(0, 10));
  };

  return <section className="lab-section" id="lab">
    <div className="wrap">
      <div className="section-heading"><span className="eyebrow">INTERACTIVE WORKBENCH / 08</span><h2>Engineering lab</h2><p>Small, runnable demonstrations of interface engineering, automation orchestration, API behavior and state management. These run locally in your browser and use sample data.</p></div>
      <div className="lab-tabs">{tabs.map(item => <button key={item.id} className={tab === item.id ? 'lab-tab active' : 'lab-tab'} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>

      {tab === 'tokens' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>Mathematical Token & Scale Synthesizer</h3><p>Adjust grid baselines, typographic scales and HSL palettes in real time.</p></div><button className="lab-button" onClick={() => navigator.clipboard?.writeText(tokens)}>▣ Copy Tokens</button></div><div className="token-layout"><div className="token-controls">
        <label>Base Spacing Unit <b>{spacing}px</b><input type="range" min="2" max="16" value={spacing} onChange={e => setSpacing(Number(e.target.value))}/><small>2px (Ultra-Dense) <span>8px (Standard)</span> 16px (Spacious)</small></label>
        <label>Type Scale Ratio <b>{ratio.toFixed(3)}</b><input type="range" min="1.1" max="1.5" step="0.005" value={ratio} onChange={e => setRatio(Number(e.target.value))}/><small>1.1 (Compact) <span>1.25 (Major Third)</span> 1.5 (Augmented Fourth)</small></label>
        <label>Brand Color Hue <b>{hue}°</b><input type="range" min="0" max="360" value={hue} onChange={e => setHue(Number(e.target.value))}/><small>0° <span>180°</span> 360°</small></label>
        <pre className="token-code">{tokens}</pre>
      </div>
      
    <div
  className="token-preview"
  style={{
    backgroundColor: `hsl(${hue} 22% 10%)`,
    borderColor: `hsl(${hue} 30% 28%)`,
    transition: 'background-color 250ms ease, border-color 250ms ease',
  }}
>
  <span className="eyebrow">LIVE DYNAMIC PREVIEW</span>

  <h2 style={{ fontSize: `${scale[4]}px` }}>
    Heading Display
  </h2>

  <h3 style={{ fontSize: `${scale[2]}px` }}>
    Subheading Level 2
  </h3>

  <p style={{ fontSize: `${scale[0]}px` }}>
    Body text scaling computed with base grid of {spacing}px and a mathematical modular multiplier.
  </p>

  <div>
    <button>Primary Button</button>
    <button className="preview-secondary">
      Secondary Action
    </button>
  </div>
</div></div></div>}

      {tab === 'raf' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>Non-Blocking Frame Rate & RAF Engine</h3><p>Measure frame intervals and observe browser animation scheduling.</p></div><button className="lab-button primary" onClick={profiling ? stopProfiler : startProfiler}>{profiling ? '■ Stop Profiler' : '▷ Start Profiler'}</button></div><div className="raf-stats"><div><strong>{profiling ? `${fps} FPS` : 'Idle'}</strong><span>Current Frame Rate</span></div><div><strong>{profiling ? `${latency} ms` : '—'}</strong><span>Frame Interval</span></div><div><strong>{drops}</strong><span>Intervals over 20 ms</span></div></div><div className="lab-console"><div className="console-head">Recent Frame History (last 20 intervals)<span>{frameHistory.length} samples recorded</span></div>{frameHistory.length ? <div className="frame-bars">{frameHistory.map((v, i) => <div key={i} title={`${v} ms`} style={{ height: `${clamp(v / 40 * 100, 5, 100)}%` }}/>)}</div> : <p className="console-empty">Press “Start Profiler” to stream real-time requestAnimationFrame intervals.</p>}</div></div>}

      {tab === 'fsm' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>Deterministic Finite State Machine (FSM)</h3><p>Invalid state transitions are rejected by an explicit transition map.</p></div><b className="state-pill">ACTIVE STATE: {fsm}</b></div><div className="state-actions">{['IDLE', 'FETCHING', 'SUCCESS', 'ERROR'].map(s => <button key={s} onClick={() => triggerFsm(s)}>Trigger → {s}</button>)}</div><div className="lab-console"><b>Transition History Log</b>{fsmLog.map((line, i) => <p key={i}>{line}</p>)}</div></div>}

      {tab === 'workflow' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>AI Workflow Builder</h3><p>Compose a sample lead-intake automation and simulate its execution path.</p></div><span className="state-pill">{workflowStatus.toUpperCase()}</span></div><div className="workflow-builder"><div className="workflow-nodes">{workflowNodes.map((node, i) => <div className="workflow-node" key={`${node}-${i}`}><span>{String(i + 1).padStart(2, '0')}</span><b>{node}</b><small>{i === 0 ? 'TRIGGER' : i === 1 ? 'AI STEP' : i === 2 ? 'BRANCH' : 'ACTION'}</small></div>)}</div><div className="workflow-edit"><label>Add a step<select id="workflow-step" defaultValue="Slack Notification"><option>Slack Notification</option><option>Send Email</option><option>Google Sheets Row</option><option>Human Approval</option><option>HTTP Request</option></select></label><button className="lab-button" onClick={() => { const el = document.getElementById('workflow-step') as HTMLSelectElement | null; if (el) setWorkflowNodes(v => [...v, el.value]); }}>＋ Add Step</button><button className="lab-button primary" onClick={runWorkflow}>▷ Run Workflow</button></div></div><div className="lab-console"><b>Execution Log</b>{workflowLog.length ? workflowLog.map((line, i) => <p key={i}>{line}</p>) : <p className="console-empty">No executions yet. Run the sample workflow to see each step complete.</p>}</div></div>}

      {tab === 'api' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>API Execution Monitor</h3><p>Send a real browser request to a public sample endpoint and inspect its response.</p></div><span className="state-pill">{apiStatus.toUpperCase()}</span></div><div className="api-controls"><select value={apiMethod} onChange={e => setApiMethod(e.target.value)}><option>GET</option><option>HEAD</option></select><input value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} aria-label="API endpoint"/><button className="lab-button primary" onClick={runApi} disabled={apiStatus === 'Sending'}>{apiStatus === 'Sending' ? 'Sending…' : '▷ Send Request'}</button></div><div className="raf-stats api-stats"><div><strong>{apiCode}</strong><span>HTTP Status</span></div><div><strong>{apiDuration}</strong><span>Duration</span></div><div><strong>{apiStatus}</strong><span>Execution Result</span></div></div><div className="lab-console"><div className="console-head">Response Body <button className="copy-small" onClick={() => navigator.clipboard?.writeText(apiBody)}>Copy response</button></div><pre>{apiBody}</pre></div><p className="lab-disclaimer">This demo makes requests from your browser. Other endpoints may reject browser requests because of CORS or authentication requirements.</p></div>}

      {tab === 'agent' && <div className="lab-panel"><div className="lab-panel-head"><div><h3>AI Agent State Machine</h3><p>Model a tool-using agent loop with guarded transitions between reasoning, tool calls and observation.</p></div><span className="state-pill">{agentState}</span></div><div className="agent-states">{['IDLE', 'REASONING', 'TOOL_CALL', 'OBSERVING', 'COMPLETED', 'FAILED'].map(s => <span key={s} className={agentState === s ? 'agent-state current' : 'agent-state'}>{s}</span>)}</div><div className="state-actions">{[{s:'REASONING',t:'Start reasoning'},{s:'TOOL_CALL',t:'Call tool'},{s:'OBSERVING',t:'Observe result'},{s:'COMPLETED',t:'Complete'},{s:'FAILED',t:'Fail run'},{s:'IDLE',t:'Reset'}].map(x => <button key={x.s} onClick={() => agentTransition(x.s)}>{x.t}</button>)}</div><div className="lab-console"><b>Agent Event Trace</b>{agentLog.map((line, i) => <p key={i}>{line}</p>)}</div></div>}
      <p className="lab-footnote">Interactive demonstrations use local browser state and sample workflows. No external client credentials or private systems are connected.</p>
    </div>
  </section>;
}
