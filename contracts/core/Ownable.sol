// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @author Udacity
/// @dev provides basic authorization control
abstract contract Ownable {
    address payable private origOwner;

    /// @dev define an Event
    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    /// @dev assign the contract to an owner
    constructor () {
        origOwner = payable(msg.sender);
        emit TransferOwnership(address(0), origOwner);
    }

    /// @dev look up the address of the owner
    function owner() public view returns (address) {
        return origOwner;
    }

    /// @dev define a function modifier 'onlyOwner'
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /// @dev owner can destroy the contract
    function close() public onlyOwner {
        selfdestruct(origOwner);
    }

    /// @dev check if the calling address is the owner of the contract
    function isOwner() public view returns (bool) {
        return msg.sender == origOwner;
    }

    /// @dev define a function to renounce ownership
    function renounceOwnership() public onlyOwner {
        emit TransferOwnership(origOwner, address(0));
        origOwner = payable(address(0));
    }

    /// @dev define a public function to transfer ownership
    function transferOwnership(address payable newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /// @dev define an internal function to transfer ownership
    function _transferOwnership(address payable newOwner) internal {
        require(newOwner != address(0));
        emit TransferOwnership(origOwner, newOwner);
        origOwner = newOwner;
    }
}
