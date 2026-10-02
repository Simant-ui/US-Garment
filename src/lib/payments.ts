export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY' | 'ESewa' | 'Khalti';

export interface PaymentInitiateParams {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  message: string;
}

export interface IPaymentProvider {
  name: string;
  processPayment(params: PaymentInitiateParams): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<boolean>;
}

export class CashOnDeliveryProvider implements IPaymentProvider {
  name = 'Cash on Delivery';

  async processPayment(params: PaymentInitiateParams): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `COD-${params.orderId}-${Date.now().toString().slice(-6)}`,
      message: 'Order placed with Cash on Delivery. Payment to be collected upon delivery.',
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}

export class BankTransferProvider implements IPaymentProvider {
  name = 'Direct Bank Transfer';

  async processPayment(params: PaymentInitiateParams): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `BANK-${params.orderId}-${Date.now().toString().slice(-6)}`,
      message: 'Please transfer funds to Nepal Investment Mega Bank AC: 01201050012345 (US Dresses and Garment Udyog) and upload screenshot.',
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}

export class OnlineGatewayProvider implements IPaymentProvider {
  name = 'Nepal Online Gateway (eSewa / Khalti / Fonepay)';

  async processPayment(params: PaymentInitiateParams): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `ONLINE-${params.orderId}-${Date.now().toString().slice(-6)}`,
      paymentUrl: `${params.returnUrl}?status=success&trx=ONLINE-${Date.now().toString().slice(-6)}`,
      message: 'Redirecting to payment gateway...',
    };
  }

  async verifyPayment(transactionId: string): Promise<boolean> {
    return true;
  }
}

export function getPaymentProvider(method: PaymentMethod): IPaymentProvider {
  switch (method) {
    case 'BANK_TRANSFER':
      return new BankTransferProvider();
    case 'ONLINE_GATEWAY':
    case 'ESewa':
    case 'Khalti':
      return new OnlineGatewayProvider();
    case 'COD':
    default:
      return new CashOnDeliveryProvider();
  }
}
