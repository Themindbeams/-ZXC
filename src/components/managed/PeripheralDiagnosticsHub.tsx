import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Barcode,
  CreditCard,
  Scale,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Activity,
  Zap,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const PeripheralDiagnosticsHub: React.FC = () => {
  const { peripherals, testPeripheral, togglePeripheralConnection } = useApp();

  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([
    '08:44:10 [SYS] Hardware connector daemon initialized on local socket.',
    '08:44:12 [BARCODE] Honeywell 1400g connected via USB-HID Keyboard Wedge.',
    '08:44:15 [PRINTER] Epson TM-T88VI socket connected at 192.168.1.140:9100.',
    '08:44:18 [TERMINAL] Verifone P400 cloud agent handshake OK (TLS 1.3).',
    '08:44:20 [SCALE] Avery Weigh-Tronix RS-232 COM3 stream calibrated.'
  ]);

  const [testedId, setTestedId] = useState<string | null>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Barcode Scanner': return <Barcode className="w-5 h-5 text-indigo-600" />;
      case 'Receipt Printer': return <Printer className="w-5 h-5 text-emerald-600" />;
      case 'Payment Terminal': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'Weighbridge': return <Scale className="w-5 h-5 text-amber-600" />;
      default: return <Tag className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleRunDeviceTest = (deviceId: string) => {
    setTestedId(deviceId);
    const res = testPeripheral(deviceId);
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticLog(prev => [
      `${timestamp} [TEST] ${deviceId}: ${res.message}`,
      ...prev.slice(0, 15)
    ]);
    setTimeout(() => setTestedId(null), 800);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Hardware Peripherals & Diagnostics Hub
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              {peripherals.filter(p => p.status === 'Connected' || p.status === 'Ready').length}/{peripherals.length} Online
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browser-based peripheral integration using narrow-scoped local connectors (WebUSB, WebSerial, USB-HID keyboard wedge, ESC/POS).
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Driverless Browser Connect</span>
        </div>
      </div>

      {/* Local Customer Infrastructure Boundary Notice */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Local Infrastructure Requirements Clarification</p>
          <p className="text-amber-900/90 text-[11px] leading-relaxed">
            Peripherals operate optionally. ZEEX does NOT require an on-premise application server.
            Customers provide local power, device USB/RS-232/Ethernet cabling, and browser permissions.
            Narrow-scoped local connectors access only the approved printer or scale without exposing the customer’s entire local private network to ZEEX.
          </p>
        </div>
      </div>

      {/* Peripherals Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {peripherals.map(dev => (
          <div
            key={dev.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  {getDeviceIcon(dev.type)}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    dev.status === 'Connected' || dev.status === 'Ready'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-xs">{dev.name}</h4>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">{dev.model}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                <p>Interface: <span className="font-mono text-slate-800 font-medium">{dev.interfaceType}</span></p>
                <p>Endpoint: <span className="font-mono text-slate-800 font-medium">{dev.connectionDetails}</span></p>
                <p className="text-slate-500 text-[10px]">{dev.diagnosticNotes}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
              <button
                onClick={() => togglePeripheralConnection(dev.id)}
                className="text-[10px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                {dev.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </button>
              <button
                onClick={() => handleRunDeviceTest(dev.id)}
                disabled={testedId === dev.id}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-md transition-colors shadow-2xs cursor-pointer"
              >
                {testedId === dev.id ? 'Testing...' : 'Run Self-Test'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Diagnostic Console */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200 text-xs">Hardware Connector Live Log Stream</span>
          </div>
          <span className="text-[10px] text-slate-500">Auto-refresh</span>
        </div>
        <div className="space-y-1 h-32 overflow-y-auto text-[11px] pr-1">
          {diagnosticLog.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-slate-500">{log.substring(0, 8)}</span>{' '}
              <span className={log.includes('[TEST]') ? 'text-indigo-400' : 'text-slate-300'}>
                {log.substring(9)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
