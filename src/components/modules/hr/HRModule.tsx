import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import {
  Users,
  DollarSign,
  Play,
  CheckCircle,
  Building,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';

export const HRModule: React.FC = () => {
  const {
    employees,
    payrollRuns,
    executePayrollRun,
    formatCurrency
  } = useApp();

  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('October 2026');

  const totalMonthlyGross = employees.reduce((sum, e) => sum + e.baseSalary, 0);
  const totalTaxPAYE = Number((totalMonthlyGross * 0.15).toFixed(2));
  const totalPension = Number((totalMonthlyGross * 0.08).toFixed(2));
  const totalNet = totalMonthlyGross - totalTaxPAYE - totalPension;

  const handleRunPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    executePayrollRun(selectedPeriod);
    setIsPayrollModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Human Capital & Payroll</span>
            <span aria-hidden="true">·</span>
            <span>Statutory Tax & Pension Engine</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Staff Directory, Compensation & Automated Payroll
          </h1>
        </div>

        <button
          onClick={() => setIsPayrollModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5" />
          Run Monthly Payroll
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Employees"
          value={String(employees.length)}
          secondary="Engineers, Specialists & Front Desk"
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          label="Monthly Gross Payroll"
          value={formatCurrency(totalMonthlyGross)}
          secondary={`Net Payout: ${formatCurrency(totalNet)}`}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          label="Statutory Tax & Pension"
          value={formatCurrency(totalTaxPAYE + totalPension)}
          secondary="15% PAYE + 8% Pension Deductions"
          icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Payroll History */}
      {payrollRuns.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Payroll Settlement Batches ({payrollRuns.length})
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4">Run Date</th>
                  <th className="py-2.5 px-4 text-right">Headcount</th>
                  <th className="py-2.5 px-4 text-right">Gross Total</th>
                  <th className="py-2.5 px-4 text-right">PAYE & Pension</th>
                  <th className="py-2.5 px-4 text-right">Net Payout</th>
                  <th className="py-2.5 px-4 text-right">Treasury Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRuns.map(pr => (
                  <tr key={pr.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{pr.period}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{pr.runDate}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{pr.employeeCount} staff</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums font-medium text-slate-700">
                      {formatCurrency(pr.totalGross)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-500">
                      {formatCurrency(pr.totalTaxPAYE + pr.totalPension)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(pr.totalNet)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        Queued in Treasury
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Registry */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Staff Directory & Compensation Master
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Code & Name</th>
                <th className="py-3 px-4">Role & Department</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4 text-right">Base Salary</th>
                <th className="py-3 px-4 text-right">Est. Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const tax = emp.baseSalary * 0.15;
                const pension = emp.baseSalary * 0.08;
                const net = emp.baseSalary - tax - pension;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{emp.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{emp.employeeCode}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{emp.role}</div>
                      <span className="text-[11px] text-slate-500">{emp.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700">{emp.email}</div>
                      <div className="text-[11px] font-mono text-slate-400">{emp.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div>{emp.bankName}</div>
                      <span className="text-[11px] text-slate-400">Acc: {emp.accountNumber}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium tabular-nums text-slate-700">
                      {formatCurrency(emp.baseSalary)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Payroll Modal */}
      <Modal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        title="Execute Monthly Payroll Batch"
        subtitle="Calculates gross compensation, statutory PAYE tax and pensions, and creates pending payout in Treasury."
        maxWidth="lg"
      >
        <form onSubmit={handleRunPayroll} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Payroll Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              <option value="October 2026">October 2026</option>
              <option value="November 2026">November 2026</option>
              <option value="December 2026">December 2026</option>
            </select>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Staff:</span>
              <strong className="text-slate-900">{employees.length} Employees</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Gross Payroll Amount:</span>
              <strong className="text-slate-900">{formatCurrency(totalMonthlyGross)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Estimated Statutory PAYE Tax (15%):</span>
              <strong className="text-slate-700">{formatCurrency(totalTaxPAYE)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Pension Scheme Deductions (8%):</span>
              <strong className="text-slate-700">{formatCurrency(totalPension)}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Net Disbursement Batch:</span>
              <span className="text-emerald-700">{formatCurrency(totalNet)}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-lg text-[11px] leading-relaxed">
            <strong>Automated Platform Integration:</strong> Once executed, ZEEX Commerce will generate a balanced journal entry in General Ledger (Dr Salaries & Wages, Cr Tax Withholdings, Cr Net Payables) and queue a payout authorization in Treasury.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPayrollModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Confirm & Post Payroll
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
