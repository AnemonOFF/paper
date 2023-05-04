import { ColorScheme, MantineThemeOverride } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";

const overrideTheme: MantineThemeOverride = {
	defaultRadius: "md",
};

const useTheme = (forceTheme?: ColorScheme) => {
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useState<ColorScheme>(
		forceTheme ?? preferredColorScheme
	);

	useEffect(() => {
		if (forceTheme === undefined) {
			setColorScheme(preferredColorScheme);
			setCookie("mantine-color-scheme", preferredColorScheme, {
				maxAge: 60 * 60 * 24 * 30,
			});
		}
	}, [forceTheme, preferredColorScheme]);

	const toggleColorScheme = (value?: ColorScheme) => {
		const nextColorScheme =
			value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		setCookie("mantine-color-scheme", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	};

	const theme: MantineThemeOverride = {
		...overrideTheme,
		colorScheme,
	};

	return {
		theme,
		colorScheme,
		toggleColorScheme,
	};
};

export default useTheme;
