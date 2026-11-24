import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  ShieldCheck,
  Database,
  HardDrive,
  RefreshCw,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Lock,
  Cpu,
  Activity,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export const ZEEXCloudConsole: React.FC = () => {
  const {
    cloudInfrastructure,
    backupSnapshots,
    durableJobs,
    triggerBackupNow,
    testBackupRestoration,
    retryDurableJob
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'backups' | 'queues' | 'releases'>('overview');
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

  const handleRunRestoration = (snapshotId: string) => {
    setIsRestoring(true);
    setSelectedSnapshot(snapshotId);
    setTimeout(() => {
      testBackupRestoration(snapshotId);
      setIsRestoring(false);
      setSelectedSnapshot(null);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Managed Platform Architecture Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ZEEX Managed Cloud Infrastructure
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Fully Managed</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ZEEX manages hosting, patches, encrypted backups, monitoring, and disaster recovery. The business retains 100% ownership and governance of operational data.
          </p>
        </div>

        {/* System Administration Scope Tag */}
        <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-2 shadow-xs">
          <Server className="w-3.5 h-3.5 text-indigo-400" />
          <span>Platform Ops: Segregated from Tenant Ops</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Infrastructure Health & SLA
        </button>
        <button
          onClick={() => setActiveTab('backups')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'backups'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Automated Backups & DR ({backupSnapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('queues')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'queues'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Durable Job Queues ({durableJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'releases'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Controlled Releases & Rollbacks
        </button>
      </div>

      {/* Tab 1: Infrastructure Health & SLA */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Real-Time Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>30-Day Uptime SLA</span>
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className="text-xl font-bold font-mono text-slate-900">{cloudInfrastructure.uptime30Days}%</p>
              <p className="text-[11px] text-slate-400 mt-1">Target SLA: 99.95%</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>P99 Query Latency</span>
                <Clock className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <p className="text-xl font-bold font-mono text-slate-900">{cloudInfrastructure.p99LatencyMs} ms</p>
              <p className="text-[11px] text-emerald-600 mt-1">Optimal Ledger Response</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>CPU & Memory Load</span>
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <p className="text-xl font-bold font-mono text-slate-900">
                {cloudInfrastructure.cpuUsagePercent}% / {cloudInfrastructure.memoryUsagePercent}%
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Autonomous Auto-scaling</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>DB Connection Pool</span>
                <Database className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="text-xl font-bold font-mono text-slate-900">
                {cloudInfrastructure.activeConnections} / {cloudInfrastructure.maxConnections}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Pgbouncer Active Pooling</p>
            </div>
          </div>

          {/* Independent Multi-Region Failure Domains */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Multi-Region Failure Domains & Automated Failover</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Primary Active Failure Domain</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                    Routing Traffic
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{cloudInfrastructure.activeRegion}</p>
                <p className="text-slate-600 text-[11px]">
                  Triple-Availability-Zone clustered PostgreSQL with synchronous write replication and automatic health probe checks.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Hot Standby Replica Domain</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    Standby In-Sync
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{cloudInfrastructure.standbyRegion}</p>
                <p className="text-slate-600 text-[11px]">
                  Continuous streaming replication. Failover RTO is &lt; 15 minutes, and RPO target is &lt; 5 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Security Patch Level & Zero Vulnerability Commitment */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs">Security Hardening & Patch Management</h4>
              </div>
              <p className="text-xs text-slate-600">
                Patch Level: <span className="font-mono text-slate-900">{cloudInfrastructure.lastSecurityPatch}</span> · TLS: <span className="font-mono text-slate-900">{cloudInfrastructure.sslExpiry}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Active CVE Vulnerabilities: <span className="font-bold text-emerald-600">0</span> · SOC2 Type II Certified Host
              </p>
            </div>
            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 shadow-2xs">
              Storage: {cloudInfrastructure.storageUsageGb} GB / {cloudInfrastructure.maxStorageGb} GB (AES-256)
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Automated Backups & Disaster Recovery */}
      {activeTab === 'backups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Encrypted Snapshot Archive</h3>
              <p className="text-xs text-slate-500">
                Snapshots are automatically encrypted with AES-256-GCM and stored across physically isolated fault domains.
              </p>
            </div>
            <button
              onClick={triggerBackupNow}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Create Snapshot Now</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Snapshot Reference</th>
                  <th className="px-3 py-3">Timestamp</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Size & Encryption</th>
                  <th className="px-3 py-3">Integrity Checksum</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">DR Recovery Drill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backupSnapshots.map(snap => (
                  <tr key={snap.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{snap.id}</td>
                    <td className="px-3 py-3 text-slate-600">{snap.timestamp}</td>
                    <td className="px-3 py-3 font-medium text-slate-800">{snap.type}</td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-slate-700">{snap.sizeMb} MB</span> ·{' '}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono">
                        {snap.encryption}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-500 text-[10px] truncate max-w-[140px]">
                      {snap.checksumSha256}
                    </td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {snap.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRunRestoration(snap.id)}
                        disabled={isRestoring && selectedSnapshot === snap.id}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isRestoring && selectedSnapshot === snap.id ? 'Restoring Drill...' : 'Test Restoration'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-lg text-xs text-indigo-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-indigo-900">Recovery SLA Target Guarantees</p>
              <p className="text-[11px] text-indigo-800 mt-0.5">
                RPO (Recovery Point Objective): &lt; 5 minutes maximum data loss window in any disaster event.
                RTO (Recovery Time Objective): &lt; 15 minutes complete system restoration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Durable Background Queues */}
      {activeTab === 'queues' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Durable Background Task & Event Queue</h3>
            <p className="text-xs text-slate-500">
              Tasks use durable persistence, idempotent retry tokens, and exponential backoff to guarantee zero duplicate postings.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Job ID & Task Name</th>
                  <th className="px-3 py-3">Queue Domain</th>
                  <th className="px-3 py-3">Payload Summary</th>
                  <th className="px-3 py-3">Attempts / Max</th>
                  <th className="px-3 py-3">Idempotency Key</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Retry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {durableJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-slate-900">{job.id}</p>
                      <p className="font-mono text-[10px] text-indigo-700">{job.jobName}</p>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11px] text-slate-600">{job.queue}</td>
                    <td className="px-3 py-3 text-slate-700">{job.payloadSummary}</td>
                    <td className="px-3 py-3 font-mono text-slate-600">
                      {job.attempts} / {job.maxAttempts}
                    </td>
                    <td className="px-3 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[130px]">
                      {job.idempotencyKey}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          job.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : job.status === 'Processing'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => retryDurableJob(job.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Force safe retry with duplicate check"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Controlled Releases & Rollback Management */}
      {activeTab === 'releases' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Platform Release</span>
                <h3 className="text-base font-bold text-slate-900">{cloudInfrastructure.currentVersion}</h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                Production Stable
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Controlled canary deployments allow automated rollbacks in &lt; 30 seconds if error budget thresholds exceed 0.01%.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-xs">Release Changelog & Rollback Points</h4>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">v2026.10.4-LTS (Current Active)</p>
                <p className="text-slate-500 text-[11px]">Managed Workspace architecture, Discord/Slack communications, Notion SOPs, and Peripherals Hub.</p>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Deployed Today</span>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">v2026.10.3-LTS (Previous Verified Snapshot)</p>
                <p className="text-slate-500 text-[11px]">Automotive workshop OBD scans, Agribusiness silo moisture checks, and Multi-branch SoD.</p>
              </div>
              <button
                onClick={() => alert('Rollback verification drill: Target version v2026.10.3 tested in shadow staging.')}
                className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
              >
                1-Click Rollback Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
