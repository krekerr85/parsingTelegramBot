import { TiktokDL } from '@tobyg74/tiktok-api-dl';

export class TicTokDownloader {
	public downloadVideo = async (url: string): Promise<string> => {
		try {
			const { result } = await TiktokDL(url, {
				version: 'v1'
			});
			//
			// @ts-ignore
			return result?.video[0];
		} catch (err) {
			throw err;
		}
	};

	public checkUrl(url: string): boolean {
		const validQueryDomains = [
			'abtest-sg-tiktok.byteoversea.com',
			'abtest-va-tiktok.byteoversea.com',
			'byteglb.com',
			'gts.byteoversea.net',
			'isnssdk.com',
			'lf1-ttcdn-tos.pstatp.com',
			'muscdn.com',
			'musemuse.cn',
			'musical.ly',
			'quic-tiktok-core-proxy-i18n-gcpva.byteoversea.net',
			'tiktokcdn.com',
			'tiktok.com',
			'tiktokd.org',
			'tiktok-lb-alisg.byteoversea.net',
			'tiktok-platform-lb-alisg.byteoversea.net',
			'tiktokv.com',
			'tlivecdn.com',
			'ttlivecdn.com',
			'ttoversea.net',
			'ttoverseaus.net'
		];

		return validQueryDomains.some(domain => url.includes(domain));
	}
}
