import React from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Laptop, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Zap, 
  WifiOff, 
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  currentLang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  const t = translations[currentLang];
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [justInstalled, setJustInstalled] = React.useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => {
          onClose();
          setJustInstalled(false);
        }, 2500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent pointer-events-none" />

        {/* Top Bar */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Download className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t.installAppModalTitle}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {t.installAppDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 relative z-10 max-h-[75vh] overflow-y-auto">
          {/* App Card Preview */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex items-center gap-4">
            <img 
              src="/pwa-192x192.png" 
              alt="Magic App" 
              className="w-16 h-16 rounded-2xl shadow-md border border-slate-700/50" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base truncate">{t.brandName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {t.brandTagline}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> بەردەست بەبێ ئینتەرنێت
                </span>
                <span>•</span>
                <span className="text-indigo-400 font-medium">قەبارە: کەمتر لە 2MB</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300 font-medium">دەستپێکردنی دەستبەجێ</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300 font-medium">کارکردن لە دۆخی ئۆفلاین</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300 font-medium">پەنجەرەی سەربەخۆ</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850/60 border border-slate-800/80 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 font-medium">پاراستنی بەرزی ئاسایش</span>
            </div>
          </div>

          {/* Conditional Guidance based on Device Platform */}
          {isInstalled || justInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-white text-sm">
                {t.appAlreadyInstalled}
              </div>
              <p className="text-xs text-emerald-300/80">
                دەتوانیت لە ڕێگەی ئایکۆنی ماجیک لەسەر شاشەی سەرەکی یان دیسکتۆپ بیکەیتەوە.
              </p>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Instructions */
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 space-y-3">
              <div className="font-bold text-indigo-200 text-xs flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>{t.installIosTitle}</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60">
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{t.installIosStep1}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60">
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">{t.installIosStep2}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Android / Desktop / Direct Install Flow */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{t.installDesktopTitle}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {t.installDesktopDesc}
                </p>
              </div>

              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.installAppBtn}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-300">
                    بۆ دابەزاندن، لە بەشی ناونیشانی براوزەرەکەت کلیک لە ئایکۆنی دابەزاندن <strong>(Install App ⊕)</strong> بکە.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  >
                    تێگەیشتم
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>پشتیوانی لە هەموو سیستمەکان: Windows, Mac, Android, iOS</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
