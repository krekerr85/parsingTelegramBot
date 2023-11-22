import * as path from 'path';
import * as fs from 'fs';
import { pipe } from 'rxjs';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

export class FileClass {
	private readonly configService: ConfigService = new ConfigService();
	private readonly folder: string = path.join(
		__dirname,
		'../../',
		'/static/videos/'
	);
	readonly name: string;
	readonly userId: number;
	readonly videoStream: Readable;

	constructor(name: string, videoStream: any, userId?: number) {
		this.name = name;
		this.videoStream = videoStream;
		this.userId = userId;
	}

	public save = async (): Promise<void> => {
		try {
			const isFolderExist = this.isFolderExist;

			if (!isFolderExist) {
				fs.mkdirSync(this.folder);
			}

			const file = fs.createWriteStream(this.path);
			this.videoStream.pipe(file);

			return new Promise((resolve, reject) => {
				file.on('finish', resolve);
				file.on('error', reject);
			});
		} catch (err) {
			throw err;
		}
	};

	public delete = async (): Promise<void> => {
		fs.unlinkSync(this.path);
	};

	public get video(): string {
		return this.path;
	}

	public get path(): string {
		return this.folder + `${this.name}_${this.userId}.mp4`;
	}

	public get link(): string {
		const domain = this.configService.get<string>('TELEGRAM_WEBHOOK_DOMAIN');
		const path = this.configService.get<string>('TELEGRAM_WEBHOOK_PATH');
		return `${domain}${path}/static/videos/${this.name}_${this.userId}.mp4`;
	}
	//
	private get isFolderExist(): boolean {
		return fs.existsSync(this.folder);
	}
}
