// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

/// @author Udacity
contract ConsumerRole {
    using Roles for Roles.Role;

    // Define events for adding and removing consumers
    event ConsumerAdded(address indexed account);
    event ConsumerRemoved(address indexed account);

    // Define a struct 'consumers' by inheriting from 'Role' struct in the 'Roles' library
    Roles.Role private consumers;

    /// @dev makes the address that deploys this contract the first consumer
    constructor() {
        _addConsumer(msg.sender);
    }

    /// @dev defines a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyConsumer() {
        require(isConsumer(msg.sender));
        _;
    }

    /// @dev defines a function 'isConsumer' to check this role
    function isConsumer(address account) public view returns (bool) {
        return consumers.has(account);
    }

    /// @dev defines a function 'addConsumer' that adds this role
    function addConsumer(address account) public onlyConsumer {
        _addConsumer(account);
    }

    /// @dev defines a function 'renounceConsumer' to renounce this role
    function renounceConsumer() public {
        _removeConsumer(msg.sender);
    }

    /// @dev defines an internal function '_addConsumer' to add this role, called by 'addConsumer'
    function _addConsumer(address account) internal {
        consumers.add(account);
        emit ConsumerAdded(account);
    }

    /// @dev defines an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
    function _removeConsumer(address account) internal {
        consumers.remove(account);
        emit ConsumerRemoved(account);
    }
}
