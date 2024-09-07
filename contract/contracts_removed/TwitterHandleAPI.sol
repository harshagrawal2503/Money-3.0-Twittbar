// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract usingTwitterHandleAPI {
    address owner;

    constructor() {
        owner = msg.sender;
    }
    
    modifier _ownerOnly() {
        require(msg.sender == owner, "owner only transaction.");
        _;
    }

    mapping(string => address) public twitterHandleAddress;

    function updateHandleAddress(string memory handle, address walletAddress) public _ownerOnly {
        require(bytes(handle).length > 0, "twitter handle is required.");
        twitterHandleAddress[handle] = walletAddress;
    }
}