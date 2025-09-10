// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract EncipherClaimHub is SepoliaConfig {
    using FHE for *;
    
    enum ClaimStatus {
        Pending,
        UnderReview,
        Approved,
        Rejected,
        Paid
    }
    
    struct InsuranceClaim {
        euint32 claimId;
        euint32 amount;
        euint32 policyNumber;
        euint8 status;
        bool isActive;
        bool isVerified;
        string claimType;
        string description;
        string evidenceHash;
        address claimant;
        address insurer;
        uint256 submissionTime;
        uint256 reviewTime;
        uint256 resolutionTime;
    }
    
    struct Policy {
        euint32 policyId;
        euint32 coverageAmount;
        euint32 premiumAmount;
        euint8 policyType;
        bool isActive;
        string policyName;
        address policyholder;
        address insurer;
        uint256 startDate;
        uint256 endDate;
    }
    
    struct Payment {
        euint32 paymentId;
        euint32 amount;
        address recipient;
        uint256 timestamp;
        bool isProcessed;
    }
    
    mapping(uint256 => InsuranceClaim) public claims;
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Payment) public payments;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32) public insurerReputation;
    mapping(address => uint256[]) public userClaims;
    mapping(address => uint256[]) public userPolicies;
    
    uint256 public claimCounter;
    uint256 public policyCounter;
    uint256 public paymentCounter;
    
    address public owner;
    address public verifier;
    address public treasury;
    
    event ClaimSubmitted(uint256 indexed claimId, address indexed claimant, string claimType);
    event ClaimReviewed(uint256 indexed claimId, uint8 status, address indexed reviewer);
    event ClaimApproved(uint256 indexed claimId, uint32 amount, address indexed claimant);
    event PaymentProcessed(uint256 indexed paymentId, address indexed recipient, uint32 amount);
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, string policyName);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier, address _treasury) {
        owner = msg.sender;
        verifier = _verifier;
        treasury = _treasury;
    }
    
    function submitClaim(
        string memory _claimType,
        string memory _description,
        string memory _evidenceHash,
        externalEuint32 amount,
        externalEuint32 policyNumber,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_claimType).length > 0, "Claim type cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_evidenceHash).length > 0, "Evidence hash cannot be empty");
        
        uint256 claimId = claimCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        euint32 internalPolicyNumber = FHE.fromExternal(policyNumber, inputProof);
        
        claims[claimId] = InsuranceClaim({
            claimId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            policyNumber: internalPolicyNumber,
            status: FHE.asEuint8(uint8(ClaimStatus.Pending)),
            isActive: true,
            isVerified: false,
            claimType: _claimType,
            description: _description,
            evidenceHash: _evidenceHash,
            claimant: msg.sender,
            insurer: address(0), // Will be set by insurer
            submissionTime: block.timestamp,
            reviewTime: 0,
            resolutionTime: 0
        });
        
        userClaims[msg.sender].push(claimId);
        
        emit ClaimSubmitted(claimId, msg.sender, _claimType);
        return claimId;
    }
    
    function reviewClaim(
        uint256 claimId,
        uint8 status,
        string memory reviewNotes
    ) public {
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        require(msg.sender == verifier || msg.sender == owner, "Only verifier or owner can review");
        require(claims[claimId].isActive, "Claim is not active");
        
        claims[claimId].status = FHE.asEuint8(status);
        claims[claimId].reviewTime = block.timestamp;
        
        if (status == uint8(ClaimStatus.Approved) || status == uint8(ClaimStatus.Rejected)) {
            claims[claimId].resolutionTime = block.timestamp;
        }
        
        emit ClaimReviewed(claimId, status, msg.sender);
    }
    
    function approveClaim(
        uint256 claimId,
        address insurer
    ) public {
        require(claims[claimId].claimant != address(0), "Claim does not exist");
        require(msg.sender == verifier || msg.sender == owner, "Only verifier or owner can approve");
        require(claims[claimId].isActive, "Claim is not active");
        
        claims[claimId].status = FHE.asEuint8(uint8(ClaimStatus.Approved));
        claims[claimId].insurer = insurer;
        claims[claimId].resolutionTime = block.timestamp;
        
        // Create payment record
        uint256 paymentId = paymentCounter++;
        payments[paymentId] = Payment({
            paymentId: FHE.asEuint32(0), // Will be set properly later
            amount: claims[claimId].amount,
            recipient: claims[claimId].claimant,
            timestamp: block.timestamp,
            isProcessed: false
        });
        
        emit ClaimApproved(claimId, 0, claims[claimId].claimant); // Amount will be decrypted off-chain
        emit PaymentProcessed(paymentId, claims[claimId].claimant, 0); // Amount will be decrypted off-chain
    }
    
    function createPolicy(
        string memory _policyName,
        string memory _policyType,
        uint256 _startDate,
        uint256 _endDate,
        externalEuint32 coverageAmount,
        externalEuint32 premiumAmount,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_policyName).length > 0, "Policy name cannot be empty");
        require(_startDate < _endDate, "Invalid date range");
        require(_endDate > block.timestamp, "End date must be in the future");
        
        uint256 policyId = policyCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalCoverageAmount = FHE.fromExternal(coverageAmount, inputProof);
        euint32 internalPremiumAmount = FHE.fromExternal(premiumAmount, inputProof);
        
        policies[policyId] = Policy({
            policyId: FHE.asEuint32(0), // Will be set properly later
            coverageAmount: internalCoverageAmount,
            premiumAmount: internalPremiumAmount,
            policyType: FHE.asEuint8(0), // Will be set based on policy type
            isActive: true,
            policyName: _policyName,
            policyholder: msg.sender,
            insurer: address(0), // Will be set by insurer
            startDate: _startDate,
            endDate: _endDate
        });
        
        userPolicies[msg.sender].push(policyId);
        
        emit PolicyCreated(policyId, msg.sender, _policyName);
        return policyId;
    }
    
    function processPayment(uint256 paymentId) public {
        require(payments[paymentId].recipient != address(0), "Payment does not exist");
        require(msg.sender == treasury || msg.sender == owner, "Only treasury or owner can process payments");
        require(!payments[paymentId].isProcessed, "Payment already processed");
        
        payments[paymentId].isProcessed = true;
        
        // In a real implementation, funds would be transferred based on decrypted amount
        // payable(payments[paymentId].recipient).transfer(amount);
        
        emit PaymentProcessed(paymentId, payments[paymentId].recipient, 0); // Amount will be decrypted off-chain
    }
    
    function updateReputation(address user, euint32 reputation, bool isInsurer) public {
        require(msg.sender == verifier || msg.sender == owner, "Only verifier or owner can update reputation");
        require(user != address(0), "Invalid user address");
        
        if (isInsurer) {
            insurerReputation[user] = reputation;
        } else {
            userReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getClaimInfo(uint256 claimId) public view returns (
        string memory claimType,
        string memory description,
        string memory evidenceHash,
        uint8 status,
        bool isActive,
        bool isVerified,
        address claimant,
        address insurer,
        uint256 submissionTime,
        uint256 reviewTime,
        uint256 resolutionTime
    ) {
        InsuranceClaim storage claim = claims[claimId];
        return (
            claim.claimType,
            claim.description,
            claim.evidenceHash,
            0, // FHE.decrypt(claim.status) - will be decrypted off-chain
            claim.isActive,
            claim.isVerified,
            claim.claimant,
            claim.insurer,
            claim.submissionTime,
            claim.reviewTime,
            claim.resolutionTime
        );
    }
    
    function getPolicyInfo(uint256 policyId) public view returns (
        string memory policyName,
        uint8 policyType,
        bool isActive,
        address policyholder,
        address insurer,
        uint256 startDate,
        uint256 endDate
    ) {
        Policy storage policy = policies[policyId];
        return (
            policy.policyName,
            0, // FHE.decrypt(policy.policyType) - will be decrypted off-chain
            policy.isActive,
            policy.policyholder,
            policy.insurer,
            policy.startDate,
            policy.endDate
        );
    }
    
    function getPaymentInfo(uint256 paymentId) public view returns (
        uint8 amount,
        address recipient,
        uint256 timestamp,
        bool isProcessed
    ) {
        Payment storage payment = payments[paymentId];
        return (
            0, // FHE.decrypt(payment.amount) - will be decrypted off-chain
            payment.recipient,
            payment.timestamp,
            payment.isProcessed
        );
    }
    
    function getUserClaims(address user) public view returns (uint256[] memory) {
        return userClaims[user];
    }
    
    function getUserPolicies(address user) public view returns (uint256[] memory) {
        return userPolicies[user];
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getInsurerReputation(address insurer) public view returns (uint8) {
        return 0; // FHE.decrypt(insurerReputation[insurer]) - will be decrypted off-chain
    }
    
    function withdrawFunds(uint256 amount) public {
        require(msg.sender == treasury || msg.sender == owner, "Only treasury or owner can withdraw");
        require(address(this).balance >= amount, "Insufficient contract balance");
        
        payable(msg.sender).transfer(amount);
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
}
