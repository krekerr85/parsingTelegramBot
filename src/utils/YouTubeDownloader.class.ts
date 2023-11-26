import * as ytdl from 'ytdl-core';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs'
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

	public processVideoStream = async (
		videoStream: Readable,
		filename: string
	) => {
		const processedVideoPath = `../static/videos/${filename}.mp4`;
		return new Promise<Readable>((resolve, reject) => {
			//@ts-ignore
			// const ffmpegInstance = ffmpeg();
			// console.log(ffmpegInstance)
			ffmpeg()
				.input(videoStream).size('640x640').autopad()
				.saveToFile(`src/static/videos/${filename}.mp4`)
				.on('end', () => {
					console.log('Video processing completed!');

					// Read the processed video from the file system
					//console.log(path.join(__dirname,'../static/videos/audio.mp4'))
					const processedVideoBuffer = fs.readFileSync(path.join(__dirname,`../../src/static/videos/${filename}.mp4`));

					// Send the processed video
					// Replace the following line with your actual code to send the processed video

					// Delete the processed video file
					
					const processedVideoStream = new Readable();
					processedVideoStream.push(processedVideoBuffer);
					processedVideoStream.push(null);
					resolve(processedVideoStream);
				})
				.on('error', error => {
					console.error('Error processing video:', error);
					reject(error);
				})
				.run();
		});
	};
}
