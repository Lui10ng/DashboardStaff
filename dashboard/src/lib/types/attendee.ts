export interface Attendee {
    id: string;
    name: string;
    time: string;
    date: string;
    status: "IN" | "OUT";
  }
  
  export interface QRScannerConfig {
    fps: number;
    qrbox: {
      width: number;
      height: number;
    };
    aspectRatio: number;
  }
  
  export type FilterType = | "IN" | "OUT";