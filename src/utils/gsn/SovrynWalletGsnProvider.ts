import { walletService } from '@sovryn/react-wallet';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import type { RequestPayload } from '@sovryn/wallet/interfaces/wallet.interface';
import type { Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';
import { RpcNode } from 'utils/blockchain/rpc-node';
type JsonRpcCallback = (error: Error | null, result?: JsonRpcResponse) => void;

// TODO: convert send and sendAsync responses to jsonrpc:
// return {
//   id: Number(payload.id || 0),
//   jsonrpc: payload.jsonrpc,
//   result: response,
// };

export class SovrynWalletGsnProvider implements Web3ProviderBaseInterface {
  public constructor(private node: RpcNode) {}

  public async request(payload: JsonRpcPayload): Promise<any> {
    if (
      [
        'eth_sendTransaction',
        'eth_getTransactionReceipt',
        'eth_accounts',
        'eth_signTypedData_v4',
      ].includes(payload.method)
    ) {
      return walletService.request(payload as RequestPayload).then(response => {
        console.warn('REQUEST WALLET', payload, response);
        return response;
      });
    }
    return this.node.send(payload).then(response => {
      console.warn('REQUEST NODE', payload.method, response);
      return response;
    });
  }

  public send(payload: JsonRpcPayload, callback: JsonRpcCallback) {
    console.warn('SEND', payload, callback);
    this.request(payload)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  }

  public async sendAsync(payload: JsonRpcPayload, callback: JsonRpcCallback) {
    console.warn('SEND ASYNC', payload, callback);
    return this.send(payload, callback);
  }
}
