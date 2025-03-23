import { Card, Divider } from 'antd';
import { DetailedTransaction } from '@/app/lib/types/crypto';
import './TransactionList.scss';
import TransactionItem from '@/app/lib/components/TransactionItem';

function TransactionList({transactions}: {transactions: DetailedTransaction[]}) {
  return (
    <Card className="transaction-list" title="Transactions">
      {transactions.map((tx) => (
        <div key={tx.tx_hash}>
          <TransactionItem transaction={tx} />
          <Divider/>
        </div>
      ))}
    </Card>
  );
}

export default TransactionList;