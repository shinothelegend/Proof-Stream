// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CampaignEscrow} from "../src/CampaignEscrow.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

interface Vm {
    function startBroadcast() external;
    function stopBroadcast() external;
    function envAddress(string memory) external view returns (address);
    function envUint(string memory) external view returns (uint256);
}

contract Script {
    Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}

contract DeployScript is Script {
    function run() external returns (address escrowAddress, address usdcAddress) {
        address deployer = msg.sender;
        address verifier = deployer; // Default fallback to deployer if verifier not set
        address ngo = 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7; // Kalimantan NGO

        vm.startBroadcast();

        // 1. Deploy or use existing USDC
        // For Base Sepolia official USDC is 0x036CbD53842c5426634e7929541eC2318f3dCF7e
        MockUSDC mockUsdc = new MockUSDC();
        usdcAddress = address(mockUsdc);

        // 2. Setup milestones
        uint64 deadline = uint64(block.timestamp + 30 days);
        CampaignEscrow.Milestone[] memory ms = new CampaignEscrow.Milestone[](3);

        ms[0] = CampaignEscrow.Milestone({
            description: "Procure and install 5 communal gravity-fed ceramic water filtration units in Bukama and Danau Rawah villages.",
            amount: 1200 * 10**6,
            deadline: deadline,
            released: false,
            refunded: false,
            attestationUID: bytes32(0)
        });

        ms[1] = CampaignEscrow.Milestone({
            description: "Assemble and distribute 200 family hygiene kits (water purification tablets, soap, jerrycans).",
            amount: 800 * 10**6,
            deadline: uint64(block.timestamp + 45 days),
            released: false,
            refunded: false,
            attestationUID: bytes32(0)
        });

        ms[2] = CampaignEscrow.Milestone({
            description: "Conduct certified independent laboratory water quality assay (E. coli, heavy metals, turbidity) and publish community report.",
            amount: 500 * 10**6,
            deadline: uint64(block.timestamp + 60 days),
            released: false,
            refunded: false,
            attestationUID: bytes32(0)
        });

        // 3. Deploy CampaignEscrow
        CampaignEscrow escrow = new CampaignEscrow(
            usdcAddress,
            ngo,
            verifier,
            ms
        );

        escrowAddress = address(escrow);

        vm.stopBroadcast();
    }
}
