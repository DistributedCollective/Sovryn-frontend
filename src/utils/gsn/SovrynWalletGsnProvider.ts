import { walletService } from '@sovryn/react-wallet';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import type { Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';
import { RpcNode } from 'utils/blockchain/rpc-node';

type RequestResponse = {
  result?: any;
  error?: string;
};

export class SovrynWalletGsnProvider implements Web3ProviderBaseInterface {
  public constructor(private node: RpcNode) {}

  public send(
    payload: JsonRpcPayload,
    callback: (error: Error | null, result?: JsonRpcResponse) => void,
  ): void {
    this.prepareRequest(payload)
      .then(result => {
        callback(null, this.prepareJsonRpcResponse(payload, { result }));
      })
      .catch(error => {
        callback(error, this.prepareJsonRpcResponse(payload, { error }));
      });
  }

  protected prepareRequest(payload: JsonRpcPayload): Promise<any> {
    if (
      ['eth_sendTransaction', 'eth_accounts', 'eth_signTypedData_v4'].includes(
        payload.method,
      )
    ) {
      return walletService.request(payload);
    }
    return this.node.send(payload);
  }

  protected prepareJsonRpcResponse(
    payload: JsonRpcPayload,
    { result, error }: RequestResponse,
  ): JsonRpcResponse {
    return {
      id: Number(payload.id || 0),
      jsonrpc: payload.jsonrpc,
      result,
      error,
    };
  }
}
