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
			maxWidth: rem(1000),
			width: "100%",
			transform: "unset",
			margin: "auto",
		},
	},

	grid: {
		flex: 1,
	},
}));

export default useProfileCardStyles;
