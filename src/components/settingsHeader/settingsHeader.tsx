import { Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeToggle from "../themeToggle";
import useSettingsHeaderStyles from "./settingsHeader.styles";

const SettingsHeader: React.FC = () => {
	const { classes } = useSettingsHeaderStyles();

	return (
		<header className={classes.header}>
			<Link href="/" style={{textDecoration: "none"}}>
				<Group align="center">
					<Image
						src="/favicon-32x32.png"
						width={32}
						height={32}
						alt="Logo"
					/>
					<Text size="xl" weight="bold" className={classes.link} >
						Paper
					</Text>
				</Group>
			</Link>
			<div className={classes.wrapper}>
				<ThemeToggle />
			</div>
		</header>
	);
};

export default React.memo(SettingsHeader);
