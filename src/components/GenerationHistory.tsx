import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import { History, Download, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';
import { ImagePreview } from './modals/ImagePreview';

export const GenerationHistory: React.FC = () => {
  const {
    currentProject,
    canvasImage,
    selectedGenerationId,
    selectedEditId,
    selectGeneration,
    selectEdit,
    showHistory,
    setShowHistory,
    setCanvasImage,
    selectedTool
  } = useAppStore();

  const [previewModal, setPreviewModal] = React.useState<{
    open: boolean;
    imageUrl: string;
    title: string;
    description?: string;
  }>({
    open: false,
    imageUrl: '',
    title: '',
    description: ''
  });

  const generations = currentProject?.generations || [];
  const edits = currentProject?.edits || [];

  const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (canvasImage) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = canvasImage;
    } else {
      setImageDimensions(null);
    }
  }, [canvasImage]);

  if (!showHistory) {
    return (
      <div className="w-10 bg-black/20 backdrop-blur-md border-l border-white/10 flex flex-col items-center justify-center">
        <button
          onClick={() => setShowHistory(true)}
          className="w-8 h-16 bg-white/5 hover:bg-white/10 rounded-l-xl border border-r-0 border-white/10 flex items-center justify-center transition-all group"
          title="히스토리 패널 보기"
        >
          <ChevronLeft className="w-4 h-4 text-white/50 group-hover:text-white/80" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-white/10 p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-white/60" />
          <h3 className="text-sm font-medium text-white/80">히스토리</h3>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          title="히스토리 패널 숨기기"
        >
          ×
        </button>
      </div>

      {/* Variants Grid */}
      <div className="mb-5 flex-shrink-0">
        <h4 className="text-xs font-medium text-white/50 mb-3">현재 변형</h4>
        {generations.length === 0 && edits.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mx-auto mb-3">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-white/40">아직 생성된 이미지가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {generations.slice(-2).map((generation, index) => (
              <div
                key={generation.id}
                className={cn(
                  'relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden',
                  selectedGenerationId === generation.id
                    ? 'border-yellow-500/70 ring-2 ring-yellow-500/30'
                    : 'border-white/20 hover:border-white/40'
                )}
                onClick={() => {
                  selectGeneration(generation.id);
                  if (generation.outputAssets[0]) {
                    setCanvasImage(generation.outputAssets[0].url);
                  }
                }}
              >
                {generation.outputAssets[0] ? (
                  <img
                    src={generation.outputAssets[0].url}
                    alt="Generated variant"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-400/20 border-t-yellow-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded-lg text-white/80">
                  #{index + 1}
                </div>
              </div>
            ))}

            {edits.slice(-2).map((edit, index) => (
              <div
                key={edit.id}
                className={cn(
                  'relative aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden',
                  selectedEditId === edit.id
                    ? 'border-purple-500/70 ring-2 ring-purple-500/30'
                    : 'border-white/20 hover:border-white/40'
                )}
                onClick={() => {
                  if (edit.outputAssets[0]) {
                    setCanvasImage(edit.outputAssets[0].url);
                    selectEdit(edit.id);
                    selectGeneration(null);
                  }
                }}
              >
                {edit.outputAssets[0] ? (
                  <img
                    src={edit.outputAssets[0].url}
                    alt="Edited variant"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-400/20 border-t-purple-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-purple-500/60 backdrop-blur-sm text-xs px-2 py-1 rounded-lg text-white">
                  Edit #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Image Info */}
      {(canvasImage || imageDimensions) && (
        <div className="mb-4 p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <h4 className="text-xs font-medium text-white/50 mb-2">현재 이미지</h4>
          <div className="space-y-1 text-xs text-white/40">
            {imageDimensions && (
              <div className="flex justify-between">
                <span>크기:</span>
                <span className="text-white/70">{imageDimensions.width} × {imageDimensions.height}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>모드:</span>
              <span className="text-white/70 capitalize">{selectedTool}</span>
            </div>
          </div>
        </div>
      )}

      {/* Generation Details */}
      <div className="mb-5 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex-1 overflow-y-auto min-h-0">
        <h4 className="text-xs font-medium text-white/50 mb-2">상세 정보</h4>
        {(() => {
          const gen = generations.find(g => g.id === selectedGenerationId);
          const selectedEdit = edits.find(e => e.id === selectedEditId);

          if (gen) {
            return (
              <div className="space-y-3">
                <div className="space-y-2 text-xs text-white/40">
                  <div>
                    <span className="text-white/50">프롬프트:</span>
                    <p className="text-white/70 mt-1">{gen.prompt}</p>
                  </div>
                  <div className="flex justify-between">
                    <span>모델:</span>
                    <span className="text-white/70">{gen.modelVersion}</span>
                  </div>
                  {gen.parameters.seed && (
                    <div className="flex justify-between">
                      <span>시드:</span>
                      <span className="text-white/70">{gen.parameters.seed}</span>
                    </div>
                  )}
                </div>

                {gen.sourceAssets.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-white/50 mb-2">참조 이미지</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {gen.sourceAssets.map((asset, index) => (
                        <button
                          key={asset.id}
                          onClick={() => setPreviewModal({
                            open: true,
                            imageUrl: asset.url,
                            title: `참조 이미지 ${index + 1}`,
                            description: '생성에 사용된 참조 이미지입니다'
                          })}
                          className="relative aspect-square rounded-lg border border-white/20 hover:border-white/40 transition-colors overflow-hidden group"
                        >
                          <img
                            src={asset.url}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (selectedEdit) {
            const parentGen = generations.find(g => g.id === selectedEdit.parentGenerationId);
            return (
              <div className="space-y-3">
                <div className="space-y-2 text-xs text-white/40">
                  <div>
                    <span className="text-white/50">편집 지시:</span>
                    <p className="text-white/70 mt-1">{selectedEdit.instruction}</p>
                  </div>
                  <div className="flex justify-between">
                    <span>타입:</span>
                    <span className="text-white/70">이미지 편집</span>
                  </div>
                  <div className="flex justify-between">
                    <span>생성 시간:</span>
                    <span className="text-white/70">{new Date(selectedEdit.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {selectedEdit.maskAssetId && (
                    <div className="flex justify-between">
                      <span>마스크:</span>
                      <span className="text-purple-400">적용됨</span>
                    </div>
                  )}
                </div>

                {parentGen && (
                  <div>
                    <h5 className="text-xs font-medium text-white/50 mb-2">원본 이미지</h5>
                    <button
                      onClick={() => setPreviewModal({
                        open: true,
                        imageUrl: parentGen.outputAssets[0]?.url || '',
                        title: '원본 이미지',
                        description: '편집된 원본 이미지입니다'
                      })}
                      className="relative aspect-square w-16 rounded-lg border border-white/20 hover:border-white/40 transition-colors overflow-hidden group"
                    >
                      <img
                        src={parentGen.outputAssets[0]?.url}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  </div>
                )}

                {selectedEdit.maskReferenceAsset && (
                  <div>
                    <h5 className="text-xs font-medium text-white/50 mb-2">마스크 참조</h5>
                    <button
                      onClick={() => setPreviewModal({
                        open: true,
                        imageUrl: selectedEdit.maskReferenceAsset!.url,
                        title: '마스크 참조 이미지',
                        description: 'AI 모델에 전송된 마스크 오버레이 이미지입니다'
                      })}
                      className="relative aspect-square w-16 rounded-lg border border-white/20 hover:border-white/40 transition-colors overflow-hidden group"
                    >
                      <img
                        src={selectedEdit.maskReferenceAsset.url}
                        alt="Masked reference"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-1 left-1 bg-purple-500/60 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded text-white">
                        Mask
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <div className="text-xs text-white/40">
                <p>생성 또는 편집을 선택하면 상세 정보가 표시됩니다</p>
              </div>
            );
          }
        })()}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            let imageUrl: string | null = null;

            if (selectedGenerationId) {
              const gen = generations.find(g => g.id === selectedGenerationId);
              imageUrl = gen?.outputAssets[0]?.url || null;
            } else {
              const { canvasImage } = useAppStore.getState();
              imageUrl = canvasImage;
            }

            if (imageUrl) {
              if (imageUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `banana-editor-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                fetch(imageUrl)
                  .then(response => response.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `banana-editor-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  });
              }
            }
          }}
          disabled={!selectedGenerationId && !useAppStore.getState().canvasImage}
        >
          <Download className="h-4 w-4 mr-2" />
          다운로드
        </Button>
      </div>

      {/* Image Preview Modal */}
      <ImagePreview
        open={previewModal.open}
        onOpenChange={(open) => setPreviewModal(prev => ({ ...prev, open }))}
        imageUrl={previewModal.imageUrl}
        title={previewModal.title}
        description={previewModal.description}
      />
    </div>
  );
};
