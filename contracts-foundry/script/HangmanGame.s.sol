// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {HangmanGame} from "../src/HangmanGame.sol";

contract HangmanGameScript is Script {
    HangmanGame public hangmanGame;

    function setUp() public {}

    function run() public {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the HangmanGame contract
        hangmanGame = new HangmanGame();

        console.log("HangmanGame deployed at:", address(hangmanGame));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
