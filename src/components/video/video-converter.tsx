'use client';

import { useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { FaUpload, FaExchangeAlt, FaDownload, FaInfoCircle } from 'react-icons/fa';
import { ConversionTask } from '@/src/lib/types';
import { startConversion, getConversionStatus, getFileDownloadUrl } from '@/src/lib/api';
import { formatBytes, getFileExtension } from '@/src/lib/utils';
import { useDropzone } from 'react-dropzone';

export default function VideoConverter() {
  // ファイルとフォーマットの状態
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 変換タスクの状態
  const [conversionTask, setConversionTask] = useState<ConversionTask | null>(null);
  const [progress, setProgress] = useState(0);
  
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
        // 既存のタスクがあればリセット
        if (conversionTask) {
          setConversionTask(null);
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

  // 変換処理を開始
  const handleStartConversion = async () => {
    if (!file) return;
    
    // 同じ形式に変換しようとした場合
    const currentExtension = getFileExtension(file.name).toLowerCase();
    if (currentExtension === outputFormat.toLowerCase()) {
      setError(`ファイルはすでに${outputFormat}形式です。別の形式を選択してください。`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);
      
      const response = await startConversion(formData);
      
      if (response.success && response.data) {
        const taskData = response.data;
        setConversionTask(taskData);
        setProgress(0);
        
        // 定期的に進捗を取得
        pollingRef.current = setInterval(async () => {
          await checkProgress(taskData.id);
        }, 1000);
      } else {
        setError(response.error || '変換の開始に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to start conversion:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 進捗状況を確認
  const checkProgress = async (taskId: string) => {
    try {
      const response = await getConversionStatus(taskId);
      
      if (response.success && response.data) {
        setConversionTask(response.data);
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
    if (conversionTask?.outputPath) {
      return getFileDownloadUrl(conversionTask.outputPath);
    }
    return null;
  };

  // 処理をリセットして新しいファイルをアップロード
  const handleReset = () => {
    setFile(null);
    setConversionTask(null);
    setProgress(0);
    setError(null);
    
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">動画形式の変換</h2>
      
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
      
      {/* アップロードされたファイル情報 */}
      {file && !conversionTask && (
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
          
          {/* 変換設定 */}
          <div className="mb-6">
            <label htmlFor="output-format" className="block mb-2 font-medium">
              出力形式
            </label>
            <select
              id="output-format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="input-field"
              disabled={isLoading}
            >
              <option value="mp4">MP4</option>
              <option value="mov">MOV</option>
              <option value="avi">AVI</option>
              <option value="mkv">MKV</option>
              <option value="webm">WebM</option>
              <option value="gif">GIF</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* 変換開始ボタン */}
          <Button
            onClick={handleStartConversion}
            disabled={isLoading}
            variant="default"
            size="lg"
            className="w-full"
          >
            <FaExchangeAlt className="mr-2" />
            変換開始
          </Button>
        </div>
      )}
      
      {/* 変換進捗表示 */}
      {conversionTask && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">変換状況</h3>
          
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-center mb-4">
            {conversionTask.status === 'pending' && '変換を準備中...'}
            {conversionTask.status === 'processing' && `変換中... ${progress}%`}
            {conversionTask.status === 'completed' && '変換が完了しました！'}
            {conversionTask.status === 'error' && `エラーが発生しました: ${conversionTask.error}`}
          </p>
          
          {/* ダウンロードリンク */}
          {conversionTask.status === 'completed' && (
            <div className="text-center">
              <a
                href={getDownloadLink() || '#'}
                download
                className="btn btn-primary inline-block"
              >
                <FaDownload className="mr-2 inline-block" />
                変換ファイルをダウンロード
              </a>
              
              {/* ファイル保持期間に関する注意書き */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm flex items-start">
                <FaInfoCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-700">
                  <strong>お知らせ:</strong> 変換ファイルは24時間後に自動的に削除されます。
                  必要なファイルは、お使いのデバイスに保存してください。
                </p>
              </div>
              
              {/* リセットボタン */}
              <Button
                onClick={handleReset}
                variant="outline"
                className="mt-4"
              >
                別のファイルを変換
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}