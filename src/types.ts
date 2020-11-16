export type AllowedElements = HTMLInputElement | HTMLTextAreaElement;

export type IntellisenseObject = {
    title?: string;
    description?: string;
    priority?: number;
    nestedData?: Record<string, IntellisenseObject>;
};

export type IntellisenseData = Record<string, IntellisenseObject>;
