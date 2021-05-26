import { EventData } from 'web3-eth-contract';
import { SovrynNetwork } from './sovryn-network';
import { Sovryn } from './index';
import { ContractName } from '../types/contracts';
import { toChunks } from '../helpers';
import { getContract } from '../blockchain/contract-helpers';

export type ReaderOption = { fromBlock: number; toBlock: number | 'latest' };

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

    const promise: Promise<{
      events: EventData[];
      fromBlock: number;
      toBlock: number;
    }> = new Promise(async (resolve, reject) => {
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
        let lastBlock = start;

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
          lastBlock = toBlock;
        }

        return {
          events,
          fromBlock: start,
          toBlock: lastBlock,
        };
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
      .then((resolvedValue: any) => {
        finished = true;
        return resolvedValue;
      })
      .catch(err => {
        finished = true;
        return err;
      });

    return { promise, cancel };
  }

  public getPastEventsInChunksPromise(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    options: ReaderOption = {
      fromBlock: 0,
      toBlock: 'latest',
    },
    blockChunkSize: number = 50000,
  ) {
    return this.getPastEventsInChunks(
      contractName,
      eventName,
      filter,
      options,
      blockChunkSize,
    ).promise;
  }

  public async getPastEvents(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    options: ReaderOption = { fromBlock: 0, toBlock: 'latest' },
  ) {
    try {
      return this.sovryn.databaseContracts[contractName]
        .getPastEvents(eventName, {
          ...options,
          ...{ filter },
        })
        .then(e =>
          e
            .map(e => ({
              ...e,
              returnValues: (e as any).returnVal,
              event: (e as any)?.eventName,
            }))
            .filter(item => !!item.returnValues),
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
