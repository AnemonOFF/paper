import {
	Dropzone,
	DropzoneProps,
	FileRejection,
	FileWithPath,
} from "@mantine/dropzone";
import { Group, Image, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React from "react";
import usePreviewDropzoneStyles from "./previewDropzone.styles";

type PreviewDropzoneProps = Partial<
	Omit<
		DropzoneProps,
		"multiple" | "maxFiles" | "onDrop" | "onReject" | "children" | "w" | "h"
	>
> & {
	onDrop: (file: FileWithPath) => void;
	onReject?: (fileRejection: FileRejection) => void;
	error?: boolean;
	width?: number | string;
	height?: number | string;
	previewUrl?: string;
};

const PreviewDropzone: React.FC<PreviewDropzoneProps> = ({
	onDrop,
	onReject,
	width,
	height,
	previewUrl,
	error = false,
	...props
}) => {
	const [fileUrl, setFileUrl] = useState<string>();
	const theme = useMantineTheme();
	const { classes, cx } = usePreviewDropzoneStyles();

	useEffect(() => {
		if (!previewUrl) return;
		setFileUrl(previewUrl);
	}, [previewUrl]);

	const onFilesDrop = (files: FileWithPath[]) => {
		if (!previewUrl) {
			setFileUrl(URL.createObjectURL(files[0]));
			// if (fileUrl) URL.revokeObjectURL(fileUrl);
		}
		onDrop(files[0]);
	};

	const onFilesReject = (fileRejections: FileRejection[]) => {
		if (onReject) onReject(fileRejections[0]);
	};

	return (
		<Dropzone
			multiple={false}
			onDrop={onFilesDrop}
			onReject={onFilesReject}
			p={0}
			className={cx({ [classes.errorDropzone]: error })}
			{...props}
		>
			<Group position="center" w={width} h={height}>
				<Dropzone.Accept>
					<IconUpload
						size="3.2rem"
						stroke={1.5}
						color={
							theme.colors[theme.primaryColor][
								theme.colorScheme === "dark" ? 4 : 6
							]
						}
					/>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX
						size="3.2rem"
						stroke={1.5}
						color={
							theme.colors.red[
								theme.colorScheme === "dark" ? 4 : 6
							]
						}
					/>
				</Dropzone.Reject>
				<Dropzone.Idle>
					{fileUrl ? (
						<Image
							src={fileUrl}
							alt="Dropzone Preview"
							radius="sm"
							width={width}
							height={height}
						/>
					) : (
						<IconPhoto size="3.2rem" stroke={1.5} />
					)}
				</Dropzone.Idle>
			</Group>
		</Dropzone>
	);
};

export default React.memo(PreviewDropzone);
