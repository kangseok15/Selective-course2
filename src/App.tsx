import React, { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { 
  BookOpen, 
  GraduationCap, 
  Search, 
  ChevronRight, 
  Info, 
  CheckCircle2,
  LayoutGrid,
  ListFilter,
  Calendar,
  Layers,
  FileText,
  CheckSquare,
  Check,
  RotateCcw,
  Printer,
  Download,
  Plus,
  X,
  Save,
  Trash2,
  Settings,
  FileUp,
  Loader2,
  FileCheck,
  Briefcase,
  Atom,
  Cpu,
  HeartPulse,
  Palette,
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { 
  FIELD_DATA, 
  SUBJECT_AREAS, 
  SUBJECT_TYPES, 
  SUNGSHIN_GROUPS, 
  MANDATORY_SUBJECTS, 
  Major, 
  Field, 
  SelectionGroup, 
  SungshinSubject,
  getSubjectEvaluationInfo,
  SubjectEvaluationInfo,
  SelectionType
} from './data/curriculumData';
import { UNIVERSITY_TIPS, UniversityTip } from './data/universityData';
import { getSubjectDetail, SubjectDetail } from './data/subjectDetailsData';
import { SubjectDetailModal } from './components/SubjectDetailModal';

// PDF 분석은 더 이상 브라우저에서 Gemini API를 직접 호출하지 않습니다.
// 실제 API 키는 Cloudflare Worker(서버) 안에만 존재하며, 프론트엔드는 이 프록시 주소로만 요청을 보냅니다.
// 아래 주소를 본인이 배포한 Cloudflare Worker 주소로 반드시 교체하세요.
const PDF_PARSE_PROXY_URL = 'https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev';

// Frequently searched / popular majors for quick one-click navigation
const POPULAR_MAJORS = [
  '의예과', '경영학과', '컴퓨터공학과', '간호학과', 
  '전자공학과', '미디어커뮤니케이션학과', '생명과학과', '자율전공학부'
];

interface FieldMeta {
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  bgLight: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  previewMajors: string[];
}

const FIELD_META: Record<string, FieldMeta> = {
  '인문 분야': {
    name: '인문 분야',
    icon: BookOpen,
    accentColor: '#d97706',
    bgLight: '#fffbeb',
    borderLight: '#fde68a',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    description: '어문, 역사, 철학 등 인간과 문화의 본질과 가치를 탐구하는 학문',
    previewMajors: ['국어국문', '영어영문', '사학', '철학']
  },
  '사회 분야': {
    name: '사회 분야',
    icon: Briefcase,
    accentColor: '#059669',
    bgLight: '#ecfdf5',
    borderLight: '#a7f3d0',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
    description: '경영, 경제, 언론, 행정 등 사회 구조와 시스템을 연구하는 학문',
    previewMajors: ['경영학', '경제학', '미디어', '행정학']
  },
  '자연 분야': {
    name: '자연 분야',
    icon: Atom,
    accentColor: '#0891b2',
    bgLight: '#ecfeff',
    borderLight: '#a5f3fc',
    badgeBg: '#cffafe',
    badgeText: '#155e75',
    description: '수학, 물리, 화학, 생명 등 자연 현상의 근본 원리와 법칙을 탐구하는 학문',
    previewMajors: ['수학', '물리학', '화학', '생명과학']
  },
  '공학 분야': {
    name: '공학 분야',
    icon: Cpu,
    accentColor: '#2563eb',
    bgLight: '#eff6ff',
    borderLight: '#bfdbfe',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    description: '소프트웨어, 전자, 반도체, 기계 등 첨단 기술을 설계하고 구현하는 학문',
    previewMajors: ['컴퓨터공학', '전자공학', '인공지능', '기계공학']
  },
  '보건·의약학 분야': {
    name: '보건·의약학 분야',
    icon: HeartPulse,
    accentColor: '#e11d48',
    bgLight: '#fff1f2',
    borderLight: '#fecdd3',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    description: '의학, 약학, 간호, 보건 등 인간 생명을 존중하고 건강을 증진하는 학문',
    previewMajors: ['의예과', '약학과', '간호학과', '수의예과']
  },
  '교육 분야': {
    name: '교육 분야',
    icon: GraduationCap,
    accentColor: '#4f46e5',
    bgLight: '#eef2ff',
    borderLight: '#c7d2fe',
    badgeBg: '#e0e7ff',
    badgeText: '#3730a3',
    description: '초등, 중등 교과 교육 및 미래 세대를 이끄는 교육 전문가를 양성하는 학문',
    previewMajors: ['초등교육', '국어교육', '수학교육', '영어교육']
  },
  '예술·체육 분야': {
    name: '예술·체육 분야',
    icon: Palette,
    accentColor: '#9333ea',
    bgLight: '#faf5ff',
    borderLight: '#e9d5ff',
    badgeBg: '#f3e8ff',
    badgeText: '#6b21a8',
    description: '시각디자인, 영상, 음악, 스포츠 과학 및 체육 지도 역량을 기르는 학문',
    previewMajors: ['디자인학', '회화과', '스포츠의학', '체육교육']
  },
  '자율전공 분야': {
    name: '자율전공 분야',
    icon: Compass,
    accentColor: '#0284c7',
    bgLight: '#f0f9ff',
    borderLight: '#bae6fd',
    badgeBg: '#e0f2fe',
    badgeText: '#075985',
    description: '전공 경계 없이 폭넓은 교양과 전공을 자유롭게 탐색하는 융복합 학부',
    previewMajors: ['자율전공학부', '자유전공학부']
  }
};

// --- 기본 교육과정(사용자 지정) 저장/불러오기 ---
// PDF 업로드나 직접 입력으로 만든 교육과정을 브라우저에 저장해두고,
// 페이지를 새로고침하거나 초기화하더라도 항상 이 교육과정이 기본값으로 적용되도록 한다.
const DEFAULT_CURRICULUM_KEY = 'selective-course-default-curriculum';

interface DefaultCurriculum {
  mandatory: Record<number, SungshinSubject[]>;
  groups: SelectionGroup[];
  schoolName?: string;
}

const saveDefaultCurriculum = (data: DefaultCurriculum) => {
  try {
    localStorage.setItem(DEFAULT_CURRICULUM_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('기본 교육과정 저장 실패:', e);
  }
};

const loadDefaultCurriculum = (): DefaultCurriculum | null => {
  try {
    const raw = localStorage.getItem(DEFAULT_CURRICULUM_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DefaultCurriculum;
  } catch (e) {
    console.error('기본 교육과정 불러오기 실패:', e);
    return null;
  }
};

const clearDefaultCurriculum = () => {
  try {
    localStorage.removeItem(DEFAULT_CURRICULUM_KEY);
  } catch (e) {
    console.error('기본 교육과정 삭제 실패:', e);
  }
};

const getFieldMeta = (fieldName: string): FieldMeta => {
  return FIELD_META[fieldName] || {
    name: fieldName,
    icon: BookOpen,
    accentColor: '#2563eb',
    bgLight: '#eff6ff',
    borderLight: '#bfdbfe',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
    description: '대학 전공별 권장과목 및 맞춤형 수강신청 계획',
    previewMajors: []
  };
};

export default function App() {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldSearchTerm, setFieldSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'plan' | 'subject' | 'group'>('plan');
  const [planGrade, setPlanGrade] = useState<2 | 3>(2);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectDetail | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customGroups, setCustomGroups] = useState<SelectionGroup[]>([]);
  const [customMandatory, setCustomMandatory] = useState<Record<number, SungshinSubject[]>>({});
  // 계획서 상단에 표시되는 학교명 (PDF 불러오기/직접 입력 시 지정 가능, 기본값은 숭신고등학교)
  const [schoolName, setSchoolName] = useState('숭신고등학교');
  const [tempSchoolName, setTempSchoolName] = useState('숭신고등학교');
  const [tempMandatory, setTempMandatory] = useState({
    '2-1': '',
    '2-2': '',
    '3-1': '',
    '3-2': ''
  });
  const [tempGroups, setTempGroups] = useState<any[]>([
    { id: Date.now(), grade: 2, semester: '1학기', credits: 4, selectCount: 1, subjects: '' }
  ]);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [univSearchTerm, setUnivSearchTerm] = useState('');
  const [univRegionFilter, setUnivRegionFilter] = useState('전체');
  const [univViewMode, setUnivViewMode] = useState<'major' | 'all'>('major');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [showPdfReview, setShowPdfReview] = useState(false);
  const [parsedData, setParsedData] = useState<{
    mandatory: Record<number, SungshinSubject[]>;
    groups: SelectionGroup[];
    schoolName: string;
  } | null>(null);
  // 현재 반영하려는 교육과정을 "기본 교육과정"으로 지정할지 여부
  const [setAsDefaultCurriculum, setSetAsDefaultCurriculum] = useState(false);
  // 브라우저에 저장된 기본 교육과정이 있는지 여부 (있으면 헤더에 표시)
  const [hasDefaultCurriculum, setHasDefaultCurriculum] = useState(false);
  // Consultant checked state: overrides default AI recommendations
  // key: `${grade}-${groupId}-${subjectName}-${semester}`
  // value: 'consultant' (녹색 체크) | 'off' (체크 해제)
  const [consultantChecks, setConsultantChecks] = useState<Record<string, 'consultant' | 'off'>>({});
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 앱을 처음 열거나(새로고침 포함) 새로 시작할 때, 저장된 기본 교육과정이 있으면 자동으로 불러온다.
  useEffect(() => {
    const saved = loadDefaultCurriculum();
    if (saved) {
      setCustomMandatory(saved.mandatory);
      setCustomGroups(saved.groups);
      setIsCustomMode(true);
      setHasDefaultCurriculum(true);
      if (saved.schoolName) {
        setSchoolName(saved.schoolName);
        setTempSchoolName(saved.schoolName);
      }
    }
  }, []);

  const normalizeSubjectName = (name: string) => {
    if (!name) return '';
    return name
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/Ⅰ/g, '1')
      .replace(/Ⅱ/g, '2')
      .replace(/Ⅲ/g, '3')
      .replace(/Ⅳ/g, '4')
      .replace(/Ⅴ/g, '5')
      .replace(/Ⅵ/g, '6')
      .replace(/Ⅶ/g, '7')
      .replace(/Ⅷ/g, '8')
      .replace(/Ⅸ/g, '9')
      .replace(/Ⅹ/g, '10')
      .toLowerCase();
  };

  const handleAddGroup = () => {
    setTempGroups([...tempGroups, { id: Date.now(), grade: 2, semester: '1학기', credits: 4, selectCount: 1, subjects: '' }]);
  };

  const handleRemoveGroup = (id: number) => {
    setTempGroups(tempGroups.filter(g => g.id !== id));
  };

  const handleUpdateGroup = (id: number, field: string, value: any) => {
    setTempGroups(tempGroups.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    setIsParsingPdf(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });

      const proxyResponse = await fetch(PDF_PARSE_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 })
      });

      if (!proxyResponse.ok) {
        throw new Error(`프록시 서버 응답 오류 (status: ${proxyResponse.status})`);
      }

      const geminiResult = await proxyResponse.json();
      const rawText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error('Unexpected proxy response shape:', geminiResult);
        throw new Error('AI 응답에서 결과 텍스트를 찾을 수 없습니다.');
      }

      const data = JSON.parse(rawText);
      // Add IDs to groups
      data.groups = data.groups.map((g: any, idx: number) => ({
        ...g,
        id: `선택과목 ${idx + 1}`
      }));
      // 학교명 입력란의 초기값은 현재 적용 중인 학교명으로 채워둔다.
      data.schoolName = schoolName;
      
      setParsedData(data);
      setShowPdfReview(true);
    } catch (error) {
      console.error('PDF Parsing Error:', error);
      alert('PDF 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsParsingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyParsedData = () => {
    if (!parsedData) return;

    // 편집 중 이름을 비워둔 빈 항목은 반영 시 제외한다.
    const cleanedMandatory: Record<number, SungshinSubject[]> = {};
    Object.entries(parsedData.mandatory).forEach(([grade, subjects]) => {
      cleanedMandatory[Number(grade)] = subjects.filter(s => s.name.trim() !== '');
    });
    const cleanedGroups: SelectionGroup[] = parsedData.groups.map(g => ({
      ...g,
      subjects: g.subjects.filter(s => s.name.trim() !== '')
    }));
    const finalSchoolName = parsedData.schoolName?.trim() || '숭신고등학교';

    setCustomMandatory(cleanedMandatory);
    setCustomGroups(cleanedGroups);
    setSchoolName(finalSchoolName);
    setTempSchoolName(finalSchoolName);
    setIsCustomMode(true);
    setShowPdfReview(false);
    setParsedData(null);

    if (setAsDefaultCurriculum) {
      saveDefaultCurriculum({ mandatory: cleanedMandatory, groups: cleanedGroups, schoolName: finalSchoolName });
      setHasDefaultCurriculum(true);
      setSetAsDefaultCurriculum(false);
    }

    alert('교육과정이 성공적으로 반영되었습니다.');
  };

  // --- PDF에서 추출한 데이터를 검토/수정하기 위한 편집 헬퍼들 ---
  const updateParsedMandatorySubjectName = (grade: number, idx: number, name: string) => {
    if (!parsedData) return;
    const list = [...(parsedData.mandatory[grade] || [])];
    list[idx] = { ...list[idx], name };
    setParsedData({ ...parsedData, mandatory: { ...parsedData.mandatory, [grade]: list } });
  };

  const toggleParsedMandatorySemester = (grade: number, idx: number, semester: number) => {
    if (!parsedData) return;
    const list = [...(parsedData.mandatory[grade] || [])];
    const current = list[idx];
    const has = current.semesters.includes(semester);
    let semesters = has
      ? current.semesters.filter(s => s !== semester)
      : [...current.semesters, semester].sort();
    if (semesters.length === 0) semesters = [semester]; // 최소 1개 학기는 유지
    list[idx] = { ...current, semesters };
    setParsedData({ ...parsedData, mandatory: { ...parsedData.mandatory, [grade]: list } });
  };

  const removeParsedMandatorySubject = (grade: number, idx: number) => {
    if (!parsedData) return;
    const list = (parsedData.mandatory[grade] || []).filter((_, i) => i !== idx);
    setParsedData({ ...parsedData, mandatory: { ...parsedData.mandatory, [grade]: list } });
  };

  const addParsedMandatorySubject = (grade: number) => {
    if (!parsedData) return;
    const list = [...(parsedData.mandatory[grade] || []), { name: '', semesters: [1] }];
    setParsedData({ ...parsedData, mandatory: { ...parsedData.mandatory, [grade]: list } });
  };

  const updateParsedGroupField = (groupIdx: number, field: 'description' | 'selectCount', value: any) => {
    if (!parsedData) return;
    const groups = [...parsedData.groups];
    groups[groupIdx] = { ...groups[groupIdx], [field]: value };
    setParsedData({ ...parsedData, groups });
  };

  const updateParsedGroupSubjectName = (groupIdx: number, subIdx: number, name: string) => {
    if (!parsedData) return;
    const groups = [...parsedData.groups];
    const subjects = [...groups[groupIdx].subjects];
    subjects[subIdx] = { ...subjects[subIdx], name };
    groups[groupIdx] = { ...groups[groupIdx], subjects };
    setParsedData({ ...parsedData, groups });
  };

  const removeParsedGroupSubject = (groupIdx: number, subIdx: number) => {
    if (!parsedData) return;
    const groups = [...parsedData.groups];
    groups[groupIdx] = { ...groups[groupIdx], subjects: groups[groupIdx].subjects.filter((_, i) => i !== subIdx) };
    setParsedData({ ...parsedData, groups });
  };

  const addParsedGroupSubject = (groupIdx: number) => {
    if (!parsedData) return;
    const groups = [...parsedData.groups];
    const target = groups[groupIdx];
    groups[groupIdx] = {
      ...target,
      subjects: [...target.subjects, { name: '', semesters: target.semester === '1학기' ? [1] : [2] }]
    };
    setParsedData({ ...parsedData, groups });
  };

  const removeParsedGroup = (groupIdx: number) => {
    if (!parsedData) return;
    setParsedData({ ...parsedData, groups: parsedData.groups.filter((_, i) => i !== groupIdx) });
  };

  const addParsedGroup = () => {
    if (!parsedData) return;
    const newGroup: SelectionGroup = {
      id: `선택과목 ${parsedData.groups.length + 1}`,
      grade: 2,
      semester: '1학기',
      selectCount: 1,
      description: '새 선택과목군',
      subjects: []
    };
    setParsedData({ ...parsedData, groups: [...parsedData.groups, newGroup] });
  };

  const handleDone = () => {
    // Process Mandatory Subjects
    const newMandatory: Record<number, SungshinSubject[]> = { 2: [], 3: [] };
    
    const processSemester = (grade: number, semester: number, input: string) => {
      const subjects = input.split(',').map(s => s.trim()).filter(s => s !== '');
      subjects.forEach(name => {
        const existing = newMandatory[grade].find(s => s.name === name);
        if (existing) {
          if (!existing.semesters.includes(semester)) {
            existing.semesters.push(semester);
            existing.semesters.sort();
          }
        } else {
          newMandatory[grade].push({ name, semesters: [semester] });
        }
      });
    };

    processSemester(2, 1, tempMandatory['2-1']);
    processSemester(2, 2, tempMandatory['2-2']);
    processSemester(3, 1, tempMandatory['3-1']);
    processSemester(3, 2, tempMandatory['3-2']);

    setCustomMandatory(newMandatory);

    // Process Selection Groups
    const newGroups: SelectionGroup[] = tempGroups.map((g, idx) => ({
      id: `선택군${idx + 1}`,
      grade: g.grade,
      semester: g.semester,
      selectCount: g.selectCount,
      credits: g.credits,
      description: `${g.grade}학년 ${g.semester} 선택과목군 ${idx + 1} (택${g.selectCount})`,
      subjects: g.subjects.split(',').map((s: string) => ({
        name: s.trim(),
        semesters: g.semester === '1학기' ? [1] : [2]
      })).filter((s: any) => s.name !== '')
    }));
    setCustomGroups(newGroups);
    const finalSchoolName = tempSchoolName.trim() || '숭신고등학교';
    setSchoolName(finalSchoolName);
    setTempSchoolName(finalSchoolName);
    setIsCustomMode(true);
    setShowCustomForm(false);

    if (setAsDefaultCurriculum) {
      saveDefaultCurriculum({ mandatory: newMandatory, groups: newGroups, schoolName: finalSchoolName });
      setHasDefaultCurriculum(true);
      setSetAsDefaultCurriculum(false);
    }
  };

  const closeCustomForm = () => {
    setTempSchoolName(schoolName);
    setShowCustomForm(false);
    setSetAsDefaultCurriculum(false);
  };

  // All majors flattened for global search
  const allMajors = useMemo(() => {
    return FIELD_DATA.flatMap(field => 
      field.majors.map(major => ({ ...major, fieldName: field.name }))
    );
  }, []);

  // Filtered majors based on search term
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allMajors.filter(major => 
      major.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allMajors]);

  // Exclusive subfields to prevent cross-matching unrelated sub-disciplines
  const EXCLUSIVE_SUBFIELDS = [
    { tag: '산업경영공학', keywords: ['산업경영', '산업공학', '산업시스템', '기술경영', '테크놀로지경영', 'it경영', '시스템경영', '경영공학', '공학경영', '기술창업'] },
    { tag: '일반경영', keywords: ['경영학과', '경영학부', '경영학', '경영대학', '경영전공', '글로벌경영', '국제경영', '경영정보', '경영'] },
    { tag: '경제', keywords: ['경제학', '경제금융', '글로벌경제', '응용경제', '농업경제', '식품자원경제', '경제'] },
    { tag: '뷰티', keywords: ['뷰티', '미용', '헤어', '메이크업', '에스테틱', '화장품'] },
    { tag: '실내', keywords: ['실내', '인테리어', '실내건축', '공간디자인'] },
    { tag: '테크놀로지', keywords: ['테크놀로지', '공학디자인'] },
    { tag: '패션', keywords: ['패션', '의류', '의상', '텍스타일', '섬유'] },
    { tag: '시각', keywords: ['시각', '커뮤니케이션', '시각정보', '시각영상', '그래픽디자인'] },
    { tag: '산업', keywords: ['산업디자인', '제품디자인', '공업디자인'] },
    { tag: '도예공예', keywords: ['공예', '도예', '금속공예', '도자'] },
    { tag: '만화영상', keywords: ['만화', '애니메이션', '웹툰', '캐릭터', '게임그래픽'] },
    { tag: '의예', keywords: ['의예', '의학', '의과'] },
    { tag: '치의예', keywords: ['치의예', '치의학', '치과'] },
    { tag: '한의예', keywords: ['한의예', '한의학', '한의'] },
    { tag: '수의예', keywords: ['수의예', '수의학', '수의'] },
    { tag: '약학', keywords: ['약학', '제약', '약제'] },
    { tag: '간호', keywords: ['간호'] },
    { tag: '화학공학', keywords: ['화학공', '화공', '응용화학', '에너지화학', '생명화학'] },
    { tag: '순수화학', keywords: ['화학과', '화학전공', '순수화학'] },
    { tag: '기계', keywords: ['기계', '로봇', '자동차', '모빌리티', '항공우주', '메카트로닉스'] },
    { tag: '건축', keywords: ['건축', '건축공', '건축학', '도시공'] },
    { tag: '토목', keywords: ['토목', '건설환경', '인프라', '사회기반'] }
  ];

  const GENERIC_MAJOR_WORDS = new Set(['디자인', '공학', '융합', '시스템', '공학부', '학부', '학과', '전공', '계열', '대학', '경영']);

  const MAJOR_KEYWORD_MAP: Record<string, string[]> = {
    '컴퓨터': ['컴퓨터', '소프트웨어', '인공지능', 'ai', 'sw', '데이터', '정보통신', 'ict', '정보기술', '지능정보', '전산'],
    '소프트웨어': ['소프트웨어', '컴퓨터', '인공지능', 'ai', 'sw', '데이터', '정보보안', '사이버보안', '지능'],
    '인공지능': ['인공지능', 'ai', '데이터', '컴퓨터', '소프트웨어', '지능정보', '인텔리전스', '빅데이터'],
    '전자': ['전자', '전기', '반도체', '정보통신', '제어', '임베디드', '전파', '나노', 'it'],
    '전기': ['전기', '전자', '전력', '에너지', '전기제어'],
    '기계': ['기계', '로봇', '모빌리티', '자동차', '항공', '우주', '메카트로닉스', '정밀'],
    '화학공학': ['화학공', '화공', '응용화학', '에너지화학', '생명화학', '고분자'],
    '생명': ['생명', '바이오', '유전', '의생명', '생물', '분자', '식품생명', '생명과학', '생명공'],
    '신소재': ['신소재', '재료', '고분자', '나노', '금속', '무기재료'],
    '화학': ['화학', '응용화학', '정밀화학'],
    '물리': ['물리', '응용물리', '양자', '물리천문', '천문'],
    '수학': ['수학', '수리', '통계', '응용통계', '데이터과학', '빅데이터', '금융수학'],
    '통계': ['통계', '데이터', '빅데이터', '응용통계', '데이터사이언스'],
    '의예': ['의예', '의학', '의과', '의학부'],
    '치의예': ['치의예', '치의학', '치과'],
    '한의예': ['한의예', '한의학', '한의'],
    '수의예': ['수의예', '수의학', '수의'],
    '약학': ['약학', '제약', '약제'],
    '간호': ['간호'],
    '경영': ['경영', '비즈니스', '글로벌경영', '국제경영', '경영정보', '회계', '재무', '마케팅'],
    '산업공학': ['산업경영', '산업공학', '산업시스템', '기술경영', '테크놀로지경영', '시스템경영', '경영공학'],
    '경제': ['경제', '금융', '통상', '국제통상', '경제금융'],
    '행정': ['행정', '공공', '정책', '도시행정'],
    '정치외교': ['정치', '외교', '국제', '정치외교'],
    '미디어': ['미디어', '신문방송', '언론', '커뮤니케이션', '영상', '콘텐츠', '광고홍보'],
    '시각디자인': ['시각디자인', '커뮤니케이션디자인', '시각정보디자인', '시각영상', '그래픽디자인'],
    '산업디자인': ['산업디자인', '제품디자인', '공업디자인', '운송디자인'],
    '실내디자인': ['실내디자인', '실내건축', '인테리어', '공간디자인'],
    '테크놀로지디자인': ['테크놀로지디자인', '공학디자인', '스마트디자인'],
    '패션디자인': ['패션디자인', '의류', '의상', '텍스타일', '의류디자인', '패션산업'],
    '뷰티디자인': ['뷰티디자인', '뷰티', '미용', '화장품', '헤어디자인', '메이크업', '에스테틱'],
    '건축': ['건축', '도시', '실내건축', '건축공학'],
    '토목': ['토목', '건설', '인프라', '사회기반', '건설환경', '도시인프라'],
    '환경': ['환경', '지구환경', '기후', '환경공학', '생태'],
    '식품': ['식품', '영양', '식품생명', '식품가공', '외식', '식품영양'],
    '국어': ['국어', '국문', '한국어', '한국어문'],
    '영어': ['영어', '영문', '영어영문'],
    '교육': ['교육', '사범', '수학교육', '국어교육', '영어교육', '과학교육', '초등교육'],
    '체육': ['체육', '스포츠', '운동', '사회체육', '체육교육', '스포츠과학', '스포츠건강', '특수체육', '태권도', '경호', '건강재활', '운동처방'],
    '스포츠': ['체육', '스포츠', '운동', '사회체육', '체육교육', '스포츠과학', '스포츠건강', '특수체육', '스포츠산업', '건강재활'],
    '자유전공': ['자유전공', '자율전공', '계열선발', '통합모집', '자유전공학부']
  };

  const cleanMajorStr = (name: string) => {
    if (!name) return '';
    return name
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .replace(/\s+/g, '')
      .replace(/(학과|학부|전공|계열|대학)$/g, '')
      .toLowerCase();
  };

  const isMajorMatch = (selectedName: string, tipMajor: string) => {
    const sClean = cleanMajorStr(selectedName);
    const tClean = cleanMajorStr(tipMajor);
    
    if (!sClean || !tClean) return false;

    // 1. Conflict check for exclusive subfields
    // (e.g. 일반경영 vs 산업경영공학/기술경영, 뷰티 vs 실내/테크놀로지, 의예 vs 치의예/한의예)
    for (const sub of EXCLUSIVE_SUBFIELDS) {
      const sMatchesSub = sub.keywords.some(kw => sClean.includes(kw));
      if (sMatchesSub) {
        // s matches this subfield! Verify if t belongs to another conflicting subfield
        const conflictingSub = EXCLUSIVE_SUBFIELDS.find(other => 
          other.tag !== sub.tag && other.keywords.some(kw => tClean.includes(kw))
        );
        if (conflictingSub) {
          // Cross-subfield collision! Disallow match
          return false;
        }
        // If s is specific (e.g. 뷰티, 산업경영공학), t must ALSO match this specific subfield
        const tMatchesSub = sub.keywords.some(kw => tClean.includes(kw));
        if (!tMatchesSub) {
          return false;
        }
      }
    }

    // 2. Direct exact match
    if (sClean === tClean) return true;

    // 3. Direct substring match (only if neither is purely a generic word)
    const isSGeneric = GENERIC_MAJOR_WORDS.has(sClean);
    const isTGeneric = GENERIC_MAJOR_WORDS.has(tClean);
    if (!isSGeneric && !isTGeneric) {
      if (sClean.length >= 3 && tClean.length >= 3) {
        if (sClean.includes(tClean) || tClean.includes(sClean)) {
          return true;
        }
      }
    }
    
    // 4. Keyword/Synonym matching
    for (const [key, synonyms] of Object.entries(MAJOR_KEYWORD_MAP)) {
      const isSelectedRelated = sClean.includes(cleanMajorStr(key)) || synonyms.some(syn => sClean.includes(cleanMajorStr(syn)));
      if (isSelectedRelated) {
        const isTipRelated = synonyms.some(syn => tClean.includes(cleanMajorStr(syn)));
        if (isTipRelated) return true;
      }
    }

    return false;
  };

  const universityTips = useMemo(() => {
    const search = univSearchTerm.trim().toLowerCase();
    
    return UNIVERSITY_TIPS.filter(tip => {
      // 1. Region filter
      if (univRegionFilter !== '전체') {
        if (tip.location !== univRegionFilter && tip.region !== univRegionFilter) {
          return false;
        }
      }

      // 2. View Mode (major-focused vs all)
      if (univViewMode === 'major') {
        if (!selectedMajor) return false;
        const isMatch = isMajorMatch(selectedMajor.name, tip.major);
        // If there's a search term, allow searching within matching or broad
        if (!isMatch && !search) return false;
        if (!isMatch && search) {
          const matchesSearch = tip.university.toLowerCase().includes(search) || 
                                tip.location.toLowerCase().includes(search) ||
                                tip.major.toLowerCase().includes(search) ||
                                tip.core.toLowerCase().includes(search) ||
                                tip.recommended.toLowerCase().includes(search);
          if (!matchesSearch) return false;
        }
      }

      // 3. Search query filter
      if (search) {
        const matchesSearch = tip.university.toLowerCase().includes(search) || 
                              tip.location.toLowerCase().includes(search) ||
                              tip.major.toLowerCase().includes(search) ||
                              tip.core.toLowerCase().includes(search) ||
                              tip.recommended.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [selectedMajor, univSearchTerm, univRegionFilter, univViewMode]);

  const subjectsByArea = useMemo(() => {
    if (!selectedMajor) return null;

    const grouped: Record<string, string[]> = {};
    
    selectedMajor.recommendedSubjects.forEach(subjectName => {
      // Find which area this subject belongs to
      let areaFound = '기타';
      for (const [area, subjects] of Object.entries(SUBJECT_AREAS)) {
        if (subjects.includes(subjectName)) {
          areaFound = area;
          break;
        }
      }

      if (!grouped[areaFound]) grouped[areaFound] = [];
      grouped[areaFound].push(subjectName);
    });

    return grouped;
  }, [selectedMajor]);

  // 대학별 권장과목 텍스트("화학, 생명과학" 등)에서 과목명만 뽑아낸다.
  // "적극 이수", "자신의 진로에 맞게" 같은 서술형 안내 문구는 특정 과목을 지정한 것이 아니므로 제외한다.
  const parseTipSubjectNames = (rawText: string): string[] => {
    if (!rawText || rawText === '-' || rawText.trim() === '') return [];
    const isDescriptive = rawText.includes('적극 이수') ||
                          rawText.includes('자신의 진로') ||
                          rawText.includes('제시하지 않은') ||
                          rawText.includes('선택 이수');
    if (isDescriptive) return [];
    return rawText
      .split(/[,/]/)
      .map(s => s.replace(/\([^)]*\)/g, '').trim())
      .filter(Boolean);
  };

  // 현재 선택된 학과와 관련된 대학들 중, 과목별로 "핵심과목"/"권장과목"으로 지정한 대학 목록을 매핑한다.
  // key: 정규화된 과목명 -> [{ university, type }]
  const subjectUniversityMap = useMemo(() => {
    const map: Record<string, { university: string; type: 'core' | 'recommended' }[]> = {};
    if (!selectedMajor) return map;

    UNIVERSITY_TIPS.forEach(tip => {
      if (!isMajorMatch(selectedMajor.name, tip.major)) return;

      const addEntries = (rawText: string, type: 'core' | 'recommended') => {
        parseTipSubjectNames(rawText).forEach(subjectPart => {
          const key = normalizeSubjectName(subjectPart);
          if (!key) return;
          if (!map[key]) map[key] = [];
          const alreadyExists = map[key].some(e => e.university === tip.university && e.type === type);
          if (!alreadyExists) {
            map[key].push({ university: tip.university, type });
          }
        });
      };

      addEntries(tip.core, 'core');
      addEntries(tip.recommended, 'recommended');
    });

    return map;
  }, [selectedMajor]);

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setSelectedMajor(null);
    setSearchTerm(''); // Clear search when picking a field
    setFieldSearchTerm('');
  };

  const handleMajorSelect = (major: Major) => {
    setSelectedMajor(major);
    setViewMode('plan');
    setConsultantChecks({});
    setFieldSearchTerm('');
    // If we were searching, we might not have the field set
    if (!selectedField) {
      const field = FIELD_DATA.find(f => f.majors.some(m => m.name === major.name));
      if (field) setSelectedField(field);
    }
  };

  const handlePopularMajorClick = (majorName: string) => {
    const found = allMajors.find(m => m.name === majorName);
    if (found) {
      handleMajorSelect(found);
    }
  };

  const resetSelection = () => {
    setSelectedField(null);
    setSelectedMajor(null);
    setSearchTerm('');
    setFieldSearchTerm('');
    setConsultantChecks({});
  };

  const filteredFieldMajors = useMemo(() => {
    if (!selectedField) return [];
    if (!fieldSearchTerm.trim()) return selectedField.majors;
    const term = fieldSearchTerm.toLowerCase().trim();
    return selectedField.majors.filter(m => 
      m.name.toLowerCase().includes(term) ||
      m.recommendedSubjects.some(s => s.toLowerCase().includes(term))
    );
  }, [selectedField, fieldSearchTerm]);

  const handlePrint = () => {
    setErrorMsg(null);
    try {
      window.print();
    } catch (error) {
      console.error('Print failed:', error);
      setErrorMsg('인쇄 기능을 실행할 수 없습니다. 브라우저 설정을 확인해 주세요.');
    }
  };

  // Renders the given grade into the printable area and waits for React to
  // finish updating the DOM before returning, so the capture below reflects
  // the newly selected grade rather than a stale render.
  const renderGradeAndWait = async (grade: 2 | 3) => {
    setPlanGrade(grade);
    // Two animation frames + a short delay gives React time to commit the
    // state update and the browser time to lay out the (potentially large)
    // table before we snapshot it.
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise((resolve) => setTimeout(resolve, 150));
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !selectedMajor || isDownloading) return;

    setIsDownloading(true);
    setErrorMsg(null);
    const originalGrade = planGrade;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // Set margin to 15mm as requested
      const maxAvailableWidth = pdfWidth - (margin * 2);
      const maxAvailableHeight = pdfHeight - (margin * 2);

      const gradesToExport: (2 | 3)[] = [2, 3];

      for (let i = 0; i < gradesToExport.length; i++) {
        const grade = gradesToExport[i];
        await renderGradeAndWait(grade);

        if (!printRef.current) continue;

        // Use html-to-image for better compatibility with modern CSS (oklch)
        const dataUrl = await toJpeg(printRef.current, {
          quality: 0.95,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
        });

        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => (img.onload = resolve));

        // Calculate dimensions to fit exactly on one page within margins
        const printScale = 1.0; // Scale to 100% of available space within margins
        let finalWidth = maxAvailableWidth * printScale;
        let finalHeight = (img.height * finalWidth) / img.width;

        if (finalHeight > maxAvailableHeight * printScale) {
          finalHeight = maxAvailableHeight * printScale;
          finalWidth = (img.width * finalHeight) / img.height;
        }

        const xPos = (pdfWidth - finalWidth) / 2;
        const yPos = margin; // Start from top margin to maximize space

        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(dataUrl, 'JPEG', xPos, yPos, finalWidth, finalHeight);
      }

      pdf.save(`2022개정_선택과목가이드_${selectedMajor.name}.pdf`);
    } catch (error: any) {
      console.error('PDF generation failed:', error);
      setErrorMsg(`PDF 생성 실패: 브라우저 호환성 문제. 인쇄(PDF로 저장)를 이용해 주세요.`);
    } finally {
      // Restore whichever grade the user was originally viewing on screen.
      setPlanGrade(originalGrade);
      setIsDownloading(false);
    }
  };

  // Helper to determine grading and CSAT info based on 2022 revised curriculum & 2028 CSAT standards
  const getSubjectEval = (name: string, area?: string, type?: SelectionType): SubjectEvaluationInfo => {
    return getSubjectEvaluationInfo(name, area, type);
  };

  // Helper to return colorful pill styling for subject classification types (공통, 일반, 진로, 융합, 전문)
  const getSubjectTypeBadgeStyle = (type: string) => {
    switch (type) {
      case '공통':
        return {
          bg: '#e0f2fe',
          text: '#0369a1',
          border: '#7dd3fc',
          label: '공통 과목'
        };
      case '일반':
        return {
          bg: '#dcfce7',
          text: '#15803d',
          border: '#86efac',
          label: '일반 선택'
        };
      case '진로':
        return {
          bg: '#dbeafe',
          text: '#1d4ed8',
          border: '#93c5fd',
          label: '진로 선택'
        };
      case '융합':
        return {
          bg: '#f3e8ff',
          text: '#7e22ce',
          border: '#d8b4fe',
          label: '융합 선택'
        };
      case '전문':
        return {
          bg: '#ede9fe',
          text: '#6d28d9',
          border: '#c4b5fd',
          label: '전문 선택'
        };
      default:
        return {
          bg: '#f1f5f9',
          text: '#334155',
          border: '#cbd5e1',
          label: `${type} 선택`
        };
    }
  };

  const handleOpenSubjectModal = (subjectName: string) => {
    const detail = getSubjectDetail(subjectName);
    setSelectedSubjectModal(detail);
  };

  // Structured data for the plan view (grouped by selection group AND academic area)
  const planData = useMemo(() => {
    if (!selectedMajor) return [];
    
    const groupsToUse = isCustomMode ? customGroups : SUNGSHIN_GROUPS;
    
    return groupsToUse.filter(g => g.grade === planGrade).map(group => {
      const subjectsWithMetadata = group.subjects.map(subject => {
        const normalizedName = normalizeSubjectName(subject.name);
        const area = Object.keys(SUBJECT_AREAS).find(a => 
          SUBJECT_AREAS[a].some(s => normalizeSubjectName(s) === normalizedName)
        ) || '기타';
        const typeKey = Object.keys(SUBJECT_TYPES).find(k => normalizeSubjectName(k) === normalizedName);
        const type = (typeKey ? SUBJECT_TYPES[typeKey] : '일반') as SelectionType;
        const isRecommended = selectedMajor.recommendedSubjects.some(s => normalizeSubjectName(s) === normalizedName);
        const evalInfo = getSubjectEval(subject.name, area, type);
        return { ...subject, area, type, isRecommended, gradingType: evalInfo.displayTitle, evalInfo };
      });

      // Group by area
      const groupedByArea: Record<string, typeof subjectsWithMetadata> = {};
      subjectsWithMetadata.forEach(s => {
        if (!groupedByArea[s.area]) groupedByArea[s.area] = [];
        groupedByArea[s.area].push(s);
      });

      return {
        ...group,
        formattedLabel: `${group.id} [택${group.selectCount}] (${group.credits || 4}학점)`,
        groupedSubjects: Object.entries(groupedByArea).map(([area, subjects]) => ({
          area,
          subjects
        }))
      };
    });
  }, [selectedMajor, planGrade, customGroups, isCustomMode]);

  // Checkbox state logic for plan table:
  // - 'ai': AI-recommended (Blue Check)
  // - 'consultant': Consultant-checked (Green Check)
  // - 'off': Unchecked (Empty)
  const getCellCheckState = (
    grade: number,
    groupId: string,
    subjectName: string,
    semester: number,
    isAiRecommended: boolean
  ): 'ai' | 'consultant' | 'off' => {
    const key = `${grade}-${groupId}-${subjectName}-${semester}`;
    const override = consultantChecks[key];
    if (override === 'consultant') return 'consultant';
    if (override === 'off') return 'off';
    return isAiRecommended ? 'ai' : 'off';
  };

  const handleToggleCell = (
    grade: number,
    groupId: string,
    subjectName: string,
    semester: number,
    isAiRecommended: boolean
  ) => {
    const key = `${grade}-${groupId}-${subjectName}-${semester}`;
    setConsultantChecks(prev => {
      const currentState = getCellCheckState(grade, groupId, subjectName, semester, isAiRecommended);
      if (currentState === 'consultant') {
        // 녹색 체크 상태 -> 한번 더 클릭하면 녹색이 사라짐 (off)
        return { ...prev, [key]: 'off' };
      } else if (currentState === 'ai') {
        // AI 파란색 체크 상태 -> 클릭하면 체크 해제 (off)
        return { ...prev, [key]: 'off' };
      } else {
        // off (빈 칸) 상태 -> 다시 클릭하면 녹색 체크가 생김
        return { ...prev, [key]: 'consultant' };
      }
    });
  };

  const handleResetConsultantChecks = () => {
    setConsultantChecks({});
  };

  const hasConsultantChanges = useMemo(() => {
    return Object.keys(consultantChecks).length > 0;
  }, [consultantChecks]);

  // 파란색(AI 추천) 체크에 마우스를 올렸을 때 보여줄 안내문을 만든다.
  // 관련 대학이 있으면 "대학명(핵심/권장)" 형태로, 없으면 일반 안내 문구로 대체한다.
  const buildAiCheckTooltip = (subjectName: string, semester: number) => {
    const entries = subjectUniversityMap[normalizeSubjectName(subjectName)];
    if (!entries || entries.length === 0) {
      return `${subjectName} ${semester}학기: AI 추천 과목 (특정 대학 지정 정보 없음 / 클릭 시 체크 해제)`;
    }

    const MAX_SHOWN = 8;
    const shown = entries.slice(0, MAX_SHOWN);
    const lines = shown.map(e => `${e.university} (${e.type === 'core' ? '핵심과목' : '권장과목'})`);
    const remaining = entries.length - shown.length;
    const header = `${subjectName} ${semester}학기 — 대학별 지정 현황`;
    const footer = remaining > 0 ? `\n외 ${remaining}개 대학` : '';
    return `${header}\n${lines.join('\n')}${footer}\n(클릭 시 체크 해제)`;
  };

  const renderSemesterCheckbox = (
    grade: number,
    groupId: string,
    subjectName: string,
    semester: number,
    isAiRecommended: boolean
  ) => {
    const state = getCellCheckState(grade, groupId, subjectName, semester, isAiRecommended);

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleCell(grade, groupId, subjectName, semester, isAiRecommended);
        }}
        title={
          state === 'ai'
            ? buildAiCheckTooltip(subjectName, semester)
            : state === 'consultant'
            ? `${subjectName} ${semester}학기: 컨설턴트 상담 선택 (녹색 체크 / 클릭 시 해제)`
            : `${subjectName} ${semester}학기: 미선택 (클릭하여 컨설턴트 녹색 체크)`
        }
        style={{
          width: '1.35rem',
          height: '1.35rem',
          borderRadius: '0.35rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          backgroundColor: state === 'ai' ? '#eff6ff' : state === 'consultant' ? '#f0fdf4' : '#ffffff',
          border: state === 'ai' ? '2px solid #2563eb' : state === 'consultant' ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
          padding: 0,
          margin: '0 auto',
          boxShadow: state !== 'off' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'
        }}
        className={
          state === 'ai'
            ? 'hover:bg-blue-100 hover:border-blue-700 hover:scale-110 active:scale-95'
            : state === 'consultant'
            ? 'hover:bg-green-100 hover:border-green-700 hover:scale-110 active:scale-95'
            : 'hover:border-blue-400 hover:bg-slate-50 hover:scale-105 active:scale-95'
        }
      >
        {state === 'ai' && (
          <Check style={{ width: '0.95rem', height: '0.95rem', color: '#2563eb', strokeWidth: 3 }} />
        )}
        {state === 'consultant' && (
          <Check style={{ width: '0.95rem', height: '0.95rem', color: '#16a34a', strokeWidth: 3 }} />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={resetSelection}>
            <div className="bg-blue-600 p-2 rounded-lg shadow-md shadow-blue-100">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">
              2022 개정교육과정 <span className="text-blue-600">선택과목 가이드</span>
            </h1>
            <h1 className="font-bold text-xl tracking-tight sm:hidden">
              개정과목 가이드
            </h1>
          </div>
          
          <div className="flex-1 max-w-md flex items-center gap-2">
            {(selectedField || selectedMajor) && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="학과명을 검색하세요 (예: 의예과, 경영...)"
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-2 border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.trim()) {
                      setSelectedMajor(null);
                    }
                  }}
                />
              </div>
            )}
            
            {hasDefaultCurriculum && (
              <button
                onClick={() => {
                  if (confirm('기본 교육과정 설정을 해제하시겠습니까?\n해제 후 초기화하면 원래 성신 교육과정으로 돌아갑니다.')) {
                    clearDefaultCurriculum();
                    setHasDefaultCurriculum(false);
                  }
                }}
                title="클릭하여 기본 교육과정 설정 해제"
                className="hidden md:flex items-center gap-1 px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-200 shrink-0 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">기본 설정됨</span>
              </button>
            )}

            <button 
              onClick={() => { setTempSchoolName(schoolName); setShowCustomForm(true); }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">교육과정 입력</span>
            </button>

            <div className="relative shrink-0">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePdfUpload}
                accept=".pdf"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsingPdf}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
              >
                {isParsingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <FileUp className="w-4 h-4 shrink-0" />
                )}
                <span className="hidden sm:inline whitespace-nowrap">PDF로 불러오기</span>
              </button>
            </div>
            
            {isCustomMode && (
              <button 
                onClick={() => {
                  const saved = loadDefaultCurriculum();
                  if (saved) {
                    // 기본 교육과정이 지정되어 있다면 초기화 시 그 교육과정으로 되돌아간다.
                    setCustomMandatory(saved.mandatory);
                    setCustomGroups(saved.groups);
                    setIsCustomMode(true);
                    const restoredName = saved.schoolName || '숭신고등학교';
                    setSchoolName(restoredName);
                    setTempSchoolName(restoredName);
                  } else {
                    setIsCustomMode(false);
                    setCustomGroups([]);
                    setCustomMandatory({});
                    setSchoolName('숭신고등학교');
                    setTempSchoolName('숭신고등학교');
                  }
                }}
                title={hasDefaultCurriculum ? '기본 교육과정으로 초기화합니다' : '입력한 교육과정을 초기화합니다'}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">초기화</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        {!selectedMajor ? (
          <div className="space-y-8">
            {/* Hero Section */}
            {!selectedField && (
              <section className="text-center pt-2 pb-6 space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 text-blue-700 rounded-full text-xs font-bold tracking-tight shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>2022 개정 교육과정 · 고교학점제 선택과목 가이드</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  진로·진학 <span className="text-blue-600">맞춤형 과목 설계</span>
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  희망 진학 학과를 검색하거나 8개 학문 분야를 탐색해보세요.<br className="hidden sm:inline" />
                  대학별 권장과목과 3개년 맞춤형 수강 계획표를 한눈에 확인할 수 있습니다.
                </p>

                {/* Hero Central Search Box */}
                <div className="pt-2 max-w-xl mx-auto">
                  <div className="relative flex items-center shadow-md shadow-blue-900/5 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                    <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                    <input
                      type="text"
                      placeholder="학과명을 검색하세요 (예: 의예과, 경영학과, 컴퓨터공학과...)"
                      className="w-full px-3 py-3.5 text-slate-800 placeholder-slate-400 text-sm sm:text-base bg-transparent outline-none rounded-2xl font-medium"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (e.target.value.trim()) {
                          setSelectedMajor(null);
                        }
                      }}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="p-2 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                        title="검색어 지우기"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Popular Majors Quick Tag Cloud */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center mt-3 text-xs">
                    <span className="text-slate-400 font-semibold mr-1">추천 학과:</span>
                    {POPULAR_MAJORS.map((majorName) => (
                      <button
                        key={majorName}
                        type="button"
                        onClick={() => handlePopularMajorClick(majorName)}
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg font-medium transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {majorName}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Dynamic Content Views */}
            <AnimatePresence mode="wait">
              {searchTerm.trim() ? (
                /* Global Search Results View */
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[400px]"
                >
                  <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-2">
                      <Search className="text-blue-600 w-5 h-5" />
                      <h3 className="text-xl font-bold text-slate-900">
                        검색 결과 <span className="text-blue-600 font-extrabold">"{searchTerm}"</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                        {searchResults.length}개 학과 발견
                      </span>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        검색 초기화
                      </button>
                    </div>
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((major) => {
                        const meta = getFieldMeta(major.fieldName);
                        const IconComponent = meta.icon;
                        return (
                          <button
                            key={`${major.fieldName}-${major.name}`}
                            onClick={() => handleMajorSelect(major)}
                            className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/50 hover:border-blue-400 transition-all hover:shadow-md group flex flex-col justify-between cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span 
                                  style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }} 
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  <IconComponent className="w-3 h-3" />
                                  {major.fieldName}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  권장 {major.recommendedSubjects.length}과목
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                                {major.name}
                              </div>
                              {major.recommendedSubjects && major.recommendedSubjects.length > 0 && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                  권장: {major.recommendedSubjects.slice(0, 4).join(', ')} 등
                                </p>
                              )}
                            </div>
                            <div className="text-xs font-bold text-blue-600 mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                              <span>과목 설계 및 계획표 보기</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4 text-center">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-700">검색 결과가 없습니다.</p>
                        <p className="text-xs text-slate-500 mt-1">입력하신 "{searchTerm}"에 해당하는 학과가 없습니다. 다른 검색어를 입력해보세요.</p>
                      </div>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                      >
                        전체 분야 둘러보기
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : selectedField ? (
                /* Field-specific Majors View */
                <motion.div
                  key={selectedField.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Field Navigation & Switcher */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedField(null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>전체 8개 분야 보기</span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <span className="font-extrabold text-slate-900 text-base">{selectedField.name}</span>
                      </div>
                      <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                        총 {selectedField.majors.length}개 학과 수록
                      </span>
                    </div>

                    {/* Quick Field Switcher Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {FIELD_DATA.map((field) => {
                        const meta = getFieldMeta(field.name);
                        const IconComponent = meta.icon;
                        const isCurrent = selectedField.name === field.name;
                        return (
                          <button
                            key={field.name}
                            onClick={() => handleFieldSelect(field)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{field.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field Header Banner & In-field Search */}
                  {(() => {
                    const meta = getFieldMeta(selectedField.name);
                    const IconComponent = meta.icon;
                    return (
                      <div 
                        style={{ backgroundColor: meta.bgLight, borderColor: meta.borderLight }}
                        className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-start sm:items-center gap-3.5">
                          <div 
                            style={{ backgroundColor: '#ffffff', color: meta.accentColor, borderColor: meta.borderLight }}
                            className="p-3 rounded-xl border shadow-xs shrink-0"
                          >
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                              {selectedField.name}
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                                {filteredFieldMajors.length}개 학과
                              </span>
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                              {meta.description}
                            </p>
                          </div>
                        </div>

                        {/* In-field Search Bar */}
                        <div className="relative min-w-[240px] shrink-0">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={`${selectedField.name} 내 검색...`}
                            value={fieldSearchTerm}
                            onChange={(e) => setFieldSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                          />
                          {fieldSearchTerm && (
                            <button
                              onClick={() => setFieldSearchTerm('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Majors Grid */}
                  {filteredFieldMajors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredFieldMajors.map((major) => (
                        <button
                          key={major.name}
                          onClick={() => handleMajorSelect(major)}
                          className="text-left p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                                권장 {major.recommendedSubjects.length}과목
                              </span>
                              {major.universityTips && major.universityTips.length > 0 && (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  대학별 팁
                                </span>
                              )}
                            </div>
                            <div className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {major.name}
                            </div>
                            {major.recommendedSubjects && major.recommendedSubjects.length > 0 && (
                              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                권장: {major.recommendedSubjects.slice(0, 4).join(', ')} 등
                              </p>
                            )}
                          </div>
                          <div className="text-xs font-bold text-blue-600 mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span>과목 설계 및 계획표 보기</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                      <Search className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-700">검색 조건에 맞는 학과가 없습니다.</p>
                      <button
                        onClick={() => setFieldSearchTerm('')}
                        className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        검색어 초기화
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* 8 Field Bento Cards Overview (when no search & no field selected) */
                <div className="space-y-6">
                  {/* Category Section Header */}
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-blue-600" />
                        <span>학문 분야별 탐색</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        희망하시는 분야를 선택하면 세부 전공 학과와 맞춤 과목 설계 화면으로 이동합니다.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                      8개 분야 · 총 {allMajors.length}개 학과 수록
                    </span>
                  </div>

                  {/* 8 Field Bento Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {FIELD_DATA.map((field) => {
                      const meta = getFieldMeta(field.name);
                      const IconComponent = meta.icon;
                      return (
                        <div
                          key={field.name}
                          onClick={() => handleFieldSelect(field)}
                          className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg rounded-2xl p-5 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div 
                                style={{ backgroundColor: meta.bgLight, color: meta.accentColor, borderColor: meta.borderLight }}
                                className="p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110"
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span 
                                style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                              >
                                {field.majors.length}개 학과
                              </span>
                            </div>

                            <h4 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                              {field.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                              {meta.description}
                            </p>

                            {/* Preview tags */}
                            <div className="flex flex-wrap gap-1 mt-3">
                              {meta.previewMajors.map((pMajor) => (
                                <span 
                                  key={pMajor} 
                                  className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                                >
                                  {pMajor}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                            <span>학과 둘러보기</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Curriculum Guidance Information Strip */}
                  <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 border border-slate-200/80 rounded-2xl p-5 mt-8 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-blue-600 shrink-0" />
                      <h4 className="font-bold text-slate-900 text-sm">2022 개정 교육과정 선택과목 설계 핵심 가이드</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-white/90 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                        <span className="font-bold text-blue-700 block mb-1">1. 과목 체계의 위계성</span>
                        <p className="text-slate-600 leading-relaxed">
                          공통과목(1학년) 이수 후 일반선택과 진로선택(심화)을 학기별로 균형 있게 배치하여 전공 적합성을 확보합니다.
                        </p>
                      </div>
                      <div className="bg-white/90 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                        <span className="font-bold text-emerald-700 block mb-1">2. 2028 대입 및 성취평가</span>
                        <p className="text-slate-600 leading-relaxed">
                          수능 출제 과목과 사회·과학 융합선택(A~E 절대평가, 석차등급 미기재) 등 평가 특성을 고려해 설계합니다.
                        </p>
                      </div>
                      <div className="bg-white/90 p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                        <span className="font-bold text-purple-700 block mb-1">3. 주요 대학 권장과목 연계</span>
                        <p className="text-slate-600 leading-relaxed">
                          서울대, 연세대, 고려대 등 주요 대학에서 제시한 학과별 핵심 권장과목을 충실히 이수할 수 있도록 돕습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Subject Display Section */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Breadcrumbs & Back Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 print:hidden">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <button onClick={resetSelection} className="hover:text-blue-600 transition-colors">홈</button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => setSelectedMajor(null)} className="hover:text-blue-600 transition-colors">{selectedField?.name}</button>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-blue-600">{selectedMajor.name}</span>
              </div>
              
              <button 
                onClick={() => setSelectedMajor(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
              >
                다른 학과 찾아 보기
              </button>
            </div>

            {/* Major Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative overflow-hidden print:hidden">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold tracking-tight">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>2022 개정 권장 선택과목 맞춤 안내</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    {selectedMajor.name}
                  </h2>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xl">
                    {selectedMajor.name} 진학을 희망하는 학생을 위한 수강신청 계획서와 대학별 전공연계 권장과목입니다.
                  </p>
                </div>
                
                {/* View Toggle Tabs */}
                <div className="flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 self-start lg:self-center shadow-inner gap-1 shrink-0">
                  <button 
                    onClick={() => setViewMode('plan')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      viewMode === 'plan' 
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>수강신청 계획서</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('subject')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      viewMode === 'subject' 
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>교과군별</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('group')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      viewMode === 'group' 
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>선택그룹</span>
                  </button>
                </div>
              </div>
            </div>

            {/* University Specific Tips Section */}
            {(() => {
              const renderTipSubjectBadges = (rawText: string, type: 'core' | 'recommended') => {
                if (!rawText || rawText === '-' || rawText.trim() === '') {
                  return <span className="text-slate-300 font-medium text-xs">-</span>;
                }

                const isDescriptive = rawText.includes('적극 이수') || 
                                      rawText.includes('자신의 진로') || 
                                      rawText.includes('제시하지 않은') ||
                                      rawText.includes('선택 이수');

                if (isDescriptive) {
                  return (
                    <span className={`text-xs leading-relaxed px-2.5 py-1.5 rounded-lg inline-block ${
                      type === 'core' 
                        ? 'bg-blue-50 text-blue-900 border border-blue-200' 
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {rawText}
                    </span>
                  );
                }

                // Split by comma, slash or bullet
                const parts = rawText.split(/[,/]/).map(s => s.trim()).filter(Boolean);

                return (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {parts.map((part, pIdx) => {
                      const cleanPart = part.replace(/\([^)]*\)/g, '').trim();
                      const isKnownSubject = !!SUBJECT_TYPES[cleanPart] || !!SUBJECT_TYPES[part];
                      const isCore = type === 'core';

                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            if (isKnownSubject) {
                              handleOpenSubjectModal(cleanPart || part);
                            }
                          }}
                          title={isKnownSubject ? `${cleanPart || part} 과목 상세안내 팝업 보기` : part}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all text-left inline-flex items-center gap-1 shadow-xs ${
                            isCore
                              ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                          } ${isKnownSubject ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                        >
                          <span>{part}</span>
                          {isKnownSubject && (
                            <Info className={`w-3 h-3 ${isCore ? 'text-blue-200' : 'text-emerald-600'} opacity-80 shrink-0`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              };

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6"
                >
                  {/* Top Banner Header */}
                  <div className="bg-slate-900 px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <GraduationCap className="text-blue-400 w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-base">2028학년도 대학별 권장과목 가이드</h3>
                          <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                            {universityTips.length}개 모집단위
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">
                          주요 대학별 입학전형 핵심 권장과목 및 일반 권장과목 가이드라인입니다. 과목 클릭 시 상세 정보를 확인할 수 있습니다.
                        </p>
                      </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      {/* View Mode Toggle */}
                      <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700 text-xs shrink-0">
                        <button
                          type="button"
                          onClick={() => setUnivViewMode('major')}
                          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 whitespace-nowrap ${
                            univViewMode === 'major' 
                              ? 'bg-blue-600 text-white font-bold shadow-xs' 
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <span className="whitespace-nowrap">학과 맞춤</span>
                          <span className="text-[11px] opacity-85 font-normal whitespace-nowrap">({selectedMajor?.name || '전공'})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnivViewMode('all')}
                          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 whitespace-nowrap ${
                            univViewMode === 'all' 
                              ? 'bg-blue-600 text-white font-bold shadow-xs' 
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <span className="whitespace-nowrap">전체 대학</span>
                          <span className="text-[11px] opacity-85 font-normal whitespace-nowrap">(591개)</span>
                        </button>
                      </div>

                      {/* Region Select */}
                      <select
                        value={univRegionFilter}
                        onChange={(e) => setUnivRegionFilter(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      >
                        <option value="전체">지역 전체</option>
                        <option value="서울">서울</option>
                        <option value="경기">경기</option>
                        <option value="인천">인천</option>
                      </select>

                      {/* Search Input */}
                      <div className="relative group min-w-[180px] sm:min-w-[210px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                          type="text"
                          placeholder="대학, 학과, 과목 검색..."
                          value={univSearchTerm}
                          onChange={(e) => setUnivSearchTerm(e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-8 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                        />
                        {univSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setUnivSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                        <tr>
                          <th className="px-5 py-3.5 whitespace-nowrap text-xs">지역</th>
                          <th className="px-5 py-3.5 whitespace-nowrap text-xs">대학교</th>
                          <th className="px-5 py-3.5 whitespace-nowrap text-xs">모집단위 (세부학과)</th>
                          <th className="px-5 py-3.5 text-xs w-[38%]">핵심과목 (필수 권장)</th>
                          <th className="px-5 py-3.5 text-xs w-[38%]">권장과목 (가급적 권장)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {universityTips.map((tip, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5 align-top">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                {tip.location || tip.region}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 align-top font-bold text-slate-900 whitespace-nowrap">
                              {tip.university}
                            </td>
                            <td className="px-5 py-3.5 align-top">
                              <span className="font-semibold text-slate-800 text-xs">
                                {tip.major}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 align-top">
                              {renderTipSubjectBadges(tip.core, 'core')}
                            </td>
                            <td className="px-5 py-3.5 align-top">
                              <div className="space-y-2">
                                {renderTipSubjectBadges(tip.recommended, 'recommended')}
                                {tip.note && tip.note !== '-' && (
                                  <div className="text-[11px] text-slate-600 bg-amber-50/70 border border-amber-200/70 rounded-lg p-2 leading-relaxed whitespace-pre-line">
                                    <span className="font-bold text-amber-900 block mb-0.5">※ 안내사항</span>
                                    {tip.note}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Empty state */}
                  {universityTips.length === 0 && (
                    <div className="p-10 text-center bg-slate-50/70 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100 shadow-2xs">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 text-base mb-1.5">
                        {univViewMode === 'major' && selectedMajor
                          ? `선택하신 [${selectedMajor.name}]는 대학별 별도 지정 권장과목이 없습니다.`
                          : '일치하는 대학별 권장과목이 없습니다.'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                        {univViewMode === 'major' && selectedMajor
                          ? `해당 학과는 수도권 주요 대학에서 필수/핵심 권장과목을 별도로 지정하지 않은 학과입니다. 연관성이 낮은 타 학과 과목을 무리하게 추천하지 않으니, 상단의 [2022 개정 교육과정 선택과목 가이드]를 참고하여 균형 있게 설계해보세요.`
                          : '검색어 또는 지역 필터를 변경하시거나 초기화해보세요.'}
                      </p>
                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        {univViewMode === 'major' && (
                          <button
                            type="button"
                            onClick={() => {
                              setUnivViewMode('all');
                              setUnivSearchTerm('');
                              setUnivRegionFilter('전체');
                            }}
                            className="text-xs px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
                          >
                            전체 591개 대학 권장과목 목록 보기
                          </button>
                        )}
                        {(univSearchTerm || univRegionFilter !== '전체') && (
                          <button
                            type="button"
                            onClick={() => {
                              setUnivSearchTerm('');
                              setUnivRegionFilter('전체');
                            }}
                            className="text-xs px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                          >
                            검색 필터 초기화
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* Subjects Grid by Area or Group or Plan */}
            <div className="grid grid-cols-1 gap-6">
              {viewMode === 'subject' ? (
                Object.entries(subjectsByArea || {}).map(([area, subjects]) => {
                  const subjectList = subjects as string[];
                  return (
                    <motion.div 
                      key={area}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                          {area} 교과군
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">{subjectList.length}개 과목</span>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {subjectList.map((subject) => {
                            const type = (SUBJECT_TYPES[subject] || '일반') as SelectionType;
                            const evalInfo = getSubjectEval(subject, area, type);
                            const typeColors: Record<string, string> = {
                              '일반': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                              '진로': 'bg-blue-50 text-blue-700 border-blue-100',
                              '융합': 'bg-purple-50 text-purple-700 border-purple-100',
                              '전문': 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            };

                            return (
                              <div 
                                key={subject}
                                className="p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md inline-block">
                                    {subject}
                                  </div>
                                  {evalInfo.isCsat && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                                      수능 출제
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${typeColors[type] || typeColors['일반']}`}>
                                      {type} 선택
                                    </span>
                                    <span 
                                      className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                      style={{
                                        backgroundColor: evalInfo.badgeBg,
                                        color: evalInfo.badgeText,
                                        border: `1px solid ${evalInfo.badgeBorder}`
                                      }}
                                    >
                                      {evalInfo.displayTitle}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => handleOpenSubjectModal(subject)}
                                    title={`${subject} 과목 상세 안내 보기`}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-all"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : viewMode === 'group' ? (
                (isCustomMode ? customGroups : SUNGSHIN_GROUPS).map((group) => {
                  const recommendedInGroup = group.subjects.filter(s => selectedMajor.recommendedSubjects.includes(s.name));
                  
                  return (
                    <motion.div 
                      key={group.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${recommendedInGroup.length > 0 ? 'border-blue-200 ring-1 ring-blue-50' : 'border-slate-200 opacity-80'}`}
                    >
                      <div className={`px-6 py-4 border-b flex items-center justify-between ${recommendedInGroup.length > 0 ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-fit px-3 h-10 rounded-xl flex items-center justify-center font-bold whitespace-nowrap ${recommendedInGroup.length > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {group.id.startsWith('pdf-group') ? '선택과목' : group.id}
                          </div>
                          <div>
                            <h4 className={`font-bold ${recommendedInGroup.length > 0 ? 'text-blue-900' : 'text-slate-700'}`}>
                              {group.description}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{group.semester}</p>
                          </div>
                        </div>
                        {recommendedInGroup.length > 0 && (
                          <div className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse">
                            추천 과목 있음
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.subjects.map((subject) => {
                            const isRecommended = selectedMajor.recommendedSubjects.includes(subject.name);
                            const type = (SUBJECT_TYPES[subject.name] || '일반') as SelectionType;
                            const evalInfo = getSubjectEval(subject.name, undefined, type);
                            
                            return (
                              <div 
                                key={subject.name}
                                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                                  isRecommended 
                                    ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02] z-10' 
                                    : 'border-slate-100 bg-white opacity-70 hover:opacity-100'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenSubjectModal(subject.name)}
                                      title={`${subject.name} 과목 상세 안내 보기`}
                                      className={`font-bold px-2 py-1 rounded-md inline-flex items-center gap-1 cursor-pointer hover:underline text-left transition-all ${
                                        isRecommended ? 'text-blue-700 bg-white shadow-2xs' : 'text-slate-700 bg-slate-100 hover:text-blue-600'
                                      }`}
                                    >
                                      <span>{subject.name}</span>
                                      <Info className="w-3 h-3 opacity-60 shrink-0" />
                                    </button>
                                    {evalInfo.isCsat && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap">
                                        수능
                                      </span>
                                    )}
                                  </div>
                                  {isRecommended && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                                </div>
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                      type === '일반'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : type === '진로'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : type === '융합'
                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                        : type === '공통'
                                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    }`}>
                                      {type} 선택
                                    </span>
                                    <span 
                                      className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                      style={{
                                        backgroundColor: evalInfo.badgeBg,
                                        color: evalInfo.badgeText,
                                        border: `1px solid ${evalInfo.badgeBorder}`
                                      }}
                                    >
                                      {evalInfo.displayTitle}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-slate-400 font-bold">
                                      {subject.semesters.join(', ')}학기
                                    </span>
                                    <button 
                                      type="button"
                                      onClick={() => handleOpenSubjectModal(subject.name)}
                                      title={`${subject.name} 과목 상세 안내`}
                                      className="text-slate-400 hover:text-blue-600 p-0.5 rounded hover:bg-blue-50 transition-colors"
                                    >
                                      <Info className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                /* Course Registration Plan View (Table Format) */
                <div className="space-y-4">
                  {/* Action Buttons - Outside the print ref */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden relative z-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">수강 신청 계획서</h3>
                        <p className="text-xs text-slate-400">{selectedMajor.name} 전공 권장</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {errorMsg && (
                        <div className="text-xs text-red-500 mr-4 font-medium animate-bounce max-w-[200px]">
                          {errorMsg}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {hasConsultantChanges && (
                          <button
                            type="button"
                            onClick={handleResetConsultantChecks}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                            title="컨설턴트가 수정한 체크 내역을 초기화하고 AI 추천 상태로 복원합니다."
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            상담 체크 초기화
                          </button>
                        )}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                          <button 
                            onClick={() => setPlanGrade(2)}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${planGrade === 2 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            2학년
                          </button>
                          <button 
                            onClick={() => setPlanGrade(3)}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${planGrade === 3 ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            3학년
                          </button>
                        </div>
                        
                        <button 
                          onClick={handleDownloadPDF}
                          disabled={isDownloading}
                          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                            isDownloading 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          }`}
                        >
                          {isDownloading ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          {isDownloading ? '생성 중...' : 'PDF 다운로드'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    ref={printRef}
                    id="printable-plan"
                    className="bg-white print-area print:shadow-none print:border-none print:rounded-none rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden"
                    style={{ 
                      backgroundColor: '#ffffff', 
                      width: '100%', 
                      height: 'auto', 
                      overflow: 'visible', 
                      position: 'relative',
                      padding: '0',
                      margin: '0'
                    }}
                  >
                    <div style={{ 
                      borderBottom: '1px solid #1e293b', 
                      padding: '1.1rem 1.4rem', 
                      display: 'flex', 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      gap: '0.5rem', 
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' 
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '0.4rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText style={{ color: '#ffffff', width: '1.2rem', height: '1.2rem' }} />
                          </div>
                          <div>
                            <h3 style={{ color: '#ffffff', fontWeight: '800', fontSize: '1.15rem', margin: 0, letterSpacing: '-0.02em' }}>
                              {planGrade}학년 수강 신청 계획서
                            </h3>
                            <div style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: '500', marginTop: '0.15rem' }}>
                              2022 개정 교육과정 기준 학기별 과목 이수 설계
                            </div>
                          </div>
                        </div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '0.8rem', 
                          fontWeight: '700',
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {schoolName} | {selectedMajor.name} 전공 권장
                        </div>
                      </div>

                      {/* Grading & CSAT Legend */}
                      <div style={{ 
                        borderBottom: '1px solid #e2e8f0', 
                        padding: '1rem 1.4rem', 
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        fontSize: '0.78rem'
                      }}>
                        {/* Subject Classification Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', color: '#1e293b' }}>[과목 구분]</span>
                          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.74rem' }}>
                            공통 과목
                          </span>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.74rem' }}>
                            일반 선택
                          </span>
                          <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.74rem' }}>
                            진로 선택
                          </span>
                          <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #d8b4fe', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.74rem' }}>
                            융합 선택
                          </span>
                          <span style={{ backgroundColor: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontWeight: '700', fontSize: '0.74rem' }}>
                            전문 선택
                          </span>
                        </div>

                        {/* Grade Evaluation Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', color: '#1e293b' }}>[성적처리 & 수능 범례]</span>
                          <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fdba74', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 수능 출제 / 5등급
                          </span>
                          <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 보통교과 5등급 (성취도 5단계)
                          </span>
                          <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 사회·과학 융합선택 (성취도 5단계·등급미기재)
                          </span>
                          <span style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 체육·예술 (성취도 3단계)
                          </span>
                          <span style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 교양 (P/F)
                          </span>
                          <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', border: '1px solid #c7d2fe', padding: '0.12rem 0.45rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.72rem' }}>
                            ■ 전문교과 (5등급)
                          </span>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.45rem', 
                          color: '#1d4ed8', 
                          fontWeight: '700', 
                          fontSize: '0.76rem',
                          backgroundColor: '#eff6ff',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #bfdbfe'
                        }}>
                          <Info style={{ width: '0.85rem', height: '0.85rem', flexShrink: 0 }} />
                          <span>안내: 계획서 표에서 <strong>과목명을 클릭</strong>하면 2022 개정 교육과정 기준 과목 소개, 평가방식, 관련 학과 및 진로 안내 팝업이 열립니다.</span>
                        </div>
                      </div>
                      
                      <div style={{ width: '100%', overflow: 'visible', position: 'relative', padding: '1.2rem' }}>
                        <table style={{ width: '100%', fontSize: '0.82rem', textAlign: 'center', borderCollapse: 'collapse', border: '1.5px solid #cbd5e1', tableLayout: 'fixed' }}>
                          <thead style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #cbd5e1' }}>
                            <tr>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '5.2rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>선택 방법</th>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '5.6rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>교과군</th>
                              <th style={{ padding: '0.75rem 0.8rem', borderRight: '1px solid #cbd5e1', textAlign: 'left', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.45rem' }}>
                                  <span>과목명</span>
                                  <span style={{ 
                                    fontSize: '0.68rem', 
                                    fontWeight: '700', 
                                    backgroundColor: '#eff6ff', 
                                    color: '#1d4ed8', 
                                    border: '1px solid #bfdbfe', 
                                    padding: '0.12rem 0.45rem', 
                                    borderRadius: '9999px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.2rem'
                                  }}>
                                    <Info style={{ width: '0.65rem', height: '0.65rem' }} />
                                    클릭 시 상세안내
                                  </span>
                                </div>
                              </th>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '5.6rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>과목 구분</th>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '3.6rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>1학기</th>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '3.6rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>2학기</th>
                              <th style={{ padding: '0.75rem 0.4rem', borderRight: '1px solid #cbd5e1', width: '8.5rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>성적처리 유형</th>
                              <th style={{ padding: '0.75rem 0.4rem', width: '4.8rem', textAlign: 'center', backgroundColor: '#f1f5f9', fontSize: '0.8rem', letterSpacing: '-0.01em' }}>비고</th>
                            </tr>
                          </thead>
                          <tbody style={{ borderTop: '1px solid #cbd5e1' }}>
                            {/* Mandatory Subjects */}
                            {((isCustomMode ? customMandatory[planGrade] : MANDATORY_SUBJECTS[planGrade]) || []).map((subject, idx) => {
                              const normalizedName = normalizeSubjectName(subject.name);
                              const area = Object.keys(SUBJECT_AREAS).find(a => 
                                SUBJECT_AREAS[a].some(s => normalizeSubjectName(s) === normalizedName)
                              ) || '공통';
                              const typeKey = Object.keys(SUBJECT_TYPES).find(k => normalizeSubjectName(k) === normalizedName);
                              const type = (typeKey ? SUBJECT_TYPES[typeKey] : '일반') as SelectionType;
                              const evalInfo = getSubjectEval(subject.name, area, type);
                              return (
                                <tr key={`mandatory-${planGrade}-${subject.name}`} style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                  {idx === 0 && (
                                    <td rowSpan={((isCustomMode ? customMandatory[planGrade] : MANDATORY_SUBJECTS[planGrade]) || []).length} style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', fontWeight: '900', color: '#1e3a8a', textAlign: 'center', letterSpacing: '0.05em', fontSize: '0.82rem', backgroundColor: '#f1f5f9' }}>필수</td>
                                  )}
                                  <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', color: '#1e293b', textAlign: 'center', fontWeight: '700', fontSize: '0.82rem' }}>{area}</td>
                                  <td style={{ padding: '0.65rem 0.8rem', borderRight: '1px solid #cbd5e1', textAlign: 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenSubjectModal(subject.name)}
                                        title={`${subject.name} 과목 상세 안내 팝업 보기`}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          padding: '0.1rem 0',
                                          margin: 0,
                                          font: 'inherit',
                                          color: '#0f172a',
                                          cursor: 'pointer',
                                          textAlign: 'left',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.45rem',
                                          fontWeight: '700',
                                          fontSize: '0.94rem',
                                          textDecoration: 'none'
                                        }}
                                        className="hover:text-blue-700 transition-colors group"
                                      >
                                        <span style={{ textDecoration: 'none' }}>
                                          {subject.name}
                                        </span>
                                        <Info style={{ width: '0.82rem', height: '0.82rem', color: '#2563eb', opacity: 0.85, flexShrink: 0 }} />
                                        {evalInfo.isCsat && (
                                          <span style={{ 
                                            fontSize: '0.68rem', 
                                            backgroundColor: '#ffedd5', 
                                            color: '#c2410c', 
                                            border: '1px solid #fdba74', 
                                            borderRadius: '4px', 
                                            padding: '0.1rem 0.35rem', 
                                            fontWeight: '700' 
                                          }}>
                                            수능
                                          </span>
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                    {(() => {
                                      const typeStyle = getSubjectTypeBadgeStyle(type);
                                      return (
                                        <span style={{ 
                                          fontSize: '0.74rem', 
                                          padding: '0.18rem 0.55rem', 
                                          borderRadius: '9999px', 
                                          fontWeight: '700',
                                          backgroundColor: typeStyle.bg,
                                          color: typeStyle.text,
                                          border: `1px solid ${typeStyle.border}`,
                                          display: 'inline-block',
                                          whiteSpace: 'nowrap',
                                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                                        }}>
                                          {typeStyle.label}
                                        </span>
                                      );
                                    })()}
                                  </td>
                                  <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                    {subject.semesters.includes(1) && renderSemesterCheckbox(planGrade, 'mandatory', subject.name, 1, true)}
                                  </td>
                                  <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                    {subject.semesters.includes(2) && renderSemesterCheckbox(planGrade, 'mandatory', subject.name, 2, true)}
                                  </td>
                                  <td style={{ padding: '0.55rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                    <span style={{ 
                                      fontSize: '0.74rem', 
                                      padding: '0.16rem 0.45rem', 
                                      borderRadius: '5px', 
                                      fontWeight: '700',
                                      backgroundColor: evalInfo.badgeBg,
                                      color: evalInfo.badgeText,
                                      border: `1px solid ${evalInfo.badgeBorder}`,
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block'
                                    }}>
                                      {evalInfo.displayTitle}
                                    </span>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.4rem', textAlign: 'center' }}></td>
                                </tr>
                              );
                            })}

                            {/* Selection Groups */}
                            {planData.map((group) => (
                              <Fragment key={group.id}>
                                {group.groupedSubjects.map((areaGroup, aIdx) => (
                                  areaGroup.subjects.map((subject, sIdx) => {
                                    const isLastInGroup = aIdx === group.groupedSubjects.length - 1 && sIdx === areaGroup.subjects.length - 1;
                                    const sem1State = subject.semesters.includes(1) 
                                      ? getCellCheckState(planGrade, group.id, subject.name, 1, subject.isRecommended) 
                                      : 'off';
                                    const sem2State = subject.semesters.includes(2) 
                                      ? getCellCheckState(planGrade, group.id, subject.name, 2, subject.isRecommended) 
                                      : 'off';

                                    const isRowConsultant = sem1State === 'consultant' || sem2State === 'consultant';
                                    const isRowAi = !isRowConsultant && (sem1State === 'ai' || sem2State === 'ai');
                                    const isRowChecked = isRowConsultant || isRowAi;

                                    const rowBgColor = isRowConsultant 
                                      ? '#f0fdf4' 
                                      : isRowAi 
                                      ? '#f0f7ff' 
                                      : '#ffffff';

                                    return (
                                      <tr key={`${group.id}-${subject.name}`} style={{ 
                                        backgroundColor: rowBgColor,
                                        borderBottom: isLastInGroup ? '2px solid #94a3b8' : '1px solid #e2e8f0',
                                        borderTop: (aIdx === 0 && sIdx === 0) ? '2px solid #94a3b8' : 'none',
                                        transition: 'background-color 0.2s ease'
                                      }}>
                                        {aIdx === 0 && sIdx === 0 && (
                                          <td rowSpan={group.subjects.length} style={{ 
                                            padding: '0.65rem 0.4rem', 
                                            borderRight: '1px solid #cbd5e1', 
                                            fontWeight: 'bold', 
                                            color: '#0f172a', 
                                            textAlign: 'center', 
                                            backgroundColor: '#ffffff',
                                            verticalAlign: 'middle'
                                          }}>
                                            <div style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: '800', lineHeight: '1.4' }}>
                                              {group.id.startsWith('pdf-group') ? '선택과목' : group.id}<br/>
                                              <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '0.78rem' }}>[택{group.selectCount}]</span><br/>
                                              <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: '500' }}>({group.credits || 4}학점)</span>
                                            </div>
                                          </td>
                                        )}
                                        {sIdx === 0 && (
                                          <td rowSpan={areaGroup.subjects.length} style={{ 
                                            padding: '0.65rem 0.4rem', 
                                            borderRight: '1px solid #cbd5e1', 
                                            color: '#1e293b', 
                                            fontWeight: '700', 
                                            fontSize: '0.82rem',
                                            backgroundColor: '#ffffff',
                                            textAlign: 'center',
                                            verticalAlign: 'middle'
                                          }}>
                                            {areaGroup.area}
                                          </td>
                                        )}
                                        <td style={{ 
                                          padding: '0.65rem 0.8rem', 
                                          borderRight: '1px solid #cbd5e1', 
                                          color: '#0f172a',
                                          textAlign: 'left'
                                        }}>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <button
                                              type="button"
                                              onClick={() => handleOpenSubjectModal(subject.name)}
                                              title={`${subject.name} 과목 상세 안내 팝업 보기`}
                                              style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '0.1rem 0',
                                                margin: 0,
                                                font: 'inherit',
                                                color: isRowConsultant ? '#15803d' : isRowAi ? '#1d4ed8' : '#0f172a',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                fontWeight: isRowChecked ? '800' : '700',
                                                fontSize: '0.94rem',
                                                textDecoration: 'none'
                                              }}
                                              className="hover:text-blue-700 transition-colors group"
                                            >
                                              <span style={{ textDecoration: 'none' }}>
                                                {subject.name}
                                              </span>
                                              <Info style={{ 
                                                width: '0.82rem', 
                                                height: '0.82rem', 
                                                color: isRowConsultant ? '#16a34a' : isRowAi ? '#2563eb' : '#94a3b8', 
                                                opacity: 0.85,
                                                flexShrink: 0
                                              }} />
                                              {subject.evalInfo?.isCsat && (
                                                <span style={{ 
                                                  fontSize: '0.68rem', 
                                                  backgroundColor: '#ffedd5', 
                                                  color: '#c2410c', 
                                                  border: '1px solid #fdba74', 
                                                  borderRadius: '4px', 
                                                  padding: '0.1rem 0.35rem', 
                                                  fontWeight: '700' 
                                                }}>
                                                  수능
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        </td>
                                      <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                        {(() => {
                                          const typeStyle = getSubjectTypeBadgeStyle(subject.type);
                                          return (
                                            <span style={{ 
                                              fontSize: '0.74rem', 
                                              padding: '0.18rem 0.55rem', 
                                              borderRadius: '9999px', 
                                              fontWeight: '700',
                                              backgroundColor: typeStyle.bg,
                                              color: typeStyle.text,
                                              border: `1px solid ${typeStyle.border}`,
                                              display: 'inline-block',
                                              whiteSpace: 'nowrap',
                                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
                                            }}>
                                              {typeStyle.label}
                                            </span>
                                          );
                                        })()}
                                      </td>
                                      <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                        {subject.semesters.includes(1) && renderSemesterCheckbox(planGrade, group.id, subject.name, 1, subject.isRecommended)}
                                      </td>
                                      <td style={{ padding: '0.65rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                        {subject.semesters.includes(2) && renderSemesterCheckbox(planGrade, group.id, subject.name, 2, subject.isRecommended)}
                                      </td>
                                      <td style={{ padding: '0.55rem 0.4rem', borderRight: '1px solid #cbd5e1', textAlign: 'center' }}>
                                        <span style={{ 
                                          fontSize: '0.74rem', 
                                          padding: '0.16rem 0.45rem', 
                                          borderRadius: '5px', 
                                          fontWeight: '700',
                                          backgroundColor: subject.evalInfo?.badgeBg || '#eff6ff',
                                          color: subject.evalInfo?.badgeText || '#1e40af',
                                          border: `1px solid ${subject.evalInfo?.badgeBorder || '#bfdbfe'}`,
                                          whiteSpace: 'nowrap',
                                          display: 'inline-block'
                                        }}>
                                          {subject.evalInfo?.displayTitle || subject.gradingType}
                                        </span>
                                      </td>
                                      <td style={{ padding: '0.65rem 0.4rem' }}></td>
                                    </tr>
                                  );
                                })
                              ))}
                            </Fragment>
                          ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div style={{ padding: '1rem 1.6rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'normal' }}>
                          * 본 계획서는 학생의 전공 적합성을 고려한 추천 안이며, 실제 수강 신청 시 학교 교육과정 편성 현황에 따라 변경될 수 있습니다.
                        </div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1e293b' }}>
                          제작 : 숭신고등학교 진로진학상담부 김강석
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-200 text-center print:hidden">
                      <p className="text-xs text-slate-500 font-medium">
                        * 위 체크박스는 대학별 권장 과목을 바탕으로 자동 생성되었습니다. <br />
                        * 실제 수강신청 시에는 본인의 적성과 진로 계획을 충분히 고려하시기 바랍니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            {/* Footer Note */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex gap-4 print:hidden">
              <Info className="text-blue-600 w-6 h-6 shrink-0" />
              <div className="text-sm text-blue-800 space-y-2">
                <p className="font-bold">안내 사항</p>
                <p>위 과목 리스트는 일반적인 권장 사항이며, 실제 학교의 교육과정 편성 현황에 따라 다를 수 있습니다.</p>
                <p>대학별로 요구하는 핵심 권장 과목이 다를 수 있으니, 목표 대학의 입학처 홈페이지를 반드시 참고하시기 바랍니다.</p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-12 print:hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-900 font-bold text-lg">
              제작 : 숭신고등학교 진로진학상담부 김강석
            </p>
            <p className="text-slate-400 text-sm">
              이 자료는 학과바이들(캠퍼스멘토) 및 각 시도교육청, 대학 권장과목의 내용을 바탕으로 제작되었습니다.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Curriculum Input Modal */}
      <AnimatePresence>
        {/* PDF Review Modal */}
        <AnimatePresence>
          {showPdfReview && parsedData && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">추출된 교육과정 확인 및 수정</h2>
                      <p className="text-sm text-slate-500">AI가 분석한 내용을 확인하고, 필요하면 직접 수정한 뒤 반영해주세요.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setShowPdfReview(false); setSetAsDefaultCurriculum(false); }}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* School Name */}
                  <section className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      학교명
                    </label>
                    <input
                      type="text"
                      value={parsedData.schoolName}
                      onChange={(e) => setParsedData({ ...parsedData, schoolName: e.target.value })}
                      placeholder="예: 숭신고등학교"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400 transition-colors"
                    />
                    <p className="text-xs text-slate-400">여기에 입력한 학교명이 수강 신청 계획서 상단에 표시됩니다.</p>
                  </section>

                  {/* Mandatory Subjects */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                      학년별 필수(지정) 과목
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[2, 3].map(grade => (
                        <div key={grade} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-700">{grade}학년 필수</h4>
                            <button
                              onClick={() => addParsedMandatorySubject(grade)}
                              className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              과목 추가
                            </button>
                          </div>
                          <div className="space-y-2">
                            {parsedData.mandatory[grade]?.length > 0 ? (
                              parsedData.mandatory[grade].map((s, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
                                  <input
                                    type="text"
                                    value={s.name}
                                    onChange={(e) => updateParsedMandatorySubjectName(grade, i, e.target.value)}
                                    placeholder="과목명"
                                    className="flex-1 min-w-0 px-2 py-1 text-sm font-medium text-slate-700 outline-none bg-transparent"
                                  />
                                  <div className="flex items-center gap-1 shrink-0">
                                    {[1, 2].map(sem => (
                                      <button
                                        key={sem}
                                        onClick={() => toggleParsedMandatorySemester(grade, i, sem)}
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                          s.semesters.includes(sem)
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-slate-100 text-slate-400'
                                        }`}
                                      >
                                        {sem}학기
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => removeParsedMandatorySubject(grade, i)}
                                    className="p-1 text-slate-300 hover:text-red-500 transition-colors shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-slate-400 italic py-2">추출된 과목이 없습니다. 위 '과목 추가'로 직접 입력할 수 있습니다.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Selection Groups */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-purple-600 rounded-full"></span>
                        학년별 선택 과목군
                      </h3>
                      <button
                        onClick={addParsedGroup}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        과목군 추가
                      </button>
                    </div>
                    <div className="space-y-4">
                      {parsedData.groups.length > 0 ? (
                        parsedData.groups.map((group, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-purple-200 transition-colors relative">
                            <button
                              onClick={() => removeParsedGroup(idx)}
                              className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              title="이 과목군 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex flex-wrap items-center gap-3 mb-4 pr-8">
                              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold shrink-0">
                                {group.grade}학년 {group.semester}
                              </span>
                              <input
                                type="text"
                                value={group.description}
                                onChange={(e) => updateParsedGroupField(idx, 'description', e.target.value)}
                                placeholder="과목군 설명"
                                className="flex-1 min-w-[140px] px-2 py-1 text-slate-900 font-bold outline-none border-b border-transparent focus:border-purple-300 bg-transparent"
                              />
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold shrink-0">
                                <span>{group.subjects.length}개 중</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={group.selectCount}
                                  onChange={(e) => updateParsedGroupField(idx, 'selectCount', parseInt(e.target.value) || 1)}
                                  className="w-10 bg-white rounded px-1 py-0.5 text-center outline-none border border-slate-200"
                                />
                                <span>개 선택</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {group.subjects.map((s, i) => (
                                <div key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-lg pl-2.5 pr-1 py-1">
                                  <input
                                    type="text"
                                    value={s.name}
                                    onChange={(e) => updateParsedGroupSubjectName(idx, i, e.target.value)}
                                    placeholder="과목명"
                                    style={{ width: `${Math.max(3, s.name.length + 1)}ch` }}
                                    className="text-xs text-slate-600 outline-none bg-transparent"
                                  />
                                  <button
                                    onClick={() => removeParsedGroupSubject(idx, i)}
                                    className="p-0.5 text-slate-300 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addParsedGroupSubject(idx)}
                                className="flex items-center gap-1 px-2.5 py-1 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-400 hover:text-purple-600 hover:border-purple-300 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                과목 추가
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-3">
                          <p>추출된 선택 과목군이 없습니다.</p>
                          <button
                            onClick={addParsedGroup}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            과목군 직접 추가하기
                          </button>
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                  <label className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={setAsDefaultCurriculum}
                      onChange={(e) => setSetAsDefaultCurriculum(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span className="text-sm font-bold text-slate-700">이 교육과정을 기본 교육과정으로 설정</span>
                    <span className="text-xs text-slate-400">— 다음부터 접속하거나 초기화해도 이 교육과정이 기본으로 적용됩니다</span>
                  </label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setShowPdfReview(false); setSetAsDefaultCurriculum(false); }}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                    >
                      취소
                    </button>
                    <button 
                      onClick={applyParsedData}
                      className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                      확인 및 반영하기
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {showCustomForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCustomForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl text-white">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">교육과정 직접 입력</h3>
                    <p className="text-xs text-slate-500">학년별 선택 그룹과 과목을 직접 구성합니다.</p>
                  </div>
                </div>
                <button 
                  onClick={closeCustomForm}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* School Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    학교명
                  </label>
                  <input
                    type="text"
                    value={tempSchoolName}
                    onChange={(e) => setTempSchoolName(e.target.value)}
                    placeholder="예: 숭신고등학교"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-400 transition-colors"
                  />
                  <p className="text-xs text-slate-400">여기에 입력한 학교명이 수강 신청 계획서 상단에 표시됩니다.</p>
                </div>

                {/* Mandatory Subjects Section */}
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-slate-800">학년별 필수 과목</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">2학년 1학기 필수</label>
                      <textarea 
                        value={tempMandatory['2-1']}
                        onChange={(e) => setTempMandatory({...tempMandatory, '2-1': e.target.value})}
                        placeholder="과목명을 쉼표(,)로 구분하여 입력"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">2학년 2학기 필수</label>
                      <textarea 
                        value={tempMandatory['2-2']}
                        onChange={(e) => setTempMandatory({...tempMandatory, '2-2': e.target.value})}
                        placeholder="과목명을 쉼표(,)로 구분하여 입력"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">3학년 1학기 필수</label>
                      <textarea 
                        value={tempMandatory['3-1']}
                        onChange={(e) => setTempMandatory({...tempMandatory, '3-1': e.target.value})}
                        placeholder="과목명을 쉼표(,)로 구분하여 입력"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">3학년 2학기 필수</label>
                      <textarea 
                        value={tempMandatory['3-2']}
                        onChange={(e) => setTempMandatory({...tempMandatory, '3-2': e.target.value})}
                        placeholder="과목명을 쉼표(,)로 구분하여 입력"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <h4 className="font-bold text-slate-800">선택 과목 그룹</h4>
                  </div>
                  <button 
                    onClick={handleAddGroup}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    추가하기
                  </button>
                </div>

                {tempGroups.map((group, index) => (
                  <div key={group.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                    <button 
                      onClick={() => handleRemoveGroup(group.id)}
                      className="absolute -top-2 -right-2 bg-white border border-slate-200 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">학년</label>
                        <select 
                          value={group.grade}
                          onChange={(e) => handleUpdateGroup(group.id, 'grade', parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value={2}>2학년</option>
                          <option value={3}>3학년</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">학기</label>
                        <select 
                          value={group.semester}
                          onChange={(e) => handleUpdateGroup(group.id, 'semester', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="1학기">1학기</option>
                          <option value="2학기">2학기</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">학점</label>
                        <input 
                          type="number"
                          value={group.credits}
                          onChange={(e) => handleUpdateGroup(group.id, 'credits', parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">선택과목수</label>
                        <input 
                          type="number"
                          value={group.selectCount}
                          onChange={(e) => handleUpdateGroup(group.id, 'selectCount', parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">선택과목 리스트 (쉼표로 구분)</label>
                      <textarea 
                        value={group.subjects}
                        onChange={(e) => handleUpdateGroup(group.id, 'subjects', e.target.value)}
                        placeholder="예: 물리학, 화학, 생명과학, 지구과학"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                ))}

                <button 
                  onClick={handleAddGroup}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-500 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  항목 추가하기
                </button>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                <label className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={setAsDefaultCurriculum}
                    onChange={(e) => setSetAsDefaultCurriculum(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <span className="text-sm font-bold text-slate-700">이 교육과정을 기본 교육과정으로 설정</span>
                  <span className="text-xs text-slate-400">— 다음부터 접속하거나 초기화해도 이 교육과정이 기본으로 적용됩니다</span>
                </label>
                <div className="flex items-center justify-end gap-3">
                  <button 
                    onClick={closeCustomForm}
                    className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700"
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleDone}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    교육과정 생성 완료
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 과목 상세 안내 팝업 모달 */}
      <SubjectDetailModal 
        subjectDetail={selectedSubjectModal} 
        onClose={() => setSelectedSubjectModal(null)} 
      />
    </div>
  );
}
