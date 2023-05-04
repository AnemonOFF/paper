import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	let username = Array.isArray(req.query.username)
		? req.query.username[0]
		: req.query.username;
	if (username === undefined || username[0] !== "@") return res.status(400).end();
    if(await prisma.profile.count({where: {username: username.substring(1)}}) === 0)
        return res.status(404).end();
	switch (req.method) {
		case "GET": {
			const result = await getProfile(username);
			return res.status(200).json(result);
		}
		case "PUT": {
            const result = await updateProfile(username, req.body);
            return res.status(200).json(result);
		}
        case "DELETE": {
            const result = await deleteProfile(username);
            return res.status(200).json(result);
        }
		default: {
			return res.status(405);
		}
	}
}

const updateProfile = async (username: string, body: any) => {
	const { username: newUsername, fullname } = body;
	return await prisma.profile.update({
		where: { username: username.substring(1) },
		data: {
			fullname: fullname,
			username: newUsername,
		},
	});
};

const deleteProfile = async (username: string) => {
	return await prisma.profile.delete({
		where: { username: username.substring(1) },
	});
};

const getProfile = async (username: string) => {
	return await prisma.profile.findUnique({
		where: { username: username.substring(1) },
	});
};
