// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HangmanGame {
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Game {
        address player;
        uint256 stake;
        bytes32 commitment;
        bool isCompleted;
        uint256 startTime;
    }

    struct Stats {
        uint256 wordsGuessed;
        uint256 gamesPlayed;
    }

    mapping(string => Game) public games;
    mapping(address => Stats) public userStats;
    uint256 public minStake = 0.01 ether;
    uint256 public maxGameDuration = 1 hours;

    event GameStarted(string gameId, address player, uint256 stake);
    event GameCompleted(string gameId, address player, bool won);

    function startGame(
        string memory gameId,
        bytes32 commitment
    ) external payable {
        require(msg.value >= minStake, "Insufficient stake");
        require(commitment != bytes32(0), "Invalid commitment");
        require(!games[gameId].isCompleted, "Game already exists");

        games[gameId] = Game({
            player: msg.sender,
            stake: msg.value,
            commitment: commitment,
            isCompleted: false,
            startTime: block.timestamp
        });

        userStats[msg.sender].gamesPlayed += 1;
        emit GameStarted(gameId, msg.sender, msg.value);
    }

    function completeGame(
        string memory gameId,
        string memory word,
        bytes32 nonce
    ) external {
        Game storage game = games[gameId];
        require(!game.isCompleted, "Game already completed");
        require(
            block.timestamp <= game.startTime + maxGameDuration,
            "Game expired"
        );
        require(
            keccak256(abi.encodePacked(word, nonce)) == game.commitment,
            "Invalid word or nonce"
        );
        require(
            msg.sender == game.player || msg.sender == admin,
            "Not authorized"
        );

        game.isCompleted = true;
        payable(game.player).transfer(game.stake);

        // Update stats
        userStats[msg.sender].wordsGuessed += 1; // Only if won

        emit GameCompleted(gameId, game.player, true);
    }

    // function recoverExpiredGame(string memory gameId) external {
    //     Game storage game = games[gameId];
    //     require(!game.isCompleted, "Game already completed");
    //     require(
    //         block.timestamp > game.startTime + maxGameDuration,
    //         "Game not expired"
    //     );
    //     require(msg.sender == game.player, "Not the player");

    //     game.isCompleted = true;
    //     payable(game.player).transfer(game.stake);
    //     emit GameCompleted(gameId, game.player, false);
    // }

    function withdrawExpiredGameFunds(string memory gameId) external {
        require(msg.sender == admin, "Only admin can withdraw");

        Game storage game = games[gameId];
        require(!game.isCompleted, "Game already completed");
        require(
            block.timestamp > game.startTime + maxGameDuration,
            "Game not expired"
        );

        game.isCompleted = true;
        payable(admin).transfer(game.stake);
        emit GameCompleted(gameId, game.player, false);
    }

    // View functions
    function getGame(
        string memory gameId
    )
        external
        view
        returns (
            address player,
            uint256 stake,
            bool isCompleted,
            uint256 startTime
        )
    {
        Game memory game = games[gameId];
        return (game.player, game.stake, game.isCompleted, game.startTime);
    }

    function getUserStats(
        address user
    ) external view returns (uint256, uint256) {
        Stats memory stats = userStats[user];
        return (stats.wordsGuessed, stats.gamesPlayed);
    }

    fallback() external payable {
        revert("Fallback: not allowed");
    }

    receive() external payable {
        revert("Receive: not allowed");
    }
}
