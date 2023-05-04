import {
	useMantineColorScheme,
	ActionIcon,
	Group,
	MantineTheme,
} from "@mantine/core";
import React from "react";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

type Props = {
	backgroundColor?: (theme: MantineTheme) => string;
	hoverBackgroundColor?: (theme: MantineTheme) => string;
};

const ThemeToggle: React.FC<Props> = ({
	backgroundColor = (theme) =>
		theme.colorScheme === "dark"
			? theme.colors.dark[6]
			: theme.colors.gray[0],
	hoverBackgroundColor = (theme) => undefined,
}) => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<Group position="center">
			<ActionIcon
				onClick={() => toggleColorScheme()}
				size="lg"
				sx={(theme) => ({
					backgroundColor: backgroundColor(theme),
					"&:hover": {
						backgroundColor: hoverBackgroundColor(theme),
					},
					color:
						theme.colorScheme === "dark"
							? theme.colors.yellow[4]
							: theme.colors.blue[6],
				})}
			>
				{colorScheme === "dark" ? (
					<IconSun size="1.2rem" />
				) : (
					<IconMoonStars size="1.2rem" />
				)}
			</ActionIcon>
		</Group>
	);
};

export default React.memo(ThemeToggle);
