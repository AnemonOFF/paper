import { ProfileCard, SettingsHeader } from "@/components";
import prisma from "@/utils/prisma";
import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Prisma, Profile } from "@prisma/client";
import { IconX } from "@tabler/icons-react";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const username = Array.isArray(context.params?.username)
		? context.params?.username[0]
		: context.params?.username;
	if (username === undefined || username[0] !== "@") {
		return {
			notFound: true,
		};
	}
	const profile = await prisma.profile.findUnique({
		where: { username: username.substring(1) },
	});
	if (!profile) {
		return {
			notFound: true,
		};
	}
	return {
		props: profile,
	};
};

const ProfilePage: NextPage<Profile> = (profile) => {
	const updateProfile = async (data: Prisma.ProfileUpdateInput) => {
		try {
			const response = await fetch(`/api/profile/@${profile.username}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				const message = response.headers
					.get("Content-Type")
					?.includes("application/json")
					? (await response.json())["message"]
					: undefined;
				notifications.show({
					title: response.statusText,
					message: message,
					color: "red",
					icon: <IconX />,
				});
				return false;
			}
			return true;
		} catch (err) {
			if (err instanceof Error) {
				notifications.show({
					message: err.message,
					color: "red",
					icon: <IconX />,
				});
			}
			return false;
		}
	};

	return (
		<Box sx={{ height: "100vh" }}>
			<SettingsHeader />
			<ProfileCard
				onSubmit={updateProfile}
				initialValues={{
					username: profile.username,
					fullname: profile.fullname ?? "",
					email: profile.email ?? "",
					phone: profile.phone ?? "",
					telegram: profile.telegram ?? "",
					url: profile.url ?? "",
				}}
				initialAvatarUrl={profile.avatarUrl ?? undefined}
			/>
		</Box>
	);
};

export default ProfilePage;
