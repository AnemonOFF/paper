import useTheme from "@/utils/useTheme";
import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getCookie } from "cookies-next";
import NextApp, { AppProps, AppContext } from "next/app";
import Head from "next/head";

export default function App({
	Component,
	pageProps,
	colorScheme: propsColorScheme,
}: AppProps & { colorScheme: ColorScheme }) {
	const { theme, colorScheme, toggleColorScheme } =
		useTheme(propsColorScheme);

	return (
		<>
			<Head>
				<title>Paper</title>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}
			>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={theme}
				>
					<Notifications position="top-right" />
					<Component {...pageProps} />
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}

App.getInitialProps = async (appContext: AppContext) => {
	const appProps = await NextApp.getInitialProps(appContext);
	return {
		...appProps,
		colorScheme: getCookie("mantine-color-scheme", appContext.ctx),
	};
};
