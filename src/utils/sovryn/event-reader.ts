import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { toChunks } from '../helpers';
import { EventData } from 'web3-eth-contract';
import { getContract } from '../blockchain/contract-helpers';

type ReaderOption = { fromBlock: number; toBlock: number | 'latest' };

class EventReader {
  private sovryn: SovrynNetwork;
  constructor() {
    this.sovryn = Sovryn;
  }

  public getPastEventsInChunks(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    options: ReaderOption = {
      fromBlock: 0,
      toBlock: 'latest',
    },
    blockChunkSize: number = 50000,
  ) {
    let finished = false;
    let cancel = () => {
      finished = true;
    };

    const promise = new Promise(async (resolve, reject) => {
      const run = async () => {
        const blockNumber = await this.getBlockNumber();
        const start =
          options.fromBlock || getContract(contractName).blockNumber;
        const end =
          options?.toBlock === 'latest'
            ? blockNumber
            : options.toBlock || blockNumber;

        const chunks = toChunks(start, end, blockChunkSize);

        if (!chunks) {
          return [];
        }

        const events: EventData[] = [];

        for (let i = 0; i < chunks.length; i++) {
          const [fromBlock, toBlock] = chunks[i];
          const result = await this.getPastEvents(
            contractName,
            eventName,
            filter,
            {
              ...options,
              fromBlock,
              toBlock,
            },
          );
          events.push(...result);
        }

        return events;
      };

      run()
        .then(results => resolve(results))
        .catch(reject);

      // When consumer calls `cancel`:
      cancel = () => {
        // In case the promise has already resolved/rejected, don't run cancel behavior!
        if (finished) {
          return;
        }
        reject();
      };

      // If was cancelled before promise was launched, trigger cancel logic
      if (finished) {
        // (to avoid duplication, just calling `cancel`)
        cancel();
      }
    })
      // After any scenario, set `finished = true` so cancelling has no effect
      .then(resolvedValue => {
        finished = true;
        return resolvedValue;
      })
      .catch(err => {
        finished = true;
        return err;
      });

    return { promise, cancel };
  }

  public async getPastEvents(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    options: ReaderOption = { fromBlock: 0, toBlock: 'latest' },
  ) {
    try {
      return await this.sovryn.contracts[contractName].getPastEvents(
        eventName,
        {
          ...options,
          ...{ filter },
        },
      );
    } catch (e) {
      return [];
    }
  }

  protected async getBlockNumber() {
    return await this.sovryn.getWeb3().eth.getBlockNumber();
  }
}

export const eventReader = new EventReader();
