export interface EventData {
    eventName: string;
    subdomain: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    description: string;
    companyLogo: string | null;
    poster: string | null;
    backgroundImage: string | null;
  }
  
  export interface CountdownData {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }
  
  export interface TimeBlockProps {
    value: number;
    label: string;
  }
