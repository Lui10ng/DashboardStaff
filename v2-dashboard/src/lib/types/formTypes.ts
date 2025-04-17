export interface PayloadForm {
	id: number;
	title: string;
	description: string;
	formBuilder: Array<{
		id: string;
		name: string;
		fieldType: string;
		label: string;
		required: boolean;
		description: string | null;
		options: string[];
	}>;
	responses: any[];
	updatedAt: string;
	createdAt: string;
}

export interface PayloadResponse {
	docs: PayloadForm[];
	hasNextPage: boolean;
	hasPrevPage: boolean;
	limit: number;
	nextPage: number | null;
	page: number;
	pagingCounter: number;
	prevPage: number | null;
	totalDocs: number;
	totalPages: number;
}