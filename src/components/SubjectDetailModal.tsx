import React, { useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Compass, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Sparkles,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SubjectDetail } from '../data/subjectDetailsData';
import { getSubjectEvaluationInfo, SelectionType } from '../data/curriculumData';

interface SubjectDetailModalProps {
  subjectDetail: SubjectDetail | null;
  onClose: () => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({ subjectDetail, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!subjectDetail) return null;

  const evalInfo = getSubjectEvaluationInfo(
    subjectDetail.name, 
    subjectDetail.area, 
    subjectDetail.type as SelectionType
  );

  // Dynamic theme based on subject classification:
  // 일반 = 녹색 (Green / Emerald)
  // 진로 = 파랑 (Blue)
  // 융합 = 보라 (Purple)
  const getTypeTheme = (type: string) => {
    switch (type) {
      case '일반':
        return {
          headerGradient: 'from-emerald-700 via-teal-700 to-slate-900',
          typeBadgeBg: 'bg-emerald-500/35',
          typeBadgeText: 'text-emerald-100',
          typeBadgeBorder: 'border-emerald-300/50',
          subtitleText: 'text-emerald-100/90',
          accentText: 'text-emerald-800',
          accentDot: 'bg-emerald-500',
          accentBg: 'bg-emerald-50/80',
          accentBorder: 'border-emerald-200/80',
          accentIconColor: 'text-emerald-600',
          sectionBorder: 'border-emerald-100'
        };
      case '진로':
        return {
          headerGradient: 'from-blue-700 via-indigo-700 to-slate-900',
          typeBadgeBg: 'bg-blue-500/35',
          typeBadgeText: 'text-blue-100',
          typeBadgeBorder: 'border-blue-300/50',
          subtitleText: 'text-blue-100/90',
          accentText: 'text-blue-800',
          accentDot: 'bg-blue-500',
          accentBg: 'bg-blue-50/80',
          accentBorder: 'border-blue-200/80',
          accentIconColor: 'text-blue-600',
          sectionBorder: 'border-blue-100'
        };
      case '융합':
        return {
          headerGradient: 'from-purple-700 via-violet-800 to-slate-900',
          typeBadgeBg: 'bg-purple-500/35',
          typeBadgeText: 'text-purple-100',
          typeBadgeBorder: 'border-purple-300/50',
          subtitleText: 'text-purple-100/90',
          accentText: 'text-purple-800',
          accentDot: 'bg-purple-500',
          accentBg: 'bg-purple-50/80',
          accentBorder: 'border-purple-200/80',
          accentIconColor: 'text-purple-600',
          sectionBorder: 'border-purple-100'
        };
      case '공통':
        return {
          headerGradient: 'from-sky-700 via-slate-700 to-slate-900',
          typeBadgeBg: 'bg-sky-500/35',
          typeBadgeText: 'text-sky-100',
          typeBadgeBorder: 'border-sky-300/50',
          subtitleText: 'text-sky-100/90',
          accentText: 'text-sky-800',
          accentDot: 'bg-sky-500',
          accentBg: 'bg-sky-50/80',
          accentBorder: 'border-sky-200/80',
          accentIconColor: 'text-sky-600',
          sectionBorder: 'border-sky-100'
        };
      case '전문':
        return {
          headerGradient: 'from-indigo-800 via-violet-900 to-slate-900',
          typeBadgeBg: 'bg-indigo-500/35',
          typeBadgeText: 'text-indigo-100',
          typeBadgeBorder: 'border-indigo-300/50',
          subtitleText: 'text-indigo-100/90',
          accentText: 'text-indigo-800',
          accentDot: 'bg-indigo-500',
          accentBg: 'bg-indigo-50/80',
          accentBorder: 'border-indigo-200/80',
          accentIconColor: 'text-indigo-600',
          sectionBorder: 'border-indigo-100'
        };
      default:
        return {
          headerGradient: 'from-slate-700 via-slate-800 to-slate-900',
          typeBadgeBg: 'bg-white/20',
          typeBadgeText: 'text-white',
          typeBadgeBorder: 'border-white/30',
          subtitleText: 'text-slate-200',
          accentText: 'text-slate-800',
          accentDot: 'bg-slate-500',
          accentBg: 'bg-slate-50',
          accentBorder: 'border-slate-200',
          accentIconColor: 'text-slate-600',
          sectionBorder: 'border-slate-100'
        };
    }
  };

  const theme = getTypeTheme(subjectDetail.type);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${theme.headerGradient} text-white p-5 flex items-start justify-between relative shrink-0 transition-colors duration-200`}>
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                {subjectDetail.area} 교과
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.typeBadgeBg} ${theme.typeBadgeText} border ${theme.typeBadgeBorder}`}>
                {subjectDetail.type === '공통' ? '공통 과목' : `${subjectDetail.type} 선택`}
              </span>
              {evalInfo.isCsat && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  수능 출제 과목
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>&lt;{subjectDetail.name}&gt;</span>
            </h3>
            <p className={`text-xs ${theme.subtitleText} font-medium`}>
              2022 개정 교육과정 고등학교 과목 선택 안내
            </p>
          </div>

          <button 
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 custom-scrollbar">
          {/* Section 1: 어떤 과목일까요? */}
          <section className="space-y-3">
            <div className={`flex items-center gap-2 ${theme.accentText} font-bold text-base border-b border-slate-100 pb-2`}>
              <BookOpen className={`w-4 h-4 ${theme.accentIconColor}`} />
              <h4>어떤 과목일까요?</h4>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {subjectDetail.description}
            </p>

            {/* Quick Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`${theme.accentBg} p-3 rounded-lg border ${theme.accentBorder}`}>
                <div className={`${theme.accentText} font-bold mb-1 flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.accentDot}`}></span>
                  이수 학점 안내
                </div>
                <div className="text-slate-800 font-semibold">{subjectDetail.credits}</div>
              </div>

              <div 
                className="p-3 rounded-lg border"
                style={{ 
                  backgroundColor: evalInfo.badgeBg, 
                  borderColor: evalInfo.badgeBorder 
                }}
              >
                <div className="font-bold mb-1 flex items-center gap-1" style={{ color: evalInfo.badgeText }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: evalInfo.badgeText }}></span>
                  성적 산출 방식
                </div>
                <div className="font-semibold text-slate-900">{evalInfo.evaluationMethod}</div>
              </div>
            </div>
          </section>

          {/* Section 2: 무엇을 배울까요? (핵심 아이디어 & 내용 요소) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-base border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4>무엇을 배울까요?</h4>
            </div>

            {/* 핵심 아이디어 */}
            {subjectDetail.coreIdeas && subjectDetail.coreIdeas.length > 0 && (
              <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/80 space-y-2">
                <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                  핵심 아이디어 (Core Ideas)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {subjectDetail.coreIdeas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 주요 학습 내용 요소 */}
            {subjectDetail.contentElements && subjectDetail.contentElements.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 block">주요 학습 영역 및 내용 요소:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {subjectDetail.contentElements.map((elem, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                      <div className="font-bold text-slate-800 mb-1.5 text-[11px] text-blue-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                        {elem.category}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {elem.items.map((it, iIdx) => (
                          <span key={iIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Section 3: 어떤 진로와 연결되어 있을까요? */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base border-b border-slate-100 pb-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h4>어떤 진로와 연결되어 있을까요?</h4>
            </div>

            <div className="space-y-3">
              {/* 관련 학과 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>관련 학과</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subjectDetail.relatedMajors.map((major, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-white rounded-md text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      {major}
                    </span>
                  ))}
                </div>
              </div>

              {/* 관련 직업 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>관련 직업군</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subjectDetail.relatedCareers.map((career, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-emerald-50/70 rounded-md text-xs font-semibold text-emerald-800 border border-emerald-200"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: 과목 간 연계 관계 */}
          {subjectDetail.connections && (
            <section className="space-y-2 pt-1 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>과목 간 연계 및 추천 이수 경로</span>
              </div>
              <div className="flex items-center gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 flex-wrap">
                {subjectDetail.connections.prev && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-medium">선수/선행 과목:</span>
                    <span className="font-bold text-slate-700">{subjectDetail.connections.prev.join(', ')}</span>
                  </div>
                )}
                {subjectDetail.connections.next && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-medium">후속/심화 연계:</span>
                    <span className="font-bold text-blue-700">{subjectDetail.connections.next.join(', ')}</span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            출처: 경기도교육청 2022 개정 교육과정 고등학교 과목 선택 안내자료
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            확인 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
