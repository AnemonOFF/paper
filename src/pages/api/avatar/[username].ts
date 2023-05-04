import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import formidable from "formidable";

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
		const filePath = path.join(process.cwd(), "public", profile.avatarUrl);
		try {
			await fs.rm(filePath);
		} catch (err) {}
	}
	try {
		const uploadResult = await uploadAvatar(req, username);
		const filename = (uploadResult.files.file as formidable.File)
			.newFilename;
		const result = await prisma.profile.update({
			where: { username: username.substring(1) },
			data: { avatarUrl: `avatars/${filename}` },
		});
		return res.status(200).json(result);
	} catch (err) {
		return res.status(500).end();
	}
}

const uploadAvatar = async (
	req: NextApiRequest,
	username: string
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
	const uploadDir = path.join(process.cwd(), "public", "avatars");
	try {
		await fs.readdir(uploadDir);
	} catch (err) {
		await fs.mkdir(uploadDir);
	}

	const options: formidable.Options = {
		uploadDir,
		maxFiles: 1,
		maxFileSize: 512000,
		filename: (name, ext, part, form) =>
			`${username}.${part.mimetype?.split("/").pop()}`,
	};

	const form = formidable(options);
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			resolve({ fields, files });
		});
	});
};
