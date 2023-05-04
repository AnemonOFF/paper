import React from "react";
import ThemeToggle from "../themeToggle";
import useSettingsHeaderStyles from "./settingsHeader.styles";

const SettingsHeader: React.FC = () => {
	const { classes } = useSettingsHeaderStyles();

	return (
		<header className={classes.header}>
			<div className={classes.wrapper}>
				<ThemeToggle />
			</div>
		</header>
	);
};

export default React.memo(SettingsHeader);
