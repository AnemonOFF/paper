import useAppQueryClient from "@/utils/useAppQueryClient";
import useTheme from "@/utils/useTheme";
import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
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
	const queryClient = useAppQueryClient();

	return (
		<>
			<Head>
				<title>Paper</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<QueryClientProvider client={queryClient}>
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
			</QueryClientProvider>
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
