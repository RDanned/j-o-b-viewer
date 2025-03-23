import { components } from '@blockfrost/openapi';

export type DetailedTransaction = components['schemas']['address_transactions_content'][number] & {
  details: components['schemas']['tx_content'];
  utxos: Omit<components['schemas']['tx_content_utxo'], 'inputs' | 'outputs'> & {
    inputs: (
      Omit<components['schemas']['tx_content_utxo']['inputs'][number], 'amount'> & {
      amount: Array<{
        unit: string;
        quantity: string;
        text: string;
      }>
    }
      )[]
    outputs: (
      Omit<components['schemas']['tx_content_utxo']['inputs'][number], 'amount'> & {
      amount: Array<{
        unit: string;
        quantity: string;
        text: string;
      }>
    }
      )[]
  };
}