import React, { useState } from 'react';
import { CLINICAL_CASES } from '../data/casesData';
import { COMPLICATION_DRILLS } from '../data/complicationsData';
import { AppProgressState } from '../types/clinical';
import { Bookmark, BookOpen, ChevronDown, ChevronUp, ExternalLink, Search } from 'lucide-react';

interface TeachingLibraryModuleProps {
  progress: AppProgressState;
  onToggleBookmark: (id: string) => void;
  onJumpToCase: (caseId: string) => void;
  onJumpToComplications: () => void;
}

export const TeachingLibraryModule: React.FC<TeachingLibraryModuleProps> = ({
  progress,
  onToggleBookmark,
  onJumpToCase,
  onJumpToComplications
}) => {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | 'hemorrhoid' | 'fistula' | 'abscess' | 'complication'>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(CLINICAL_CASES[0].id);

  type LibraryEntry =
    | { kind: 'case'; id: string; code: string; title: string; category: string; categoryKey: 'hemorrhoid' | 'fistula' | 'abscess'; difficultyLabel: string; tags: string[]; summary: string; takeaways: string[] }
    | { kind: 'complication'; id: string; code: string; title: string; category: string; categoryKey: 'complication'; difficultyLabel: string; tags: string[]; summary: string; takeaways: string[] };

  const allEntries: LibraryEntry[] = [
    ...CLINICAL_CASES.map((c) => ({
      kind: 'case' as const,
      id: c.id,
      code: c.code,
      title: c.title,
      category: c.categoryLabel,
      categoryKey: c.category,
      difficultyLabel: c.difficultyLabel,
      tags: c.tags,
      summary: `${c.patientInfo.gender}，${c.patientInfo.age}岁。主诉：${c.patientInfo.chiefComplaint} 查体：${c.physicalExam.palpation}`,
      takeaways: c.keyTakeaways
    })),
    ...COMPLICATION_DRILLS.map((d, i) => ({
      kind: 'complication' as const,
      id: d.id,
      code: `CMP-0${i + 1}`,
      title: d.title,
      category: '术后并发症',
      categoryKey: 'complication' as const,
      difficultyLabel: d.difficulty === 'assistant_gp' ? '助理全科基础' : '进修医师进阶',
      tags: [d.postOpDay, d.priorSurgery],
      summary: `${d.scenario} 体征：${d.vitalsAndSigns}`,
      takeaways: [d.immediateAction, d.contraindication, d.teachingExplanation]
    }))
  ];

  const filtered = allEntries.filter((e) => {
    if (catFilter !== 'all' && e.categoryKey !== catFilter) return false;
    if (onlyBookmarked && !progress.bookmarkedIds.includes(e.id)) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${e.code} ${e.title} ${e.summary} ${e.tags.join(' ')} ${e.takeaways.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-clinical-600" />
              带教病例库（共 {allEntries.length} 例经典教学档案）
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              支持按病种、关键词检索或筛选已收藏病例，供带教老师查房示范及学员考前复盘。
            </p>
          </div>
          <button
            onClick={() => setOnlyBookmarked((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition self-start ${
              onlyBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={onlyBookmarked ? 'currentColor' : 'none'} />
            仅看收藏 ({progress.bookmarkedIds.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索病例编号、症状、术式、Goodsall、克罗恩、大出血..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-clinical-500"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as typeof catFilter)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700"
          >
            <option value="all">全部类别</option>
            <option value="hemorrhoid">痔病</option>
            <option value="fistula">肛瘘</option>
            <option value="abscess">肛周脓肿</option>
            <option value="complication">术后并发症</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
            未找到符合条件的带教病例，请尝试调整搜索词或筛选条件。
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = expandedId === item.id;
            const bookmarked = progress.bookmarkedIds.includes(item.id);
            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="p-4 cursor-pointer hover:bg-slate-50/70 transition flex items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.code}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-clinical-50 text-clinical-700">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-500">{item.difficultyLabel}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className={`p-1.5 rounded-lg border transition ${
                        bookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
                    </button>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      <strong>病例摘要：</strong>{item.summary}
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">带教核心要点：</div>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        {item.takeaways.map((tk, i) => (
                          <li key={i} className="leading-relaxed">{tk}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          item.kind === 'case' ? onJumpToCase(item.id) : onJumpToComplications()
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-clinical-600 hover:bg-clinical-700 text-white text-xs font-semibold transition"
                      >
                        进入互动练习
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
