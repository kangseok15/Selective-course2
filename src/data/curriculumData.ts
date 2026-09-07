export type SelectionType = '일반' | '진로' | '융합';

export interface Subject {
  name: string;
  type: SelectionType;
  area: string;
}

export interface Major {
  name: string;
  recommendedSubjects: string[];
  universityTips?: { university: string; core: string; recommended: string; note?: string }[];
}

export interface Field {
  name: string;
  majors: Major[];
}

export const SUBJECT_AREAS: Record<string, string[]> = {
  '국어': ['화법과 언어', '독서와 작문', '문학', '주제 탐구 독서', '문학과 영상', '직무 의사소통', '독서 토론과 글쓰기', '매체 의사소통', '언어생활 탐구'],
  '수학': ['대수', '미적분Ⅰ', '확률과 통계', '기하', '미적분Ⅱ', '경제 수학', '인공지능 수학', '직무 수학', '수학과 문화', '실용 통계', '수학과제 탐구', '전문 수학', '이산 수학', '고급 대수', '고급 미적분', '고급 기하'],
  '영어': ['영어Ⅰ', '영어Ⅱ', '영어 독해와 작문', '영미 문학 읽기', '영어 발표와 토론', '심화 영어', '심화 영어 독해와 작문', '직무 영어', '실생활 영어 회화', '미디어 영어', '세계 문화와 영어', '심화 영어 회화Ⅰ', '심화 영어 회화Ⅱ', '심화 영어Ⅰ', '심화 영어Ⅱ', '심화 영어 독해Ⅰ', '심화 영어 독해Ⅱ', '심화 영어 작문Ⅰ', '심화 영어 작문Ⅱ'],
  '사회': ['세계시민과 지리', '세계사', '사회와 문화', '현대사회와 윤리', '한국지리 탐구', '도시의 미래 탐구', '동아시아 역사 기행', '정치', '법과 사회', '경제', '윤리와 사상', '인문학과 윤리', '국제 관계의 이해', '여행지리', '역사로 탐구하는 현대 세계', '사회문제 탐구', '금융과 경제생활', '윤리문제 탐구', '기후변화와 지속가능한 세계', '국제 정치', '국제 경제', '국제법', '지역 이해', '한국 사회의 이해', '비교 문화', '세계 문제와 미래 사회', '국제 관계와 국제기구', '현대 세계의 변화', '사회 탐구 방법', '사회과제 연구'],
  '과학': ['물리학', '화학', '생명과학', '지구과학', '역학과 에너지', '전자기와 양자', '물질과 에너지', '화학 반응의 세계', '세포와 물질대사', '생물의 유전', '지구시스템과학', '행성우주과학', '과학의 역사와 문화', '기후변화와 환경생태', '융합과학 탐구', '고급 물리학', '고급 화학', '고급 생명과학', '고급 지구과학', '과학과제 연구', '물리학 실험', '화학 실험', '생명과학 실험', '지구과학 실험'],
  '체육': ['체육1', '체육2', '운동과 건강', '스포츠 문화', '스포츠 문학', '스포츠 과학', '스포츠 생활1', '스포츠 생활2', '스포츠 개론', '육상', '체조', '수상 스포츠', '기초 체육 전공 실기', '심화 체육 전공 실기', '고급 체육 전공 실기', '스포츠 경기 체력', '스포츠 경기 기술', '스포츠 경기 분석', '스포츠 교육', '스포츠 생리의학', '스포츠 행정 및 경영'],
  '예술': ['음악', '미술', '연극', '음악 연주와 창작', '음악 감상과 비평', '미술 창작', '미술 감상과 비평', '음악과 미디어', '미술과 매체', '음악 이론', '음악사', '시창·청음', '음악 전공 실기', '합창·합주', '음악 공연 실습', '음악과 문화', '미술 이론', '드로잉', '미술사', '미술 전공 실기', '조형 탐구', '미술 매체 탐구', '미술과 사회', '무용의 이해', '무용과 몸', '무용 기초 실기', '무용 전공 실기', '안무', '무용 제작 실습', '무용 감상과 비평', '무용과 매체', '문예 창작의 이해', '문장론', '문학 감상과 비평', '시 창작', '소설 창작', '극 창작', '문학과 매체', '연극과 몸', '연극과 말', '연기', '무대 미술과 기술', '연극 제작 실습', '연극 감상과 비평', '연극과 삶', '영화의 이해', '촬영·조명', '편집·사운드', '영화 제작 실습', '영화 감상과 비평', '영화와 삶', '사진의 이해', '사진 촬영', '사진 표현 기법', '영상 제작의 이해', '사진 감상과 비평', '사진과 삶'],
  '기술·가정/정보': ['기술·가정', '로봇과 공학세계', '생활과학 탐구', '창의 공학 설계', '지식 재산 일반', '생애 설계와 자립', '아동발달과 부모', '정보', '인공지능 기초', '데이터 과학', '소프트웨어와 생활', '정보과학', '인공지능과 피지컬 컴퓨팅', '사물인터넷과 센서 제어', '정보와 디지털 문해력'],
  '제2외국어/한문': ['독일어', '프랑스어', '스페인어', '중국어', '일본어', '러시아어', '아랍어', '베트남어', '한문', '한문 고전 읽기', '언어생활과 한자', '심화 독일어', '심화 프랑스어', '심화 스페인어', '심화 중국어', '심화 일본어', '심화 러시아어', '심화 아랍어', '심화 베트남어', '독일어 회화', '프랑스어 회화', '스페인어 회화', '중국어 회화', '일본어 회화', '러시아어 회화', '아랍어 회화', '베트남어 회화', '독일어권 문화', '프랑스어권 문화', '스페인어권 문화', '중국 문화', '일본 문화', '러시아 문화', '아랍 문화', '베트남 문화', '전공 기초 제2외국어', '제2외국어 회화Ⅰ', '제2외국어 회화Ⅱ', '제2외국어 독해와 작문Ⅰ', '제2외국어 독해와 작문Ⅱ', '심화 제2외국어', '제2외국어권 문화'],
  '교양': ['진로와 직업', '생태와 환경', '인간과 철학', '논리와 사고', '인간과 심리', '교육의 이해', '삶과 종교', '보건', '인간과 경제활동', '논술']
};

export const SUBJECT_TYPES: Record<string, SelectionType> = {
  // 국어
  '화법과 언어': '일반', '독서와 작문': '일반', '문학': '일반',
  '주제 탐구 독서': '진로', '문학과 영상': '진로', '직무 의사소통': '진로',
  '독서 토론과 글쓰기': '융합', '매체 의사소통': '융합', '언어생활 탐구': '융합',
  // 수학
  '대수': '일반', '미적분Ⅰ': '일반', '확률과 통계': '일반',
  '기하': '진로', '미적분Ⅱ': '진로', '경제 수학': '진로', '인공지능 수학': '진로', '직무 수학': '진로',
  '수학과 문화': '융합', '실용 통계': '융합', '수학과제 탐구': '융합',
  // 영어
  '영어Ⅰ': '일반', '영어Ⅱ': '일반', '영어 독해와 작문': '일반',
  '영미 문학 읽기': '진로', '영어 발표와 토론': '진로', '심화 영어': '진로', '심화 영어 독해와 작문': '진로', '직무 영어': '진로',
  '실생활 영어 회화': '융합', '미디어 영어': '융합', '세계 문화와 영어': '융합',
  // 사회
  '세계시민과 지리': '일반', '세계사': '일반', '사회와 문화': '일반', '현대사회와 윤리': '일반',
  '한국지리 탐구': '진로', '도시의 미래 탐구': '진로', '동아시아 역사 기행': '진로', '정치': '진로', '법과 사회': '진로', '경제': '진로', '윤리와 사상': '진로', '인문학과 윤리': '진로', '국제 관계의 이해': '진로',
  '여행지리': '융합', '역사로 탐구하는 현대 세계': '융합', '사회문제 탐구': '융합', '금융과 경제생활': '융합', '윤리문제 탐구': '융합', '기후변화와 지속가능한 세계': '융합',
  // 과학
  '물리학': '일반', '화학': '일반', '생명과학': '일반', '지구과학': '일반',
  '역학과 에너지': '진로', '전자기와 양자': '진로', '물질과 에너지': '진로', '화학 반응의 세계': '진로', '세포와 물질대사': '진로', '생물의 유전': '진로', '지구시스템과학': '진로', '행성우주과학': '진로',
  '과학의 역사와 문화': '융합', '기후변화와 환경생태': '융합', '융합과학 탐구': '융합',
  // 체육
  '체육1': '일반', '체육2': '일반',
  '운동과 건강': '진로', '스포츠 문화': '진로', '스포츠 문학': '진로', '스포츠 과학': '진로',
  '스포츠 생활1': '융합', '스포츠 생활2': '융합',
  // 예술
  '음악': '일반', '미술': '일반', '연극': '일반',
  '음악 연주와 창작': '진로', '음악 감상과 비평': '진로', '미술 창작': '진로', '미술 감상과 비평': '진로',
  '음악과 미디어': '융합', '미술과 매체': '융합',
  // 기술가정/정보
  '기술·가정': '일반', '정보': '일반',
  '로봇과 공학세계': '진로', '생활과학 탐구': '진로', '인공지능 기초': '진로', '데이터 과학': '진로',
  '창의 공학 설계': '융합', '지식 재산 일반': '융합', '생애 설계와 자립': '융합', '아동발달과 부모': '융합', '소프트웨어와 생활': '융합',
  '인공지능과 피지컬 컴퓨팅': '융합', '사물인터넷과 센서 제어': '융합', '정보와 디지털 문해력': '융합',
  // 제2외국어/한문
  '독일어': '일반', '프랑스어': '일반', '스페인어': '일반', '중국어': '일반', '일본어': '일반', '러시아어': '일반', '아랍어': '일반', '베트남어': '일반', '한문': '일반',
  '심화 독일어': '진로', '심화 프랑스어': '진로', '심화 스페인어': '진로', '심화 중국어': '진로', '심화 일본어': '진로', '심화 러시아어': '진로', '심화 아랍어': '진로', '심화 베트남어': '진로',
  '독일어 회화': '진로', '프랑스어 회화': '진로', '스페인어 회화': '진로', '중국어 회화': '진로', '일본어 회화': '진로', '러시아어 회화': '진로', '아랍어 회화': '진로', '베트남어 회화': '진로', '한문 고전 읽기': '진로',
  '독일어권 문화': '융합', '프랑스어권 문화': '융합', '스페인어권 문화': '융합', '중국 문화': '융합', '일본 문화': '융합', '러시아 문화': '융합', '아랍 문화': '융합', '베트남 문화': '융합', '언어생활과 한자': '융합',
  // 교양
  '진로와 직업': '일반', '생태와 환경': '일반',
  '인간과 철학': '진로', '논리와 사고': '진로', '인간과 심리': '진로', '교육의 이해': '진로', '삶과 종교': '진로', '보건': '진로',
  '인간과 경제활동': '융합', '논술': '융합'
};

// 2028 수능 출제 과목 (총론 표5 주황색 음영 과목)
export const CSAT_SUBJECTS = new Set([
  // 국어
  '공통국어1', '공통국어2', '화법과 언어', '독서와 작문', '문학',
  // 수학
  '공통수학1', '공통수학2', '대수', '미적분Ⅰ', '확률과 통계',
  // 영어
  '공통영어1', '공통영어2', '영어Ⅰ', '영어Ⅱ',
  // 사회
  '한국사1', '한국사2', '통합사회1', '통합사회2',
  // 과학
  '통합과학1', '통합과학2',
  // 제2외국어/한문 (일반선택 9과목)
  '독일어', '프랑스어', '스페인어', '중국어', '일본어', '러시아어', '아랍어', '베트남어', '한문'
]);

// 사회·과학 융합선택 과목 (총론 표5 노란색 음영 / 2023.12.27 교육부 확정안: 성취도 5단계 A~E, 석차등급 미기재 절대평가)
export const SOC_SCI_CONVERGENT_SUBJECTS = new Set([
  // 사회(역사/도덕 포함) 융합선택
  '여행지리', '역사로 탐구하는 현대 세계', '사회문제 탐구', '금융과 경제생활', '윤리문제 탐구', '기후변화와 지속가능한 세계',
  // 과학 융합선택
  '과학의 역사와 문화', '기후변화와 환경생태', '융합과학 탐구'
]);

// 전문교과 (특목고 전공 선택 및 직업계고 전문교과: 성취도 5단계 + 5등급)
export const SPECIALIZED_SUBJECTS = new Set([
  '사물인터넷과 센서 제어',
  '전문 수학', '이산 수학', '고급 대수', '고급 미적분', '고급 기하',
  '심화 영어 회화Ⅰ', '심화 영어 회화Ⅱ', '심화 영어Ⅰ', '심화 영어Ⅱ', '심화 영어 독해Ⅰ', '심화 영어 독해Ⅱ', '심화 영어 작문Ⅰ', '심화 영어 작문Ⅱ',
  '고급 물리학', '고급 화학', '고급 생명과학', '고급 지구과학', '과학과제 연구', '물리학 실험', '화학 실험', '생명과학 실험', '지구과학 실험',
  '스포츠 개론', '기초 체육 전공 실기', '심화 체육 전공 실기', '고급 체육 전공 실기', '스포츠 경기 체력', '스포츠 경기 기술', '스포츠 경기 분석',
  '음악 이론', '음악사', '시창·청음', '음악 전공 실기', '합창·합주', '미술 이론', '드로잉', '미술사', '미술 전공 실기', '조형 탐구'
]);

export interface SubjectEvaluationInfo {
  category: 'CSAT_GRADE5' | 'GRADE5' | 'CONVERGENT_5' | 'ACHIEVEMENT_3' | 'PASS_FAIL' | 'SPECIALIZED_GRADE5';
  displayTitle: string; // e.g. "수능 / 5등급", "5등급", "성취도 5단계", "성취도 3단계", "P/F", "전문 5등급"
  isCsat: boolean; // 수능 출제 과목 여부 (주황색 음영)
  evaluationMethod: string; // 성적 산출 방식 상세
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export function getSubjectEvaluationInfo(name: string, areaHint?: string, typeHint?: SelectionType): SubjectEvaluationInfo {
  const trimmed = name.trim();
  
  // 1. 체육, 예술, 과학탐구실험 -> 성취도 3단계 (A·B·C)
  const isPE = SUBJECT_AREAS['체육']?.some(s => s.trim() === trimmed) || areaHint === '체육';
  const isArt = SUBJECT_AREAS['예술']?.some(s => s.trim() === trimmed) || areaHint === '예술';
  const isSciExp = trimmed.startsWith('과학탐구실험');
  if (isPE || isArt || isSciExp) {
    return {
      category: 'ACHIEVEMENT_3',
      displayTitle: '성취도 3단계',
      isCsat: false,
      evaluationMethod: '성취도 3단계(A·B·C) / 석차등급 미산출',
      badgeBg: '#f0fdf4',
      badgeText: '#166534',
      badgeBorder: '#bbf7d0'
    };
  }

  // 2. 교양 교과군 -> P/F (이수)
  const isLiberal = SUBJECT_AREAS['교양']?.some(s => s.trim() === trimmed) || areaHint === '교양';
  if (isLiberal) {
    return {
      category: 'PASS_FAIL',
      displayTitle: 'P/F (이수)',
      isCsat: false,
      evaluationMethod: 'P/F (이수 여부만 표기) / 등급 미산출',
      badgeBg: '#f8fafc',
      badgeText: '#475569',
      badgeBorder: '#cbd5e1'
    };
  }

  // 3. 전문교과 -> 성취도 5단계 + 5등급
  if (SPECIALIZED_SUBJECTS.has(trimmed)) {
    return {
      category: 'SPECIALIZED_GRADE5',
      displayTitle: '5등급 [전문]',
      isCsat: false,
      evaluationMethod: '성취도 5단계(A~E) + 석차 5등급 (전문교과)',
      badgeBg: '#e0e7ff',
      badgeText: '#3730a3',
      badgeBorder: '#c7d2fe'
    };
  }

  // 4. 사회·과학 융합선택 -> 성취도 5단계 (A·B·C·D·E, 석차등급 미기재 절대평가)
  const isSocialOrScience = (areaHint === '사회' || areaHint === '과학' ||
    SUBJECT_AREAS['사회']?.some(s => s.trim() === trimmed) ||
    SUBJECT_AREAS['과학']?.some(s => s.trim() === trimmed));
  const isConvergent = typeHint === '융합' || SUBJECT_TYPES[trimmed] === '융합';
  
  if (SOC_SCI_CONVERGENT_SUBJECTS.has(trimmed) || (isSocialOrScience && isConvergent)) {
    return {
      category: 'CONVERGENT_5',
      displayTitle: '성취도 5단계',
      isCsat: false,
      evaluationMethod: '성취도 5단계(A~E) / 석차등급 미산출 (절대평가)',
      badgeBg: '#fef9c3',
      badgeText: '#854d0e',
      badgeBorder: '#fde047'
    };
  }

  // 5. 수능 출제 과목 (주황색 음영) -> 수능 5등급
  if (CSAT_SUBJECTS.has(trimmed)) {
    return {
      category: 'CSAT_GRADE5',
      displayTitle: '수능 / 5등급',
      isCsat: true,
      evaluationMethod: '수능 출제과목 / 성취도 5단계 + 석차 5등급',
      badgeBg: '#ffedd5',
      badgeText: '#c2410c',
      badgeBorder: '#fdba74'
    };
  }

  // 6. 일반 보통교과 (국어, 수학, 영어, 일반/진로선택, 기술·가정/정보, 사회/과학 외 융합선택 등)
  return {
    category: 'GRADE5',
    displayTitle: '5등급',
    isCsat: false,
    evaluationMethod: '성취도 5단계(A~E) + 석차 5등급',
    badgeBg: '#eff6ff',
    badgeText: '#1e40af',
    badgeBorder: '#bfdbfe'
  };
}

export interface SungshinSubject {
  name: string;
  semesters: number[]; // [1] for 1st, [2] for 2nd, [1, 2] for both
}

export interface SelectionGroup {
  id: string;
  grade: number;
  semester: string;
  selectCount: number;
  subjects: SungshinSubject[];
  description: string;
  credits?: number;
}

export const SUNGSHIN_GROUPS: SelectionGroup[] = [
  {
    id: '선택군1',
    grade: 2,
    semester: '1학기',
    selectCount: 1,
    subjects: [
      { name: '중국어', semesters: [1] },
      { name: '스페인어', semesters: [1] },
      { name: '인공지능과 피지컬 컴퓨팅', semesters: [1] }
    ],
    description: '2학년 1학기 선택과목군 1 (택1)'
  },
  {
    id: '선택군2',
    grade: 2,
    semester: '1학기',
    selectCount: 3,
    subjects: [
      { name: '주제 탐구 독서', semesters: [1] },
      { name: '인공지능 수학', semesters: [1] },
      { name: '인공지능 기초', semesters: [1] },
      { name: '세계시민과 지리', semesters: [1] },
      { name: '세계사', semesters: [1] },
      { name: '사회와 문화', semesters: [1] },
      { name: '정치', semesters: [1] },
      { name: '현대사회와 윤리', semesters: [1] },
      { name: '물리학', semesters: [1] },
      { name: '화학', semesters: [1] },
      { name: '생명과학', semesters: [1] },
      { name: '기후변화와 환경생태', semesters: [1] },
      { name: '미술 창작', semesters: [1] }
    ],
    description: '2학년 1학기 선택과목군 2 (택3)'
  },
  {
    id: '선택군3',
    grade: 2,
    semester: '2학기',
    selectCount: 1,
    subjects: [
      { name: '기하', semesters: [2] },
      { name: '중국어 회화', semesters: [2] },
      { name: '스페인어 회화', semesters: [2] },
      { name: '사물인터넷과 센서 제어', semesters: [2] }
    ],
    description: '2학년 2학기 선택과목군 3 (택1)'
  },
  {
    id: '선택군4',
    grade: 2,
    semester: '2학기',
    selectCount: 3,
    subjects: [
      { name: '문학과 영상', semesters: [2] },
      { name: '인공지능 기초', semesters: [2] },
      { name: '한국지리 탐구', semesters: [2] },
      { name: '동아시아 역사 기행', semesters: [2] },
      { name: '법과 사회', semesters: [2] },
      { name: '경제', semesters: [2] },
      { name: '윤리문제 탐구', semesters: [2] },
      { name: '역학과 에너지', semesters: [2] },
      { name: '물질과 에너지', semesters: [2] },
      { name: '세포와 물질대사', semesters: [2] },
      { name: '지구과학', semesters: [2] },
      { name: '미술 창작', semesters: [2] }
    ],
    description: '2학년 2학기 선택과목군 4 (택3)'
  },
  {
    id: '선택군5',
    grade: 3,
    semester: '1학기',
    selectCount: 4,
    subjects: [
      { name: '독서 토론과 글쓰기', semesters: [1] },
      { name: '미적분Ⅱ', semesters: [1] },
      { name: '여행지리', semesters: [1] },
      { name: '사회문제 탐구', semesters: [1] },
      { name: '기후변화와 지속가능한 세계', semesters: [1] },
      { name: '전자기와 양자', semesters: [1] },
      { name: '화학 반응의 세계', semesters: [1] },
      { name: '생물의 유전', semesters: [1] },
      { name: '행성우주과학', semesters: [1] },
      { name: '지구시스템과학', semesters: [1] },
      { name: '데이터 과학', semesters: [1] },
      { name: '스포츠 생활2', semesters: [1] },
      { name: '음악 감상과 비평', semesters: [1] },
      { name: '미술과 매체', semesters: [1] },
      { name: '교육의 이해', semesters: [1] }
    ],
    description: '3학년 1학기 선택과목군 5 (택4)'
  },
  {
    id: '선택군6',
    grade: 3,
    semester: '2학기',
    selectCount: 5,
    subjects: [
      { name: '매체 의사소통', semesters: [2] },
      { name: '사회문제 탐구', semesters: [2] },
      { name: '역사로 탐구하는 현대 세계', semesters: [2] },
      { name: '금융과 경제생활', semesters: [2] },
      { name: '과학의 역사와 문화', semesters: [2] },
      { name: '생태와 환경', semesters: [2] },
      { name: '정보와 디지털 문해력', semesters: [2] },
      { name: '스포츠 생활2', semesters: [2] },
      { name: '음악과 미디어', semesters: [2] },
      { name: '미술 감상과 비평', semesters: [2] },
      { name: '논술', semesters: [2] }
    ],
    description: '3학년 2학기 선택과목군 6 (택5)'
  },
  {
    id: '선택군7',
    grade: 3,
    semester: '2학기',
    selectCount: 2,
    subjects: [
      { name: '언어생활 탐구', semesters: [2] },
      { name: '경제 수학', semesters: [2] },
      { name: '세계 문화와 영어', semesters: [2] }
    ],
    description: '3학년 2학기 선택과목군 7 (택2)'
  }
];

export const MANDATORY_SUBJECTS: Record<number, SungshinSubject[]> = {
  2: [
    { name: '문학', semesters: [1] },
    { name: '대수', semesters: [1] },
    { name: '영어Ⅰ', semesters: [1] },
    { name: '운동과 건강', semesters: [1] },
    { name: '기술·가정', semesters: [1, 2] },
    { name: '언어생활과 한자', semesters: [1, 2] },
    { name: '독서와 작문', semesters: [2] },
    { name: '미적분Ⅰ', semesters: [2] },
    { name: '영어Ⅱ', semesters: [2] },
    { name: '스포츠 생활1', semesters: [2] }
  ],
  3: [
    { name: '화법과 언어', semesters: [1] },
    { name: '확률과 통계', semesters: [1] },
    { name: '영어 독해와 작문', semesters: [1] },
    { name: '스포츠 문화', semesters: [1] },
    { name: '스포츠 과학', semesters: [2] }
  ]
};

export const FIELD_DATA: Field[] = [
  {
    name: '인문 분야',
    majors: [
      {
        name: '국어국문학과',
        recommendedSubjects: ['화법과 언어', '독서와 작문', '문학', '주제 탐구 독서', '언어생활 탐구'],
        universityTips: [
          { university: '가톨릭대', core: '-', recommended: '인문사회계열 진로 및 적성을 고려하여 교과목 선택 이수' },
          { university: '동국대', core: '국어', recommended: '역사, 일반사회, 한문' }
        ]
      },
      {
        name: '영어영문학과',
        recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '영어 독해와 작문', '영미 문학 읽기', '심화 영어', '영어 발표와 토론'],
        universityTips: [
          { university: '가톨릭대', core: '-', recommended: '인문사회계열 진로 및 적성을 고려하여 교과목 선택 이수' },
          { university: '동국대', core: '국어, 영어', recommended: '일반사회, 역사' }
        ]
      },
      {
        name: '사학과',
        recommendedSubjects: ['세계사', '동아시아 역사 기행', '역사로 탐구하는 현대 세계', '한국지리 탐구', '한문'],
        universityTips: [
          { university: '가톨릭대', core: '-', recommended: '인문사회계열 진로 및 적성을 고려하여 교과목 선택 이수' },
          { university: '동국대', core: '역사, 일반사회', recommended: '한문' }
        ]
      },
      {
        name: '철학과',
        recommendedSubjects: ['윤리와 사상', '현대사회와 윤리', '인간과 철학', '인문학과 윤리', '논리와 사고', '독서와 작문'],
        universityTips: [
          { university: '가톨릭대', core: '-', recommended: '인문사회계열 진로 및 적성을 고려하여 교과목 선택 이수' },
          { university: '동국대', core: '국어, 윤리', recommended: '교양, 한문' }
        ]
      },
      { name: '고고미술사학과', recommendedSubjects: ['세계사', '사회와 문화', '미술', '미술 창작', '동아시아 역사 기행', '한문'] },
      { name: '문예창작학과', recommendedSubjects: ['화법과 언어', '독서와 작문', '문학', '주제 탐구 독서', '문학과 영상', '독서 토론과 글쓰기'] },
      { name: '문화인류학과', recommendedSubjects: ['사회와 문화', '세계사', '세계시민과 지리', '현대사회와 윤리', '인류학과 윤리', '사회문제 탐구'] },
      { name: '고고학과', recommendedSubjects: ['세계사', '사회와 문화', '동아시아 역사 기행', '한문', '언어생활과 한자', '역사로 탐구하는 현대 세계'] },
      { name: '노어노문학과', recommendedSubjects: ['러시아어', '심화 러시아어', '러시아어 회화', '러시아 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '독어독문학과', recommendedSubjects: ['독일어', '심화 독일어', '독일어 회화', '독일어권 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '동양어문학과', recommendedSubjects: ['중국어', '일본어', '한문', '동아시아 역사 기행', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '문화재학과', recommendedSubjects: ['세계사', '사회와 문화', '미술', '미술 창작', '동아시아 역사 기행', '한문', '언어생활과 한자'] },
      { name: '미학과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '인간과 철학', '논리와 사고', '인문학과 윤리', '미술사'] },
      { name: '불어불문학과', recommendedSubjects: ['프랑스어', '심화 프랑스어', '프랑스어 회화', '프랑스어권 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '스페인어학과', recommendedSubjects: ['스페인어', '심화 스페인어', '스페인어 회화', '스페인어권 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '신학과', recommendedSubjects: ['삶과 종교', '인간과 철학', '인문학과 윤리', '세계사', '사회와 문화', '현대사회와 윤리', '윤리와 사상'] },
      { name: '아랍어과', recommendedSubjects: ['아랍어', '심화 아랍어', '아랍어 회화', '아랍 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '언어학과', recommendedSubjects: ['화법과 언어', '언어생활 탐구', '영어Ⅰ', '영어Ⅱ', '제2외국어', '논리와 사고', '인간과 심리'] },
      { name: '응용영어통번역학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '영어 독해와 작문', '영어 발표와 토론', '심화 영어', '직무 영어', '실생활 영어 회화', '언어생활 탐구'] },
      { name: '일어일문학과', recommendedSubjects: ['일본어', '심화 일본어', '일본어 회화', '일본 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '종교학과', recommendedSubjects: ['삶과 종교', '인간과 철학', '인문학과 윤리', '세계사', '사회와 문화', '현대사회와 윤리', '윤리와 사상'] },
      { name: '중어중문학과', recommendedSubjects: ['중국어', '심화 중국어', '중국어 회화', '중국 문화', '세계사', '사회와 문화', '언어생활 탐구'] },
      { name: '철학생명의료윤리학과', recommendedSubjects: ['현대사회와 윤리', '윤리와 사상', '인문학과 윤리', '윤리문제 탐구', '생명과학', '보건', '인간과 철학'] },
      { name: '한국어학과', recommendedSubjects: ['화법과 언어', '독서와 작문', '문학', '언어생활 탐구', '주제 탐구 독서', '한문', '언어생활과 한자'] },
      { name: '한문학과', recommendedSubjects: ['한문', '한문 고전 읽기', '언어생활과 한자', '세계사', '동아시아 역사 기행', '문학'] }
    ]
  },
  {
    name: '사회 분야',
    majors: [
      {
        name: '경영학과',
        recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '경제 수학', '경제', '사회와 문화', '금융과 경제생활', '독서와 작문', '영어Ⅰ', '영어Ⅱ'],
        universityTips: [
          { university: '서울대', core: '확률과 통계', recommended: '미적분Ⅰ, 경제' },
          { university: '고려대/연세대', core: '대수, 미적분Ⅰ, 확률과 통계', recommended: '경제, 사회와 문화' },
          { university: '건국대', core: '국어, 사회, 수학(대수, 미적분Ⅰ, 확률과 통계)', recommended: '-' },
          { university: '서울시립대', core: '수학, 영어', recommended: '경제' }
        ]
      },
      {
        name: '경제학과',
        recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '경제 수학', '미적분Ⅱ', '경제', '금융과 경제생활'],
        universityTips: [
          { university: '서울대', core: '미적분Ⅱ, 확률과 통계', recommended: '경제' },
          { university: '서울시립대', core: '미적분Ⅰ, 경제', recommended: '확률과 통계, 미적분Ⅱ, 경제 수학' },
          { university: '고려대/연세대/성균관대', core: '미적분Ⅰ, 확률과 통계', recommended: '경제, 경제 수학, 미적분Ⅱ' },
          { university: '국민대', core: '미적분Ⅰ 또는 확률과 통계', recommended: '경제 수학 또는 경제' },
          { university: '단국대', core: '-', recommended: '미적분Ⅰ, 확률과 통계, 경제' }
        ]
      },
      { name: '정치외교학과', recommendedSubjects: ['정치', '법과 사회', '국제 관계의 이해', '사회와 문화', '세계사', '세계시민과 지리', '사회문제 탐구'] },
      { name: '행정학과', recommendedSubjects: ['정치', '법과 사회', '경제', '사회와 문화', '현대사회와 윤리', '사회문제 탐구'] },
      { name: '사회복지학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '정치', '법과 사회', '인간과 심리', '사회문제 탐구'] },
      { name: '심리학과', recommendedSubjects: ['인간과 심리', '생명과학', '확률과 통계', '사회와 문화', '현대사회와 윤리', '윤리문제 탐구'] },
      { name: '사회학과', recommendedSubjects: ['사회와 문화', '현대사회와 윤리', '세계사', '정치', '사회문제 탐구', '인문학과 윤리'] },
      { name: '언론정보학과', recommendedSubjects: ['화법과 언어', '독서와 작문', '사회와 문화', '정치', '매체 의사소통', '미디어 영어'] },
      { name: '가족아동복지학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '인간과 심리', '아동발달과 부모', '사회문제 탐구'] },
      { name: '경영정보학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '정보', '데이터 과학', '경영', '인공지능 기초'] },
      { name: '경찰행정학과', recommendedSubjects: ['법과 사회', '정치', '사회와 문화', '현대사회와 윤리', '인간과 심리', '사회문제 탐구'] },
      { name: '공공인재학부', recommendedSubjects: ['정치', '법과 사회', '경제', '사회와 문화', '현대사회와 윤리', '사회문제 탐구'] },
      { name: '공공행정학과', recommendedSubjects: ['정치', '법과 사회', '경제', '사회와 문화', '현대사회와 윤리', '사회문제 탐구'] },
      { name: '관광경영학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '제2외국어', '사회와 문화', '지리', '여행지리', '세계 문화와 영어'] },
      { name: '관광학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '제2외국어', '사회와 문화', '지리', '여행지리', '세계 문화와 영어'] },
      { name: '광고홍보학과', recommendedSubjects: ['사회와 문화', '심리', '언론정보', '매체 의사소통', '미디어 영어', '디자인'] },
      { name: '국제경영학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '경제', '국제 관계의 이해', '국제 경제', '제2외국어', '세계 문화와 영어'] },
      { name: '국제관계학과', recommendedSubjects: ['정치', '법과 사회', '국제 관계의 이해', '세계사', '사회와 문화', '국제 정치'] },
      { name: '국제물류학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '지리', '영어Ⅰ', '국제 경제', '금융과 경제생활'] },
      { name: '국제통상학과', recommendedSubjects: ['경제', '영어Ⅰ', '제2외국어', '국제 경제', '국제 관계의 이해', '금융과 경제생활'] },
      { name: '국제학부', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '심화 영어', '국제 관계의 이해', '세계사', '사회와 문화', '세계 문화와 영어'] },
      { name: '군사학과', recommendedSubjects: ['정치', '법과 사회', '세계사', '체육', '현대사회와 윤리', '사회문제 탐구'] },
      { name: '글로벌 경영학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '대수', '확률과 통계', '경제', '국제 경제', '세계 문화와 영어'] },
      { name: '글로벌비즈니스학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '경제', '제2외국어', '국제 경제', '세계 문화와 영어'] },
      { name: '금융보험학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '금융과 경제생활', '경제 수학', '사회와 문화'] },
      { name: '금융학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '금융과 경제생활', '경제 수학', '사회와 문화'] },
      { name: '기술경영학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '정보', '창의 공학 설계', '지식 재산 일반'] },
      { name: '노인복지상담학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '인간과 심리', '보건', '사회문제 탐구'] },
      { name: '농업경제학과', recommendedSubjects: ['경제', '생명과학', '확률과 통계', '지리', '사회와 문화', '금융과 경제생활'] },
      { name: '도시계획부동산학과', recommendedSubjects: ['지리', '경제', '법과 사회', '사회와 문화', '도시의 미래 탐구', '여행지리'] },
      { name: '도시행정학과', recommendedSubjects: ['정치', '법과 사회', '지리', '사회와 문화', '도시의 미래 탐구', '사회문제 탐구'] },
      { name: '무역학과', recommendedSubjects: ['경제', '영어Ⅰ', '제2외국어', '국제 경제', '지리', '금융과 경제생활'] },
      { name: '문헌정보학과', recommendedSubjects: ['국어', '정보', '사회와 문화', '데이터 과학', '언어생활 탐구', '정보과학'] },
      { name: '문화콘텐츠학과', recommendedSubjects: ['문학', '사회와 문화', '세계사', '매체 의사소통', '미술', '연극', '문학과 영상'] },
      { name: '미디어커뮤니케이션학과', recommendedSubjects: ['사회와 문화', '정치', '매체 의사소통', '미디어 영어', '언론정보', '정보'] },
      { name: '미디어학부', recommendedSubjects: ['사회와 문화', '정치', '매체 의사소통', '미디어 영어', '언론정보', '정보'] },
      { name: '법학과', recommendedSubjects: ['법과 사회', '정치', '사회와 문화', '현대사회와 윤리', '국제법', '사회문제 탐구'] },
      { name: '부동산학과', recommendedSubjects: ['경제', '법과 사회', '지리', '사회와 문화', '금융과 경제생활', '도시의 미래 탐구'] },
      { name: '북한학과', recommendedSubjects: ['정치', '법과 사회', '세계사', '국제 관계의 이해', '사회와 문화', '사회문제 탐구'] },
      { name: '산업보안학과', recommendedSubjects: ['법과 사회', '정보', '정치', '사회와 문화', '데이터 과학', '지식 재산 일반'] },
      { name: '상담심리학과', recommendedSubjects: ['인간과 심리', '사회와 문화', '현대사회와 윤리', '생명과학', '보건', '윤리문제 탐구'] },
      { name: '세무학과', recommendedSubjects: ['경제', '대수', '확률과 통계', '법과 사회', '금융과 경제생활', '경제 수학'] },
      { name: '세무회계학과', recommendedSubjects: ['경제', '대수', '확률과 통계', '법과 사회', '금융과 경제생활', '경제 수학'] },
      { name: '소비자학과', recommendedSubjects: ['경제', '사회와 문화', '심리', '금융과 경제생활', '경제 수학', '사회문제 탐구'] },
      { name: '식품자원경제학과', recommendedSubjects: ['경제', '생명과학', '화학', '지리', '사회와 문화', '금융과 경제생활'] },
      { name: '신문방송학과', recommendedSubjects: ['사회와 문화', '정치', '매체 의사소통', '미디어 영어', '언론정보', '정보'] },
      { name: '아동가족학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '인간과 심리', '아동발달과 부모', '보건'] },
      { name: '아동복지학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '인간과 심리', '아동발달과 부모', '사회문제 탐구'] },
      { name: '아동학과', recommendedSubjects: ['현대사회와 윤리', '사회와 문화', '인간과 심리', '아동발달과 부모', '보건'] },
      { name: '응용통계학과', recommendedSubjects: ['대수', '확률과 통계', '미적분Ⅰ', '경제', '데이터 과학', '실용 통계', '수학과제 탐구'] },
      { name: '의료경영학과', recommendedSubjects: ['경제', '보건', '생명과학', '사회와 문화', '금융과 경제생활', '인간과 심리'] },
      { name: '인류학과', recommendedSubjects: ['사회와 문화', '세계사', '지리', '현대사회와 윤리', '비교 문화', '사회문제 탐구'] },
      { name: '지리학과', recommendedSubjects: ['세계시민과 지리', '한국지리 탐구', '세계사', '사회와 문화', '여행지리', '기후변화와 지속가능한 세계'] },
      { name: '항공관광학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '제2외국어', '사회와 문화', '지리', '여행지리', '세계 문화와 영어'] },
      { name: '항공서비스학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '제2외국어', '사회와 문화', '심리', '세계 문화와 영어', '보건'] },
      { name: '호텔경영학과', recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '제2외국어', '사회와 문화', '지리', '여행지리', '세계 문화와 영어'] },
      { name: '회계학과', recommendedSubjects: ['경제', '대수', '확률과 통계', '금융과 경제생활', '경제 수학', '사회와 문화'] }
    ]
  },
  {
    name: '자연 분야',
    majors: [
      {
        name: '수학과',
        recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하'],
        universityTips: [
          { university: '서울대', core: '미적분Ⅱ, 기하', recommended: '-' },
          { university: '경희대/연세대/고려대', core: '대수, 미적분Ⅰ, 미적분Ⅱ, 확률과 통계, 기하', recommended: '-' },
          { university: '가톨릭대', core: '수학', recommended: '과목 위계를 고려하여 3과목 이상' }
        ]
      },
      {
        name: '물리학과',
        recommendedSubjects: ['물리학', '역학과 에너지', '전자기와 양자', '미적분Ⅰ', '미적분Ⅱ', '기하'],
        universityTips: [
          { university: '서울대', core: '물리학, 미적분Ⅱ, 기하', recommended: '-' },
          { university: '경희대', core: '대수, 미적분Ⅰ, 미적분Ⅱ, 기하, 물리학, 역학과 에너지, 전자기와 양자', recommended: '화학, 물질과 에너지' },
          { university: '가톨릭대', core: '물리학, 수학', recommended: '물리학 1과목 이상, 수학 3과목 이상' }
        ]
      },
      {
        name: '화학과',
        recommendedSubjects: ['화학', '물질과 에너지', '화학 반응의 세계', '미적분Ⅰ', '미적분Ⅱ', '물리학'],
        universityTips: [
          { university: '서울대', core: '화학, 미적분Ⅱ, 기하', recommended: '-' },
          { university: '경희대', core: '대수, 미적분Ⅰ, 미적분Ⅱ, 화학, 물질과 에너지, 화학 반응의 세계', recommended: '기하, 물리학' },
          { university: '가톨릭대', core: '화학, 수학', recommended: '화학 1과목 이상, 수학 3과목 이상' }
        ]
      },
      { name: '생명과학과', recommendedSubjects: ['생명과학', '세포와 물질대사', '생물의 유전', '화학', '미적분Ⅰ'] },
      { name: '지구환경과학과', recommendedSubjects: ['지구과학', '물리학', '화학', '지구시스템과학', '행성우주과학', '기후변화와 환경생태'] },
      { name: '식품영양학과', recommendedSubjects: ['화학', '생명과학', '확률과 통계', '물질과 에너지', '화학 반응의 세계', '생태와 환경'] },
      { name: '의류학과', recommendedSubjects: ['사회와 문화', '세계사', '화학', '미술', '생활과학 탐구', '지식 재산 일반'] },
      { name: '통계학과', recommendedSubjects: ['대수', '확률과 통계', '미적분Ⅰ', '인공지능 수학', '실용 통계', '데이터 과학'] },
      { name: '천문우주학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '미적분Ⅱ', '기하', '행성우주과학'] },
      { name: '공업화학과', recommendedSubjects: ['화학', '물리학', '미적분Ⅰ', '물질과 에너지', '화학 반응의 세계', '융합과학 탐구'] },
      { name: '나노전자물리학과', recommendedSubjects: ['물리학', '미적분Ⅰ', '미적분Ⅱ', '기하', '전자기와 양자', '인공지능 수학'] },
      { name: '농생물학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '기후변화와 환경생태'] },
      { name: '대기과학과', recommendedSubjects: ['지구과학', '물리학', '미적분Ⅰ', '행성우주과학', '지구시스템과학', '기후변화와 환경생태'] },
      { name: '대기환경과학과', recommendedSubjects: ['지구과학', '물리학', '화학', '행성우주과학', '지구시스템과학', '기후변화와 환경생태'] },
      { name: '동물자원학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '생활과학 탐구'] },
      { name: '물리천문학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '미적분Ⅱ', '기하', '행성우주과학'] },
      { name: '미생물분자생명과학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '미생물학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '분자생물학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '산림학과', recommendedSubjects: ['생명과학', '지구과학', '기후변화와 환경생태', '생태와 환경', '사회문제 탐구'] },
      { name: '산림환경스시템학과', recommendedSubjects: ['생명과학', '지구과학', '기후변화와 환경생태', '생태와 환경', '지구시스템과학'] },
      { name: '생명공학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구', '창의 공학 설계'] },
      { name: '생물학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '생물환경화학과', recommendedSubjects: ['생명과학', '화학', '기후변화와 환경생태', '생태와 환경', '화학 반응의 세계'] },
      { name: '수산생명의학과', recommendedSubjects: ['생명과학', '화학', '보건', '세포와 물질대사', '생물의 유전'] },
      { name: '식물의학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '기후변화와 환경생태'] },
      { name: '식물자원학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '기후변화와 환경생태'] },
      { name: '식품공학과', recommendedSubjects: ['화학', '생명과학', '물질과 에너지', '화학 반응의 세계', '창의 공학 설계'] },
      { name: '식품외식산업학과', recommendedSubjects: ['화학', '생명과학', '경제', '금융과 경제생활', '생활과학 탐구'] },
      { name: '원예생명공학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '기후변화와 환경생태'] },
      { name: '원예학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '기후변화와 환경생태'] },
      { name: '응용물리학과', recommendedSubjects: ['물리학', '미적분Ⅰ', '미적분Ⅱ', '기하', '역학과 에너지', '전자기와 양자'] },
      { name: '응용수학과', recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하', '인공지능 수학'] },
      { name: '임산생명공학과', recommendedSubjects: ['생명과학', '화학', '기후변화와 환경생태', '생태와 환경', '물질과 에너지'] },
      { name: '정보통계학과', recommendedSubjects: ['대수', '확률과 통계', '미적분Ⅰ', '정보', '데이터 과학', '실용 통계'] },
      { name: '조경학과', recommendedSubjects: ['지구과학', '생명과학', '미술', '기후변화와 환경생태', '여행지리'] },
      { name: '주거환경학과', recommendedSubjects: ['사회와 문화', '지리', '미술', '생활과학 탐구', '도시의 미래 탐구'] },
      { name: '줄기세포재생공학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '지구시스템과학과', recommendedSubjects: ['지구과학', '물리학', '화학', '지구시스템과학', '행성우주과학', '기후변화와 환경생태'] },
      { name: '지역건설공학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '기하', '도시의 미래 탐구', '창의 공학 설계'] },
      { name: '지질환경과학과', recommendedSubjects: ['지구과학', '물리학', '화학', '지구시스템과학', '행성우주과학', '기후변화와 환경생태'] },
      { name: '축산학과', recommendedSubjects: ['생명과학', '화학', '생물의 유전', '세포와 물질대사', '생활과학 탐구'] },
      { name: '해양학과', recommendedSubjects: ['지구과학', '생명과학', '화학', '지구시스템과학', '기후변화와 환경생태', '행성우주과학'] },
      { name: '해양환경과학과', recommendedSubjects: ['지구과학', '생명과학', '화학', '지구시스템과학', '기후변화와 환경생태', '행성우주과학'] },
      { name: '환경학과', recommendedSubjects: ['생명과학', '화학', '지구과학', '기후변화와 환경생태', '생태와 환경', '사회문제 탐구'] }
    ]
  },
  {
    name: '공학 분야',
    majors: [
      {
        name: '컴퓨터정보공학부',
        recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '정보', '인공지능 기초'],
        universityTips: [
          { university: '서울대', core: '미적분Ⅱ, 기하', recommended: '-' },
          { university: '광운대', core: '대수, 미적분Ⅰ, 확률과 통계, 정보', recommended: '기하, 미적분Ⅱ, 인공지능 수학' },
          { university: '가톨릭대', core: '수학, 정보', recommended: '수학 3과목 이상' }
        ]
      },
      {
        name: '기계공학과',
        recommendedSubjects: ['물리학', '역학과 에너지', '대수', '미적분Ⅰ', '미적분Ⅱ', '기하'],
        universityTips: [
          { university: '서울대', core: '물리학, 미적분Ⅱ, 기하', recommended: '-' },
          { university: '고려대', core: '물리학', recommended: '-' },
          { university: '경희대', core: '대수, 미적분Ⅰ, 확률과 통계, 미적분Ⅱ, 기하, 물리학, 역학과 에너지, 전자기와 양자', recommended: '-' }
        ]
      },
      { name: '전자공학과', recommendedSubjects: ['물리학', '미적분Ⅰ', '미적분Ⅱ', '기하', '전자기와 양자', '정보', '로봇과 공학세계'] },
      { name: '신소재공학과', recommendedSubjects: ['물리학', '화학', '미적분Ⅰ', '미적분Ⅱ', '기하', '물질과 에너지', '화학 반응의 세계'] },
      { name: '화학공학과', recommendedSubjects: ['화학', '물리학', '미적분Ⅰ', '미적분Ⅱ', '기하', '물질과 에너지', '화학 반응의 세계'] },
      { name: '건축학과', recommendedSubjects: ['물리학', '미술', '기하', '미적분Ⅰ', '생활과학 탐구', '창의 공학 설계'] },
      { name: '소프트웨어학과', recommendedSubjects: ['정보', '인공지능 기초', '데이터 과학', '대수', '확률과 통계', '인공지능 수학'] },
      { name: '에너지공학과', recommendedSubjects: ['물리학', '화학', '미적분Ⅰ', '미적분Ⅱ', '기하', '역학과 에너지', '지구시스템과학'] },
      { name: '산업공학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '정보', '실용 통계', '데이터 과학'] },
      { name: '로봇공학과', recommendedSubjects: ['물리학', '정보', '기하', '미적분Ⅱ', '로봇과 공학세계', '인공지능 기초'] },
      { name: '건설시스템공학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '기하', '도시의 미래 탐구', '창의 공학 설계'] },
      { name: '건설환경공학과', recommendedSubjects: ['물리학', '지구과학', '화학', '기후변화와 환경생태', '창의 공학 설계'] },
      { name: '건축공학과', recommendedSubjects: ['물리학', '미적분Ⅰ', '기하', '물질과 에너지', '창의 공학 설계'] },
      { name: '게임공학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '미적분Ⅰ', '인공지능 기초', '이산 수학'] },
      { name: '고분자공학과', recommendedSubjects: ['화학', '물리학', '생명과학', '물질과 에너지', '화학 반응의 세계'] },
      { name: '공간정보공학과', recommendedSubjects: ['지리', '정보', '대수', '확률과 통계', '데이터 과학', '지구시스템과학'] },
      { name: '교통공학과', recommendedSubjects: ['물리학', '대수', '확률과 통계', '미적분Ⅰ', '도시의 미래 탐구', '실용 통계'] },
      { name: '금속재료공학과', recommendedSubjects: ['물리학', '화학', '기하', '물질과 에너지', '화학 반응의 세계'] },
      { name: '기계설계공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '창의 공학 설계', '로봇과 공학세계'] },
      { name: '기계시스템공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '창의 공학 설계'] },
      { name: '도시공학과', recommendedSubjects: ['지리', '사회와 문화', '경제', '도시의 미래 탐구', '기후변화와 지속가능한 세계'] },
      { name: '멀티미디어공학과', recommendedSubjects: ['정보', '미술', '매체 의사소통', '인공지능 기초', '데이터 과학'] },
      { name: '멀티미디어학과', recommendedSubjects: ['정보', '미술', '매체 의사소통', '인공지능 기초', '데이터 과학'] },
      { name: '메카트로닉스공학과', recommendedSubjects: ['물리학', '정보', '기하', '로봇과 공학세계', '역학과 에너지'] },
      { name: '모바일시스템공학과', recommendedSubjects: ['정보', '물리학', '통신 기초', '데이터 과학', '인공지능 기초'] },
      { name: '반도체공학과', recommendedSubjects: ['물리학', '화학', '미적분Ⅰ', '미적분Ⅱ', '기하', '전자기와 양자'] },
      { name: '산업경영공학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '정보', '실용 통계', '데이터 과학'] },
      { name: '산업시스템공학과', recommendedSubjects: ['대수', '확률과 통계', '경제', '정보', '실용 통계', '데이터 과학'] },
      { name: '생명나노공학과', recommendedSubjects: ['생명과학', '화학', '물리학', '세포와 물질대사', '물질과 에너지'] },
      { name: '생물공학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '융합과학 탐구'] },
      { name: '소방방재학과', recommendedSubjects: ['물리학', '화학', '법과 사회', '보건', '안전 공학 기초'] },
      { name: '소프트웨어융합공학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '인공지능 기초', '데이터 과학'] },
      { name: '소프트웨어융합학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '인공지능 기초', '데이터 과학'] },
      { name: '식품생명공학과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '생활과학 탐구'] },
      { name: '안전공학과', recommendedSubjects: ['물리학', '화학', '보건', '안전 공학 기초', '사회문제 탐구'] },
      { name: '원자력공학과', recommendedSubjects: ['물리학', '화학', '미적분Ⅰ', '역학과 에너지', '전자기와 양자'] },
      { name: '원자핵공학과', recommendedSubjects: ['물리학', '화학', '미적분Ⅰ', '역학과 에너지', '전자기와 양자'] },
      { name: '응용화학과', recommendedSubjects: ['화학', '물리학', '미적분Ⅰ', '물질과 에너지', '화학 반응의 세계'] },
      { name: '의공학과', recommendedSubjects: ['생명과학', '물리학', '화학', '보건', '로봇과 공학세계'] },
      { name: '임베디드시스템공학과', recommendedSubjects: ['정보', '물리학', '로봇과 공학세계', '데이터 과학', '인공지능 기초'] },
      { name: '자동차공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '창의 공학 설계'] },
      { name: '자동차IT융합학과', recommendedSubjects: ['물리학', '정보', '기하', '인공지능 기초', '로봇과 공학세계'] },
      { name: '전기공학과', recommendedSubjects: ['물리학', '미적분Ⅰ', '미적분Ⅱ', '기하', '전자기와 양자', '역학과 에너지'] },
      { name: '전파정보통신공학과', recommendedSubjects: ['물리학', '정보', '미적분Ⅰ', '전자기와 양자', '통신 기초'] },
      { name: '정보보안학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '데이터 과학', '지식 재산 일반'] },
      { name: '정보보호학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '데이터 과학', '지식 재산 일반'] },
      { name: '정보통신공학과', recommendedSubjects: ['정보', '물리학', '대수', '확률과 통계', '데이터 과학'] },
      { name: '제약공학과', recommendedSubjects: ['화학', '생명과학', '보건', '화학 반응의 세계', '세포와 물질대사'] },
      { name: '조선해양공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '지구시스템과학'] },
      { name: '조선해양시스템공학부', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '지구시스템과학'] },
      { name: '컴퓨터공학과', recommendedSubjects: ['정보', '대수', '확률과 통계', '미적분Ⅰ', '인공지능 기초', '데이터 과학'] },
      { name: '토목공학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '기하', '도시의 미래 탐구'] },
      { name: '토목환경공학과', recommendedSubjects: ['물리학', '지구과학', '화학', '기후변화와 환경생태', '지구시스템과학'] },
      { name: '파이버시스템공학과', recommendedSubjects: ['화학', '물리학', '미술', '물질과 에너지', '생활과학 탐구'] },
      { name: '항공기계공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '행성우주과학'] },
      { name: '항공시스템공학과', recommendedSubjects: ['물리학', '정보', '기하', '역학과 에너지', '행성우주과학'] },
      { name: '항공우주공학과', recommendedSubjects: ['물리학', '기하', '미적분Ⅰ', '역학과 에너지', '행성우주과학'] },
      { name: '항공운항학과', recommendedSubjects: ['물리학', '지구과학', '영어Ⅰ', '영어Ⅱ', '행성우주과학'] },
      { name: '항공정비학과', recommendedSubjects: ['물리학', '기하', '창의 공학 설계', '역학과 에너지', '영어Ⅰ'] },
      { name: '항해학부', recommendedSubjects: ['지구과학', '물리학', '영어Ⅰ', '영어Ⅱ', '지구시스템과학'] },
      { name: '해양공학과', recommendedSubjects: ['물리학', '지구과학', '미적분Ⅰ', '기하', '지구시스템과학'] },
      { name: '화공생명공학과', recommendedSubjects: ['화학', '생명과학', '물리학', '물질과 에너지', '화학 반응의 세계'] },
      { name: '화장품공학과', recommendedSubjects: ['화학', '생명과학', '미술', '화학 반응의 세계', '생활과학 탐구'] },
      { name: '환경공학과', recommendedSubjects: ['화학', '생명과학', '지구과학', '기후변화와 환경생태', '생태와 환경'] }
    ]
  },
  {
    name: '보건·의약학 분야',
    majors: [
      {
        name: '의예과',
        recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '물질과 에너지', '미적분Ⅰ', '확률과 통계'],
        universityTips: [
          { university: '서울대', core: '생명과학', recommended: '기하, 미적분Ⅱ, 과학', note: '과학 교과의 진로선택 과목 중 세포와 물질대사, 생물의 유전을 포함하여 3과목 이상' },
          { university: '경희대/연세대/고려대', core: '대수, 미적분Ⅰ, 확률과 통계, 미적분Ⅱ, 화학, 생명과학, [물질과 에너지, 화학 반응의 세계, 세포와 물질대사, 생물의 유전 중 3과목]', recommended: '기하' },
          { university: '가톨릭대', core: '화학, 생명과학, 수학', recommended: '세포와 물질대사, 생물의 유전 포함 3과목 이상, 수학 3과목 이상' }
        ]
      },
      {
        name: '약학과',
        recommendedSubjects: ['화학', '생명과학', '물질과 에너지', '화학 반응의 세계', '세포와 물질대사', '미적분Ⅰ', '확률과 통계'],
        universityTips: [
          { university: '서울대', core: '화학, 미적분Ⅱ, 기하', recommended: '-' },
          { university: '경희대/성균관대', core: '대수, 미적분Ⅰ, 확률과 통계, 미적분Ⅱ, 화학, 생명과학, [물질과 에너지, 화학 반응의 세계, 세포와 물질대사, 생물의 유전 중 3과목]', recommended: '-' },
          { university: '가톨릭대', core: '화학, 생명과학, 수학', recommended: '화학, 생명과학 2과목 이상, 수학 3과목 이상' }
        ]
      },
      { name: '간호학과', recommendedSubjects: ['생명과학', '화학', '보건', '세포와 물질대사'] },
      { name: '물리치료학과', recommendedSubjects: ['생명과학', '물리학', '보건', '운동과 건강'] },
      { name: '수의예과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '미적분Ⅰ'] },
      { name: '치의예과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '생물의 유전', '미적분Ⅰ'] },
      { name: '한의예과', recommendedSubjects: ['생명과학', '화학', '세포와 물질대사', '한문', '인문학과 윤리'] },
      { name: '건강관리학과', recommendedSubjects: ['보건', '생명과학', '운동과 건강', '사회와 문화', '심리'] },
      { name: '방사선학과', recommendedSubjects: ['물리학', '생명과학', '화학', '보건', '전자기와 양자'] },
      { name: '보건관리학과', recommendedSubjects: ['보건', '사회와 문화', '경제', '정치', '사회문제 탐구'] },
      { name: '안경광학과', recommendedSubjects: ['물리학', '생명과학', '화학', '보건', '기하'] },
      { name: '언어청각치료학과', recommendedSubjects: ['인간과 심리', '생명과학', '보건', '언어생활 탐구', '사회와 문화'] },
      { name: '언어치료학과', recommendedSubjects: ['인간과 심리', '생명과학', '보건', '언어생활 탐구', '사회와 문화'] },
      { name: '응급구조학과', recommendedSubjects: ['보건', '생명과학', '물리학', '운동과 건강', '안전 공학 기초'] },
      { name: '의료공학과', recommendedSubjects: ['물리학', '생명과학', '화학', '정보', '로봇과 공학세계'] },
      { name: '의료정보학과', recommendedSubjects: ['정보', '보건', '데이터 과학', '인공지능 기초', '확률과 통계'] },
      { name: '임상병리학과', recommendedSubjects: ['생명과학', '화학', '보건', '세포와 물질대사', '생물의 유전'] },
      { name: '작업치료학과', recommendedSubjects: ['생명과학', '인간과 심리', '보건', '운동과 건강', '사회와 문화'] },
      { name: '재활상담학과', recommendedSubjects: ['인간과 심리', '사회와 문화', '보건', '사회복지 서비스', '심리'] },
      { name: '재활학과', recommendedSubjects: ['생명과학', '인간과 심리', '보건', '운동과 건강', '사회와 문화'] },
      { name: '치기공학과', recommendedSubjects: ['미술', '화학', '물리학', '보건', '물질과 에너지'] },
      { name: '치위생학과', recommendedSubjects: ['생명과학', '화학', '보건', '세포와 물질대사', '생물의 유전'] },
      { name: '한약학과', recommendedSubjects: ['화학', '생명과학', '한문', '보건', '화학 반응의 세계'] }
    ]
  },
  {
    name: '교육 분야',
    majors: [
      {
        name: '초등교육과',
        recommendedSubjects: ['교육의 이해', '독서와 작문', '대수', '사회와 문화', '생명과학', '영어Ⅰ'],
        universityTips: [
          { university: '서울대', core: '-', recommended: '-' },
          { university: '진주교육대', core: '국어, 수학, 영어, 사회, 과학, 한국사 전반의 기초 균형 이수', recommended: '-' },
          { university: '광주교육대', core: '국어, 수학, 영어, 사회, 과학, 한국사 전반의 기초 균형 이수', recommended: '-' }
        ]
      },
      {
        name: '국어교육과',
        recommendedSubjects: ['화법과 언어', '독서와 작문', '문학', '언어생활 탐구', '주제 탐구 독서', '교육의 이해']
      },
      {
        name: '영어교육과',
        recommendedSubjects: ['영어Ⅰ', '영어Ⅱ', '영어 독해와 작문', '심화 영어', '영어 발표와 토론', '교육의 이해']
      },
      {
        name: '수학교육과',
        recommendedSubjects: ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하', '교육의 이해']
      },
      {
        name: '과학교육과',
        recommendedSubjects: ['물리학', '화학', '생명과학', '지구과학', '융합과학 탐구', '교육의 이해']
      },
      {
        name: '유아교육과',
        recommendedSubjects: ['문학', '음악', '미술', '인간과 심리', '교육의 이해', '아동발달과 부모']
      },
      {
        name: '특수교육과',
        recommendedSubjects: ['사회와 문화', '현대사회와 윤리', '인간과 심리', '교육의 이해', '보건']
      },
      { name: '가정교육과', recommendedSubjects: ['기술·가정', '생활과학 탐구', '생애 설계와 자립', '아동발달과 부모', '교육의 이해'] },
      { name: '교육공학과', recommendedSubjects: ['정보', '인공지능 기초', '데이터 과학', '교육의 이해', '소프트웨어와 생활'] },
      { name: '교육학과', recommendedSubjects: ['인간과 심리', '사회와 문화', '현대사회와 윤리', '교육의 이해', '논술'] },
      { name: '기술교육과', recommendedSubjects: ['기술·가정', '로봇과 공학세계', '창의 공학 설계', '물리학', '교육의 이해'] },
      { name: '독어교육과', recommendedSubjects: ['독일어', '심화 독일어', '독일어권 문화', '교육의 이해', '언어생활 탐구'] },
      { name: '물리교육과', recommendedSubjects: ['물리학', '역학과 에너지', '전자기와 양자', '미적분Ⅰ', '교육의 이해'] },
      { name: '미술교육과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '미술사', '교육의 이해'] },
      { name: '불어교육과', recommendedSubjects: ['프랑스어', '심화 프랑스어', '프랑스어권 문화', '교육의 이해', '언어생활 탐구'] },
      { name: '사회교육과', recommendedSubjects: ['사회와 문화', '정치', '법과 사회', '경제', '교육의 이해'] },
      { name: '생물교육과', recommendedSubjects: ['생명과학', '세포와 물질대사', '생물의 유전', '화학', '교육의 이해'] },
      { name: '아동보육과', recommendedSubjects: ['인간과 심리', '아동발달과 부모', '보건', '교육의 이해', '음악', '미술'] },
      { name: '역사교육과', recommendedSubjects: ['세계사', '동아시아 역사 기행', '한국지리 탐구', '역사로 탐구하는 현대 세계', '교육의 이해'] },
      { name: '유아교육학과', recommendedSubjects: ['문학', '음악', '미술', '인간과 심리', '교육의 이해', '아동발달과 부모'] },
      { name: '윤리교육과', recommendedSubjects: ['현대사회와 윤리', '윤리와 사상', '인문학과 윤리', '윤리문제 탐구', '교육의 이해'] },
      { name: '음악교육과', recommendedSubjects: ['음악', '음악 연주와 창작', '음악 감상과 비평', '음악사', '교육의 이해'] },
      { name: '일반사회교육과', recommendedSubjects: ['사회와 문화', '정치', '법과 사회', '경제', '교육의 이해'] },
      { name: '일어교육과', recommendedSubjects: ['일본어', '심화 일본어', '일본 문화', '교육의 이해', '언어생활 탐구'] },
      { name: '중국어교육과', recommendedSubjects: ['중국어', '심화 중국어', '중국 문화', '교육의 이해', '언어생활 탐구'] },
      { name: '지구과학교육과', recommendedSubjects: ['지구과학', '지구시스템과학', '행성우주과학', '물리학', '교육의 이해'] },
      { name: '지리교육과', recommendedSubjects: ['세계시민과 지리', '한국지리 탐구', '여행지리', '기후변화와 지속가능한 세계', '교육의 이해'] },
      { name: '체육교육과', recommendedSubjects: ['체육1', '체육2', '운동과 건강', '스포츠 과학', '교육의 이해'] },
      { name: '컴퓨터교육과', recommendedSubjects: ['정보', '인공지능 기초', '데이터 과학', '소프트웨어와 생활', '교육의 이해'] },
      { name: '한문교육과', recommendedSubjects: ['한문', '한문 고전 읽기', '언어생활과 한자', '문학', '교육의 이해'] },
      { name: '화학교육과', recommendedSubjects: ['화학', '물질과 에너지', '화학 반응의 세계', '수학', '교육의 이해'] },
      { name: '환경교육과', recommendedSubjects: ['생태와 환경', '기후변화와 환경생태', '지구과학', '사회문제 탐구', '교육의 이해'] }
    ]
  },
  {
    name: '예술·체육 분야',
    majors: [
      {
        name: '회화과',
        recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '드로잉', '미술사', '미술 매체 탐구']
      },
      {
        name: '디자인과',
        recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '매체 의사소통', '정보']
      },
      {
        name: '음악학과',
        recommendedSubjects: ['음악', '음악 연주와 창작', '음악 감상과 비평', '음악 이론', '음악사', '음악과 미디어']
      },
      {
        name: '작곡과',
        recommendedSubjects: ['음악', '음악 연주와 창작', '음악 이론', '음악사', '음악과 미디어', '미적분Ⅰ']
      },
      {
        name: '연극영화학과',
        recommendedSubjects: ['연극', '문학과 영상', '영화의 이해', '촬영·조명', '편집·사운드', '연극과 삶']
      },
      {
        name: '체육학과',
        recommendedSubjects: ['체육1', '체육2', '운동과 건강', '스포츠 과학', '스포츠 문화'],
        universityTips: [
          { university: '서울대', core: '체육', recommended: '-' },
          { university: '경희대', core: '체육1, 체육2, 운동과 건강, 스포츠 과학', recommended: '-' }
        ]
      },
      { name: '경호학과', recommendedSubjects: ['체육1', '체육2', '법과 사회', '안전 공학 기초', '무도'] },
      { name: '공업디자인학과', recommendedSubjects: ['미술', '미술 창작', '물리학', '창의 공학 설계', '미술 감상과 비평'] },
      { name: '관현악과', recommendedSubjects: ['음악', '음악 연주와 창작', '음악 감상과 비평', '음악 이론', '음악사'] },
      { name: '금속공예학과', recommendedSubjects: ['미술', '미술 창작', '화학', '물질과 에너지', '미술사'] },
      { name: '디지털콘텐츠학과', recommendedSubjects: ['정보', '미술', '매체 의사소통', '인공지능 기초', '데이터 과학'] },
      { name: '만화애니메이션학과', recommendedSubjects: ['미술', '문학', '문학과 영상', '매체 의사소통', '미술 창작'] },
      { name: '모델연기전공', recommendedSubjects: ['연극', '무용', '체육1', '매체 의사소통', '연극과 삶'] },
      { name: '무용학과', recommendedSubjects: ['무용', '무용 연주와 창작', '무용 감상과 비평', '체육1', '무용사'] },
      { name: '뮤지컬학과', recommendedSubjects: ['연극', '음악', '무용', '연극과 삶', '음악 연주와 창작'] },
      { name: '미술학과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '드로잉', '미술사'] },
      { name: '방송연예전공', recommendedSubjects: ['연극', '매체 의사소통', '문학과 영상', '연극과 삶', '미디어 영어'] },
      { name: '뷰티디자인학과', recommendedSubjects: ['미술', '화학', '생명과학', '생활과학 탐구', '미술 창작'] },
      { name: '뷰티화장품학과', recommendedSubjects: ['화학', '생명과학', '미술', '화학 반응의 세계', '생활과학 탐구'] },
      { name: '사진학과', recommendedSubjects: ['미술', '물리학', '매체 의사소통', '미술 감상과 비평', '정보'] },
      { name: '사회체육학과', recommendedSubjects: ['체육1', '체육2', '사회와 문화', '운동과 건강', '스포츠 과학'] },
      { name: '산업디자인학과', recommendedSubjects: ['미술', '미술 창작', '정보', '창의 공학 설계', '미술 감상과 비평'] },
      { name: '서양화과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '드로잉', '미술사'] },
      { name: '성악과', recommendedSubjects: ['음악', '음악 연주와 창작', '음악 감상과 비평', '제2외국어', '음악사'] },
      { name: '스포츠건강관리학과', recommendedSubjects: ['체육1', '체육2', '보건', '운동과 건강', '스포츠 과학'] },
      { name: '스포츠과학과', recommendedSubjects: ['체육1', '체육2', '운동과 건강', '스포츠 과학', '스포츠 문화', '생명과학', '보건'] },
      { name: '스포츠레저학과', recommendedSubjects: ['체육1', '체육2', '여행지리', '운동과 건강', '스포츠 과학'] },
      { name: '스포츠산업학과', recommendedSubjects: ['체육1', '경제', '사회와 문화', '스포츠 과학', '금융과 경제생활'] },
      { name: '스포츠의학과', recommendedSubjects: ['체육1', '생명과학', '보건', '운동과 건강', '스포츠 과학'] },
      { name: '시각디자인학과', recommendedSubjects: ['미술', '미술 창작', '매체 의사소통', '정보', '미술 감상과 비평'] },
      { name: '실내디자인학과', recommendedSubjects: ['미술', '물리학', '지리', '미술 창작', '도시의 미래 탐구'] },
      { name: '실용음악과', recommendedSubjects: ['음악', '음악 연주와 창작', '음악 감상과 비평', '음악과 미디어', '정보'] },
      { name: '영상 에니메이션학과', recommendedSubjects: ['미술', '정보', '문학과 영상', '매체 의사소통', '미술 창작'] },
      { name: '영상디자인학과', recommendedSubjects: ['미술', '정보', '매체 의사소통', '문학과 영상', '미술 창작'] },
      { name: '운동처방학과', recommendedSubjects: ['체육1', '생명과학', '보건', '운동과 건강', '스포츠 과학'] },
      { name: '조소과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '드로잉', '미술사'] },
      { name: '조형예술학과', recommendedSubjects: ['미술', '미술 창작', '미술 감상과 비평', '드로잉', '미술사'] },
      { name: '패션디자인학과', recommendedSubjects: ['미술', '화학', '사회와 문화', '생활과학 탐구', '미술 창작'] }
    ]
  },
  {
    name: '자율전공 분야',
    majors: [
      {
        name: '자율전공학부',
        recommendedSubjects: ['독서와 작문', '대수', '영어Ⅰ', '사회와 문화'],
        universityTips: [
          { university: '가톨릭대', core: '계열 구분 없이 자신의 진로 및 적성을 고려하여 교과목 선택 이수', recommended: '-' },
          { university: '건국대', core: '계열 상관없이 자신의 진로와 적성에 따라 과목 선택하여 이수', recommended: '-' }
        ]
      }
    ]
  }
];
