import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import {
  CreditCard,
  Wrench,
  Truck,
  BookOpen,
  Users,
  Building,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface PersonalEmployeeWorkspaceProps {
  onNavigateTab: (tab: string) => void;
}

export const PersonalEmployeeWorkspace: React.FC<PersonalEmployeeWorkspaceProps> = ({
  onNavigateTab
}) => {
  const {
    currentUser,
    activeBranch,
    roles,
    activePOSSession,
    payoutRequests,
    repairOrders,
    dispatchTrips,
    products,
    formatCurrency
  } = useApp();

  const primaryRole = roles[0]?.role || 'OwnerDirector';

  const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderLevel).length;
  const pendingApprovals = payoutRequests.filter(p => p.status === 'Pending Dual Approval' || (p as any).status === 'PendingApproval').length;
  const activeJobs = repairOrders.filter(j => j.status !== 'Invoiced' && (j as any).status !== 'InvoicedAndClosed').length;
  const activeTrips = dispatchTrips.filter(t => t.status === 'On Route' || (t as any).status === 'Dispatched').length;

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mb-1">
            <span>OPERATIONAL WORKSPACE</span>
            <span>·</span>
            <span>{activeBranch.name}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">{primaryRole}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight font-display text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in with verified credentials and scoped permissions for {currentUser.department || 'Operations'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Active Site</span>
            <span className="font-semibold">{activeBranch.code} ({activeBranch.city})</span>
          </div>
        </div>
      </div>

      {/* Role-Specific Dashboard Modules */}

      {/* 1. CASHIER WORKSPACE */}
      {primaryRole === 'Cashier' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Assigned POS Register"
              value={activePOSSession ? activePOSSession.tillNumber : 'Till 01'}
              secondary={activePOSSession ? 'Shift Open & Taking Payments' : 'No Open Shift'}
              icon={<CreditCard className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Cash Drawer Custody"
              value={activePOSSession ? formatCurrency(activePOSSession.expectedCashInDrawer) : '$0.00'}
              secondary={activePOSSession ? `Opening Float: ${formatCurrency(activePOSSession.openingFloat)}` : 'Awaiting Float'}
              icon={<Clock className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Orders Checked Out"
              value={activePOSSession ? String(activePOSSession.ordersCount) : '0'}
              secondary="Today's Till Transactions"
              icon={<CheckCircle2 className="w-4 h-4 text-slate-700" />}
            />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Counter Register Station</h3>
                <p className="text-xs text-slate-500">Scan barcodes, tender cash/card/transfers, and print customer slips.</p>
              </div>
              <button
                onClick={() => onNavigateTab('retail')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Launch Counter Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TECHNICIAN WORKSPACE */}
      {primaryRole === 'Technician' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Active Repair Jobs"
              value={String(activeJobs)}
              secondary="In Service Bays"
              icon={<Wrench className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Inspection Checklists"
              value="Multi-Point Active"
              secondary="Digital Safety Cards"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Fast Spares Inventory"
              value={`${products.length} Parts Available`}
              secondary="Fast-Moving Bay Stock"
              icon={<Clock className="w-4 h-4 text-amber-600" />}
            />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Automotive Service & Repair Bays</h3>
                <p className="text-xs text-slate-500">View diagnostic checklists, issue parts to jobs, and clock labor hours.</p>
              </div>
              <button
                onClick={() => onNavigateTab('automotive')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Go to Repair Job Cards
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISPATCHER WORKSPACE */}
      {primaryRole === 'Dispatcher' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Active Freight Trips"
              value={String(activeTrips)}
              secondary="En Route to Destinations"
              icon={<Truck className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Fleet Capacity"
              value="Commercial Haulage"
              secondary="Roadworthy & Insured"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Pending POD Signatures"
              value="Real-Time Tracking"
              secondary="Consignee Handover"
              icon={<Clock className="w-4 h-4 text-slate-700" />}
            />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Logistics & Freight Dispatch Hub</h3>
                <p className="text-xs text-slate-500">Dispatch cargo trips, allocate driver fuel advances, and confirm proof of delivery.</p>
              </div>
              <button
                onClick={() => onNavigateTab('logistics')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Open Dispatch Command
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACCOUNTANT / FINANCE WORKSPACE */}
      {(primaryRole === 'Accountant' || primaryRole === 'AccountsPayableOfficer' || primaryRole === 'AccountsReceivableOfficer') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Double-Entry Balance"
              value="Balanced"
              secondary="Debits = Credits Verified"
              icon={<BookOpen className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Pending Disbursements"
              value={String(pendingApprovals)}
              secondary="Awaiting Maker-Checker Approval"
              icon={<AlertCircle className="w-4 h-4 text-amber-600" />}
            />
            <StatCard
              label="Statutory Payroll Summary"
              value="Summarized Journal"
              secondary="Individual Wages Shielded by SoD"
              icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
              <h4 className="font-bold text-sm text-slate-900">General Ledger & Trial Balance</h4>
              <p className="text-xs text-slate-500">Review chart of accounts, post balanced journal entries, and inspect financial statements.</p>
              <button
                onClick={() => onNavigateTab('accounting')}
                className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                Access Ledger & P&L
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Treasury & Approvals</h4>
              <p className="text-xs text-slate-500">Review supplier payment requests, dual-authorization queues, and connected bank accounts.</p>
              <button
                onClick={() => onNavigateTab('treasury')}
                className="mt-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                Review Payout Queue
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAYROLL OFFICER WORKSPACE */}
      {primaryRole === 'PayrollOfficer' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Payroll Authorization"
              value="Statutory Officer"
              secondary="Full Compensation Access"
              icon={<Users className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Staff Compensation Profiles"
              value="Active Registry"
              secondary="PAYE & Pension Configured"
              icon={<ShieldCheck className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Ledger Integration"
              value="Summarized Sync"
              secondary="Auto-posts to General Ledger"
              icon={<CheckCircle2 className="w-4 h-4 text-slate-700" />}
            />
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Confidential Payroll Register & Calculations</h3>
                <p className="text-xs text-slate-500">Prepare monthly payroll batches, compute PAYE taxes and pension deductions, and post summary to ledger.</p>
              </div>
              <button
                onClick={() => onNavigateTab('hr')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Open Payroll Engine
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DIRECTOR / SUPER ADMIN / BRANCH MANAGER WORKSPACE */}
      {(primaryRole === 'OwnerDirector' || primaryRole === 'OrgAdmin' || primaryRole === 'BranchManager') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              label="Operating Site"
              value={activeBranch.name}
              secondary={`${activeBranch.city}, ${activeBranch.country}`}
              icon={<Building className="w-4 h-4 text-slate-800" />}
            />
            <StatCard
              label="Repair Jobs Active"
              value={String(activeJobs)}
              secondary="Workshop Bays"
              icon={<Wrench className="w-4 h-4 text-blue-600" />}
            />
            <StatCard
              label="Freight Dispatches"
              value={String(activeTrips)}
              secondary="Interstate Transit"
              icon={<Truck className="w-4 h-4 text-emerald-600" />}
            />
            <StatCard
              label="Stock Reorder Warnings"
              value={`${lowStockCount} Items`}
              secondary="Threshold Reached"
              icon={<AlertCircle className="w-4 h-4 text-rose-600" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Industry Operations</h4>
              <p className="text-[11px] text-slate-500">Retail counter, automotive bays, farm plots, and freight trips.</p>
              <button
                onClick={() => onNavigateTab('workspace')}
                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
              >
                Open Industry Suite &rarr;
              </button>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Finance & Double-Entry Ledger</h4>
              <p className="text-[11px] text-slate-500">Chart of accounts, balance sheet, profit & loss, and period locks.</p>
              <button
                onClick={() => onNavigateTab('accounting')}
                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
              >
                Open Finance &rarr;
              </button>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Staff & Access Management</h4>
              <p className="text-[11px] text-slate-500">Role assignments, active sessions, and multi-user security.</p>
              <button
                onClick={() => onNavigateTab('security')}
                className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
              >
                Manage Staff Access &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
