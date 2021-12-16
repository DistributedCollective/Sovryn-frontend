import { LootDropColors } from 'app/components/FinanceV2Components/LootDrop/styled';
import { AppMode } from 'types/app-mode';
import { Asset } from 'types/asset';
import { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

export const mainnetAmm = [
  new AmmLiquidityPool(
    Asset.SOV,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0x88a67a0e79e311fe93c6e2101d55d6d2ae3a7e94',
    '0x09C5faF7723b13434ABdF1a65aB1B667BC02A902',
  )
    .setLootDropColor(LootDropColors.Purple)
    .setPreviousConverters(['0x3fd679b01ddab34da8f72b7ec301aa75ea25f338']),
  new AmmLiquidityPool(
    Asset.XUSD,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0x34163bb263ac77e9d6315676a2b9624cfc5ff861',
    '0x6f96096687952349DD5944E0EB1Be327DcdeB705',
  )
    .setLootDropColor(LootDropColors.Yellow)
    .setPreviousConverters(['0x029448377a56c15928ec783baf6ca736ed99a57f']),
  new AmmLiquidityPool(
    Asset.FISH,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0x832769cc15dbdd6814819988c7a875ec2cb943e8',
    '0x35A74a38Fd7728F1c6BC39aE3b18C974b7979ddD',
  ).setPreviousConverters(['0xe731DA93034D769c2045B1ee137D42E1Aa23C18e']),
  new AmmLiquidityPool(
    Asset.USDT,
    Asset.RBTC,
    2,
    AppMode.MAINNET,
    '0x448c2474b255576554EeD36c24430ccFac131cE3',
    '0x40580E31cc14DbF7a0859f38Ab36A84262df821D',
    '0x9c4017D1C04cFa0F97FDc9505e33a0D8ac84817F',
  ),
  new AmmLiquidityPool(
    Asset.BNB,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0x150bc1f9f1020255d44385865928aadc6b7ad9f3',
    '0x8f3d24ab3510294f1466aa105f78901b90d79d4d',
  )
    .setLootDropColor(LootDropColors.Blue)
    .setPreviousConverters(['0x3a36919f1d6729ea8bd2a04f72bd9d5396f7e549']),
  new AmmLiquidityPool(
    Asset.ETH,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0xd8397c1944862b6a9674c85a5496c208dc9417bb',
    '0xF41Ed702df2B84AcE02772C6a0D8AE46465aA5F4',
  )
    .setLootDropColor(LootDropColors.Green)
    .setPreviousConverters(['0xcef26b429e272960d8fa2ea190b06df5dd8f68e2']),
  new AmmLiquidityPool(
    Asset.MOC,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0x60cc333072f16d5f4cb2bc36d6aa1f00381e22c2',
    '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
  )
    .setSovRewards(false)
    .setPreviousConverters(['0x34031D1cd14e2C80B0268B47eFf49643375aFaeb']),
  new AmmLiquidityPool(
    Asset.DOC,
    Asset.RBTC,
    2,
    AppMode.MAINNET,
    '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f',
    '0x2dc80332C19FBCd5169ab4a579d87eE006Cb72c0',
    '0x840437BdE7346EC13B5451417Df50586F4dAF836',
  ),
  new AmmLiquidityPool(
    Asset.BPRO,
    Asset.RBTC,
    2,
    AppMode.MAINNET,
    '0x26463990196B74aD5644865E4d4567E4A411e065',
    '0x9CE25371426763025C04a9FCd581fbb9E4593475',
    '0x75e327A83aD2BFD53da12EB718fCCFC68Bc57535',
  ),
  new AmmLiquidityPool(
    Asset.RIF,
    Asset.RBTC,
    1,
    AppMode.MAINNET,
    '0xf6377dec9ce79b5bc0576618a5cd3e95f49f9ace',
    '0xAE66117C8105a65D914fB47d37a127E879244319',
  ).setPreviousConverters(['0x1769044CBa7aD37719badE16Cc71EC3f027b943D']),
];
