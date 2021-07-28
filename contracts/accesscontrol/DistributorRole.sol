// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the library 'Roles'
import "./Roles.sol";

/// @author Udacity
contract DistributorRole {
    using Roles for Roles.Role;

    // Define events for adding and removing distributors
    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);

    // Define a struct 'distributors' by inheriting from 'Role' struct in the 'Roles' library
    Roles.Role private distributors;

    /// @dev makes the address that deploys this contract the first distributor
    constructor() {
        _addDistributor(msg.sender);
    }

    /// @dev defines a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyDistributor() {
        require(isDistributor(msg.sender));
        _;
    }

    /// @dev defines a function 'isDistributor' to check this role
    function isDistributor(address account) public view returns (bool) {
        return distributors.has(account);
    }

    /// @dev defines a function 'addDistributor' that adds this role
    function addDistributor(address account) public onlyDistributor {
        _addDistributor(account);
    }

    /// @dev defines a function 'renounceDistributor' to renounce this role
    function renounceDistributor() public {
        _removeDistributor(msg.sender);
    }

    /// @dev defines an internal function '_addDistributor' to add this role, called by 'addDistributor'
    function _addDistributor(address account) internal {
        distributors.add(account);
        emit DistributorAdded(account);
    }

    /// @dev defines an internal function '_removeDistributor' to remove this role, called by 'removeDistributor'
    function _removeDistributor(address account) internal {
        distributors.remove(account);
        emit DistributorRemoved(account);
    }
}
