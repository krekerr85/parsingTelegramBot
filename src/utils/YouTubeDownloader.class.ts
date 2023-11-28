import * as ytdl from 'ytdl-core';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

interface IDownloadVideo {
	videoStream: Readable;
}

export class ClassDownloader {
	public downloadVideo = async (url: string): Promise<IDownloadVideo> => {
		try {
			const [videoStream] = await Promise.all([
				ytdl(url, { quality: 'highestvideo', filter: 'audioandvideo' })
			]);

			return {
				videoStream
			};
		} catch (err) {
			throw err;
		}
	};

	public downloadAudio = async (url: string) => {
		try {
			const [audioStream, audioInfo] = await Promise.all([
				ytdl(url, {
					quality: 'highestaudio',
					filter: 'audioonly'
				}),
				ytdl.getInfo(url)
			]);

			return {
				audioStream,
				audioInfo
			};
		} catch (err) {
			throw err;
		}
	};

	public checkVideoDuration = async (
		url: string,
		durationSeconds: number
	): Promise<boolean> => {
		const info = await ytdl.getInfo(url);
		const durationVideo = Number(info.videoDetails.lengthSeconds);

		return durationVideo <= durationSeconds;
	};

	public checkUrl(url: string): boolean {
		const validQueryDomains = [
			'youtube.com',
			'www.youtube.com',
			'm.youtube.com',
			'music.youtube.com',
			'youtu.be',
			'gaming.youtube.com'
		];

		return validQueryDomains.some(domain => url.includes(domain));
	}

	public checkShortsUrl(url: string): boolean {
		const validQueryDomains = [
			'youtube.com/shorts',
			'www.youtube.com/shorts',
			'youtu.be',
			'm.youtube.com/shorts'
		];

		return validQueryDomains.some(domain => url.includes(domain));
	}

	public processVideoStream = async (filePath: string, filename: string, minSide: number) => {
		return new Promise<Buffer>((resolve, reject) => {
			//@ts-ignore
			ffmpeg(filePath)
				.videoFilter(`crop=${minSide}:${minSide}`)
				.saveToFile(`src/static/videos/${filename}`)
				.on('end', () => {
					console.log('Video processing completed!');
					const processedVideoBuffer = fs.readFileSync(
						path.join(__dirname, `../../src/static/videos/${filename}`)
					);
					resolve(processedVideoBuffer);
				})
				.on('error', error => {
					console.error('Error processing video:', error);
					reject(error);
				})
				.run();
		});
	};
}
