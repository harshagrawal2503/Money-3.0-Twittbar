// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./TwitterHandleAPI.sol";

contract TwitterVault is usingTwitterHandleAPI {
    struct VaultReceipt { 
        address sender;
        uint256 amount;
        uint timestamp;
    }
    
    event TransactionBreakdown(
        address sender,
        uint transferTimestamp,
        address receiver,
        uint256 receiverAmount,
        uint256 commisionAmount
    );

    mapping(string => VaultReceipt[]) public twitterHandleVault;
    
    function transferWithCommissionTo(VaultReceipt memory receipt, address receiver, uint256 amount) private {
        uint256 commision = amount / 100; // 1% commision
        uint256 transferAmount = amount - commision;

        emit TransactionBreakdown(
            receipt.sender, receipt.timestamp,
            receiver, transferAmount, commision
        );
        payable(receiver).transfer(transferAmount);
        payable(owner).transfer(commision);
    }

    function transferFund(string calldata twitterHandle) external payable {
        require(bytes(twitterHandle).length > 0, "twitter handle is required.");

        address receiver = twitterHandleAddress[twitterHandle];
        // require(_address != address(0), "Twitter handle has not registered with twitter oracle.");
    
        if (receiver == address(0)) {
            // Handle is not registered with the oracle.
            // Store the value to the vault.
            twitterHandleVault[twitterHandle].push(VaultReceipt(msg.sender, msg.value, block.timestamp));
        }
        else {
            // disburse the fund immediately
            transferWithCommissionTo(
                VaultReceipt(msg.sender, msg.value, block.timestamp),
                receiver, msg.value
            );
        }
    }

    function releaseFund(string memory twitterHandle) public _ownerOnly payable {
        address receiver = twitterHandleAddress[twitterHandle];
        require(receiver != address(0), "Twitter handle has not registered with twitter oracle.");

        while (twitterHandleVault[twitterHandle].length > 0) {
            uint256 lastIndex = twitterHandleVault[twitterHandle].length - 1;
            VaultReceipt memory receipt = twitterHandleVault[twitterHandle][lastIndex];
            transferWithCommissionTo(receipt, receiver, receipt.amount);
            twitterHandleVault[twitterHandle].pop();
        }
    }

    function vaultLength(string memory twitterHandle) public view returns (uint) {
        require(bytes(twitterHandle).length > 0, "twitter handle is required.");
        return twitterHandleVault[twitterHandle].length;
    }

    function checkBalance() public payable returns (uint256 contractAccount, uint256 ownerAccount, uint256 senderAccount) {
        return (address(this).balance, address(owner).balance, address(msg.sender).balance);
    }

    // recover the funds of the contract
    function kill() public _ownerOnly {
        selfdestruct(payable(msg.sender));
    }
}