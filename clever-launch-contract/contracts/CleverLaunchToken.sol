// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.0/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CleverLaunchToken is ERC20 {
    constructor() ERC20("CleverLaunchToken", "CLT") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}