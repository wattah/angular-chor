export interface PartnerVo {
        id: number;
        name: string;
        contact: string;
        contactMethod: string;
        status: PartnerStatus;
}

export type PartnerStatus = "NOT_REFERENCED" | "REFERENCED" | "PENDING";
