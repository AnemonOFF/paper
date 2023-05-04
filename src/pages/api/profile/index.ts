import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") return res.status(405).end();

	const { username, fullname } = req.body;
	if (username === undefined)
		return res.status(400).json({ message: "username is required" });
	const result = await prisma.profile.create({
		data: {
			username: username,
			fullname: fullname,
		},
	});
	return res.status(201).json(result);
}
