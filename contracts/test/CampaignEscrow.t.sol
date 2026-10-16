// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CampaignEscrow} from "../src/CampaignEscrow.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function deal(address, uint256) external;
}

contract Test {
    Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}

contract CampaignEscrowTest is Test {
    CampaignEscrow escrow;
    MockUSDC usdc;

    address admin = address(0xAD);
    address ngo = address(0xEE);
    address verifier = address(0xFE);
    address donor = address(0xD0);
    address nonVerifier = address(0xBA);

    uint256 milestone0Amount = 1200 * 10**6;
    uint256 milestone1Amount = 800 * 10**6;
    uint64 deadline;

    function setUp() public {
        usdc = new MockUSDC();
        deadline = uint64(block.timestamp + 30 days);

        CampaignEscrow.Milestone[] memory ms = new CampaignEscrow.Milestone[](2);
        ms[0] = CampaignEscrow.Milestone({
            description: "Install 5 gravity-fed ceramic water filters",
            amount: milestone0Amount,
            deadline: deadline,
            released: false,
            refunded: false,
            attestationUID: bytes32(0)
        });
        ms[1] = CampaignEscrow.Milestone({
            description: "Distribute 200 hygiene kits",
            amount: milestone1Amount,
            deadline: deadline,
            released: false,
            refunded: false,
            attestationUID: bytes32(0)
        });

        escrow = new CampaignEscrow(
            address(usdc),
            ngo,
            verifier,
            ms
        );

        // Fund donor
        usdc.transfer(donor, 5000 * 10**6);
    }

    function test_FundAndReleaseHappyPath() public {
        bytes32 attestationUID = keccak256("EAS_ATTESTATION_MILESTONE_0");

        // 1. Donor funds
        vm.prank(donor);
        usdc.approve(address(escrow), 2000 * 10**6);

        vm.prank(donor);
        escrow.fund(2000 * 10**6);

        assertEq(usdc.balanceOf(address(escrow)), 2000 * 10**6);

        // 2. Verifier releases milestone 0
        vm.prank(verifier);
        escrow.release(0, attestationUID);

        CampaignEscrow.Milestone memory m0 = escrow.getMilestone(0);
        assertTrue(m0.released);
        assertEq(m0.attestationUID, attestationUID);
        assertEq(usdc.balanceOf(ngo), milestone0Amount);
        assertEq(usdc.balanceOf(address(escrow)), 2000 * 10**6 - milestone0Amount);
    }

    function test_NonVerifierCannotRelease() public {
        bytes32 attestationUID = keccak256("FAKE_ATTESTATION");

        vm.prank(donor);
        usdc.approve(address(escrow), 2000 * 10**6);
        vm.prank(donor);
        escrow.fund(2000 * 10**6);

        vm.prank(nonVerifier);
        try escrow.release(0, attestationUID) {
            revert("Expected revert when non-verifier calls release");
        } catch {
            // Expected
        }
    }

    function test_DoubleReleaseReverts() public {
        bytes32 attestationUID = keccak256("EAS_ATTESTATION_MILESTONE_0");

        vm.prank(donor);
        usdc.approve(address(escrow), 2000 * 10**6);
        vm.prank(donor);
        escrow.fund(2000 * 10**6);

        vm.prank(verifier);
        escrow.release(0, attestationUID);

        // Second release must revert
        vm.prank(verifier);
        try escrow.release(0, attestationUID) {
            revert("Expected revert on double release");
        } catch {
            // Expected
        }
    }

    function test_DeadlineBlocksRelease() public {
        bytes32 attestationUID = keccak256("EAS_ATTESTATION_LATE");

        vm.prank(donor);
        usdc.approve(address(escrow), 2000 * 10**6);
        vm.prank(donor);
        escrow.fund(2000 * 10**6);

        // Warp past deadline
        vm.warp(deadline + 1);

        vm.prank(verifier);
        try escrow.release(0, attestationUID) {
            revert("Expected revert because deadline has passed");
        } catch {
            // Expected
        }
    }

    function test_RefundAfterDeadline() public {
        vm.prank(donor);
        usdc.approve(address(escrow), 2000 * 10**6);
        vm.prank(donor);
        escrow.fund(2000 * 10**6);

        // Warp past deadline
        vm.warp(deadline + 1);

        uint256 donorBefore = usdc.balanceOf(donor);

        vm.prank(donor);
        escrow.refund(0);

        CampaignEscrow.Milestone memory m0 = escrow.getMilestone(0);
        assertTrue(m0.refunded);
        assertEq(usdc.balanceOf(donor), donorBefore + milestone0Amount);
    }

    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "assertEq failed");
    }

    function assertEq(bytes32 a, bytes32 b) internal pure {
        require(a == b, "assertEq bytes32 failed");
    }

    function assertTrue(bool condition) internal pure {
        require(condition, "assertTrue failed");
    }
}
