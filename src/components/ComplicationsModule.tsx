import React, { useState } from 'react';
import { COMPLICATION_DRILLS } from '../data/complicationsData';
import { AssessmentAttempt } from '../types/clinical';
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';

interface ComplicationsModuleProps {
  onRecordAttempt: (attempt: Omit<AssessmentAttempt, 'id' | 'timestamp'>) => void;
}

export const ComplicationsModule: React.FC<ComplicationsModuleProps> = ({ onRecordAttempt }) => {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSubmit = (drillId: string) => {
    const drill = COMPLICATION_DRILLS.find((d) => d.id === drillId);
    if (!drill || selected[drillId] === undefined) return;
    const isCorrect = selected[drillId] === drill.correctIndex;
    setSubmitted((prev) => ({ ...prev, [drillId]: true }));
    onRecordAttempt({
      module: 'complications',
      itemId: drill.id,
      itemTitle: drill.title,
      category: 'complication',
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      wrongQuestionPrompts: isCorrect ? [] : [`术后并发症：${drill.title}`]
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600" />
          术后并发症判断与急诊查房练习
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          模拟肛肠科术后夜班与门诊复诊常见突发状况：继发性大出血、尿潴留、皮桥水肿、假性愈合、肛门狭窄与失禁预警。
        </p>
      </div>

      <div className="space-y-5">
        {COMPLICATION_DRILLS.map((drill, idx) => {
          const picked = selected[drill.id];
          const isSubmitted = !!submitted[drill.id];
          const isCorrect = picked === drill.correctIndex;

          return (
            <div key={drill.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                    查房情景 #{idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{drill.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-medium">
                    {drill.postOpDay}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {drill.priorSurgery}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
                <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  <div className="text-xs font-bold text-slate-500 mb-1">床旁主诉与经过</div>
                  <p className="text-slate-800 leading-relaxed">{drill.scenario}</p>
                </div>
                <div className="md:col-span-5 bg-rose-50/60 border border-rose-200 rounded-lg p-3.5">
                  <div className="text-xs font-bold text-rose-800 mb-1">生命体征与局部体征</div>
                  <p className="text-rose-950 text-xs leading-relaxed">{drill.vitalsAndSigns}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">{drill.question}</p>
                {drill.options.map((opt, oIdx) => {
                  let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                  if (!isSubmitted && picked === oIdx) {
                    btnClass = 'border-clinical-600 bg-clinical-50 ring-1 ring-clinical-600';
                  } else if (isSubmitted) {
                    if (oIdx === drill.correctIndex) {
                      btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                    } else if (picked === oIdx) {
                      btnClass = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      btnClass = 'border-slate-200 bg-slate-50 text-slate-400';
                    }
                  }
                  return (
                    <button
                      key={oIdx}
                      disabled={isSubmitted}
                      onClick={() => setSelected((prev) => ({ ...prev, [drill.id]: oIdx }))}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition flex items-start gap-2.5 ${btnClass}`}
                    >
                      <span className="font-mono text-xs font-bold mt-0.5">{String.fromCharCode(65 + oIdx)}.</span>
                      <span className="flex-1">{opt}</span>
                      {isSubmitted && oIdx === drill.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && picked === oIdx && oIdx !== drill.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!isSubmitted ? (
                <button
                  disabled={picked === undefined}
                  onClick={() => handleSubmit(drill.id)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition ${
                    picked !== undefined
                      ? 'bg-clinical-600 hover:bg-clinical-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  提交判断并查看应急规范
                </button>
              ) : (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCorrect ? '判断准确！' : `判断有误（正确选项：${String.fromCharCode(65 + drill.correctIndex)}）`}
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold">标准应急处置步骤：</div>
                    <p className="leading-relaxed">{drill.immediateAction}</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex gap-2 text-xs text-rose-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{drill.contraindication}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex gap-2 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>带教解析：</strong>{drill.teachingExplanation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
