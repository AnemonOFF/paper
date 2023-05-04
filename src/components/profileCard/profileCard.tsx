import { Button, Group, Paper, SimpleGrid, TextInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { isNotEmpty, useForm } from "@mantine/form";
import React from "react";
import PreviewDropzone from "../previewDropzone";
import useProfileCardStyles from "./profileCard.styles";

type FormValues = {
	username: string;
	fullname: string;
	avatar?: FileWithPath;
};

type Props = {
	onSubmit: (data: FormValues) => Promise<void>;
	initialValues: FormValues;
};

const ProfileCard: React.FC<Props> = ({
	onSubmit: onSubmitProps,
	initialValues,
}) => {
	const { classes } = useProfileCardStyles();
	const form = useForm<FormValues>({
		initialValues: initialValues,
		validate: {
			username: isNotEmpty("Username cannot be empty"),
		},
	});

	const onFormSubmit = form.onSubmit(async (data) => {
		if (!form.isDirty()) return;
		await onSubmitProps({
			username: data.username,
			fullname: data.fullname,
		});
		form.resetDirty();
		form.resetTouched();
	});

	return (
		<Paper className={classes.wrapper} p="md" withBorder shadow="xl">
			<form onSubmit={onFormSubmit}>
				<Group align="stretch" spacing="md" w="100%">
					<PreviewDropzone
						onDrop={(file) => form.setFieldValue("avatar", file)}
						width={250}
						height={250}
						{...form.getInputProps("avatar")}
					/>
					<SimpleGrid cols={2} className={classes.grid}>
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
				</Group>
				<Button type="submit">Save</Button>
			</form>
		</Paper>
	);
};

export default React.memo(ProfileCard);
