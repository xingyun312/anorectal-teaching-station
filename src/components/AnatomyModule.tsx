import React, { useState } from 'react';
import { ANATOMY_STRUCTURES, PARKS_FISTULA_TYPES } from '../data/anatomyData';
import { ParksFistulaType } from '../types/clinical';
import { AlertTriangle, Compass, Eye, Info, Layers } from 'lucide-react';

export const AnatomyModule: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('dentate-line');
  const [parksOverlay, setParksOverlay] = useState<'none' | ParksFistulaType['id']>('none');
  const [subMode, setSubMode] = useState<'coronal' | 'goodsall'>('coronal');

  // Goodsall simulator state
  const [clockHour, setClockHour] = useState<number>(5);
  const [distanceCm, setDistanceCm] = useState<'near' | 'far'>('near'); // near <=3cm, far >3cm

  const selectedStructure = ANATOMY_STRUCTURES.find((s) => s.id === selectedId) ?? ANATOMY_STRUCTURES[0];
  const selectedParks = PARKS_FISTULA_TYPES.find((p) => p.id === parksOverlay);

  const isSelected = (id: string) => selectedId === id;

  // Goodsall logic in lithotomy position:
  // Anterior hemisphere: 10, 11, 12, 1, 2 (strictly above 3-9 horizontal line)
  // On 3-9 line (3 or 9) or posterior (4, 5, 6, 7, 8): curves to 6 o'clock
  const isAnterior = [10, 11, 12, 1, 2].includes(clockHour);
  const goodsallCurvesToSix = !isAnterior || distanceCm === 'far';
  const predictedInternalClock = goodsallCurvesToSix ? 6 : clockHour;

  // Helper for clock coordinates on SVG (center 160, 160)
  const getClockXY = (hour: number, radius: number) => {
    // 12 o'clock is -90 deg
    const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
    return {
      x: 160 + radius * Math.cos(angleRad),
      y: 160 + radius * Math.sin(angleRad)
    };
  };

  const outerPt = getClockXY(clockHour, distanceCm === 'near' ? 92 : 128);
  const innerPt = getClockXY(predictedInternalClock, 34);

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-clinical-600" />
            肛管直肠解剖互动图与定位模拟
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            点击解剖结构查看神经/血供/淋巴及手术红线，或切换截石位演示 Goodsall 定律与母痔区定位。
          </p>
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start">
          <button
            onClick={() => setSubMode('coronal')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
              subMode === 'coronal'
                ? 'bg-white text-clinical-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            冠状面解剖与 Parks 分型
          </button>
          <button
            onClick={() => setSubMode('goodsall')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
              subMode === 'goodsall'
                ? 'bg-white text-clinical-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            截石位与 Goodsall 定律模拟
          </button>
        </div>
      </div>

      {subMode === 'coronal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive SVG + Parks overlay selector */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-clinical-600" />
                点击图中任意结构进行解剖解析
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setParksOverlay('none')}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                    parksOverlay === 'none'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  仅正常解剖
                </button>
                {PARKS_FISTULA_TYPES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setParksOverlay(p.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition ${
                      parksOverlay === p.id
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    Parks {['I', 'II', 'III', 'IV'][idx]}型
                  </button>
                ))}
              </div>
            </div>

            {/* Coronal SVG */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex justify-center">
              <svg viewBox="0 0 560 400" className="w-full max-w-[560px] h-auto select-none">
                {/* Background Labels */}
                <text x="280" y="24" textAnchor="middle" className="fill-slate-500 text-[12px] font-semibold">
                  直肠肛管冠状面解剖示意图（点击各区域交互）
                </text>

                {/* Pelvirectal Space (Left & Right) */}
                <g
                  onClick={() => setSelectedId('pelvirectal-space')}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                >
                  <path
                    d="M 45,55 L 185,55 L 175,145 Q 110,165 45,155 Z"
                    fill={isSelected('pelvirectal-space') ? '#fef08a' : '#fef9c3'}
                    stroke={isSelected('pelvirectal-space') ? '#ca8a04' : '#fde047'}
                    strokeWidth={isSelected('pelvirectal-space') ? 2.5 : 1.5}
                  />
                  <path
                    d="M 375,55 L 515,55 L 515,155 Q 450,165 385,145 Z"
                    fill={isSelected('pelvirectal-space') ? '#fef08a' : '#fef9c3'}
                    stroke={isSelected('pelvirectal-space') ? '#ca8a04' : '#fde047'}
                    strokeWidth={isSelected('pelvirectal-space') ? 2.5 : 1.5}
                  />
                  <text x="112" y="105" textAnchor="middle" className="fill-amber-900 text-[11px] font-semibold">
                    骨盆直肠间隙
                  </text>
                  <text x="448" y="105" textAnchor="middle" className="fill-amber-900 text-[11px] font-semibold">
                    骨盆直肠间隙
                  </text>
                </g>

                {/* Ischiorectal Fossa (Left & Right) */}
                <g
                  onClick={() => setSelectedId('ischiorectal-fossa')}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                >
                  <path
                    d="M 45,175 Q 115,180 165,165 L 135,330 L 45,330 Z"
                    fill={isSelected('ischiorectal-fossa') ? '#fed7aa' : '#ffedd5'}
                    stroke={isSelected('ischiorectal-fossa') ? '#ea580c' : '#fdba74'}
                    strokeWidth={isSelected('ischiorectal-fossa') ? 2.5 : 1.5}
                  />
                  <path
                    d="M 515,175 Q 445,180 395,165 L 425,330 L 515,330 Z"
                    fill={isSelected('ischiorectal-fossa') ? '#fed7aa' : '#ffedd5'}
                    stroke={isSelected('ischiorectal-fossa') ? '#ea580c' : '#fdba74'}
                    strokeWidth={isSelected('ischiorectal-fossa') ? 2.5 : 1.5}
                  />
                  <text x="95" y="265" textAnchor="middle" className="fill-orange-900 text-[11px] font-semibold">
                    坐骨直肠窝
                  </text>
                  <text x="465" y="265" textAnchor="middle" className="fill-orange-900 text-[11px] font-semibold">
                    坐骨直肠窝
                  </text>
                </g>

                {/* Levator Ani & Puborectalis (Anorectal Ring) */}
                <g
                  onClick={() => setSelectedId('anorectal-ring')}
                  className="cursor-pointer"
                >
                  <path
                    d="M 45,155 Q 115,170 185,150 L 185,168 Q 115,188 45,173 Z"
                    fill={isSelected('anorectal-ring') ? '#dc2626' : '#ef4444'}
                    stroke="#991b1b"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 515,155 Q 445,170 375,150 L 375,168 Q 445,188 515,173 Z"
                    fill={isSelected('anorectal-ring') ? '#dc2626' : '#ef4444'}
                    stroke="#991b1b"
                    strokeWidth="1.5"
                  />
                  {/* Puborectalis sling highlight */}
                  <ellipse
                    cx="182"
                    cy="165"
                    rx="14"
                    ry="16"
                    fill={isSelected('anorectal-ring') ? '#b91c1c' : '#dc2626'}
                    stroke="#7f1d1d"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="378"
                    cy="165"
                    rx="14"
                    ry="16"
                    fill={isSelected('anorectal-ring') ? '#b91c1c' : '#dc2626'}
                    stroke="#7f1d1d"
                    strokeWidth="2"
                  />
                  <text x="115" y="150" textAnchor="middle" className="fill-red-900 text-[10px] font-bold">
                    肛提肌 / 肛管直肠环
                  </text>
                  <text x="445" y="150" textAnchor="middle" className="fill-red-900 text-[10px] font-bold">
                    肛提肌 / 肛管直肠环
                  </text>
                </g>

                {/* Rectal & Anal Canal Lumen */}
                <path
                  d="M 215,55 L 345,55 L 330,190 L 325,330 L 235,330 L 230,190 Z"
                  fill="#fff1f2"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                />

                {/* Internal Anal Sphincter (IAS) */}
                <g onClick={() => setSelectedId('ias')} className="cursor-pointer">
                  <rect
                    x="208"
                    y="178"
                    width="18"
                    height="125"
                    rx="6"
                    fill={isSelected('ias') ? '#e11d48' : '#fb7185'}
                    stroke={isSelected('ias') ? '#881337' : '#e11d48'}
                    strokeWidth={isSelected('ias') ? 2.5 : 1.2}
                  />
                  <rect
                    x="334"
                    y="178"
                    width="18"
                    height="125"
                    rx="6"
                    fill={isSelected('ias') ? '#e11d48' : '#fb7185'}
                    stroke={isSelected('ias') ? '#881337' : '#e11d48'}
                    strokeWidth={isSelected('ias') ? 2.5 : 1.2}
                  />
                  <text x="217" y="245" textAnchor="middle" className="fill-white text-[9px] font-bold">
                    内
                  </text>
                  <text x="343" y="245" textAnchor="middle" className="fill-white text-[9px] font-bold">
                    内
                  </text>
                </g>

                {/* Intersphincteric Space */}
                <g onClick={() => setSelectedId('intersphincteric-space')} className="cursor-pointer">
                  <rect
                    x="196"
                    y="180"
                    width="10"
                    height="138"
                    rx="3"
                    fill={isSelected('intersphincteric-space') ? '#38bdf8' : '#bae6fd'}
                    stroke={isSelected('intersphincteric-space') ? '#0284c7' : '#7dd3fc'}
                    strokeWidth={isSelected('intersphincteric-space') ? 2 : 1}
                  />
                  <rect
                    x="354"
                    y="180"
                    width="10"
                    height="138"
                    rx="3"
                    fill={isSelected('intersphincteric-space') ? '#38bdf8' : '#bae6fd'}
                    stroke={isSelected('intersphincteric-space') ? '#0284c7' : '#7dd3fc'}
                    strokeWidth={isSelected('intersphincteric-space') ? 2 : 1}
                  />
                </g>

                {/* External Anal Sphincter (EAS - 3 parts) */}
                <g onClick={() => setSelectedId('eas')} className="cursor-pointer">
                  {/* Deep, Superficial, Subcutaneous Left */}
                  <ellipse cx="179" cy="205" rx="14" ry="18" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  <ellipse cx="179" cy="248" rx="14" ry="20" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  <ellipse cx="183" cy="296" rx="13" ry="16" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  {/* Right */}
                  <ellipse cx="381" cy="205" rx="14" ry="18" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  <ellipse cx="381" cy="248" rx="14" ry="20" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  <ellipse cx="377" cy="296" rx="13" ry="16" fill={isSelected('eas') ? '#991b1b' : '#f87171'} stroke="#7f1d1d" strokeWidth={isSelected('eas') ? 2.5 : 1.2} />
                  <text x="150" y="250" textAnchor="end" className="fill-red-900 text-[10px] font-semibold">
                    外括约肌(深/浅/皮下)
                  </text>
                </g>

                {/* Hemorrhoidal Plexus */}
                <g onClick={() => setSelectedId('hemorrhoidal-plexus')} className="cursor-pointer">
                  <ellipse
                    cx="244"
                    cy="205"
                    rx="10"
                    ry="18"
                    fill={isSelected('hemorrhoidal-plexus') ? '#7c3aed' : '#a78bfa'}
                    stroke="#5b21b6"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="316"
                    cy="205"
                    rx="10"
                    ry="18"
                    fill={isSelected('hemorrhoidal-plexus') ? '#7c3aed' : '#a78bfa'}
                    stroke="#5b21b6"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="244"
                    cy="288"
                    rx="9"
                    ry="14"
                    fill={isSelected('hemorrhoidal-plexus') ? '#6d28d9' : '#c4b5fd'}
                    stroke="#5b21b6"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="316"
                    cy="288"
                    rx="9"
                    ry="14"
                    fill={isSelected('hemorrhoidal-plexus') ? '#6d28d9' : '#c4b5fd'}
                    stroke="#5b21b6"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Dentate Line (齿状线) */}
                <g onClick={() => setSelectedId('dentate-line')} className="cursor-pointer">
                  <path
                    d="M 230,242 L 245,234 L 260,244 L 275,234 L 290,244 L 305,234 L 320,244 L 330,242"
                    fill="none"
                    stroke={isSelected('dentate-line') ? '#0284c7' : '#0369a1'}
                    strokeWidth={isSelected('dentate-line') ? 4 : 3}
                  />
                  <rect x="252" y="216" width="56" height="18" rx="4" fill="#0284c7" />
                  <text x="280" y="229" textAnchor="middle" className="fill-white text-[10px] font-bold">
                    齿状线
                  </text>
                </g>

                {/* Anal Crypts (肛隐窝) */}
                <g onClick={() => setSelectedId('anal-crypts')} className="cursor-pointer">
                  <circle cx="245" cy="240" r="5" fill={isSelected('anal-crypts') ? '#eab308' : '#fde047'} stroke="#854d0e" strokeWidth="1.5" />
                  <circle cx="315" cy="240" r="5" fill={isSelected('anal-crypts') ? '#eab308' : '#fde047'} stroke="#854d0e" strokeWidth="1.5" />
                  <text x="280" y="262" textAnchor="middle" className="fill-amber-800 text-[10px] font-semibold">
                    肛窦 / 肛腺开口
                  </text>
                </g>

                {/* Perianal Skin Line */}
                <line x1="45" y1="330" x2="235" y2="330" stroke="#64748b" strokeWidth="3" />
                <line x1="325" y1="330" x2="515" y2="330" stroke="#64748b" strokeWidth="3" />
                <text x="280" y="352" textAnchor="middle" className="fill-slate-500 text-[11px]">
                  肛缘皮肤（外括约肌皮下部水平）
                </text>

                {/* Parks Fistula Path Overlays */}
                {parksOverlay === 'intersphincteric' && (
                  <path
                    d="M 318,240 Q 358,242 359,280 L 359,336"
                    fill="none"
                    stroke="#be123c"
                    strokeWidth="5"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                  />
                )}
                {parksOverlay === 'transsphincteric' && (
                  <path
                    d="M 318,240 L 360,244 Q 405,250 420,288 L 435,336"
                    fill="none"
                    stroke="#be123c"
                    strokeWidth="5"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                  />
                )}
                {parksOverlay === 'suprasphincteric' && (
                  <path
                    d="M 318,240 L 358,238 L 358,136 Q 385,120 412,148 L 430,275 L 445,336"
                    fill="none"
                    stroke="#be123c"
                    strokeWidth="5"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                  />
                )}
                {parksOverlay === 'extrasphincteric' && (
                  <path
                    d="M 338,110 Q 430,115 445,175 L 460,270 L 470,336"
                    fill="none"
                    stroke="#be123c"
                    strokeWidth="5"
                    strokeDasharray="6 3"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </div>

            {selectedParks && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-900 text-sm">
                    {selectedParks.name}（{selectedParks.proportion}）
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      selectedParks.riskLevel === '低'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedParks.riskLevel === '中'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    失禁风险：{selectedParks.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-rose-800">
                  <strong>走行路径：</strong>{selectedParks.pathDescription}
                </p>
                <p className="text-xs text-rose-900">
                  <strong>手术原则：</strong>{selectedParks.surgicalStrategy}
                </p>
              </div>
            )}

            {/* Quick Structure Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ANATOMY_STRUCTURES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedId(st.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition border ${
                    selectedId === st.id
                      ? 'bg-clinical-600 text-white border-clinical-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed Structure Info */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-clinical-50 text-clinical-700">
                  {selectedStructure.category === 'landmark'
                    ? '核心标志'
                    : selectedStructure.category === 'muscle'
                    ? '括约肌群'
                    : selectedStructure.category === 'space'
                    ? '肛周间隙'
                    : '血管丛'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedStructure.englishName}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedStructure.name}</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-clinical-600" />
                  解剖要点
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedStructure.summary}</p>
              </div>

              <div className="bg-clinical-50/70 border border-clinical-100 rounded-lg p-3.5">
                <h4 className="font-semibold text-clinical-900 mb-1">临床教学意义</h4>
                <p className="text-clinical-800 text-xs leading-relaxed">
                  {selectedStructure.clinicalSignificance}
                </p>
              </div>

              {selectedStructure.aboveVsBelow && (
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-slate-800 mb-1">齿状线以上（内痔区）</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedStructure.aboveVsBelow.above}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-slate-800 mb-1">齿状线以下（外痔/肛周皮肤区）</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedStructure.aboveVsBelow.below}</p>
                  </div>
                </div>
              )}

              {selectedStructure.surgicalWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-900 mb-0.5">手术红线与避坑提示</div>
                    <p className="text-xs text-amber-800 leading-relaxed">{selectedStructure.surgicalWarning}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Goodsall's Rule & Lithotomy Simulator */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-clinical-600" />
                截石位（Lithotomy）肛门时钟定位
              </span>
              <span className="text-xs text-slate-500">点击任意点位模拟外口</span>
            </div>

            <svg viewBox="0 0 320 320" className="w-full max-w-[320px] h-auto select-none">
              {/* Outer skin zone */}
              <circle cx="160" cy="160" r="142" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* 3 cm boundary */}
              <circle cx="160" cy="160" r="108" fill="#ffffff" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" />
              {/* Horizontal 3-9 line (Goodsall transverse line) */}
              <line x1="18" y1="160" x2="302" y2="160" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 3" />
              <text x="26" y="154" className="fill-clinical-700 text-[10px] font-semibold">3-9点横线</text>

              {/* Anterior / Posterior labels */}
              <text x="160" y="15" textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">
                前正中（会阴/阴囊/阴道方向）12点
              </text>
              <text x="160" y="314" textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">
                后正中（尾骨方向）6点
              </text>

              {/* Anal canal & Mother Hemorrhoid Zones (3, 7, 11) */}
              <circle cx="160" cy="160" r="36" fill="#ffe4e6" stroke="#fb7185" strokeWidth="2" />
              {[3, 7, 11].map((h) => {
                const pt = getClockXY(h, 28);
                return (
                  <g key={`hem-${h}`}>
                    <circle cx={pt.x} cy={pt.y} r="6" fill="#a855f7" opacity="0.7" />
                  </g>
                );
              })}

              {/* Predicted Fistula Tract */}
              {goodsallCurvesToSix ? (
                <path
                  d={`M ${outerPt.x},${outerPt.y} Q ${outerPt.x > 160 ? 225 : 95},235 ${innerPt.x},${innerPt.y}`}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="4"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                />
              ) : (
                <line
                  x1={outerPt.x}
                  y1={outerPt.y}
                  x2={innerPt.x}
                  y2={innerPt.y}
                  stroke="#0d9488"
                  strokeWidth="4"
                  strokeDasharray="5 3"
                  strokeLinecap="round"
                />
              )}

              {/* Predicted Internal Opening */}
              <circle cx={innerPt.x} cy={innerPt.y} r="7" fill="#0f766e" stroke="#ffffff" strokeWidth="2" />

              {/* External Opening */}
              <circle cx={outerPt.x} cy={outerPt.y} r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />

              {/* Clickable 12 clock hours */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
                const pt = getClockXY(h, 128);
                const active = clockHour === h;
                return (
                  <g
                    key={h}
                    onClick={() => setClockHour(h)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="13"
                      fill={active ? '#0284c7' : '#ffffff'}
                      stroke={active ? '#0369a1' : '#cbd5e1'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 4}
                      textAnchor="middle"
                      className={`text-[11px] font-bold ${active ? 'fill-white' : 'fill-slate-700'}`}
                    >
                      {h}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" /> 外口位置
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-700 inline-block" /> 预测内口
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> 3/7/11点母痔区
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Goodsall 定律（索罗门定律）动态推演</h3>
              <p className="text-xs text-slate-500 mt-1">
                注意：截石位中 3 点为患者左侧，9 点为患者右侧；12 点为前正中，6 点为后正中。
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  外口距肛缘距离：
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDistanceCm('near')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                      distanceCm === 'near'
                        ? 'bg-clinical-600 text-white border-clinical-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    ≤ 3 cm（近肛缘）
                  </button>
                  <button
                    onClick={() => setDistanceCm('far')}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                      distanceCm === 'far'
                        ? 'bg-clinical-600 text-white border-clinical-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    &gt; 3 cm（远肛缘/例外情况）
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    当前模拟：截石位 {clockHour} 点外口（{distanceCm === 'near' ? '≤3 cm' : '>3 cm'}）
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                    预测内口：{predictedInternalClock} 点
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {!isAnterior
                    ? `外口位于 3-9 点横线后方（或横线上），根据 Goodsall 定律，瘘管多呈弧形弯曲走行，内口通常位于后正中线 6 点齿状线肛隐窝处。`
                    : distanceCm === 'near'
                    ? `外口位于 3-9 点横线前方且距肛缘 ≤ 3 cm，瘘管通常呈放射状直行，内口直接位于对应 ${clockHour} 点齿状线处。`
                    : `【重要例外】虽然外口位于 3-9 点横线前方，但距肛缘 > 3 cm，常提示深部高位或前延型瘘管，其瘘管仍可能向后弯曲通往后正中 6 点内口！`}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 space-y-1">
                <div className="font-bold">带教提醒：</div>
                <p>
                  Goodsall 定律对后方肛瘘准确率较高，但对前方肛瘘（尤其是女性前壁复杂瘘、克罗恩病或多次复发瘘）存在例外。临床确诊仍需结合指诊、探针轻柔探查及 ERUS/盆腔 MRI。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
