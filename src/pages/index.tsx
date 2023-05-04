import { ProfileCard, SettingsHeader } from "@/components";
import { Box } from "@mantine/core";
import { NextPage } from "next";

const HomePage: NextPage = () => {
	return (
		<Box sx={{ height: "100vh" }}>
			<SettingsHeader />
			<ProfileCard />
		</Box>
	);
};

export default HomePage;
