import React, { useState } from 'react';
import { X, Plus, Columns3 } from 'lucide-react';
import { FieldType, FieldDefinition } from '../types/database';
import { Language } from '../i18n/translations';

interface AddColumnModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
  onAddField: (field: FieldDefinition) => void;
}

export const AddColumnModal: React.FC<AddColumnModalProps> = ({
  currentLang,
  isOpen,
  onClose,
  onAddField,
}) => {
  const [fieldNameKu, setFieldNameKu] = useState('');
  const [fieldNameEn, setFieldNameEn] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [optionsStr, setOptionsStr] = useState('بەڵێ, نەخێر, لە چاوەڕوانیدا');
  const [formula, setFormula] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldNameKu.trim() && !fieldNameEn.trim()) return;

    const newField: FieldDefinition = {
      id: `field_${Date.now()}`,
      name: fieldNameEn.trim() || fieldNameKu.trim(),
      nameKu: fieldNameKu.trim() || fieldNameEn.trim(),
      nameAr: fieldNameKu.trim() || fieldNameEn.trim(),
      type: fieldType,
      options: fieldType === 'dropdown' || fieldType === 'status' 
        ? optionsStr.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
      formula: fieldType === 'formula' ? formula : undefined,
      width: 150,
    };

    onAddField(newField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Columns3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              زیادکردنی خانەی نوێ (Add New Column)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ناوی خانە بە کوردی (Field Name - Kurdish):
            </label>
            <input
              type="text"
              required
              value={fieldNameKu}
              onChange={(e) => setFieldNameKu(e.target.value)}
              placeholder="بۆ نموونە: شێوازی گواستنەوە، داشکاندن..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ناوی خانە بە ئینگلیزی (English Name):
            </label>
            <input
              type="text"
              value={fieldNameEn}
              onChange={(e) => setFieldNameEn(e.target.value)}
              placeholder="e.g. Shipping Method, Discount..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              جۆری داتا (Field Type):
            </label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as FieldType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="text">دەق (Text)</option>
              <option value="number">ژمارە (Number)</option>
              <option value="currency">دراو و پارە ($ Currency)</option>
              <option value="date">بەروار (Date)</option>
              <option value="dropdown">لیستەی هەڵبژاردن (Dropdown)</option>
              <option value="status">دۆخ (Status Badge)</option>
              <option value="formula">هاوکێشەی حیسابی (Formula)</option>
              <option value="user">بەکارهێنەر / نوێنەر (User)</option>
            </select>
          </div>

          {(fieldType === 'dropdown' || fieldType === 'status') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                هەڵبژاردنەکان (بە فاریزە جیایانبکەرەوە):
              </label>
              <input
                type="text"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {fieldType === 'formula' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                هاوکێشەی ماتماتیکی (Excel Formula):
              </label>
              <input
                type="text"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="بۆ نموونە: subtotal * 0.15"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
            >
              پاشگەزبوونەوە
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>زیادکردن بۆ خشتە</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
