import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import * as fs from 'fs';
import { PutObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';

class S3Service {
	private configService: ConfigService = new ConfigService();
	private client: S3;

	constructor() {
		this.client = new S3({
			credentials: {
				accessKeyId: 'ca36227',
				secretAccessKey: '002cbffb500f9a268b03071a356c22a8'
			},
			endpoint: 'https://s3.timeweb.com',
			region: 'ru-1',
			apiVersion: 'latest'
		});
	}
	//
	public async uploadFile(file: Readable, key: string): Promise<void> {
		await this.client.putObject({
			Bucket: '1d76fb16-c0c688fa-0458-4085-8123-928070831ea0',
			Key: key,
			Body: file
		});
	}

	public async deleteFile(keyName: string): Promise<void> {
		await this.client.deleteObject({
			Bucket: '1d76fb16-c0c688fa-0458-4085-8123-928070831ea0',
			Key: keyName
		});
	}

	public getLinkByKeyName(keyName: string): string {
		return `https://s3.timeweb.com/1d76fb16-c0c688fa-0458-4085-8123-928070831ea0/${keyName}`;
	}
}

export default new S3Service();
