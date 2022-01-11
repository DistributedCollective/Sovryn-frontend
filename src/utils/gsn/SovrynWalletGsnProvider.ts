import { walletService } from '@sovryn/react-wallet';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import type { RequestPayload } from '@sovryn/wallet/interfaces/wallet.interface';
import { RpcNode } from 'utils/blockchain/rpc-node';

type JsonRpcCallback = (error: Error | null, result?: JsonRpcResponse) => void;

export class SovrynWalletGsnProvider {
  public constructor(private node: RpcNode) {}

  public async request(payload: JsonRpcPayload): Promise<JsonRpcResponse> {
    if (
      [
        'eth_sendTransaction',
        'eth_getTransactionReceipt',
        'eth_accounts',
        'eth_signTypedData_v4',
      ].includes(payload.method)
    ) {
      return walletService
        .request(payload as RequestPayload)
        .then(response => ({
          id: Number(payload.id || 0),
          jsonrpc: payload.jsonrpc,
          result: response,
        }));
    }
    return this.node.send(payload);
  }

  public send(payload: JsonRpcPayload, callback: JsonRpcCallback) {
    this.request(payload)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  }

  public async sendAsync(payload: JsonRpcPayload, callback: JsonRpcCallback) {
    return this.send(payload, callback);
  }
}
