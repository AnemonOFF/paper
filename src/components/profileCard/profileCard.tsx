import {
	ActionIcon,
	Button,
	Group,
	Paper,
	SimpleGrid,
	TextInput,
	useMantineTheme,
} from "@mantine/core";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { isEmail, isNotEmpty, matches, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Prisma } from "@prisma/client";
import { IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import PreviewDropzone from "../previewDropzone";
import useProfileCardStyles from "./profileCard.styles";

type FormValues = {
	username: string;
	fullname: string;
	email: string;
	phone: string;
	telegram: string;
	url: string;
	avatar?: FileWithPath;
};

type Props = {
	onSubmit: (data: Prisma.ProfileUpdateInput) => Promise<boolean>;
	initialValues: FormValues;
	onDelete?: () => void;
	initialAvatarUrl?: string;
};

const ProfileCard: React.FC<Props> = ({
	onSubmit: onSubmitProps,
	onDelete,
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
			email: (v) =>
				!v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
					? null
					: "Not valid email",
			phone: (v) =>
				!v ||
				/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
					v
				)
					? null
					: "Not valid phone",
			telegram: (v) =>
				!v || (v.length > 1 && v[0] === "@")
					? null
					: "Not valid telegram username (should start with @)",
			url: (v) =>
				!v ||
				/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(
					v
				)
					? null
					: "Not valid url",
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
				email: form.isDirty("email") ? data.email : undefined,
				phone: form.isDirty("phone") ? data.phone : undefined,
				telegram: form.isDirty("telegram") ? data.telegram : undefined,
				url: form.isDirty("url") ? data.url : undefined,
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
						mah={254}
						maw={254}
						{...form.getInputProps("avatar")}
					/>
					<SimpleGrid
						cols={2}
						breakpoints={[{ maxWidth: "sm", cols: 1 }]}
						className={classes.grid}
					>
						<TextInput
							label="Username"
							placeholder="Username"
							required
							autoComplete="username"
							{...form.getInputProps("username")}
						/>
						<TextInput
							label="Full name"
							placeholder="Full name"
							autoComplete="name"
							{...form.getInputProps("fullname")}
						/>
						<TextInput
							label="Email"
							placeholder="email@email.com"
							autoComplete="email"
							{...form.getInputProps("email")}
						/>
						<TextInput
							label="Phone"
							placeholder="14924495029"
							autoComplete="tel"
							{...form.getInputProps("phone")}
						/>
						<TextInput
							label="Telegram"
							placeholder="@username"
							{...form.getInputProps("telegram")}
						/>
						<TextInput
							label="Url"
							placeholder="yoursite.com"
							autoComplete="url"
							{...form.getInputProps("url")}
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
					{onDelete && initialValues.username !== "" && (
						<ActionIcon
							variant="filled"
							color="red"
							size="lg"
							onClick={onDelete}
						>
							<IconTrash />
						</ActionIcon>
					)}
				</Group>
			</form>
		</Paper>
	);
};

export default React.memo(ProfileCard);
