// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

/// @author Udacity
contract FisherRole {
    using Roles for Roles.Role;

    // Define events for adding and removing fishers
    event FisherAdded(address indexed account);
    event FisherRemoved(address indexed account);

    // Define a struct 'fishers' by inheriting from 'Role' struct in the 'Roles' library
    Roles.Role private fishers;

    /// @dev makes the address that deploys this contract the first fisher
    constructor() {
        _addFisher(msg.sender);
    }

    /// @dev defines a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyFisher() {
        require(isFisher(msg.sender));
        _;
    }

    /// @dev defines a function 'isFisher' to check this role
    function isFisher(address account) public view returns (bool) {
        return fishers.has(account);
    }

    /// @dev defines a function 'addFisher' that adds this role
    function addFisher(address account) public onlyFisher {
        _addFisher(account);
    }

    /// @dev define a function 'renounceFisher' to renounce this role
    function renounceFisher() public {
        _removeFisher(msg.sender);
    }

    /// @dev defines an internal function '_addFisher' to add this role, called by 'addFisher'
    function _addFisher(address account) internal {
        fishers.add(account);
        emit FisherAdded(account);
    }

    /// @dev defines an internal function '_removeFisher' to remove this role, called by 'removeFisher'
    function _removeFisher(address account) internal {
        fishers.remove(account);
        emit FisherRemoved(account);
    }
}
