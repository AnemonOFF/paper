import { createStyles } from "@mantine/core";

const useSettingsHeaderStyles = createStyles((theme) => ({
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "end",
	},

	wrapper: {
		margin: theme.spacing.md,
		display: "flex",
		alignItems: "center",
		gap: theme.spacing.md,
	},
}));

export default useSettingsHeaderStyles;
