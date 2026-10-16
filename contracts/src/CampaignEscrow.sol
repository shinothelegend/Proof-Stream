// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

library SafeERC20 {
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        require(token.transfer(to, value), "SafeERC20: transfer failed");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        require(token.transferFrom(from, to, value), "SafeERC20: transferFrom failed");
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract AccessControl is Context {
    struct RoleData {
        mapping(address => bool) hasRole;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view virtual returns (bool) {
        return _roles[role].hasRole[account];
    }

    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert("AccessControl: account is missing role");
        }
    }

    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].hasRole[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }
}

contract CampaignEscrow is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Milestone {
        string description;   // e.g. "Install 5 water filtration units"
        uint256 amount;        // USDC, 6 decimals
        uint64 deadline;       // unmet-by-deadline -> refundable
        bool released;
        bool refunded;
        bytes32 attestationUID; // EAS attestation for the release decision
    }

    IERC20 public immutable usdc;
    address public immutable ngo;
    Milestone[] public milestones;

    // Auditing events
    event Funded(address indexed donor, uint256 amount);
    event TrancheReleased(uint256 indexed milestoneId, uint256 amount, bytes32 attestationUID);
    event MilestoneRefunded(uint256 indexed milestoneId, uint256 amount);
    event DecisionLogged(
        uint256 indexed milestoneId,
        uint8 verdict,          // 0: PENDING, 1: PASSED, 2: REJECTED, 3: FLAGGED
        uint256 confidence,     // Scaled 0 - 10000 (e.g. 9400 = 94%)
        bytes32 evidenceCid,
        bytes32 reasoningHash
    );

    constructor(
        address _usdc,
        address _ngo,
        address _verifier,
        Milestone[] memory _ms
    ) {
        require(_usdc != address(0), "Invalid USDC");
        require(_ngo != address(0), "Invalid NGO");
        require(_verifier != address(0), "Invalid Verifier");

        usdc = IERC20(_usdc);
        ngo = _ngo;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, _verifier);

        for (uint256 i = 0; i < _ms.length; ++i) {
            milestones.push(_ms[i]);
        }
    }

    /// Donor: USDC approve() first, then fund()
    function fund(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit Funded(msg.sender, amount);
    }

    /// ONLY the agent backend (VERIFIER_ROLE) may release a tranche upon cryptographic verification
    function release(uint256 milestoneId, bytes32 _attestationUID) external onlyRole(VERIFIER_ROLE) {
        require(milestoneId < milestones.length, "Invalid milestone");
        Milestone storage m = milestones[milestoneId];
        require(!m.released && !m.refunded, "Already processed");
        require(block.timestamp <= m.deadline, "Deadline passed");

        m.released = true;
        m.attestationUID = _attestationUID;

        usdc.safeTransfer(ngo, m.amount);
        emit TrancheReleased(milestoneId, m.amount, _attestationUID);
    }

    /// Log verification decision for public on-chain audit trail
    function logDecision(
        uint256 milestoneId,
        uint8 verdict,
        uint256 confidence,
        bytes32 evidenceCid,
        bytes32 reasoningHash
    ) external onlyRole(VERIFIER_ROLE) {
        require(milestoneId < milestones.length, "Invalid milestone");
        emit DecisionLogged(milestoneId, verdict, confidence, evidenceCid, reasoningHash);
    }

    /// Milestone unmet by deadline -> donor refund
    function refund(uint256 milestoneId) external {
        require(milestoneId < milestones.length, "Invalid milestone");
        Milestone storage m = milestones[milestoneId];
        require(!m.released && !m.refunded, "Already processed");
        require(block.timestamp > m.deadline, "Deadline not passed");

        m.refunded = true;
        usdc.safeTransfer(msg.sender, m.amount);
        emit MilestoneRefunded(milestoneId, m.amount);
    }

    function getMilestonesCount() external view returns (uint256) {
        return milestones.length;
    }

    function getMilestone(uint256 idx) external view returns (Milestone memory) {
        require(idx < milestones.length, "Index out of bounds");
        return milestones[idx];
    }
}
