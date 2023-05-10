import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import formidable from "formidable";
import { s3 } from "@/utils/s3";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") return res.status(405).end();

	let username = Array.isArray(req.query.username)
		? req.query.username[0]
		: req.query.username;
	if (username === undefined || username[0] !== "@")
		return res.status(400).end();

	const profile = await prisma.profile.findUnique({
		where: { username: username.substring(1) },
	});
	if (!profile) return res.status(404).end();

	if (profile.avatarUrl) {
		try {
			await deleteAvatar(profile.avatarUrl);
		} catch (err) {
			return res
				.status(500)
				.json({ message: "Avatar delete from YOS error" });
		}
	}
	try {
		const uploadResult = await uploadAvatar(req, username);
		const filename = uploadResult.filename;
		const result = await prisma.profile.update({
			where: { username: username.substring(1) },
			data: { avatarUrl: filename },
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).end();
	}
}

export const deleteAvatar = async (filepath: string) => {
	const remove = await s3.Remove(filepath);
	if (remove === undefined) throw new Error("Avatar delete from YOS error");
};

const uploadAvatar = async (
	req: NextApiRequest,
	username: string
): Promise<{ filename: string; result: any }> => {
	const options: formidable.Options = {
		maxFiles: 1,
		maxFileSize: 512000,
		filename: (name, ext, part, form) =>
			`${username}.${part.mimetype?.split("/").pop()}`,
	};

	const form = formidable(options);
	return new Promise((resolve, reject) => {
		form.parse(req, async (err, fields, files) => {
			if (err) reject(err);
			const filename = (files.file as formidable.File).newFilename;
			const filepath = (files.file as formidable.File).filepath;
			const upload = await s3.Upload(
				{
					path: filepath,
				},
				"/avatars/"
			);
			await fs.rm(filepath);
			if (upload === false) reject("YOS uploading error");
			resolve({ filename: (upload as any).key, result: upload });
		});
	});
};

// const uploadAvatar = async (
// 	req: NextApiRequest,
// 	username: string
// ): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
// 	const uploadDir = path.join(process.cwd(), "public", "avatars");
// 	try {
// 		await fs.readdir(uploadDir);
// 	} catch (err) {
// 		await fs.mkdir(uploadDir);
// 	}

// 	const options: formidable.Options = {
// 		uploadDir,
// 		maxFiles: 1,
// 		maxFileSize: 512000,
// 		filename: (name, ext, part, form) =>
// 			`${username}.${part.mimetype?.split("/").pop()}`,
// 	};

// 	const form = formidable(options);
// 	return new Promise((resolve, reject) => {
// 		form.parse(req, (err, fields, files) => {
// 			if (err) reject(err);
// 			resolve({ fields, files });
// 		});
// 	});
// };
