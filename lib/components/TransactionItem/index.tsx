import { DetailedTransaction } from '@/lib/types/crypto';
import { shortenString } from '@/lib/helpers/crypto';
import { ArrowRightOutlined } from '@ant-design/icons';

function TransactionItem({ transaction }: { transaction: DetailedTransaction }) {
  return (
    <div className="transaction-item">
      <h2>{shortenString(transaction.tx_hash)}</h2>
      <p>
        <strong>Time:</strong>{' '}
        {transaction.details.block_time
          ? new Date(transaction.details.block_time * 1000).toLocaleString()
          : 'N/A'}
      </p>
      <div className="transaction-item__directions">
        <div className="transaction-item__from">
          <strong>From:</strong>
          {transaction.utxos.inputs.map((input, index) => (
            <div key={index} className="transaction-operation transaction-operation_input">
              <div className="transaction-input__address">{shortenString(transaction.tx_hash)}</div>
              <div className="transaction-input__amount">{input.amount.map((a) => a.text)}</div>
            </div>
          ))}
        </div>

        <div className="transaction-item__direction">
          <ArrowRightOutlined />
        </div>

        <div className="transaction-item__to">
          <strong>To:</strong>
          {transaction.utxos.outputs.map((input, index) => (
            <div key={index} className="transaction-operation transaction-operation_output">
              <div className="transaction-input__address">{shortenString(transaction.tx_hash)}</div>
              <div className="transaction-input__amount">{input.amount.map((a) => a.text)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;