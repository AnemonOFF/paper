import { createStyles, rem } from "@mantine/core";

const useProfileCardStyles = createStyles((theme) => ({
	wrapper: {
		position: "fixed",
		width: rem(1000),

		left: "50%",
		top: "50%",
		transform: "translate(-50%, -50%)",

		[theme.fn.smallerThan("lg")]: {
			position: "initial",
			width: rem(1000),
			maxWidth: `calc(100vw - ${theme.spacing.md} * 2)`,
			transform: "unset",
			margin: "auto",
		},

		[theme.fn.smallerThan("xs")]: {
			border: "none !important",
			boxShadow: "none !important",
		},
	},

	avatarGrid: {
		display: "flex",
		alignItems: "stretch",
		gap: theme.spacing.md,
		width: "100%",

		[theme.fn.smallerThan("xs")]: {
			flexDirection: "column",
			alignItems: "center",
		},
	},

	grid: {
		flex: 1,
		width: "100%",
	},
}));

export default useProfileCardStyles;
