import {
	Button,
	Group,
	Paper,
	SimpleGrid,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import PreviewDropzone from "../previewDropzone";
import useProfileCardStyles from "./profileCard.styles";

type FormValues = {
	username: string;
	fullname: string;
	avatar?: FileWithPath;
};

type Props = {
	onSubmit: (data: Prisma.ProfileUpdateInput) => Promise<boolean>;
	initialValues: FormValues;
	initialAvatarUrl?: string;
};

const ProfileCard: React.FC<Props> = ({
	onSubmit: onSubmitProps,
	initialValues,
	initialAvatarUrl,
}) => {
	const router = useRouter();
	const theme = useMantineTheme();
	const { classes } = useProfileCardStyles();
	const [previewUrl, setPreviewUrl] = useState<string | undefined>(
		() => initialAvatarUrl
	);
	const form = useForm<FormValues>({
		initialValues: initialValues,
		validate: {
			username: isNotEmpty("Username cannot be empty"),
		},
	});

	const uploadAvatar = async (username: string, avatar: File | Blob) => {
		try {
			const data = new FormData();
			data.append("file", avatar);
			const response = await fetch("/api/avatar/@" + username, {
				method: "POST",
				body: data,
			});
			if (!response.ok) throw new Error();
			return true;
		} catch (err) {
			if (err instanceof Error) {
				notifications.show({
					title: "Unable to upload avatar",
					message: err.message,
					color: "red",
					icon: <IconX />,
				});
			}
			return false;
		}
	};

	const onFormSubmit = form.onSubmit(async (data) => {
		if (!form.isDirty()) return;
		if (
			await onSubmitProps({
				username: form.isDirty("username") ? data.username : undefined,
				fullname: form.isDirty("fullname") ? data.fullname : undefined,
			})
		) {
			if (data.avatar && form.isDirty("avatar"))
				await uploadAvatar(data.username, data.avatar);
			router.push(`/@${data.username}`);
			form.resetDirty();
			form.resetTouched();
		}
	});

	const onAvatarDrop = (file: FileWithPath) => {
		form.setFieldValue("avatar", file);
		if (previewUrl !== initialAvatarUrl && previewUrl)
			URL.revokeObjectURL(previewUrl);
		const newPreviewUrl = URL.createObjectURL(file);
		setPreviewUrl(newPreviewUrl);
	};

	const onAvatarReject = (fileRejection: FileRejection) => {
		console.log(fileRejection);
		notifications.show({
			title: "Unable to upload avatar",
			message: fileRejection.errors.map((err) => err.message).join("\n"),
			color: "red",
			icon: <IconX />,
		});
	};

	return (
		<Paper className={classes.wrapper} p="md" withBorder shadow="xl">
			<form onSubmit={onFormSubmit}>
				<div className={classes.avatarGrid}>
					<PreviewDropzone
						onDrop={onAvatarDrop}
						onReject={onAvatarReject}
						width={250}
						height={250}
						maxSize={512000}
						previewUrl={previewUrl}
						{...form.getInputProps("avatar")}
					/>
					<SimpleGrid
						cols={2}
						breakpoints={[{ maxWidth: "sm", cols: 1 }]}
						className={classes.grid}
					>
						<TextInput
							label="Username"
							required
							{...form.getInputProps("username")}
						/>
						<TextInput
							label="Full name"
							{...form.getInputProps("fullname")}
						/>
					</SimpleGrid>
				</div>
				<Group
					w="100%"
					align="center"
					mt="md"
					sx={{ justifyContent: "end" }}
				>
					<Button type="submit">Save profile</Button>
				</Group>
			</form>
		</Paper>
	);
};

export default React.memo(ProfileCard);
