import EasyYandexS3 from "easy-yandex-s3";

export const s3 = new EasyYandexS3({
	auth: {
		accessKeyId: process.env.S3AccessKey!,
		secretAccessKey: process.env.S3SecretKey!,
	},
	Bucket: process.env.S3Bucket!,
	debug: false,
});
