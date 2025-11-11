import { createServer, Model, RestSerializer } from 'miragejs';
import { TransactionRecord } from 'store/types';
import generateUid from 'utils/generateUid';

import { transactionHistory } from './testdata';

export default function makeServer(): void {
  createServer({
    models: {
      transaction: Model.extend<Partial<TransactionRecord>>({}),
    },
    serializers: {
      transaction: RestSerializer.extend({
        embed: true,
        root: false,
      }),
    },
    seeds(server) {
      transactionHistory.forEach((transaction) => {
        server.create('transaction', transaction);
      });
    },
    routes() {
      this.get('api/transactions', (schema) => {
        return schema.all('transaction');
      });
      this.post('api/transactions', (schema, request) => {
        const transaction = JSON.parse(request.requestBody);
        transaction.id = generateUid('', 8);
        return schema.create('transaction', transaction);
      });
    },
  });
}
