import React, { useState } from 'react';
import { AppProgressState, TraineeProfile } from '../types/clinical';
import { Award, Download, Printer, Trash2, UserCheck, AlertCircle } from 'lucide-react';

interface AssessmentRecordsModuleProps {
  progress: AppProgressState;
  onUpdateProfile: (profile: TraineeProfile) => void;
  onClearAttempts: () => void;
}

export const AssessmentRecordsModule: React.FC<AssessmentRecordsModuleProps> = ({
  progress,
  onUpdateProfile,
  onClearAttempts
}) => {
  const [editingProfile, setEditingProfile] = useState<TraineeProfile>(progress.profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const totalScore = progress.attempts.reduce((s, a) => s + a.score, 0);
  const totalMax = progress.attempts.reduce((s, a) => s + a.maxScore, 0);
  const accuracy = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  const moduleStats = (mod: 'cases' | 'surgery' | 'complications') => {
    const list = progress.attempts.filter((a) => a.module === mod);
    const sc = list.reduce((s, a) => s + a.score, 0);
    const mx = list.reduce((s, a) => s + a.maxScore, 0);
    return {
      count: list.length,
      pct: mx > 0 ? Math.round((sc / mx) * 100) : 0
    };
  };

  const allWrongPrompts = Array.from(
    new Set(progress.attempts.flatMap((a) => a.wrongQuestionPrompts))
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editingProfile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `肛肠专科考核记录_${progress.profile.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-clinical-600" />
            进修/轮转考核记录与能力评估
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            所有考核记录本地实时保存，支持导出考核档案或打印轮转出科成绩单。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            打印成绩单
          </button>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-clinical-200 bg-clinical-50 hover:bg-clinical-100 text-xs font-semibold text-clinical-800"
          >
            <Download className="w-3.5 h-3.5" />
            导出 JSON
          </button>
          {progress.attempts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('确定清空所有本地考核记录吗？')) {
                  onClearAttempts();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空记录
            </button>
          )}
        </div>
      </div>

      {/* Trainee Profile + Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3"
        >
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-clinical-600" />
            学员基本信息（用于出科考核署名）
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1">姓名</label>
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">培训身份</label>
              <select
                value={editingProfile.role}
                onChange={(e) =>
                  setEditingProfile({
                    ...editingProfile,
                    role: e.target.value as TraineeProfile['role']
                  })
                }
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
              >
                <option value="进修医生">进修医生</option>
                <option value="助理全科医生">助理全科医生</option>
                <option value="规培医师">规培医师</option>
              </select>
            </div>
            <div>
              <label className="text-slate-600 block mb-1">轮转科室</label>
              <input
                type="text"
                value={editingProfile.department}
                onChange={(e) => setEditingProfile({ ...editingProfile, department: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">选送单位 / 医院</label>
              <input
                type="text"
                value={editingProfile.hospital}
                onChange={(e) => setEditingProfile({ ...editingProfile, hospital: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 no-print">
            <span className="text-xs text-emerald-600 font-medium">
              {savedNotice ? '已保存学员信息' : ''}
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-clinical-600 hover:bg-clinical-700 text-white text-xs font-semibold"
            >
              保存信息
            </button>
          </div>
        </form>

        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-500">累计考核次数</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{progress.attempts.length}</div>
            </div>
            <div className="bg-clinical-50 rounded-lg p-3 border border-clinical-100">
              <div className="text-xs text-clinical-700">综合正确率</div>
              <div className="text-2xl font-bold text-clinical-900 mt-1">{accuracy}%</div>
            </div>
            <div className="bg-tealmed-50 rounded-lg p-3 border border-tealmed-100">
              <div className="text-xs text-tealmed-700">累计得分</div>
              <div className="text-2xl font-bold text-tealmed-900 mt-1">
                {totalScore} / {totalMax}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'cases' as const, label: '病例闯关（痔/肛瘘/脓肿）' },
              { key: 'surgery' as const, label: '手术适应证与术式决策' },
              { key: 'complications' as const, label: '术后并发症应急判断' }
            ].map((m) => {
              const st = moduleStats(m.key);
              return (
                <div key={m.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {m.label}（{st.count} 次）
                    </span>
                    <span className="font-bold text-slate-900">{st.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-clinical-600 rounded-full transition-all"
                      style={{ width: `${st.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mistake Review */}
      {allWrongPrompts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
          <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            错题本与带教重点复盘（{allWrongPrompts.length} 项）
          </h3>
          <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
            {allWrongPrompts.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Log */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 font-bold text-slate-900 text-sm">
          考核明细记录
        </div>
        {progress.attempts.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            暂无考核记录。请前往「病例闯关」「术式选择」或「术后并发症」模块完成练习后自动记录。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">时间</th>
                  <th className="px-4 py-2.5 font-semibold">模块</th>
                  <th className="px-4 py-2.5 font-semibold">考核项目</th>
                  <th className="px-4 py-2.5 font-semibold">得分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progress.attempts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                      {new Date(a.timestamp).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {a.module === 'cases'
                          ? '病例闯关'
                          : a.module === 'surgery'
                          ? '术式决策'
                          : '术后并发症'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{a.itemTitle}</td>
                    <td className="px-4 py-2.5 font-bold">
                      <span
                        className={
                          a.score === a.maxScore ? 'text-emerald-700' : 'text-amber-700'
                        }
                      >
                        {a.score} / {a.maxScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
