// vouchers.ts
export interface Voucher {
    id: string;
    code: string;
    discount: number;
    maxUses: number;
    used: number;
  }
  
export const vouchers: Voucher[] = [
  {
    id: '1',
    code: 'STUDENT',
    discount: 20,
    maxUses: 100,
    used: 45
  },
  {
    id: '2',
    code: 'EARLYBIRD',
    discount: 15,
    maxUses: 50,
    used: 30
  }
];
