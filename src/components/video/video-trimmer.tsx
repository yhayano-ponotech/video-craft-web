'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { FaUpload, FaCut, FaDownload, FaPlay, FaPause } from 'react-icons/fa';
import { TrimTask } from '@/src/lib/types';
import { startTrimming, getTrimmingStatus, getFileDownloadUrl } from '@/src/lib/api';
import { formatBytes, formatDuration } from '@/src/lib/utils';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';

// ReactPlayerの参照用インターフェース
interface ReactPlayerRef {
  seekTo: (amount: number, type: 'seconds' | 'fraction') => void;
}

// クライアントサイドでのみレンダリングするためにdynamicインポート
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

export default function VideoTrimmer() {
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
  
  // トリミング設定
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [outputFormat, setOutputFormat] = useState('mp4');
  
  // トリミングタスクの状態
  const [trimTask, setTrimTask] = useState<TrimTask | null>(null);
  const [progress, setProgress] = useState(0);
  
  // シークバードラッグの状態管理
  const [isDragging, setIsDragging] = useState(false);
  const seekBarRef = useRef<HTMLDivElement>(null);
  
  // ポーリングのインターバルID
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
        if (trimTask) {
          setTrimTask(null);
          setProgress(0);
        }
        // トリミング設定をリセット
        setStartTime(0);
        setEndTime(0);
        setCurrentTime(0);
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
    };
  }, [fileUrl]);

  // 再生位置が変更されたときの処理
  const handleProgress = (state: { playedSeconds: number }) => {
    if (!isDragging) {
      setCurrentTime(state.playedSeconds);
    }
  };

  // 動画の長さが取得できたときの処理
  const handleDuration = (duration: number) => {
    setDuration(duration);
    // 初期値として動画の長さをセット
    setEndTime(duration);
  };

  // 現在位置を開始位置として設定
  const setCurrentAsStart = () => {
    const newStart = currentTime;
    if (newStart < endTime) {
      setStartTime(newStart);
    } else {
      setError('開始位置は終了位置より前に設定してください。');
    }
  };

  // 現在位置を終了位置として設定
  const setCurrentAsEnd = () => {
    const newEnd = currentTime;
    if (newEnd > startTime) {
      setEndTime(newEnd);
    } else {
      setError('終了位置は開始位置より後に設定してください。');
    }
  };

  // 指定された時間（秒）にシーク
  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  // トリミング処理を開始
  const handleStartTrimming = async () => {
    if (!file) return;
    
    // 開始時間と終了時間が正しく設定されているか確認
    if (startTime >= endTime) {
      setError('開始時間は終了時間より前に設定してください。');
      return;
    }
    
    // 選択された範囲が短すぎないか確認
    if (endTime - startTime < 0.5) {
      setError('選択された範囲が短すぎます。少なくとも0.5秒以上の長さを選択してください。');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startTime', startTime.toString());
      formData.append('endTime', endTime.toString());
      formData.append('outputFormat', outputFormat);
      
      const response = await startTrimming(formData);
      
      if (response.success && response.data) {
        const taskData = response.data;
        setTrimTask(taskData);
        setProgress(0);
        
        // 定期的に進捗を取得
        pollingRef.current = setInterval(async () => {
          await checkProgress(taskData.id);
        }, 1000);
      } else {
        setError(response.error || 'トリミングの開始に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to start trimming:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 進捗状況を確認
  const checkProgress = async (taskId: string) => {
    try {
      const response = await getTrimmingStatus(taskId);
      
      if (response.success && response.data) {
        setTrimTask(response.data);
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
    if (trimTask?.outputPath) {
      return getFileDownloadUrl(trimTask.outputPath);
    }
    return null;
  };

  // 処理をリセットして新しいファイルをアップロード
  const handleReset = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFile(null);
    setFileUrl(null);
    setTrimTask(null);
    setProgress(0);
    setError(null);
    setDuration(0);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">動画のトリミング</h2>
      
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
      {file && fileUrl && !trimTask && (
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
          
          {/* トリミング設定 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-3">トリミング範囲</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-20">
                  <label htmlFor="start-time" className="block text-sm mb-1">
                    開始時間
                  </label>
                  <input
                    type="number"
                    id="start-time"
                    min="0"
                    max={Math.max(0, endTime - 0.5)}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="input-field py-1"
                  />
                </div>
                
                <div className="mx-2 text-gray-500">-</div>
                
                <div className="w-20">
                  <label htmlFor="end-time" className="block text-sm mb-1">
                    終了時間
                  </label>
                  <input
                    type="number"
                    id="end-time"
                    min={startTime + 0.5}
                    max={duration}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="input-field py-1"
                  />
                </div>
                
                <div className="ml-4">
                  <p className="text-sm mb-1">長さ</p>
                  <p className="font-medium">{formatDuration(endTime - startTime)}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setCurrentAsStart}
                >
                  現在位置を開始点に設定
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setCurrentAsEnd}
                >
                  現在位置を終了点に設定
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">出力設定</h3>
              
              <label htmlFor="output-format" className="block mb-2 text-sm">
                出力形式
              </label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="input-field py-2"
                disabled={isLoading}
              >
                <option value="mp4">MP4</option>
                <option value="mov">MOV</option>
                <option value="avi">AVI</option>
                <option value="webm">WebM</option>
                <option value="gif">GIF</option>
              </select>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* トリミング開始ボタン */}
          <Button
            onClick={handleStartTrimming}
            disabled={isLoading || startTime >= endTime}
            variant="default"
            size="lg"
            className="w-full"
          >
            <FaCut className="mr-2" />
            トリミング開始
          </Button>
        </div>
      )}
      
      {/* トリミング進捗表示 */}
      {trimTask && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">処理状況</h3>
          
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-center mb-4">
            {trimTask.status === 'pending' && 'トリミングを準備中...'}
            {trimTask.status === 'processing' && `処理中... ${progress}%`}
            {trimTask.status === 'completed' && 'トリミングが完了しました！'}
            {trimTask.status === 'error' && `エラーが発生しました: ${trimTask.error}`}
          </p>
          
          {/* ダウンロードリンク */}
          {trimTask.status === 'completed' && (
            <div className="text-center">
              <a
                href={getDownloadLink() || '#'}
                download
                className="btn btn-primary inline-block"
              >
                <FaDownload className="mr-2 inline-block" />
                トリミングした動画をダウンロード
              </a>
              
              {/* リセットボタン */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="ml-4"
              >
                別の動画をトリミング
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}