import { currentChainId, backendUrl, ethGenesisAddress } from './classifiers';
import { contractReader } from './sovryn/contract-reader';

const sovLimit = 1;

class Whitelist {
  public async test(address: string) {
    try {
      return await this.getApi(address);
    } catch (e) {
      return await this.getContracts(address);
    }
  }

  // Check if user is whitelisted using backend server
  public async getApi(address: string) {
    const controller = new AbortController();

    // abort request if it's not resolved in 30 seconds and start checking in smart-contract from frontend side.
    const timeoutId = setTimeout(() => controller.abort(), 30e3);
    return fetch(`${backendUrl[currentChainId]}/whitelist/${address}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      signal: controller.signal,
    })
      .then(response => {
        clearTimeout(timeoutId);
        return response.json();
      })
      .then(({ whitelisted }) => whitelisted);
  }

  // Check if user is whitelisted using smart-contracts
  public async getContracts(address: string) {
    address = address.toLowerCase();

    const nft = await contractReader
      .call('NFT_tier1', 'balanceOf', [address])
      .then(e => Number(e));
    if (nft) return true;

    const sov = await contractReader
      .call('SOV_token', 'balanceOf', [address])
      .then(e => Number(e) / 1e18);
    if (sov >= sovLimit) return true;

    const csov1 = await contractReader
      .call('CSOV_token', 'balanceOf', [address])
      .then(e => Number(e) / 1e18);
    if (csov1 >= sovLimit) return true;

    const csov2 = await contractReader
      .call('CSOV2_token', 'balanceOf', [address])
      .then(e => Number(e) / 1e18);
    if (csov2 >= sovLimit) return true;

    const staked = await contractReader
      .call('staking', 'balanceOf', [address])
      .then(e => Number(e) / 1e18);
    if (staked >= sovLimit) return true;

    const vesting1 = await contractReader.call(
      'vestingRegistry',
      'getVesting',
      [address],
    );
    if (vesting1 !== ethGenesisAddress) {
      const staked = await contractReader
        .call('staking', 'balanceOf', [vesting1])
        .then(e => Number(e) / 1e18);
      if (staked >= sovLimit) return true;
    }

    const vesting2 = await contractReader.call(
      'vestingRegistry',
      'getTeamVesting',
      [address],
    );
    if (vesting2 !== ethGenesisAddress) {
      const staked = await contractReader
        .call('staking', 'balanceOf', [vesting2])
        .then(e => Number(e) / 1e18);
      if (staked >= sovLimit) return true;
    }

    const vesting3 = await contractReader.call(
      'vestingRegistryOrigin',
      'getVesting',
      [address],
    );
    if (vesting3 !== ethGenesisAddress) {
      const staked = await contractReader
        .call('staking', 'balanceOf', [vesting3])
        .then(e => Number(e) / 1e18);
      if (staked >= sovLimit) return true;
    }

    return false;
  }
}

export const whitelist = new Whitelist();
