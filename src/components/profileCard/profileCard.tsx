import { Group, Paper, SimpleGrid, TextInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import React, { useState } from "react";
import PreviewDropzone from "../previewDropzone";
import useProfileCardStyles from "./profileCard.styles";

const ProfileCard: React.FC = () => {
	const [avatar, setAvatar] = useState<FileWithPath>();
	const { classes } = useProfileCardStyles();

	return (
		<Paper className={classes.wrapper} p="md" withBorder shadow="xl">
			<Group align="stretch" spacing="md" w="100%">
				<PreviewDropzone onDrop={setAvatar} width={250} height={250} />
				<SimpleGrid cols={2} className={classes.grid}>
					<TextInput label="Ник" required />
					<TextInput label="Имя" />
				</SimpleGrid>
			</Group>
		</Paper>
	);
};

export default React.memo(ProfileCard);
