import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import fs from 'fs';
import path from 'path';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org';
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY;
if (!DEPLOYER_KEY) {
  console.error("Missing DEPLOYER_PRIVATE_KEY in environment");
  process.exit(1);
}
const VERIFIER_ADDRESS = process.env.VERIFIER_ADDRESS || '0x8FEE8b6ca0b4C449d92cABa57E8425cE93678B57';
const OFFICIAL_USDC = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
const NGO_ADDRESS = process.env.NGO_ADDRESS || '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7';

async function main() {
  const contractJsonPath = path.resolve('contracts/out/CampaignEscrow.sol/CampaignEscrow.json');
  const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));
  const abi = contractJson.abi;
  const bytecode = contractJson.bytecode.object;

  const account = privateKeyToAccount(
    DEPLOYER_KEY.startsWith('0x') ? DEPLOYER_KEY : `0x${DEPLOYER_KEY}`
  );
  const client = createPublicClient({ chain: baseSepolia, transport: http(RPC_URL) });
  const wallet = createWalletClient({ account, chain: baseSepolia, transport: http(RPC_URL) });

  console.log('Deploying from:', account.address);
  const bal = await client.getBalance({ address: account.address });
  console.log('Balance:', bal.toString(), 'wei');

  const nowSec = Math.floor(Date.now() / 1000);
  const milestones = [
    {
      description: 'Procure and install 5 communal gravity-fed ceramic water filtration units in Bukama and Danau Rawah villages.',
      amount: 1200000000n, // 1,200 USDC (6 decimals)
      deadline: BigInt(nowSec + 30 * 24 * 3600),
      released: false,
      refunded: false,
      attestationUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      description: 'Assemble and distribute 200 family hygiene kits (water purification tablets, medical soap, jerrycans, guidance charts).',
      amount: 800000000n, // 800 USDC (6 decimals)
      deadline: BigInt(nowSec + 45 * 24 * 3600),
      released: false,
      refunded: false,
      attestationUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    {
      description: 'Conduct certified independent laboratory water quality assay (E. coli, heavy metals, turbidity) and publish community report.',
      amount: 500000000n, // 500 USDC (6 decimals)
      deadline: BigInt(nowSec + 60 * 24 * 3600),
      released: false,
      refunded: false,
      attestationUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  ];

  console.log('Deploying CampaignEscrow with USDC:', OFFICIAL_USDC);
  console.log('NGO Address:', NGO_ADDRESS);
  console.log('Verifier Address:', VERIFIER_ADDRESS);

  const hash = await wallet.deployContract({
    abi,
    bytecode: bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`,
    args: [OFFICIAL_USDC, NGO_ADDRESS, VERIFIER_ADDRESS, milestones],
  });

  console.log('Deployment tx submitted:', hash);
  console.log('Waiting for receipt on Base Sepolia...');
  const receipt = await client.waitForTransactionReceipt({ hash });

  console.log('Contract mined successfully!');
  console.log('Contract Address:', receipt.contractAddress);
  console.log('Block Number:', receipt.blockNumber.toString());
  console.log('Gas Used:', receipt.gasUsed.toString());
  console.log('BaseScan URL: https://sepolia.basescan.org/address/' + receipt.contractAddress);
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
