export interface IntroContent {
	type: 'intro';
	text: string;
}

export interface TitledContent {
	type: 'mission' | 'vision' | 'team';
	title: string;
	text: string;
}

export interface FeatureContent {
	type: 'features';
	items: Array<{
		title: string;
		text: string;
	}>;
}

export type SectionContent = IntroContent | TitledContent | FeatureContent;

export interface Section {
	title: string;
	content: SectionContent[];
}
