export interface FieldQueryOperators { 
  equals?: number; // Allow string if event IDs can be strings from query params
}

export interface RequestBodyWithEvent {
  event?: number; // Assuming event ID can be a number or string from request body
}