import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Sparkles, BarChart3, Palette, Layout, GitBranch, Workflow, PieChart, TrendingUp, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface PromptBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPrompt: (prompt: string) => void;
  currentPrompt: string;
}

// 비즈니스 시각화 프롬프트 요소들
const promptElements = {
  chartType: {
    label: '차트 유형',
    icon: BarChart3,
    description: '데이터 시각화에 적합한 차트 선택',
    options: [
      { label: '막대 차트', value: 'bar chart with clear labels' },
      { label: '라인 차트', value: 'line chart showing trends over time' },
      { label: '파이/도넛 차트', value: 'donut chart showing proportions' },
      { label: '영역 차트', value: 'area chart with gradient fill' },
      { label: '워터폴 차트', value: 'waterfall chart showing incremental changes' },
      { label: '트리맵', value: 'treemap showing hierarchical data' },
      { label: '버블 차트', value: 'bubble chart showing three dimensions' },
      { label: '게이지 차트', value: 'gauge chart showing progress or KPI' },
    ]
  },
  diagramType: {
    label: '다이어그램 유형',
    icon: Workflow,
    description: '프로세스와 구조 시각화',
    options: [
      { label: '플로우차트', value: 'flowchart with decision points and arrows' },
      { label: '조직도', value: 'organizational chart with hierarchy levels' },
      { label: '프로세스 맵', value: 'process map with sequential steps' },
      { label: '마인드맵', value: 'mind map with central concept and branches' },
      { label: 'SWOT 분석', value: '2x2 SWOT analysis matrix' },
      { label: '벤 다이어그램', value: 'Venn diagram showing overlapping concepts' },
      { label: '타임라인', value: 'horizontal timeline with milestones' },
      { label: '피라미드', value: 'pyramid diagram showing hierarchy' },
    ]
  },
  framework: {
    label: '컨설팅 프레임워크',
    icon: GitBranch,
    description: '전략 분석 프레임워크',
    options: [
      { label: '2x2 매트릭스', value: '2x2 matrix with four quadrants, labeled axes' },
      { label: 'BCG 매트릭스', value: 'BCG growth-share matrix with star, cash cow, question mark, dog' },
      { label: '포터 5 Forces', value: "Porter's Five Forces diagram" },
      { label: '가치 사슬', value: 'value chain diagram with primary and support activities' },
      { label: '맥킨지 7S', value: 'McKinsey 7S framework diagram' },
      { label: '피쉬본 다이어그램', value: 'fishbone/Ishikawa diagram for root cause analysis' },
      { label: '간트 차트', value: 'Gantt chart with tasks and timeline' },
      { label: 'RACI 매트릭스', value: 'RACI responsibility matrix' },
    ]
  },
  colorScheme: {
    label: '색상 체계',
    icon: Palette,
    description: '전문적인 색상 팔레트',
    options: [
      { label: '맥킨지 블루', value: 'McKinsey blue color scheme, navy and light blue gradient' },
      { label: 'BCG 그린', value: 'BCG green color palette, professional green tones' },
      { label: '베인 레드', value: 'Bain red color scheme, burgundy and coral accents' },
      { label: '네이비-그레이', value: 'corporate navy blue and gray color palette' },
      { label: '모노크롬', value: 'monochromatic grayscale, professional and clean' },
      { label: '티얼-오렌지', value: 'teal and orange complementary colors' },
      { label: '다크 테마', value: 'dark theme with white text and accent colors' },
    ]
  },
  style: {
    label: '디자인 스타일',
    icon: Layout,
    description: '시각적 스타일과 레이아웃',
    options: [
      { label: '미니멀리스트', value: 'minimalist design, clean lines, ample white space' },
      { label: '플랫 디자인', value: 'flat design, no gradients, solid colors' },
      { label: '아이소메트릭', value: 'isometric 3D style illustration' },
      { label: '인포그래픽', value: 'infographic style with icons and data callouts' },
      { label: '그리드 기반', value: 'grid-based layout, aligned elements' },
      { label: '카드 UI', value: 'card-based UI with subtle shadows' },
      { label: '글래스모피즘', value: 'glassmorphism style with blur effects' },
    ]
  },
  dataLabels: {
    label: '데이터 표시',
    icon: TrendingUp,
    description: '숫자와 레이블 표현 방식',
    options: [
      { label: '퍼센트 레이블', value: 'percentage labels on each element' },
      { label: '절대값 표시', value: 'absolute value labels with units' },
      { label: '범례 포함', value: 'clear legend explaining all categories' },
      { label: '데이터 테이블', value: 'data table below the chart' },
      { label: '주석 추가', value: 'annotations highlighting key insights' },
      { label: '트렌드 라인', value: 'trend line showing direction' },
      { label: '목표선', value: 'target/goal line for comparison' },
    ]
  },
};

// 비즈니스 시각화 템플릿
const promptTemplates = [
  {
    name: '매출 성장 차트',
    description: '연도별/분기별 매출 추이',
    template: '{{subject}}을 보여주는 막대 차트, 맥킨지 스타일 파란색 그라데이션, 각 막대에 성장률 퍼센트 표시, Y축에 매출액, X축에 기간, 깔끔하고 전문적인 디자인, 흰색 배경'
  },
  {
    name: '시장 점유율',
    description: '경쟁사 비교 분석',
    template: '{{subject}}의 시장 점유율을 보여주는 도넛 차트, 각 세그먼트에 회사명과 퍼센트 표시, 가장 큰 점유율은 강조 색상, 우측에 범례, 전문적인 컨설팅 보고서 스타일'
  },
  {
    name: '프로세스 플로우',
    description: '업무 프로세스 시각화',
    template: '{{subject}} 프로세스를 보여주는 플로우차트, 왼쪽에서 오른쪽으로 흐름, 의사결정 분기점은 다이아몬드 모양, 각 단계에 아이콘과 설명, 화살표로 연결, 네이비-그레이 색상 체계'
  },
  {
    name: '전략 매트릭스',
    description: '2x2 분석 프레임워크',
    template: '{{subject}} 분석을 위한 2x2 매트릭스, 각 사분면에 명확한 라벨과 설명, 축 레이블 포함, 각 영역에 해당 항목 배치, BCG 스타일 색상, 전략 컨설팅 프레젠테이션 품질'
  },
  {
    name: '조직 구조도',
    description: '계층적 조직 시각화',
    template: '{{subject}}의 조직도, 위에서 아래로 계층 구조, 각 박스에 직책과 이름, 연결선으로 보고 체계 표시, 깔끔한 그리드 정렬, 전문적인 기업 스타일'
  },
  {
    name: '타임라인 로드맵',
    description: '프로젝트 마일스톤',
    template: '{{subject}} 타임라인, 가로 방향으로 시간 흐름, 각 마일스톤에 날짜와 설명, 완료/진행중/예정 상태 색상 구분, 인포그래픽 스타일, 깔끔한 아이콘 사용'
  },
];

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  open,
  onOpenChange,
  onApplyPrompt,
  currentPrompt
}) => {
  const [selectedElements, setSelectedElements] = useState<Record<string, string>>({});
  const [customSubject, setCustomSubject] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    chartType: true,
    diagramType: true,
    framework: false,
    colorScheme: false,
    style: false,
    dataLabels: false,
  });
  const [copied, setCopied] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const selectElement = (category: string, value: string) => {
    setSelectedElements(prev => {
      if (prev[category] === value) {
        const { [category]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [category]: value };
    });
  };

  const generatePrompt = () => {
    const parts: string[] = [];

    // 주제 (커스텀 또는 기본)
    if (customSubject.trim()) {
      parts.push(customSubject.trim());
    }

    // 나머지 요소들을 자연스럽게 연결
    const elementOrder = ['chartType', 'diagramType', 'framework', 'colorScheme', 'style', 'dataLabels'];
    elementOrder.forEach(key => {
      if (selectedElements[key]) {
        parts.push(selectedElements[key]);
      }
    });

    // 기본 품질 향상 문구 추가
    if (parts.length > 0) {
      parts.push('professional business presentation quality, clean and readable');
    }

    return parts.join(', ');
  };

  const applyTemplate = (template: string) => {
    const subject = customSubject.trim() || '[데이터/주제를 입력하세요]';
    const prompt = template.replace('{{subject}}', subject);
    onApplyPrompt(prompt);
    onOpenChange(false);
  };

  const handleApply = () => {
    const prompt = generatePrompt();
    if (prompt) {
      onApplyPrompt(prompt);
      onOpenChange(false);
    }
  };

  const handleCopy = () => {
    const prompt = generatePrompt();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedPrompt = generatePrompt();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#16171D] border border-[#25262D] rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-hidden z-50 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-100">
                비즈니스 시각화 빌더
              </Dialog.Title>
              <p className="text-sm text-gray-400 mt-1">
                전문적인 차트와 다이어그램 프롬프트 생성
              </p>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* 커스텀 주제 입력 */}
            <div className="p-4 bg-[#1C1D24] rounded-lg border border-[#25262D]">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                시각화할 데이터/주제
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="예: 2024년 분기별 매출 데이터, 고객 여정 프로세스, 시장 진입 전략"
                className="w-full h-10 px-3 bg-[#0D0E11] border border-[#25262D] rounded-lg text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                구체적인 데이터나 분석 주제를 입력하면 더 정확한 시각화를 생성합니다
              </p>
            </div>

            {/* 프롬프트 요소 선택 */}
            {Object.entries(promptElements).map(([key, section]) => {
              const Icon = section.icon;
              const isExpanded = expandedSections[key];

              return (
                <div key={key} className="border border-[#25262D] rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(key)}
                    className="w-full p-3 bg-[#1C1D24] flex items-center justify-between hover:bg-[#202128] transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-primary-400" />
                      <span className="text-sm font-medium text-gray-200">{section.label}</span>
                      {selectedElements[key] && (
                        <span className="text-xs px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded">
                          선택됨
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-[#0D0E11]">
                      <p className="text-xs text-gray-500 mb-3">{section.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => selectElement(key, option.value)}
                            className={cn(
                              'px-3 py-1.5 text-xs rounded-lg border transition-all',
                              selectedElements[key] === option.value
                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                                : 'bg-[#1C1D24] border-[#25262D] text-gray-400 hover:bg-[#202128] hover:text-gray-300'
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* 템플릿 섹션 */}
            <div className="border border-[#25262D] rounded-lg overflow-hidden">
              <div className="p-3 bg-[#1C1D24]">
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className="h-4 w-4 text-accent-400" />
                  <span className="text-sm font-medium text-gray-200">빠른 템플릿</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {promptTemplates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => applyTemplate(template.template)}
                      className="p-3 text-left bg-[#0D0E11] border border-[#25262D] rounded-lg hover:bg-[#1C1D24] hover:border-primary-500/30 transition-all group"
                    >
                      <div className="text-sm font-medium text-gray-200 group-hover:text-primary-400 transition-colors">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {template.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 생성된 프롬프트 미리보기 */}
          {generatedPrompt && (
            <div className="mt-4 p-4 bg-[#0D0E11] rounded-lg border border-[#25262D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">생성된 프롬프트</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? '복사됨!' : '복사'}</span>
                </button>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                {generatedPrompt}
              </p>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex space-x-3 mt-4 pt-4 border-t border-[#25262D]">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedElements({});
                setCustomSubject('');
              }}
              className="flex-1"
            >
              초기화
            </Button>
            <Button
              onClick={handleApply}
              disabled={!generatedPrompt}
              className="flex-1"
            >
              프롬프트 적용
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
