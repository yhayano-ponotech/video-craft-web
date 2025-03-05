'use client';

import { useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { FaUpload, FaCompress, FaDownload, FaInfoCircle } from 'react-icons/fa';
import { CompressTask } from '@/src/lib/types';
import { startCompression, getCompressionStatus, getFileDownloadUrl } from '@/src/lib/api';
import { formatBytes } from '@/src/lib/utils';
import { useDropzone } from 'react-dropzone';

export default function VideoCompressor() {
  // ファイルと設定の状態
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState('medium'); // light, medium, high
  const [resolution, setResolution] = useState('original'); // original, 1080p, 720p, 480p
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 圧縮タスクの状態
  const [compressionTask, setCompressionTask] = useState<CompressTask | null>(null);
  const [progress, setProgress] = useState(0);
  
  // ファイルサイズの推定
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  
  // ポーリングのインターバルID
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ドロップゾーンの設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 500, // 500MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        // ファイルサイズから圧縮後の推定サイズを計算
        calculateEstimatedSize(acceptedFiles[0].size, compressionLevel, resolution);
        // 既存のタスクがあればリセット
        if (compressionTask) {
          setCompressionTask(null);
          setProgress(0);
        }
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0]?.errors[0]?.code === 'file-too-large') {
        setError('ファイルサイズが大きすぎます。500MB以下のファイルを選択してください。');
      } else {
        setError('サポートされていないファイル形式です。動画ファイルを選択してください。');
      }
    }
  });

  // 圧縮レベルと解像度に基づいて推定サイズを計算
  const calculateEstimatedSize = (originalSize: number, level: string, res: string) => {
    // 圧縮レベルによる削減率
    let reductionFactor = 0.7; // 中程度（デフォルト）
    if (level === 'light') {
      reductionFactor = 0.85; // 軽度圧縮
    } else if (level === 'high') {
      reductionFactor = 0.4; // 高度圧縮
    }
    
    // 解像度による削減率
    let resolutionFactor = 1.0; // オリジナル
    if (res === '1080p') {
      resolutionFactor = 0.9; // 1080p（オリジナルより小さい場合のみ影響）
    } else if (res === '720p') {
      resolutionFactor = 0.6; // 720p
    } else if (res === '480p') {
      resolutionFactor = 0.3; // 480p
    }
    
    // 推定サイズを計算
    const estimated = Math.floor(originalSize * reductionFactor * resolutionFactor);
    setEstimatedSize(estimated);
  };

  // 圧縮レベルが変わったときの処理
  const handleCompressionLevelChange = (level: string) => {
    setCompressionLevel(level);
    if (file) {
      calculateEstimatedSize(file.size, level, resolution);
    }
  };

  // 解像度が変わったときの処理
  const handleResolutionChange = (res: string) => {
    setResolution(res);
    if (file) {
      calculateEstimatedSize(file.size, compressionLevel, res);
    }
  };

  // 圧縮処理を開始
  const handleStartCompression = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('compressionLevel', compressionLevel);
      formData.append('resolution', resolution);
      
      const response = await startCompression(formData);
      
      if (response.success && response.data) {
        const taskData = response.data;
        setCompressionTask(taskData);
        setProgress(0);
        
        // 定期的に進捗を取得
        pollingRef.current = setInterval(async () => {
          await checkProgress(taskData.id);
        }, 1000);
      } else {
        setError(response.error || '圧縮の開始に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to start compression:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 進捗状況を確認
  const checkProgress = async (taskId: string) => {
    try {
      const response = await getCompressionStatus(taskId);
      
      if (response.success && response.data) {
        setCompressionTask(response.data);
        setProgress(response.data.progress);
        
        // 完了または失敗した場合はポーリングを停止
        if (
          response.data.status === 'completed' ||
          response.data.status === 'error'
        ) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      }
    } catch (err) {
      console.error('Failed to check progress:', err);
    }
  };

  // ダウンロードリンクを取得
  const getDownloadLink = () => {
    if (compressionTask?.outputPath) {
      return getFileDownloadUrl(compressionTask.outputPath);
    }
    return null;
  };

  // 圧縮比率を計算
  const calculateCompressionRatio = () => {
    if (!file || !compressionTask?.outputSize) return null;
    
    const originalSize = file.size;
    const compressedSize = compressionTask.outputSize;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    return `${ratio}%削減 (${formatBytes(originalSize)} → ${formatBytes(compressedSize)})`;
  };

  // 処理をリセットして新しいファイルをアップロード
  const handleReset = () => {
    setFile(null);
    setCompressionTask(null);
    setProgress(0);
    setError(null);
    setEstimatedSize(null);
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">動画ファイルの圧縮</h2>
      
      {/* ファイルアップロード部分 */}
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-lg mb-2">
            クリックまたはドラッグ&ドロップで動画ファイルをアップロード
          </p>
          <p className="text-sm text-gray-500">
            対応形式: MP4, MOV, AVI, MKV, WebM, FLV, WMV (最大500MB)
          </p>
        </div>
      )}
      
      {/* アップロードされたファイル情報と圧縮設定 */}
      {file && !compressionTask && (
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="flex-grow">
                <h3 className="font-semibold">{file.name}</h3>
                <p className="text-sm text-gray-600">{formatBytes(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-gray-500"
              >
                キャンセル
              </Button>
            </div>
          </div>
          
          {/* 圧縮設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="compression-level" className="block mb-2 font-medium">
                圧縮レベル
              </label>
              <select
                id="compression-level"
                value={compressionLevel}
                onChange={(e) => handleCompressionLevelChange(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                <option value="light">軽度 - 高品質維持（低圧縮率）</option>
                <option value="medium">中程度 - バランス型（推奨）</option>
                <option value="high">高度 - 最大圧縮（品質犠牲）</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="resolution" className="block mb-2 font-medium">
                解像度
              </label>
              <select
                id="resolution"
                value={resolution}
                onChange={(e) => handleResolutionChange(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                <option value="original">オリジナル解像度を維持</option>
                <option value="1080p">1080p (フルHD)</option>
                <option value="720p">720p (HD)</option>
                <option value="480p">480p (SD)</option>
              </select>
            </div>
          </div>
          
          {/* 推定サイズ情報 */}
          {estimatedSize && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">圧縮後の推定サイズ</h3>
              <p className="text-blue-700">
                約 {formatBytes(estimatedSize)}
                <span className="text-sm ml-2">
                  (元のサイズから約 {((1 - estimatedSize / file.size) * 100).toFixed(1)}% 削減)
                </span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                注: 実際のサイズは動画の内容によって変わる場合があります
              </p>
            </div>
          )}
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* 圧縮開始ボタン */}
          <Button
            onClick={handleStartCompression}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="w-full"
          >
            <FaCompress className="mr-2" />
            圧縮開始
          </Button>
        </div>
      )}
      
      {/* 圧縮進捗表示 */}
      {compressionTask && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">圧縮状況</h3>
          
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-center mb-4">
            {compressionTask.status === 'pending' && '圧縮を準備中...'}
            {compressionTask.status === 'processing' && `圧縮中... ${progress}%`}
            {compressionTask.status === 'completed' && '圧縮が完了しました！'}
            {compressionTask.status === 'error' && `エラーが発生しました: ${compressionTask.error}`}
          </p>
          
          {/* 圧縮結果 */}
          {compressionTask.status === 'completed' && (
            <div className="mb-6">
              <div className="p-3 bg-green-50 rounded-lg mb-4">
                <h3 className="font-medium text-green-800 mb-1">圧縮結果</h3>
                <p className="text-green-700">
                  {calculateCompressionRatio()}
                </p>
              </div>
              
              <div className="text-center">
                <a
                  href={getDownloadLink() || '#'}
                  download
                  className="btn btn-primary inline-block"
                >
                  <FaDownload className="mr-2 inline-block" />
                  圧縮ファイルをダウンロード
                </a>
                
                {/* ファイル保持期間に関する注意書き */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm flex items-start">
                  <FaInfoCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-700">
                    <strong>お知らせ:</strong> 圧縮ファイルは24時間後に自動的に削除されます。
                    必要なファイルは、お使いのデバイスに保存してください。
                  </p>
                </div>
                
                {/* リセットボタン */}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-4"
                >
                  別のファイルを圧縮
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}