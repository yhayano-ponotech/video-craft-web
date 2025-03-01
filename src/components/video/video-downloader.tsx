'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { FaSearch, FaDownload } from 'react-icons/fa';
import { YoutubeVideoInfo, VideoFormat, DownloadTask } from '@/src/lib/types';
import { getVideoInfo, startDownload, getDownloadStatus, getFileDownloadUrl } from '@/src/lib/api';
import { formatBytes, formatDuration, extractYoutubeVideoId } from '@/src/lib/utils';

export default function VideoDownloader() {
  // YouTube URLの入力状態
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 動画情報の状態
  const [videoInfo, setVideoInfo] = useState<YoutubeVideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<number | null>(null);
  
  // ダウンロードタスクの状態
  const [downloadTask, setDownloadTask] = useState<DownloadTask | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // URLの検証
  useEffect(() => {
    const videoId = extractYoutubeVideoId(url);
    setIsValidUrl(!!videoId);
  }, [url]);

  // ダウンロードタスクの進捗を定期的に取得
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (downloadTask && downloadTask.status !== 'completed' && downloadTask.status !== 'error') {
      interval = setInterval(async () => {
        try {
          const response = await getDownloadStatus(downloadTask.id);
          if (response.success && response.data) {
            setDownloadTask(response.data);
            setDownloadProgress(response.data.progress);
            
            // 完了したらインターバルをクリア
            if (response.data.status === 'completed' || response.data.status === 'error') {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error('Failed to fetch download status:', err);
        }
      }, 1000); // 1秒ごとに更新
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [downloadTask]);

  // 動画情報を取得する
  const handleFetchVideoInfo = async () => {
    if (!isValidUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getVideoInfo(url);
      
      if (response.success && response.data) {
        setVideoInfo(response.data);
        
        // 高品質なMP4フォーマットを自動選択する
        const bestFormat = findBestFormat(response.data.formats);
        if (bestFormat) {
          setSelectedFormat(bestFormat.itag);
        }
      } else {
        setError(response.error || '動画情報の取得に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to fetch video info:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // ダウンロードを開始する
  const handleStartDownload = async () => {
    if (!videoInfo || !selectedFormat) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await startDownload(url, selectedFormat);
      
      if (response.success && response.data) {
        setDownloadTask(response.data);
        setDownloadProgress(0);
      } else {
        setError(response.error || 'ダウンロードの開始に失敗しました。');
      }
    } catch (err) {
      console.error('Failed to start download:', err);
      setError('エラーが発生しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 最適なフォーマットを見つける（高品質なMP4を優先）
  const findBestFormat = (formats: VideoFormat[]): VideoFormat | null => {
    // 動画と音声の両方を含むMP4フォーマットをフィルタリング
    const mp4Formats = formats.filter(
      (f) => f.container === 'mp4' && f.hasVideo && f.hasAudio
    );
    
    if (mp4Formats.length === 0) return null;
    
    // ビットレートが高い順にソートして最初のものを返す
    return mp4Formats.sort((a, b) => b.bitrate - a.bitrate)[0];
  };

  // フォーマット選択の変更を処理
  const handleFormatChange = (itagValue: string) => {
    setSelectedFormat(parseInt(itagValue, 10));
  };

  // ダウンロードファイルへのリンクを取得
  const getDownloadLink = () => {
    if (downloadTask?.outputPath) {
      return getFileDownloadUrl(downloadTask.outputPath);
    }
    return null;
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">YouTube動画ダウンロード</h2>
      
      {/* URL入力フォーム */}
      <div className="mb-6">
        <label htmlFor="youtube-url" className="block mb-2 font-medium">
          YouTube URL
        </label>
        <div className="flex">
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="input-field flex-grow"
            disabled={isLoading || !!downloadTask}
          />
          <Button
            onClick={handleFetchVideoInfo}
            disabled={!isValidUrl || isLoading || !!downloadTask}
            className="ml-2"
          >
            <FaSearch className="mr-2" />
            検索
          </Button>
        </div>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      {/* 動画情報表示 */}
      {videoInfo && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* サムネイル画像 */}
            <div className="w-full md:w-1/3">
              <img
                src={videoInfo.thumbnailUrl}
                alt={videoInfo.title}
                className="w-full h-auto rounded shadow"
              />
            </div>
            
            {/* 動画情報 */}
            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-bold mb-2">{videoInfo.title}</h3>
              <p className="mb-2">作者: {videoInfo.author}</p>
              <p className="mb-4">時間: {formatDuration(videoInfo.duration)}</p>
              
              {/* フォーマット選択 */}
              <div className="mb-4">
                <label htmlFor="format-select" className="block mb-2 font-medium">
                  ダウンロード形式
                </label>
                <select
                  id="format-select"
                  value={selectedFormat || ''}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  className="input-field"
                  disabled={isLoading || !!downloadTask}
                >
                  <option value="" disabled>
                    形式を選択してください
                  </option>
                  {videoInfo.formats
                    .filter((f) => f.hasVideo && f.hasAudio) // 動画と音声の両方を含むフォーマットのみ
                    .map((format) => (
                      <option key={format.itag} value={format.itag}>
                        {format.quality} ({format.container}) - {format.codecs} - {format.size ? formatBytes(format.size) : '不明'}
                      </option>
                    ))}
                </select>
              </div>
              
              {/* ダウンロードボタン */}
              <Button
                onClick={handleStartDownload}
                disabled={!selectedFormat || isLoading || !!downloadTask}
                variant="default"
                size="lg"
              >
                <FaDownload className="mr-2" />
                ダウンロード開始
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* ダウンロード進捗表示 */}
      {downloadTask && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">ダウンロード状況</h3>
          
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
          
          <p className="text-center mb-4">
            {downloadTask.status === 'pending' && 'ダウンロードを準備中...'}
            {downloadTask.status === 'downloading' && `ダウンロード中... ${downloadProgress}%`}
            {downloadTask.status === 'processing' && `処理中... ${downloadProgress}%`}
            {downloadTask.status === 'completed' && 'ダウンロードが完了しました！'}
            {downloadTask.status === 'error' && `エラーが発生しました: ${downloadTask.error}`}
          </p>
          
          {/* ダウンロードリンク */}
          {downloadTask.status === 'completed' && (
            <div className="text-center">
              <a
                href={getDownloadLink() || '#'}
                download
                className="btn btn-primary inline-block"
              >
                <FaDownload className="mr-2 inline-block" />
                ファイルをダウンロード
              </a>
              
              {/* リセットボタン */}
              <Button
                onClick={() => {
                  setDownloadTask(null);
                  setVideoInfo(null);
                  setUrl('');
                }}
                variant="outline"
                className="ml-4"
              >
                別の動画をダウンロード
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}