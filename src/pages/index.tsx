import { ProfileCard, SettingsHeader } from "@/components";
import { Box } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import { IconX } from "@tabler/icons-react";
import { NextPage } from "next";

const HomePage: NextPage = () => {
	const createProfile = async (data: Prisma.ProfileUpdateInput) => {
		if (data.username === undefined) return false;
		try {
			const response = await fetch("/api/profile", {
				method: "POST",
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
				onSubmit={createProfile}
				initialValues={{
					username: "",
					fullname: "",
					email: "",
					phone: "",
					telegram: "",
					url: "",
				}}
			/>
		</Box>
	);
};

export default HomePage;
