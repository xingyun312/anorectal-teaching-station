import React, { useState } from 'react';
import { AppProgressState, AssessmentAttempt, TabId, TraineeProfile } from './types/clinical';
import {
  clearAllAttempts,
  loadProgressState,
  recordAttempt,
  toggleBookmark,
  updateTraineeProfile
} from './utils/storage';
import { AnatomyModule } from './components/AnatomyModule';
import { CaseChallengeModule } from './components/CaseChallengeModule';
import { SurgerySimulatorModule } from './components/SurgerySimulatorModule';
import { ComplicationsModule } from './components/ComplicationsModule';
import { TeachingLibraryModule } from './components/TeachingLibraryModule';
import { AssessmentRecordsModule } from './components/AssessmentRecordsModule';
import {
  Activity,
  Award,
  BookOpen,
  GitBranch,
  Home,
  Layers,
  Stethoscope
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [jumpCaseId, setJumpCaseId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AppProgressState>(() => loadProgressState());

  const handleRecordAttempt = (attempt: Omit<AssessmentAttempt, 'id' | 'timestamp'>) => {
    setProgress((prev) => recordAttempt(prev, attempt));
  };

  const handleToggleBookmark = (id: string) => {
    setProgress((prev) => toggleBookmark(prev, id));
  };

  const handleUpdateProfile = (profile: TraineeProfile) => {
    setProgress((prev) => updateTraineeProfile(prev, profile));
  };

  const handleClearAttempts = () => {
    setProgress((prev) => clearAllAttempts(prev));
  };

  const navItems: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: '教学总览', icon: <Home className="w-4 h-4" /> },
    { id: 'cases', label: '病例闯关', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'surgery', label: '术式模拟', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'anatomy', label: '解剖互动图', icon: <Layers className="w-4 h-4" /> },
    { id: 'complications', label: '术后并发症', icon: <Activity className="w-4 h-4" /> },
    { id: 'library', label: '带教病例库', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'records', label: '考核记录', icon: <Award className="w-4 h-4" /> }
  ];

  const totalScore = progress.attempts.reduce((s, a) => s + a.score, 0);
  const totalMax = progress.attempts.reduce((s, a) => s + a.maxScore, 0);
  const accuracy = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            <div
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-clinical-600 text-white flex items-center justify-center font-bold shadow-sm">
                肛
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                  肛肠专科互动教学站
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  进修医生 · 助理全科医师临床思维与手术决策实训平台
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
                <span className="font-semibold">{progress.profile.name}</span>
                <span className="text-slate-400">|</span>
                <span>{progress.profile.role}</span>
              </div>
              <button
                onClick={() => setActiveTab('records')}
                className="px-3 py-1.5 rounded-full bg-clinical-50 text-clinical-700 font-semibold border border-clinical-200 hover:bg-clinical-100 transition"
              >
                已完成 {progress.attempts.length} 次 · 正确率 {accuracy}%
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 overflow-x-auto pb-2 -mb-px">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id !== 'cases') setJumpCaseId(null);
                    setActiveTab(item.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                    active
                      ? 'bg-clinical-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-clinical-900 via-clinical-700 to-tealmed-700 rounded-2xl p-6 sm:p-8 text-white shadow-md">
              <div className="max-w-3xl space-y-3">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                  面向进修医生 &amp; 助理全科医师 · 临床实战导向
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
                  肛肠专科常见病规范化诊疗与手术决策实训
                </h2>
                <p className="text-sm text-clinical-100 leading-relaxed">
                  聚焦基层与专科轮转最核心的五大能力：肛管直肠精准解剖定位、痔/肛瘘/肛周脓肿病例闯关、手术适应证与术式权衡、术后并发症夜间查房应急处理，以及可导出打印的带教考核档案。
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('cases')}
                    className="px-4 py-2 rounded-xl bg-white text-clinical-900 font-semibold text-sm hover:bg-clinical-50 transition"
                  >
                    立即开始病例闯关
                  </button>
                  <button
                    onClick={() => setActiveTab('anatomy')}
                    className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm transition"
                  >
                    查看互动解剖图谱
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'cases' as TabId,
                  title: '痔、肛瘘、肛周脓肿病例闯关',
                  desc: '8 例真实临床情景，涵盖 Goligher 分度、Goodsall 定律、高位深部脓肿及克罗恩病肛瘘陷阱。',
                  badge: '8 个典型病例',
                  icon: <Stethoscope className="w-5 h-5 text-clinical-600" />
                },
                {
                  id: 'surgery' as TabId,
                  title: '手术适应证与术式选择模拟',
                  desc: '交互式推演外剥内扎、TST/PPH、挂线疗法、LIFT 及抗栓/妊娠/高龄特殊人群决策。',
                  badge: '决策引擎 + 3题考核',
                  icon: <GitBranch className="w-5 h-5 text-tealmed-600" />
                },
                {
                  id: 'anatomy' as TabId,
                  title: '肛管直肠解剖互动图',
                  desc: '冠状面交互图谱 + Parks 肛瘘路径叠加 + 截石位 Goodsall 定律实时模拟器。',
                  badge: '9 大核心结构',
                  icon: <Layers className="w-5 h-5 text-indigo-600" />
                },
                {
                  id: 'complications' as TabId,
                  title: '术后并发症判断练习',
                  desc: '脱线期继发大出血、尿潴留、皮桥水肿、假性愈合、肛门狭窄与失禁预警演练。',
                  badge: '6 项查房情景',
                  icon: <Activity className="w-5 h-5 text-rose-600" />
                },
                {
                  id: 'library' as TabId,
                  title: '带教病例库',
                  desc: '支持关键词检索、病种过滤与重点收藏，方便带教老师教学示范与学员复盘。',
                  badge: '14 份教学档案',
                  icon: <BookOpen className="w-5 h-5 text-amber-600" />
                },
                {
                  id: 'records' as TabId,
                  title: '考核记录与出科成绩单',
                  desc: '本地持久化记录答题正确率、自动汇总错题本，支持 JSON 导出与一键打印成绩单。',
                  badge: `已记录 ${progress.attempts.length} 次`,
                  icon: <Award className="w-5 h-5 text-emerald-600" />
                }
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => setActiveTab(card.id)}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-clinical-400 hover:shadow transition cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        {card.icon}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{card.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="text-xs font-semibold text-clinical-600">进入模块 →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <CaseChallengeModule
            progress={progress}
            initialCaseId={jumpCaseId}
            onRecordAttempt={handleRecordAttempt}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'surgery' && (
          <SurgerySimulatorModule onRecordAttempt={handleRecordAttempt} />
        )}

        {activeTab === 'anatomy' && <AnatomyModule />}

        {activeTab === 'complications' && (
          <ComplicationsModule onRecordAttempt={handleRecordAttempt} />
        )}

        {activeTab === 'library' && (
          <TeachingLibraryModule
            progress={progress}
            onToggleBookmark={handleToggleBookmark}
            onJumpToCase={(id) => {
              setJumpCaseId(id);
              setActiveTab('cases');
            }}
            onJumpToComplications={() => setActiveTab('complications')}
          />
        )}

        {activeTab === 'records' && (
          <AssessmentRecordsModule
            progress={progress}
            onUpdateProfile={handleUpdateProfile}
            onClearAttempts={handleClearAttempts}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        肛肠专科互动教学站 · 仅供医学继续教育与临床带教模拟使用，具体诊疗决策请结合患者个体情况及临床指南。
      </footer>
    </div>
  );
}

export default App;
