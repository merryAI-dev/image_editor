import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Lightbulb, BarChart3, GitBranch, Workflow, PieChart, Network } from 'lucide-react';
import { PromptHint } from '../../types';
import { Button } from '../ui/Button';

// 비즈니스 시각화 최적화 팁
const promptHints: PromptHint[] = [
  {
    category: '차트 유형',
    text: '데이터 특성에 맞는 차트 유형을 명확히 지정하세요',
    example: '"막대 차트로 연도별 매출 성장률 비교" 또는 "도넛 차트로 시장 점유율 분포 표현"'
  },
  {
    category: '플로우차트',
    text: '프로세스 흐름과 의사결정 포인트를 구체적으로 설명하세요',
    example: '"고객 온보딩 프로세스를 왼쪽에서 오른쪽으로 흐르는 플로우차트, 승인/거절 분기점 포함"'
  },
  {
    category: '색상 체계',
    text: '전문적인 컨설팅 보고서에 맞는 색상 팔레트를 지정하세요',
    example: '"맥킨지 스타일의 파란색 계열 그라데이션" 또는 "기업용 네이비-그레이 색상 체계"'
  },
  {
    category: '레이아웃',
    text: '시각적 계층 구조와 정보 배치를 명시하세요',
    example: '"2x2 매트릭스 형태, 왼쪽 상단에 제목, 각 사분면에 라벨과 설명"'
  },
  {
    category: '데이터 표현',
    text: '숫자와 비율을 어떻게 시각화할지 설명하세요',
    example: '"각 항목에 퍼센트 레이블 표시, 가장 큰 값은 강조 색상으로 하이라이트"'
  }
];

const categoryIcons: Record<string, React.ElementType> = {
  '차트 유형': BarChart3,
  '플로우차트': Workflow,
  '색상 체계': PieChart,
  '레이아웃': GitBranch,
  '데이터 표현': Network,
};

const categoryColors: Record<string, string> = {
  '차트 유형': 'bg-primary-500/10 border-primary-500/30 text-primary-400',
  '플로우차트': 'bg-accent-500/10 border-accent-500/30 text-accent-400',
  '색상 체계': 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  '레이아웃': 'bg-green-500/10 border-green-500/30 text-green-400',
  '데이터 표현': 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};

interface PromptSuggestionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#16171D] border border-[#25262D] rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-100">
                비즈니스 시각화 가이드
              </Dialog.Title>
              <p className="text-sm text-gray-400 mt-1">
                전문적인 차트와 다이어그램 생성 팁
              </p>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {promptHints.map((hint, index) => {
              const Icon = categoryIcons[hint.category] || BarChart3;
              return (
                <div key={index} className="p-4 bg-[#1C1D24] rounded-lg border border-[#25262D]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-1.5 rounded ${categoryColors[hint.category]?.split(' ')[0] || 'bg-gray-700'}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${categoryColors[hint.category] || ''}`}>
                      {hint.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mb-2">{hint.text}</p>
                  <div className="p-2 bg-[#0D0E11] rounded text-xs text-gray-400">
                    <span className="text-gray-500">예시: </span>
                    {hint.example}
                  </div>
                </div>
              );
            })}

            {/* 비즈니스 시각화 핵심 가이드 */}
            <div className="p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-lg border border-primary-500/20 mt-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary-300 mb-2">
                    컨설팅 시각화 핵심 원칙
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1.5">
                    <li>• <strong>단순함 우선</strong>: 핵심 메시지만 전달하는 깔끔한 디자인</li>
                    <li>• <strong>계층 구조</strong>: 중요도에 따른 시각적 강조</li>
                    <li>• <strong>일관된 색상</strong>: 2-3개 주요 색상으로 통일</li>
                    <li>• <strong>명확한 라벨</strong>: 모든 요소에 설명 텍스트 포함</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
