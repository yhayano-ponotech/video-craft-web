'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { FaUpload, FaCamera, FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import { ScreenshotTask } from '@/src/lib/types';
import { takeScreenshot, getScreenshotStatus, getFileDownloadUrl } from '@/src/lib/api';
import { formatBytes, formatDuration } from '@/src/lib/utils';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';

// ReactPlayerの参照用インターフェース
interface ReactPlayerRef {
  seekTo: (amount: number, type: 'seconds' | 'fraction') => void;
}

// クライアントサイドでのみレンダリングするためにdynamicインポート
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function VideoScreenshotter() {
  // ファイルと設定の状態
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  // 動画プレーヤーの状態
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // ReactPlayerのインスタンスの型定義
  const playerRef = useRef<ReactPlayerRef | null>(null);
  
  // スクリーンショット設定
  const [timestamp, setTimestamp] = useState(0);
  const [imageFormat, setImageFormat] = useState<'jpg' | 'png'>('jpg');
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('high');
  
  // スクリーンショットタスクの状態
  const [screenshotTask, setScreenshotTask] = useState<ScreenshotTask | null>(null);
  const [progress, setProgress] = useState(0);
  
  // シークバードラッグの状態管理
  const [isDragging, setIsDragging] = useState(false);
  const seekBarRef = useRef<HTMLDivElement>(null);
  
  // ポーリングのインターバルID
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // プレビュー画像
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ドロップゾーンの設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 500, // 500MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        // ObjectURLを作成して動画プレーヤーで使用
        const url = URL.createObjectURL(acceptedFiles[0]);
        setFileUrl(url);
        // 既存のタスクがあればリセット
        if (screenshotTask) {
          setScreenshotTask(null);
          setProgress(0);
        }
        // 設定をリセット
        setTimestamp(0);
        setCurrentTime(0);
        // プレビューをクリア
        setPreviewImage(null);
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

  // シークバーのドラッグ機能
  const handleSeekMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateSeekPosition(e);
  };
  
  const handleSeekMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateSeekPosition(e);
    }
  };
  
  const handleSeekMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };
  
  const updateSeekPosition = (e: MouseEvent | React.MouseEvent) => {
    if (seekBarRef.current && duration > 0) {
      const rect = seekBarRef.current.getBoundingClientRect();
      const percentage = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      const newTime = percentage * duration;
      setCurrentTime(newTime);
      seekTo(newTime);
    }
  };
  
  // マウスイベントリスナーの設定と解除
  useEffect(() => {
    if (file && fileUrl) {
      document.addEventListener('mousemove', handleSeekMouseMove);
      document.addEventListener('mouseup', handleSeekMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleSeekMouseMove);
        document.removeEventListener('mouseup', handleSeekMouseUp);
      };
    }
  }, [file, fileUrl, isDragging]);

  // コンポーネントがアンマウントされたらObjectURLを解放
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [fileUrl, previewImage]);

  // 再生位置が変更されたときの処理
  const handleProgress = (state: { playedSeconds: number }) => {
    if (!isDragging) {
      setCurrentTime(state.playedSeconds);
    }
  };

  // 動画の長さが取得できたときの処理
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // 現在位置をスクリーンショット位置として設定
  const setCurrentAsTimestamp = () => {
    setTimestamp(currentTime);
  };

  // 指定された時間（秒）にシーク
  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  // スクリーンショット処理を開始
  const handleTakeScreenshot = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp.toString());
      formData.append('format', imageFormat);
      formData.append('quality', imageQuality);
      
      const response = await takeScreenshot(formData);
      
      if (response.success && response.data) {
        const taskData = response.data;
        setScreenshotTask(taskData);
        setProgress(0);
        
        // 定期的に進捗を取得
        pollingRef.current = setInterval(async () => {
          await checkProgress(taskData.id);
        }, 1000);
      } else {
        setError(response.error || 'スクリーンショットの取得に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to take screenshot:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 進捗状況を確認
  const checkProgress = async (taskId: string) => {
    try {
      const response = await getScreenshotStatus(taskId);
      
      if (response.success && response.data) {
        setScreenshotTask(response.data);
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
          
          // 完了したらプレビュー画像を表示
          if (response.data.status === 'completed' && response.data.outputPath) {
            // サーバーから画像のURLを取得
            const imageUrl = getFileDownloadUrl(response.data.outputPath);
            // プレビュー用の一時的なキャッシュを防ぐためにタイムスタンプを付与
            setPreviewImage(`${imageUrl}&t=${new Date().getTime()}`);
          }
        }
      }
    } catch (err) {
      console.error('Failed to check progress:', err);
    }
  };

  // ダウンロードリンクを取得
  const getDownloadLink = () => {
    if (screenshotTask?.outputPath) {
      return getFileDownloadUrl(screenshotTask.outputPath);
    }
    return null;
  };

  // 処理をリセットして新しいファイルをアップロード
  const handleReset = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setFile(null);
    setFileUrl(null);
    setScreenshotTask(null);
    setProgress(0);
    setError(null);
    setDuration(0);
    setCurrentTime(0);
    setTimestamp(0);
    setPreviewImage(null);
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">動画からの画像抽出</h2>
      
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
            対応形式: MP4, MOV, AVI, MKV, WebM (最大500MB)
          </p>
        </div>
      )}
      
      {/* 動画プレーヤーと設定 */}
      {file && fileUrl && !screenshotTask && (
        <div className="mb-6">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center mb-2">
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
          
          {/* 動画プレーヤー */}
          <div className="bg-black rounded-lg overflow-hidden mb-6">
            <ReactPlayer
              ref={playerRef}
              url={fileUrl}
              width="100%"
              height="auto"
              controls={false}
              playing={playing}
              onProgress={handleProgress}
              onDuration={handleDuration}
              progressInterval={100}
              style={{ aspectRatio: '16 / 9' }}
            />
            
            <div className="bg-gray-800 p-3 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPlaying(!playing)}
                className="text-white mr-3"
              >
                {playing ? <FaPause /> : <FaPlay />}
              </Button>
              
              <div className="text-white text-sm mr-3">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>
              
              {/* シークバー */}
              <div 
                ref={seekBarRef}
                className="flex-grow h-2 bg-gray-600 rounded-full cursor-pointer"
                onMouseDown={handleSeekMouseDown}
              >
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* スクリーンショット設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-3">スクリーンショット位置</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-20">
                  <label htmlFor="timestamp" className="block text-sm mb-1">
                    時間位置
                  </label>
                  <input
                    type="number"
                    id="timestamp"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={timestamp}
                    onChange={(e) => setTimestamp(Number(e.target.value))}
                    className="input-field py-1"
                  />
                </div>
                
                <div className="ml-4">
                  <p className="text-sm mb-1">表示時間</p>
                  <p className="font-medium">{formatDuration(timestamp)}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={setCurrentAsTimestamp}
              >
                現在位置を使用
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">画像設定</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="image-format" className="block mb-2 text-sm">
                    画像形式
                  </label>
                  <select
                    id="image-format"
                    value={imageFormat}
                    onChange={(e) => setImageFormat(e.target.value as 'jpg' | 'png')}
                    className="input-field py-2"
                    disabled={isLoading}
                  >
                    <option value="jpg">JPG (小さいサイズ)</option>
                    <option value="png">PNG (高品質)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="image-quality" className="block mb-2 text-sm">
                    画質
                  </label>
                  <select
                    id="image-quality"
                    value={imageQuality}
                    onChange={(e) => setImageQuality(e.target.value as 'low' | 'medium' | 'high')}
                    className="input-field py-2"
                    disabled={isLoading}
                  >
                    <option value="low">低 (速い)</option>
                    <option value="medium">中</option>
                    <option value="high">高 (遅い)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* スクリーンショット取得ボタン */}
          <Button
            onClick={handleTakeScreenshot}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="w-full"
          >
            <FaCamera className="mr-2" />
            スクリーンショットを取得
          </Button>
        </div>
      )}
      
      {/* スクリーンショット処理進捗表示 */}
      {screenshotTask && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">処理状況</h3>
          
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-center mb-4">
            {screenshotTask.status === 'pending' && 'スクリーンショットを準備中...'}
            {screenshotTask.status === 'processing' && `処理中... ${progress}%`}
            {screenshotTask.status === 'completed' && 'スクリーンショットの取得が完了しました！'}
            {screenshotTask.status === 'error' && `エラーが発生しました: ${screenshotTask.error}`}
          </p>
          
          {/* プレビューと結果 */}
          {previewImage && screenshotTask.status === 'completed' && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="font-medium mb-3">プレビュー</h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <img
                    src={previewImage}
                    alt="Screenshot Preview"
                    className="max-w-full h-auto max-h-96 mx-auto rounded"
                  />
                </div>
              </div>
              
              <a
                href={getDownloadLink() || '#'}
                download
                className="btn btn-primary inline-block"
              >
                <FaDownload className="mr-2 inline-block" />
                画像をダウンロード
              </a>
              
              {/* リセットボタン */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="ml-4"
              >
                別の画像を抽出
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}