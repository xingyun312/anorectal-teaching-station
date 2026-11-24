import React, { useState } from 'react';
import { CLINICAL_CASES } from '../data/casesData';
import { AppProgressState, AssessmentAttempt, ClinicalCase, DifficultyLevel } from '../types/clinical';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  Stethoscope,
  XCircle
} from 'lucide-react';

interface CaseChallengeModuleProps {
  progress: AppProgressState;
  initialCaseId?: string | null;
  onRecordAttempt: (attempt: Omit<AssessmentAttempt, 'id' | 'timestamp'>) => void;
  onToggleBookmark: (id: string) => void;
}

export const CaseChallengeModule: React.FC<CaseChallengeModuleProps> = ({
  progress,
  initialCaseId,
  onRecordAttempt,
  onToggleBookmark
}) => {
  const [filterCat, setFilterCat] = useState<'all' | 'hemorrhoid' | 'fistula' | 'abscess'>('all');
  const [filterDiff, setFilterDiff] = useState<'all' | DifficultyLevel>('all');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(initialCaseId ?? null);

  // Quiz state for active case
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const activeCase: ClinicalCase | undefined = CLINICAL_CASES.find((c) => c.id === activeCaseId);

  const openCase = (c: ClinicalCase) => {
    setActiveCaseId(c.id);
    setAnswers({});
    setSubmitted(false);
  };

  const handleSelectOption = (qId: string, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleSubmitCase = () => {
    if (!activeCase) return;
    let score = 0;
    const wrongPrompts: string[] = [];
    activeCase.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        score += 1;
      } else {
        wrongPrompts.push(`${activeCase.code} ${q.stageLabel}：${q.prompt}`);
      }
    });
    setSubmitted(true);
    onRecordAttempt({
      module: 'cases',
      itemId: activeCase.id,
      itemTitle: activeCase.title,
      category: activeCase.category,
      score,
      maxScore: activeCase.questions.length,
      wrongQuestionPrompts: wrongPrompts
    });
  };

  const filteredCases = CLINICAL_CASES.filter((c) => {
    if (filterCat !== 'all' && c.category !== filterCat) return false;
    if (filterDiff !== 'all' && c.difficulty !== filterDiff) return false;
    return true;
  });

  if (activeCase) {
    const allAnswered = activeCase.questions.every((q) => answers[q.id] !== undefined);
    const totalCorrect = activeCase.questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const isBookmarked = progress.bookmarkedIds.includes(activeCase.id);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveCaseId(null)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-clinical-700"
          >
            <ArrowLeft className="w-4 h-4" />
            返回病例闯关列表
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {activeCase.code}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-clinical-50 text-clinical-700">
              {activeCase.categoryLabel}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-tealmed-50 text-tealmed-700">
              {activeCase.difficultyLabel}
            </span>
            <button
              onClick={() => onToggleBookmark(activeCase.id)}
              className={`p-1.5 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title="收藏至重点复习"
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Clinical Record */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeCase.title}</h2>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="px-2 py-1 rounded bg-slate-100 font-medium">
                    {activeCase.patientInfo.gender} · {activeCase.patientInfo.age}岁
                  </span>
                  {activeCase.patientInfo.occupation && (
                    <span className="px-2 py-1 rounded bg-slate-100">{activeCase.patientInfo.occupation}</span>
                  )}
                </div>
              </div>

              <div className="bg-clinical-50/70 border border-clinical-100 rounded-lg p-3.5 text-sm">
                <span className="font-bold text-clinical-900">主诉：</span>
                <span className="text-clinical-800">{activeCase.patientInfo.chiefComplaint}</span>
              </div>

              <div className="space-y-1.5 text-sm">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-clinical-600" />
                  现病史
                </h4>
                <p className="text-slate-600 leading-relaxed">{activeCase.history}</p>
              </div>

              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-tealmed-600" />
                  专科查体（{activeCase.physicalExam.position}）
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p><strong>视诊：</strong>{activeCase.physicalExam.inspection}</p>
                  <p><strong>指诊/触诊：</strong>{activeCase.physicalExam.palpation}</p>
                  {activeCase.physicalExam.anoscopy && (
                    <p><strong>肛门镜：</strong>{activeCase.physicalExam.anoscopy}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-sm border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-800">辅助检查</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {activeCase.auxiliaryExam}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Step-by-step Questions */}
          <div className="lg:col-span-7 space-y-4">
            {activeCase.questions.map((q, qIdx) => {
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctIndex;
              return (
                <div key={q.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-clinical-700 bg-clinical-50 px-2.5 py-1 rounded">
                      {q.stageLabel}
                    </span>
                    <span className="text-xs text-slate-400">第 {qIdx + 1} / {activeCase.questions.length} 步</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{q.prompt}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => {
                      const isPicked = chosen === idx;
                      let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                      if (!submitted && isPicked) {
                        btnStyle = 'border-clinical-600 bg-clinical-50 text-clinical-900 ring-1 ring-clinical-600';
                      } else if (submitted) {
                        if (idx === q.correctIndex) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                        } else if (isPicked && idx !== q.correctIndex) {
                          btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        } else {
                          btnStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                        }
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(q.id, idx)}
                          disabled={submitted}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="font-mono text-xs font-bold mt-0.5">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="flex-1">{opt}</span>
                          {submitted && idx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {submitted && isPicked && idx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-3 space-y-2 pt-3 border-t border-slate-100">
                      <div
                        className={`text-xs font-bold ${
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isCorrect ? '回答正确' : `回答有误（正确答案：${String.fromCharCode(65 + q.correctIndex)}）`}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{q.explanation}</p>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex gap-2 text-xs text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>带教珍珠：</strong>{q.clinicalPearl}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted ? (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitCase}
                  disabled={!allAnswered}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition ${
                    allAnswered
                      ? 'bg-clinical-600 hover:bg-clinical-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  提交本病例闯关并记录成绩
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900">
                    本例闯关完成：{totalCorrect} / {activeCase.questions.length} 题正确
                  </h4>
                  <button
                    onClick={() => openCase(activeCase)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  >
                    重新练习
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-900">本例核心带教总结：</div>
                  <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                    {activeCase.keyTakeaways.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">痔、肛瘘、肛周脓肿病例闯关</h2>
          <p className="text-sm text-slate-600 mt-1">
            精选 8 例临床真实情境病例，涵盖体格检查、影像评估、治疗决策与误诊陷阱。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as typeof filterCat)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700"
          >
            <option value="all">全部病种</option>
            <option value="hemorrhoid">痔病</option>
            <option value="fistula">肛瘘</option>
            <option value="abscess">肛周脓肿</option>
          </select>
          <select
            value={filterDiff}
            onChange={(e) => setFilterDiff(e.target.value as typeof filterDiff)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700"
          >
            <option value="all">全部难度</option>
            <option value="assistant_gp">助理全科基础</option>
            <option value="visiting_doctor">进修医师进阶</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => {
          const attempts = progress.attempts.filter((a) => a.module === 'cases' && a.itemId === c.id);
          const best = attempts.reduce<number | null>(
            (acc, cur) => (acc === null || cur.score > acc ? cur.score : acc),
            null
          );
          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-clinical-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.code}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        c.category === 'hemorrhoid'
                          ? 'bg-purple-50 text-purple-700'
                          : c.category === 'fistula'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {c.categoryLabel}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{c.difficultyLabel}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{c.patientInfo.chiefComplaint}</p>

                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {best !== null ? (
                    <span className="text-emerald-700 font-semibold">
                      已完成 · 最高 {best}/{c.questions.length} 题
                    </span>
                  ) : (
                    <span>共 {c.questions.length} 步决策</span>
                  )}
                </div>
                <button
                  onClick={() => openCase(c)}
                  className="px-4 py-1.5 rounded-lg bg-clinical-600 hover:bg-clinical-700 text-white text-xs font-semibold transition"
                >
                  开始闯关
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
