import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  Calculator 
} from 'lucide-react';
import { DatabaseTable } from '../types/database';
import { Language } from '../i18n/translations';

interface PivotTableViewProps {
  currentLang: Language;
  table: DatabaseTable;
}

export const PivotTableView: React.FC<PivotTableViewProps> = ({
  currentLang,
  table,
}) => {
  // Available group-by fields from current table
  const groupableFields = table.fields.filter(f => f.type === 'dropdown' || f.type === 'status' || f.type === 'user');
  const [selectedGroupField, setSelectedGroupField] = useState<string>(
    groupableFields[0]?.id || 'paymentStatus'
  );

  // Group records by selected field
  const groups: Record<string, { count: number; totalValue: number; records: any[] }> = {};

  table.records.forEach((rec) => {
    const rawVal = rec[selectedGroupField] || 'نادیار (Unassigned)';
    const val = typeof rawVal === 'string' ? rawVal : String(rawVal);
    
    // Calculate numeric value (e.g. totalAmount, dealValue, totalBatchCost, estimatedHours)
    const numericAmount = Number(rec.totalAmount || rec.dealValue || rec.totalBatchCost || rec.estimatedHours || 0);

    if (!groups[val]) {
      groups[val] = { count: 0, totalValue: 0, records: [] };
    }
    groups[val].count += 1;
    groups[val].totalValue += numericAmount;
    groups[val].records.push(rec);
  });

  const totalAllRecords = table.records.length;
  const grandTotalValue = Object.values(groups).reduce((acc, g) => acc + g.totalValue, 0);

  const activeFieldDef = table.fields.find(f => f.id === selectedGroupField);
  const activeFieldName = currentLang === 'ku' ? activeFieldDef?.nameKu : activeFieldDef?.name;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              پێڤۆت تەیبڵ و شیکاری دارایی (Pivot Table & Analytics)
            </h3>
            <p className="text-xs text-slate-400">
              دابەشکردنی داتا بەپێی گرووپ، کۆی بەها، ڕێژەی بەشداری و هاوکێشەکان
            </p>
          </div>
        </div>

        {/* Group By Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-300">
            گرووپکردن بەپێی (Group by):
          </label>
          <select
            value={selectedGroupField}
            onChange={(e) => setSelectedGroupField(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {groupableFields.map((f) => (
              <option key={f.id} value={f.id}>
                {currentLang === 'ku' ? f.nameKu : f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">کۆی گشتی ژمارەی تۆمارەکان</div>
            <div className="text-2xl font-black text-white font-mono mt-1">{totalAllRecords}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">کۆی بەهای دارایی شیکاریکراو</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              ${grandTotalValue.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-400">تێکڕای بەهای هەر تۆمارێک</div>
            <div className="text-2xl font-black text-purple-400 font-mono mt-1">
              ${totalAllRecords > 0 ? Math.round(grandTotalValue / totalAllRecords).toLocaleString() : 0}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Pivot Summary Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
        <table className="w-full text-xs sm:text-sm text-right">
          <thead>
            <tr className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
              <th className="p-3.5">بەشی پۆلێنکراو ({activeFieldName})</th>
              <th className="p-3.5 text-center">ژمارەی تۆمار</th>
              <th className="p-3.5">ڕێژەی بەشداریکردن</th>
              <th className="p-3.5 text-left font-mono">کۆی گشتی بەها</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {Object.entries(groups).map(([groupName, data]) => {
              const percentage = totalAllRecords > 0 ? Math.round((data.count / totalAllRecords) * 100) : 0;
              return (
                <tr key={groupName} className="hover:bg-slate-850/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span>{groupName}</span>
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-300">
                    {data.count}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400 w-8">{percentage}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-left font-mono font-bold text-emerald-400">
                    ${data.totalValue.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-900/90 font-bold border-t border-slate-700 text-slate-200">
              <td className="p-3.5">کۆی گشتی خشتەی پێڤۆت (Grand Total)</td>
              <td className="p-3.5 text-center font-mono">{totalAllRecords}</td>
              <td className="p-3.5">100%</td>
              <td className="p-3.5 text-left font-mono text-emerald-400">
                ${grandTotalValue.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};
