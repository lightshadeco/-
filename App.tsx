
import React, { useState, useMemo } from 'react';
import { CurtainType, TriplePleatState, SFoldState, SquareFeetState } from './types';
import { calculateTriplePleat, calculateSFold, calculateSquareFeet } from './utils/calculations';

// Shared UI components
const InputGroup = ({ label, icon, value, onChange, unit, step = 1 }: { label: string, icon: string, value: number, onChange: (v: number) => void, unit?: string, step?: number }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
      <i className={`fa-solid ${icon} w-4 text-sky-500`}></i>
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all outline-none"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{unit}</span>
      )}
    </div>
  </div>
);

const CheckboxGroup = ({ label, checked, onChange, description }: { label: string, checked: boolean, onChange: (v: boolean) => void, description?: string }) => (
  <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${checked ? 'bg-sky-50 border-sky-200 ring-1 ring-sky-100' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
    <div className="pt-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
      />
    </div>
    <div className="flex flex-col">
      <span className={`font-medium ${checked ? 'text-sky-800' : 'text-slate-700'}`}>{label}</span>
      {description && <span className="text-xs text-slate-400 mt-1">{description}</span>}
    </div>
  </label>
);

const App: React.FC = () => {
  const [curtainType, setCurtainType] = useState<CurtainType>(CurtainType.TRIPLE_PLEAT);

  // States
  const [tpState, setTpState] = useState<TriplePleatState>({
    unitPrice: 240,
    width: 180,
    height: 256,
    multiplier: 2.2,
    isSeamless: true,
    hasShaping: false,
    hasHooks: false,
    hasTieBack: false,
    hasLeadWeight: false,
  });

  const [sfState, setSfState] = useState<SFoldState>({
    unitPrice: 300,
    width: 180,
    height: 256,
    multiplier: 2.2,
    hookDistance: 8,
    isDouble: true,
    hasShaping: false,
    hasHooks: false,
    hasTieBack: false,
    hasLeadWeight: false,
  });

  const [sqState, setSqState] = useState<SquareFeetState>({
    unitPrice: 84.35,
    width: 300,
    height: 256
  });

  // Calculations
  const results = useMemo(() => {
    switch (curtainType) {
      case CurtainType.TRIPLE_PLEAT: return calculateTriplePleat(tpState);
      case CurtainType.S_FOLD: return calculateSFold(sfState);
      case CurtainType.SQUARE_FEET: return calculateSquareFeet(sqState);
    }
  }, [curtainType, tpState, sfState, sqState]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-scissors text-sky-500"></i>
            窗簾用布量計算
          </h1>
          <div className="text-xs font-medium px-2 py-1 bg-sky-100 text-sky-600 rounded-md">專業版</div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 mt-6">
        {/* Type Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-8">
          {Object.values(CurtainType).map((type) => (
            <button
              key={type}
              onClick={() => setCurtainType(type)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                curtainType === type
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="窗戶寬度"
              icon="fa-arrows-left-right"
              value={curtainType === CurtainType.SQUARE_FEET ? sqState.width : (curtainType === CurtainType.S_FOLD ? sfState.width : tpState.width)}
              onChange={(v) => {
                if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, width: v });
                if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, width: v });
                if (curtainType === CurtainType.SQUARE_FEET) setSqState({ ...sqState, width: v });
              }}
              unit="cm"
            />
            <InputGroup
              label="窗戶高度"
              icon="fa-arrows-up-down"
              value={curtainType === CurtainType.SQUARE_FEET ? sqState.height : (curtainType === CurtainType.S_FOLD ? sfState.height : tpState.height)}
              onChange={(v) => {
                if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, height: v });
                if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, height: v });
                if (curtainType === CurtainType.SQUARE_FEET) setSqState({ ...sqState, height: v });
              }}
              unit="cm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="每單位單價"
              icon="fa-tags"
              value={curtainType === CurtainType.SQUARE_FEET ? sqState.unitPrice : (curtainType === CurtainType.S_FOLD ? sfState.unitPrice : tpState.unitPrice)}
              onChange={(v) => {
                if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, unitPrice: v });
                if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, unitPrice: v });
                if (curtainType === CurtainType.SQUARE_FEET) setSqState({ ...sqState, unitPrice: v });
              }}
              unit="元"
              step={0.01}
            />
            {curtainType !== CurtainType.SQUARE_FEET && (
              <InputGroup
                label="布料倍數"
                icon="fa-maximize"
                value={curtainType === CurtainType.S_FOLD ? sfState.multiplier : tpState.multiplier}
                onChange={(v) => {
                  if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, multiplier: v });
                  if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, multiplier: v });
                }}
                unit="倍"
                step={0.1}
              />
            )}
          </div>

          {/* Type Specific Config */}
          {curtainType === CurtainType.TRIPLE_PLEAT && (
            <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">三折簾設定</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">計價模式</span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setTpState({ ...tpState, isSeamless: true })}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${tpState.isSeamless ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    無接縫
                  </button>
                  <button
                    onClick={() => setTpState({ ...tpState, isSeamless: false })}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!tpState.isSeamless ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    五尺布
                  </button>
                </div>
              </div>
            </div>
          )}

          {curtainType === CurtainType.S_FOLD && (
            <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-6">
              <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">蛇行簾設定</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-link w-4 text-sky-500"></i>
                    鉤距
                  </label>
                  <select
                    value={sfState.hookDistance}
                    onChange={(e) => setSfState({ ...sfState, hookDistance: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-400 appearance-none bg-white"
                  >
                    <option value={8}>8 公分</option>
                    <option value={5.5}>5.5 公分</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-door-open w-4 text-sky-500"></i>
                    開啟方式
                  </label>
                  <select
                    value={sfState.isDouble ? '雙開' : '單開'}
                    onChange={(e) => setSfState({ ...sfState, isDouble: e.target.value === '雙開' })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-400 appearance-none bg-white"
                  >
                    <option value="單開">單開</option>
                    <option value="雙開">雙開</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Add-ons */}
          {curtainType !== CurtainType.SQUARE_FEET && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">加購項目</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CheckboxGroup
                  label="高溫塑形整燙"
                  checked={curtainType === CurtainType.TRIPLE_PLEAT ? tpState.hasShaping : sfState.hasShaping}
                  onChange={(v) => {
                    if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, hasShaping: v });
                    if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, hasShaping: v });
                  }}
                  description="提升美感，維持垂直度"
                />
                <CheckboxGroup
                  label="升級白鐵勾"
                  checked={curtainType === CurtainType.TRIPLE_PLEAT ? tpState.hasHooks : sfState.hasHooks}
                  onChange={(v) => {
                    if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, hasHooks: v });
                    if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, hasHooks: v });
                  }}
                  description="不生鏽、經久耐用"
                />
                <CheckboxGroup
                  label="船型綁帶"
                  checked={curtainType === CurtainType.TRIPLE_PLEAT ? tpState.hasTieBack : sfState.hasTieBack}
                  onChange={(v) => {
                    if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, hasTieBack: v });
                    if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, hasTieBack: v });
                  }}
                  description="標配船型綁帶"
                />
                <CheckboxGroup
                  label="下襬加鉛條"
                  checked={curtainType === CurtainType.TRIPLE_PLEAT ? tpState.hasLeadWeight : sfState.hasLeadWeight}
                  onChange={(v) => {
                    if (curtainType === CurtainType.TRIPLE_PLEAT) setTpState({ ...tpState, hasLeadWeight: v });
                    if (curtainType === CurtainType.S_FOLD) setSfState({ ...sfState, hasLeadWeight: v });
                  }}
                  description="增加垂墜感"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="mt-10 bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <h2 className="text-slate-400 text-sm font-medium mb-1">預估總金額</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-sky-400">NT$ {results?.totalPrice.toLocaleString()}</span>
              <span className="text-slate-400 text-sm">起</span>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">布料寬度 (尺)</span>
                  <span className="text-lg font-bold">{results?.fabricWidthChi || '--'} <span className="text-xs font-normal text-slate-400">尺</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 mb-1">使用幅數</span>
                  <span className="text-lg font-bold">{results?.fabricWidthFu || '--'} <span className="text-xs font-normal text-slate-400">幅</span></span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase">費用明細</h4>
                {results?.details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm py-1">
                    <span className="text-slate-400">{detail.label}</span>
                    <span className="font-medium">NT$ {detail.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full bg-sky-500 hover:bg-sky-400 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
                <i className="fa-solid fa-file-invoice"></i>
                下載正式報價單
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Contact */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-emerald-500 w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-200 hover:scale-110 transition-transform">
          <i className="fa-brands fa-line"></i>
        </button>
      </div>
    </div>
  );
};

export default App;
