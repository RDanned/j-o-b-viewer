import Image from 'next/image';
import { components } from '@blockfrost/openapi';
import { Card } from 'antd';
import blockfrostAPI from '@/lib/api/blockfrost';
import { convertLovelaceToAda, convertLovelaceToUSD, shortenString } from '@/lib/helpers/crypto';
import adaIcon from '@/lib/assets/img/currency/ada.svg';
import { DetailedTransaction } from '@/lib/types/crypto';
import TransactionList from '@/lib/components/TransactionList';

export default async function Home() {
  const walletAddress = process.env.WALLET_ADDRESS || '';
  let address: components['schemas']['address_content'] | null = null;
  let account: components['schemas']['account_content'] | null = null;
  let assets: Array<components['schemas']['asset']> = [];
  let transactions: DetailedTransaction[] = [];
  let balanceTotalADA = 0;
  let balanceTotalUSD = 0;

  try {
    address = await blockfrostAPI.addresses(walletAddress);

    const txList = await blockfrostAPI.addressesTransactions(walletAddress, {
      order: 'desc',
      count: 20,
      page: 1,
    });

    const detailedTxs = await Promise.all(
      txList.map(async (tx) => {
        const details = await blockfrostAPI.txs(tx.tx_hash);
        const utxos = await blockfrostAPI.txsUtxos(tx.tx_hash)
          .then(async (utxos) => {
            const formattedInputs = await Promise.all(utxos.inputs.map(async (input) => {
              const formattedAmounts = await Promise.all(input.amount.map(async (amount) => {
                if (amount.unit === 'lovelace') {
                  return {
                    ...amount,
                    text: `${convertLovelaceToAda(Number(amount.quantity))} ADA`
                  }
                }
                const assetData = await blockfrostAPI.assetsById(amount.unit);
                return {
                  ...amount,
                  text: `${amount.quantity} ${assetData.onchain_metadata?.name
                    ? assetData.onchain_metadata?.name as string : shortenString(String(assetData.asset_name))}`
                }
              }));
              return {
                ...input,
                amount: formattedAmounts
              }
            }));

            const formattedOutputs = await Promise.all(utxos.outputs.map(async (input) => {
              const formattedAmounts = await Promise.all(input.amount.map(async (amount) => {
                if (amount.unit === 'lovelace') {
                  return {
                    ...amount,
                    text: `${convertLovelaceToAda(Number(amount.quantity))} ADA`
                  }
                }
                const assetData = await blockfrostAPI.assetsById(amount.unit);
                return {
                  ...amount,
                  text: `${amount.quantity} ${assetData.onchain_metadata?.name
                    ? assetData.onchain_metadata?.name as string : shortenString(String(assetData.asset_name))}`
                }
              }));
              return {
                ...input,
                amount: formattedAmounts
              }
            }));

            return {
              ...utxos,
              inputs: formattedInputs,
              outputs: formattedOutputs
            }
          });
        return {...tx, details, utxos} as DetailedTransaction;
      })
    );

    transactions = detailedTxs;

    if (address.stake_address)
      account = await blockfrostAPI.accounts(address.stake_address);

    if (address.amount) {
      assets = await Promise.all(
        address.amount.map(async (asset) => {
          try {
            const assetData = await blockfrostAPI.assetsById(asset.unit);
            return assetData;
          } catch (e) {
            if (asset.unit === 'lovelace') {
              balanceTotalADA = convertLovelaceToAda(Number(asset.quantity))
              balanceTotalUSD = await convertLovelaceToUSD(Number(asset.quantity));
              return null;
            }
            return {
              asset_name: 'Unknown',
              asset: asset.quantity,
              quantity: asset.quantity,
            } as components['schemas']['asset'];
          }
        })
      ).then((assets) => assets.filter((asset) => asset !== null));
    }
  } catch (error) {
    console.error(error);
  }

  if (!address) {
    return <div>Loading...</div>
  }

  return (
    <div className="pt-8">
      <Card title="Address" className="address-info">
        <div className="address-title">{address.address}</div>

        <div className="flex gap-4 w-full">

          <div className="info-grid">
            <Card className="balance-list">
              <div className="balance-item">
                <div className="balance-item__title">Balance</div>
                <div className="balance-item__value">
                  {balanceTotalADA.toFixed(2)}
                  <Image
                    priority
                    src={adaIcon}
                    alt="Follow us on Twitter"
                  />
                </div>
              </div>
              <div className="balance-item">
                <div className="balance-item__title">Value</div>
                <div className="balance-item__value">{balanceTotalUSD.toFixed(2)} $</div>
              </div>
            </Card>

            <Card className="token-list">
              <div className="token-list__title">Tokens</div>
              {assets.map((asset) => (
                <div className="token-item" key={asset.asset}>
                  <div className="token-item__name">
                    {asset.onchain_metadata?.name ? asset.onchain_metadata?.name as string : asset.asset_name}
                  </div>
                  <div className="token-item__value">
                    {asset.quantity}
                  </div>
                </div>
              ))}
            </Card>

            <TransactionList transactions={transactions}/>
          </div>
        </div>
      </Card>
    </div>
  );
}
