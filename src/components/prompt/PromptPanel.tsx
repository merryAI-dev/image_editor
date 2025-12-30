import React, { useState, useRef } from 'react';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { useImageGeneration, useImageEditing } from '../../hooks/useGemini';
import { Upload, Wand2, Edit3, MousePointer, HelpCircle, ChevronDown, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { blobToBase64 } from '../../utils/imageUtils';
import { PromptSuggestions } from './PromptSuggestions';
import { PromptBuilder } from './PromptBuilder';
import { cn } from '../../utils/cn';

export const PromptPanel: React.FC = () => {
  const {
    currentPrompt,
    setCurrentPrompt,
    selectedTool,
    setSelectedTool,
    temperature,
    setTemperature,
    seed,
    setSeed,
    isGenerating,
    uploadedImages,
    addUploadedImage,
    removeUploadedImage,
    clearUploadedImages,
    editReferenceImages,
    addEditReferenceImage,
    removeEditReferenceImage,
    clearEditReferenceImages,
    canvasImage,
    setCanvasImage,
    showPromptPanel,
    setShowPromptPanel,
    clearBrushStrokes,
  } = useAppStore();

  const { generate } = useImageGeneration();
  const { edit } = useImageEditing();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const [showPromptBuilder, setShowPromptBuilder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!currentPrompt.trim()) return;

    if (selectedTool === 'generate') {
      const referenceImages = uploadedImages
        .filter(img => img.includes('base64,'))
        .map(img => img.split('base64,')[1]);

      generate({
        prompt: currentPrompt,
        referenceImages: referenceImages.length > 0 ? referenceImages : undefined,
        temperature,
        seed: seed || undefined
      });
    } else if (selectedTool === 'edit' || selectedTool === 'mask') {
      edit(currentPrompt);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const base64 = await blobToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;

        if (selectedTool === 'generate') {
          if (uploadedImages.length < 2) {
            addUploadedImage(dataUrl);
          }
        } else if (selectedTool === 'edit') {
          if (editReferenceImages.length < 2) {
            addEditReferenceImage(dataUrl);
          }
          if (!canvasImage) {
            setCanvasImage(dataUrl);
          }
        } else if (selectedTool === 'mask') {
          clearUploadedImages();
          addUploadedImage(dataUrl);
          setCanvasImage(dataUrl);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleClearSession = () => {
    setCurrentPrompt('');
    clearUploadedImages();
    clearEditReferenceImages();
    clearBrushStrokes();
    setCanvasImage(null);
    setSeed(null);
    setTemperature(0.7);
    setShowClearConfirm(false);
  };

  const tools = [
    { id: 'generate', icon: Wand2, label: '생성', description: '텍스트로 생성' },
    { id: 'edit', icon: Edit3, label: '편집', description: '기존 이미지 수정' },
    { id: 'mask', icon: MousePointer, label: '선택', description: '클릭하여 선택' },
  ] as const;

  if (!showPromptPanel) {
    return (
      <div className="w-10 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col items-center justify-center">
        <button
          onClick={() => setShowPromptPanel(true)}
          className="w-8 h-16 bg-white/5 hover:bg-white/10 rounded-r-xl border border-l-0 border-white/10 flex items-center justify-center transition-all group"
          title="프롬프트 패널 보기"
        >
          <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white/80" />
        </button>
      </div>
    );
  }

  return (
    <>
    <div className="w-80 lg:w-72 xl:w-80 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 p-5 flex flex-col space-y-5 overflow-y-auto">
      {/* Mode Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white/80">모드</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowHintsModal(true)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowPromptPanel(false)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title="패널 숨기기"
            >
              ×
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl border transition-all duration-200',
                selectedTool === tool.id
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
              )}
            >
              <tool.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="text-sm font-medium text-white/80 mb-1 block">
          {selectedTool === 'generate' ? '참조 이미지' : selectedTool === 'edit' ? '스타일 참조' : '이미지 업로드'}
        </label>
        {selectedTool === 'mask' && (
          <p className="text-xs text-white/40 mb-3">마스크로 이미지 편집</p>
        )}
        {selectedTool === 'generate' && (
          <p className="text-xs text-white/40 mb-3">선택사항, 최대 2개</p>
        )}
        {selectedTool === 'edit' && (
          <p className="text-xs text-white/40 mb-3">
            {canvasImage ? '선택사항 스타일 참조, 최대 2개' : '편집할 이미지 업로드, 최대 2개'}
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
          disabled={
            (selectedTool === 'generate' && uploadedImages.length >= 2) ||
            (selectedTool === 'edit' && editReferenceImages.length >= 2)
          }
        >
          <Upload className="h-4 w-4 mr-2" />
          업로드
        </Button>

        {/* Uploaded images preview */}
        {((selectedTool === 'generate' && uploadedImages.length > 0) ||
          (selectedTool === 'edit' && editReferenceImages.length > 0)) && (
          <div className="mt-3 space-y-2">
            {(selectedTool === 'generate' ? uploadedImages : editReferenceImages).map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-20 object-cover rounded-xl border border-white/20"
                />
                <button
                  onClick={() => selectedTool === 'generate' ? removeUploadedImage(index) : removeEditReferenceImage(index)}
                  className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white/80 hover:text-white rounded-full p-1 transition-all opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-lg text-white/80">
                  참조 {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div>
        <div className="mb-3">
          <label className="text-sm font-medium text-white/80 block mb-2">
            {selectedTool === 'generate' ? '만들고 싶은 이미지를 설명하세요' : '변경 사항을 설명하세요'}
          </label>
          {selectedTool === 'generate' && (
            <button
              onClick={() => setShowPromptBuilder(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 backdrop-blur-md text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>프롬프트 빌더</span>
            </button>
          )}
        </div>
        <Textarea
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder={
            selectedTool === 'generate'
              ? '황금빛 하늘이 반사되는 호수가 있는 석양의 고요한 산 풍경...'
              : '하늘을 더 극적으로 만들고, 폭풍 구름을 추가하세요...'
          }
          className="min-h-[120px] resize-none"
        />

        {/* Prompt Quality Indicator */}
        <button
          onClick={() => setShowHintsModal(true)}
          className="mt-2 flex items-center text-xs hover:text-white/60 transition-colors group"
        >
          {currentPrompt.length < 20 ? (
            <HelpCircle className="h-3 w-3 mr-2 text-red-400 group-hover:text-red-300" />
          ) : (
            <div className={cn(
              'h-2 w-2 rounded-full mr-2',
              currentPrompt.length < 50 ? 'bg-yellow-400' : 'bg-green-400'
            )} />
          )}
          <span className="text-white/40 group-hover:text-white/60">
            {currentPrompt.length < 20 ? '더 나은 결과를 위해 세부 정보 추가' :
             currentPrompt.length < 50 ? '적절한 세부 수준' : '훌륭한 프롬프트 세부 정보'}
          </span>
        </button>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !currentPrompt.trim()}
        className="w-full h-12 text-sm font-medium"
      >
        {isGenerating ? (
          <span className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black mr-2 flex-shrink-0" />
            생성 중...
          </span>
        ) : (
          <span className="inline-flex items-center">
            <Wand2 className="h-4 w-4 mr-2 flex-shrink-0" />
            {selectedTool === 'generate' ? '생성' : '적용'}
          </span>
        )}
      </Button>

      {/* Advanced Controls */}
      <div className="space-y-2">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          {showAdvanced ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          고급 설정 {showAdvanced ? '숨기기' : '보기'}
        </button>

        <button
          onClick={() => setShowClearConfirm(!showClearConfirm)}
          className="flex items-center text-sm text-white/50 hover:text-red-400 transition-colors"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          세션 초기화
        </button>

        {showClearConfirm && (
          <div className="mt-3 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <p className="text-xs text-white/70 mb-3">
              정말 세션을 초기화하시겠습니까? 모든 업로드, 프롬프트 및 캔버스 콘텐츠가 제거됩니다.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearSession}
                className="flex-1"
              >
                네, 초기화
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        )}

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {/* Temperature */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">
                창의성 ({temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

            {/* Seed */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">
                시드 (선택사항)
              </label>
              <input
                type="number"
                value={seed || ''}
                onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="무작위"
                className="w-full h-9 px-3 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all placeholder:text-white/30"
              />
            </div>
          </div>
        )}
      </div>

    </div>
    {/* Prompt Hints Modal */}
    <PromptSuggestions open={showHintsModal} onOpenChange={setShowHintsModal} />
    {/* Prompt Builder Modal */}
    <PromptBuilder
      open={showPromptBuilder}
      onOpenChange={setShowPromptBuilder}
      onApplyPrompt={setCurrentPrompt}
      currentPrompt={currentPrompt}
    />
    </>
  );
};
