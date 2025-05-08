export interface Promotion {
  id: number;
  /**
   * The code users enter (forced uppercase). e.g., EARLYBIRD20
   */
  code: string;
  description: string;
  status: 'active' | 'inactive' | 'expired';
  discountType: 'percentage' | 'fixed_amount';
  /**
   * % or fixed amount
   */
  discountValue: number;
  currency?: ('USD' | 'PHP' | 'EUR') | null;
  /**
   * Optional: Max total uses. Blank for unlimited.
   */
  usageLimit?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  /**
   * Optional: Order total must meet this amount.
   */
  minimumOrderAmount?: number | null;
  appliesToAllEvents?: boolean | null;
  /**
   * Only applies to these specific events if not checked above.
   */
  event?: (number | Event)[] | null;
  updatedAt: string;
  createdAt: string;
}

export interface PromotionsResponse {
	docs: Promotion[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}
