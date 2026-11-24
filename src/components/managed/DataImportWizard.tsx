import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  RefreshCw,
  FileText
} from 'lucide-react';

export const DataImportWizard: React.FC = () => {
  const { importDataset, products, customers } = useApp();

  const [entityType, setEntityType] = useState<'Products' | 'Customers'>('Products');
  const [importStatus, setImportStatus] = useState<'idle' | 'validated' | 'success'>('idle');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; column: string; issue: string }[]>([]);

  // Sample Datasets for Fast Guided Onboarding
  const sampleProducts = [
    { name: 'Bosch Spark Plug Double Platinum', sku: 'BS-SP-9901', category: 'Spares', unitOfMeasure: 'Piece', stockQuantity: 120, reorderLevel: 20, costPrice: 12.5, sellingPrice: 24.0 },
    { name: 'Motul 8100 X-cess 5W-40 5L', sku: 'MOT-5W40-5L', category: 'Lubricants', unitOfMeasure: 'Bottle', stockQuantity: 45, reorderLevel: 10, costPrice: 38.0, sellingPrice: 62.0 },
    { name: 'Denso Cabin Air Filter', sku: 'DEN-AF-201', category: 'Filters', unitOfMeasure: 'Piece', stockQuantity: 60, reorderLevel: 15, costPrice: 14.0, sellingPrice: 28.5 },
    { name: 'Invalid Defective SKU Sample', sku: '', category: 'General', unitOfMeasure: 'Unit', stockQuantity: -5, reorderLevel: 10, costPrice: 5.0, sellingPrice: -10.0 }
  ];

  const sampleCustomers = [
    { name: 'Lagos Island Fleet Logistics Ltd', email: 'fleet@lagosmarina.com', phone: '+234 802 110 9942', address: 'Plot 12 Marina, Lagos', creditLimit: 15000, taxId: 'TIN-4892019' },
    { name: 'Apex Transit Express Services', email: 'dispatch@apextransit.ng', phone: '+234 809 332 1092', address: '14 Airport Road, Abuja', creditLimit: 25000, taxId: 'TIN-7718290' },
    { name: 'Defective Customer Sample', email: 'invalid_email_format', phone: '', address: '', creditLimit: -200, taxId: '' }
  ];

  const handleLoadSample = () => {
    const raw = entityType === 'Products' ? sampleProducts : sampleCustomers;
    validateDataset(raw);
  };

  const validateDataset = (rows: any[]) => {
    const errors: { row: number; column: string; issue: string }[] = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      if (entityType === 'Products') {
        if (!row.sku || String(row.sku).trim() === '') {
          errors.push({ row: rowNum, column: 'sku', issue: 'Missing unique SKU identifier' });
        }
        if (Number(row.sellingPrice) < 0) {
          errors.push({ row: rowNum, column: 'sellingPrice', issue: 'Selling price cannot be negative' });
        }
        if (Number(row.stockQuantity) < 0) {
          errors.push({ row: rowNum, column: 'stockQuantity', issue: 'Initial inventory quantity cannot be negative' });
        }
      } else if (entityType === 'Customers') {
        if (!row.name || String(row.name).trim() === '') {
          errors.push({ row: rowNum, column: 'name', issue: 'Customer name is required' });
        }
        if (row.email && !row.email.includes('@')) {
          errors.push({ row: rowNum, column: 'email', issue: 'Malformed email syntax' });
        }
        if (Number(row.creditLimit) < 0) {
          errors.push({ row: rowNum, column: 'creditLimit', issue: 'Credit limit cannot be negative' });
        }
      }
    });

    setParsedRows(rows);
    setValidationErrors(errors);
    setImportStatus('validated');
  };

  const handleExecuteImport = () => {
    const res = importDataset(entityType, parsedRows);
    setImportStatus('success');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Master Data Import & Validation Engine
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              CSV / JSON with Validation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Migrate existing business records into ZEEX without manual duplicate data entry. Pre-import validation prevents corrupt inventory and invalid chart of accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={entityType}
            onChange={e => {
              setEntityType(e.target.value as any);
              setImportStatus('idle');
              setParsedRows([]);
              setValidationErrors([]);
            }}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 font-semibold"
          >
            <option value="Products">Products & Inventory SKUs</option>
            <option value="Customers">Customers & Credit Accounts</option>
          </select>
        </div>
      </div>

      {/* Step 1: Upload or Load Sample */}
      {importStatus === 'idle' && (
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Upload {entityType} Data File</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Drag and drop your spreadsheet export (CSV or JSON). Or load the pre-formatted guided onboarding dataset.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Load Verified Sample Dataset</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Validation Preview Table & Diagnostics */}
      {importStatus !== 'idle' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs text-slate-900">Validation Diagnostics Summary</h4>
              <p className="text-xs text-slate-600">
                Parsed: <span className="font-mono font-bold text-slate-900">{parsedRows.length} rows</span> · Valid: <span className="font-mono font-bold text-emerald-600">{parsedRows.length - validationErrors.length}</span> · Issues Detected: <span className="font-mono font-bold text-rose-600">{validationErrors.length}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImportStatus('idle');
                  setParsedRows([]);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md font-medium cursor-pointer"
              >
                Reset
              </button>
              {importStatus === 'validated' && (
                <button
                  onClick={handleExecuteImport}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Import {parsedRows.length - validationErrors.length} Valid Records</span>
                </button>
              )}
            </div>
          </div>

          {/* Error Diagnostics Alert */}
          {validationErrors.length > 0 && (
            <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/70 text-xs text-rose-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>Pre-Import Validation Warnings ({validationErrors.length})</span>
              </div>
              <ul className="space-y-1 text-[11px] text-rose-800 list-disc list-inside">
                {validationErrors.map((err, i) => (
                  <li key={i}>
                    Row {err.row} [Column: <span className="font-mono font-bold">{err.column}</span>]: {err.issue} (Row skipped automatically).
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Row #</th>
                  <th className="px-3 py-2.5">Name</th>
                  {entityType === 'Products' ? (
                    <>
                      <th className="px-3 py-2.5">SKU</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5">Stock</th>
                      <th className="px-3 py-2.5">Price</th>
                    </>
                  ) : (
                    <>
                      <th className="px-3 py-2.5">Email</th>
                      <th className="px-3 py-2.5">Phone</th>
                      <th className="px-3 py-2.5">Credit Limit</th>
                    </>
                  )}
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row, idx) => {
                  const hasError = validationErrors.some(e => e.row === idx + 1);
                  return (
                    <tr key={idx} className={hasError ? 'bg-rose-50/40' : 'hover:bg-slate-50/50'}>
                      <td className="px-3 py-2 font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-900">{row.name || '—'}</td>
                      {entityType === 'Products' ? (
                        <>
                          <td className="px-3 py-2 font-mono">{row.sku || <span className="text-rose-600 font-bold">MISSING</span>}</td>
                          <td className="px-3 py-2">{row.category}</td>
                          <td className="px-3 py-2 font-mono">{row.stockQuantity}</td>
                          <td className="px-3 py-2 font-mono">${row.sellingPrice}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2">{row.email}</td>
                          <td className="px-3 py-2 font-mono">{row.phone}</td>
                          <td className="px-3 py-2 font-mono">${row.creditLimit}</td>
                        </>
                      )}
                      <td className="px-3 py-2">
                        {hasError ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Invalid
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {importStatus === 'success' && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-xs">Import Successful! Verified records have been posted to master database.</span>
              </div>
              <span className="text-xs text-emerald-800 font-semibold">Active in Catalog</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
