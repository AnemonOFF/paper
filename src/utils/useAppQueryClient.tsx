import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";

const useAppQueryClient = () => {
	const onQueryError = useCallback(
		(err: unknown) => {
			let errorMessage;
			if (axios.isAxiosError(err) && err.response) {
				errorMessage = err.response.data.error?.message ?? err.message;
			} else if (err instanceof Error) errorMessage = err.message;
			notifications.show({
				title: "Ошибка запроса",
				message: errorMessage,
				icon: <IconX />,
				color: "red",
			});
		},
		[]
	);

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5,
						retry: 3,
						keepPreviousData: true,
						refetchOnWindowFocus: true,
						onError: onQueryError,
					},
					mutations: {
						onError: onQueryError,
					},
				},
			})
	);

	return queryClient;
};

export default useAppQueryClient;
