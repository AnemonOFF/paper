import { createStyles } from "@mantine/core";

const useSettingsHeaderStyles = createStyles((theme) => ({
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: theme.spacing.md,
	},

	wrapper: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing.md,
	},

	link: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
	},
}));

export default useSettingsHeaderStyles;
