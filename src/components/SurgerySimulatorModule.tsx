import React, { useState } from 'react';
import {
  evaluateSurgeryDecision,
  SURGERY_CHALLENGES,
  SurgeryRuleInput
} from '../data/surgeryData';
import { AssessmentAttempt } from '../types/clinical';
import { AlertOctagon, CheckCircle2, GitBranch, ShieldCheck, XCircle } from 'lucide-react';

interface SurgerySimulatorModuleProps {
  onRecordAttempt: (attempt: Omit<AssessmentAttempt, 'id' | 'timestamp'>) => void;
}

export const SurgerySimulatorModule: React.FC<SurgerySimulatorModuleProps> = ({ onRecordAttempt }) => {
  const [tab, setTab] = useState<'simulator' | 'challenges'>('simulator');

  const [input, setInput] = useState<SurgeryRuleInput>({
    disease: 'hemorrhoid',
    hemorrhoidGrade: 'III',
    fistulaType: 'low_simple',
    abscessType: 'perianal_subcutaneous',
    specialCondition: 'none'
  });

  // Challenges state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedIds, setSubmittedIds] = useState<Record<string, boolean>>({});

  const result = evaluateSurgeryDecision(input);

  const handleSubmitChallenge = (challengeId: string) => {
    const ch = SURGERY_CHALLENGES.find((c) => c.id === challengeId);
    if (!ch || selectedAnswers[challengeId] === undefined) return;
    const isCorrect = selectedAnswers[challengeId] === ch.correctIndex;
    setSubmittedIds((prev) => ({ ...prev, [challengeId]: true }));
    onRecordAttempt({
      module: 'surgery',
      itemId: ch.id,
      itemTitle: ch.title,
      category: ch.id === 'sc-2' ? 'fistula' : 'hemorrhoid',
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      wrongQuestionPrompts: isCorrect ? [] : [`术式决策：${ch.title}`]
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-clinical-600" />
            手术适应证与术式选择模拟
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            通过参数组合推演手术指征、推荐术式及禁忌操作，并完成特殊人群手术决策考核。
          </p>
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start">
          <button
            onClick={() => setTab('simulator')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
              tab === 'simulator'
                ? 'bg-white text-clinical-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            术式决策推演器
          </button>
          <button
            onClick={() => setTab('challenges')}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition ${
              tab === 'challenges'
                ? 'bg-white text-clinical-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            实战决策考核（3题）
          </button>
        </div>
      </div>

      {tab === 'simulator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Controls */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                1. 选择病种
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hemorrhoid', label: '痔病' },
                  { id: 'fistula', label: '肛瘘' },
                  { id: 'abscess', label: '肛周脓肿' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        disease: d.id as SurgeryRuleInput['disease']
                      }))
                    }
                    className={`py-2 px-3 rounded-lg text-sm font-semibold border transition ${
                      input.disease === d.id
                        ? 'bg-clinical-600 text-white border-clinical-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                2. 选择临床分度 / 分型
              </label>
              {input.disease === 'hemorrhoid' && (
                <div className="space-y-2">
                  {[
                    { id: 'I', label: 'Goligher I 度内痔（仅便血不脱出）' },
                    { id: 'II', label: 'Goligher II 度内痔（脱出可自行还纳）' },
                    { id: 'III', label: 'Goligher III 度混合痔（脱出需手托还纳）' },
                    { id: 'IV', label: 'Goligher IV 度混合痔（长期脱出不能还纳）' },
                    { id: 'thrombosed', label: '急性血栓性外痔 / 嵌顿痔（72h内剧痛）' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          hemorrhoidGrade: opt.id as SurgeryRuleInput['hemorrhoidGrade']
                        }))
                      }
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition ${
                        input.hemorrhoidGrade === opt.id
                          ? 'bg-clinical-50 border-clinical-600 text-clinical-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {input.disease === 'fistula' && (
                <div className="space-y-2">
                  {[
                    { id: 'low_simple', label: '低位单纯性肛瘘（Parks I型/低位II型）' },
                    { id: 'high_transsphincteric', label: '高位经括约肌肛瘘（累及外括约肌 >30%）' },
                    { id: 'suprasphincteric', label: '括约肌上型肛瘘（绕过肛管直肠环）' },
                    { id: 'crohns', label: '克罗恩病相关性肛瘘（活动期/多发）' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          fistulaType: opt.id as SurgeryRuleInput['fistulaType']
                        }))
                      }
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition ${
                        input.fistulaType === opt.id
                          ? 'bg-clinical-50 border-clinical-600 text-clinical-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {input.disease === 'abscess' && (
                <div className="space-y-2">
                  {[
                    { id: 'perianal_subcutaneous', label: '肛周皮下脓肿（低位表浅，波动感明显）' },
                    { id: 'intersphincteric_high', label: '高位括约肌间脓肿（深部胀痛）' },
                    { id: 'ischiorectal', label: '坐骨直肠窝脓肿（单侧或马蹄形）' },
                    { id: 'pelvirectal', label: '骨盆直肠间隙脓肿（肛提肌上方，高热）' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          abscessType: opt.id as SurgeryRuleInput['abscessType']
                        }))
                      }
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition ${
                        input.abscessType === opt.id
                          ? 'bg-clinical-50 border-clinical-600 text-clinical-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                3. 特殊患者状态 / 合并症
              </label>
              <select
                value={input.specialCondition}
                onChange={(e) =>
                  setInput((prev) => ({
                    ...prev,
                    specialCondition: e.target.value as SurgeryRuleInput['specialCondition']
                  }))
                }
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800"
              >
                <option value="none">无特殊合并症（常规成人）</option>
                <option value="anticoagulant">长期口服抗栓/抗凝药物</option>
                <option value="pregnancy">妊娠期患者</option>
                <option value="weak_sphincter">高龄 / 产伤 / 括约肌功能储备薄弱</option>
              </select>
            </div>
          </div>

          {/* Right Output */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">临床决策推演结果</h3>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  result.indicationLevel === '保守治疗为主'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.indicationLevel === '限期/急诊手术指征'
                    ? 'bg-rose-100 text-rose-800'
                    : result.indicationLevel === '多学科协同/谨慎手术'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-clinical-100 text-clinical-800'
                }`}
              >
                {result.indicationLevel}
              </span>
            </div>

            <div className="bg-clinical-50 border border-clinical-200 rounded-xl p-4 space-y-1.5">
              <div className="text-xs font-bold text-clinical-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-clinical-600" />
                首选推荐方案 / 术式
              </div>
              <p className="text-base font-bold text-clinical-950">{result.recommendedProcedure}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-700">循证依据与决策逻辑</div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.rationale}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-slate-800">备选/补充方案</div>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {result.alternativeOptions.map((alt, i) => (
                    <li key={i}>{alt}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 space-y-1.5">
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  禁忌或应避免的操作
                </div>
                <ul className="list-disc list-inside text-xs text-rose-800 space-y-1">
                  {result.contraindicatedOrAvoid.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.specialNotes.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 space-y-1">
                {result.specialNotes.map((note, i) => (
                  <p key={i} className="text-xs text-amber-900 leading-relaxed">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {SURGERY_CHALLENGES.map((ch) => {
            const picked = selectedAnswers[ch.id];
            const isSubmitted = !!submittedIds[ch.id];
            return (
              <div key={ch.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{ch.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ch.difficulty === 'assistant_gp' ? '助理全科基础' : '进修医师进阶'}
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {ch.patientSummary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ch.keyFindings.map((k) => (
                    <span key={k} className="text-xs px-2.5 py-0.5 rounded-full bg-clinical-50 text-clinical-700">
                      {k}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  {ch.options.map((opt, idx) => {
                    let style = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (!isSubmitted && picked === idx) {
                      style = 'border-clinical-600 bg-clinical-50 ring-1 ring-clinical-600';
                    } else if (isSubmitted) {
                      if (idx === ch.correctIndex) style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      else if (picked === idx) style = 'border-rose-400 bg-rose-50 text-rose-900';
                    }
                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [ch.id]: idx }))}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition flex items-start gap-2 ${style}`}
                      >
                        <span className="font-mono text-xs font-bold mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                        <span className="flex-1">{opt.name}</span>
                        {isSubmitted && idx === ch.correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                        {isSubmitted && picked === idx && idx !== ch.correctIndex && <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
                {!isSubmitted ? (
                  <button
                    disabled={picked === undefined}
                    onClick={() => handleSubmitChallenge(ch.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                      picked !== undefined
                        ? 'bg-clinical-600 hover:bg-clinical-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    确认术式选择
                  </button>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900">带教总结：{ch.indicationSummary}</div>
                    {ch.options.map((opt, idx) => (
                      <p key={idx} className={opt.isRecommended ? 'text-emerald-800' : 'text-slate-600'}>
                        <strong>{String.fromCharCode(65 + idx)}. </strong>
                        {opt.rationale}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
