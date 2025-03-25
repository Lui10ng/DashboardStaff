import type { Dialog, DropdownMenu, WithoutChild } from 'bits-ui';
import type { Snippet } from 'svelte';

export type DropdownMenuProps = DropdownMenu.Props & {
	icon: string;
	className?: string;
	classMenu?: string;
	buttonText: string;
	alignContent?: string;
	items: string[];
	contentProps?: WithoutChild<DropdownMenu.Content.Props>;
};

export type ModalProps = Dialog.RootProps & {
	buttonText: string;
	buttonClass?: string;
	header: Snippet;
	content: Snippet;
	contentProps?: WithoutChild<Dialog.ContentProps>;
};
