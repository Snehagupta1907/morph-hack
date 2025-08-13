// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Buzzify {
    IERC20 public token;
    address public owner;
    uint256 private pool_id;
    uint256 public constant FEE = 100 wei;


    enum POLL_TYPE {
        BINARY,
        RANGE
    }
    struct Bet {
        address user;
        uint256 amount;
        uint256 targetScore;
        uint256 claimedAmount;
        bool claimed;
    }
    struct Pool {
        string question;
        string url;
        string parameter;
        string category;
        uint256 total_amount;
        uint256 total_bets;
        uint256 finalScore;
        uint256 startTime;
        uint256 endTime;
        uint256 resultDeclareTime;
        POLL_TYPE poll_type;
        bool poolEnded;
        mapping(address => Bet) userBet;
    }

    mapping(uint256 => Bet[]) public bets;
    mapping(uint256 => Pool) public pools;

    event BetPlaced(address indexed user, uint256 amount, uint256 targetScore);
    event BetClaimed(address indexed user, uint256 amountWon);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }

    function createPool(
        string calldata _poolName,
        string calldata _url,
        string calldata _parameter,
        string calldata _category,
        uint _polltype,
        uint256 _endTime
    ) external payable  {
        require(msg.value>=FEE,"PAY_MINIMAL_FEE");
        // Create a new pool
        pools[pool_id].question = _poolName;
        pools[pool_id].url = _url;
        pools[pool_id].parameter = _parameter;
        pools[pool_id].category = _category;
        pools[pool_id].total_amount = 0;
        pools[pool_id].total_bets = 0;
        pools[pool_id].poolEnded = false;
        pools[pool_id].finalScore = 0;
        pools[pool_id].poll_type = _polltype== 0 ? POLL_TYPE.BINARY : POLL_TYPE.RANGE;
        pools[pool_id].startTime = block.timestamp;
        pools[pool_id].endTime = block.timestamp + _endTime;
        pools[pool_id].resultDeclareTime =
            block.timestamp +
            (_endTime + 30 minutes);
        unchecked {
            pool_id += 1;
        }
    }

    // Place a bet with tokens and target score
    function placeBet(
        uint256 _amount,
        uint256 _targetScore,
        uint256 _pool_id
    ) external {
        require(_amount > 0, "Bet amount must be greater than 0");
        require(_targetScore > 0, "Target score must be greater than 0");
        require(!pools[_pool_id].poolEnded, "Pool is closed");
        require(
            pools[_pool_id].userBet[msg.sender].amount == 0,
            "Bet already placed"
        );
        require(
            block.timestamp < pools[_pool_id].endTime,
            "Betting period over"
        );
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        // Add bet to user's bets
        Bet memory newBet = Bet({
            user: msg.sender,
            amount: _amount,
            targetScore: _targetScore,
            claimedAmount: 0,
            claimed: false
        });

        bets[_pool_id].push(newBet);
        pools[_pool_id].userBet[msg.sender] = newBet;
        pools[_pool_id].total_bets += 1;
        pools[_pool_id].total_amount += _amount;
        emit BetPlaced(msg.sender, _amount, _targetScore);
    }

    // Set the result score (can be called by owner after 7 days)
    function setResult(uint256 _pool_id, uint256 _finalScore)
        external
        onlyOwner
    {
        require(
            block.timestamp >= pools[_pool_id].resultDeclareTime,
            "Betting period not over"
        );
        pools[_pool_id].poolEnded = true;
        pools[_pool_id].finalScore = _finalScore;
        _calculationReward(_pool_id);
    }

    function _calculationReward(uint256 _pool_id) private {
        Pool storage pool = pools[_pool_id];

        require(pool.poolEnded, "Pool not ended yet");
        require(pool.finalScore != 0, "Result not set yet");

        uint256 _finalScore = pool.finalScore;
        uint256 _totalWeightedAccuracy = 0;
        Bet[] storage userBets = bets[_pool_id];

        for (uint256 i = 0; i < userBets.length; i++) {
            uint256 _targetScore = userBets[i].targetScore;
            uint256 divergence = _finalScore > _targetScore
                ? _finalScore - _targetScore
                : _targetScore - _finalScore;
            uint256 _accuracyScore = (divergence + 1 > 0)
                ? (1e18 / (divergence + 1))
                : 0;
            uint256 weightedAccuracy = (_accuracyScore * userBets[i].amount) /
                1e18;
            _totalWeightedAccuracy += weightedAccuracy;
        }

        for (uint256 i = 0; i < userBets.length; i++) {
            uint256 _targetScore = userBets[i].targetScore;
            uint256 divergence = _finalScore > _targetScore
                ? _finalScore - _targetScore
                : _targetScore - _finalScore;
            uint256 _accuracyScore = (divergence + 1 > 0)
                ? (1e18 / (divergence + 1))
                : 0;
            uint256 weightedAccuracy = (_accuracyScore * userBets[i].amount) /
                1e18;
            uint256 _reward = (weightedAccuracy * pool.total_amount) /
                _totalWeightedAccuracy;
            userBets[i].claimedAmount = _reward;
            Bet storage _userBet = pool.userBet[userBets[i].user];
            _userBet.claimedAmount = _reward;
        }
    }

    // User claims the reward if the target score matches
    function claimBet(uint256 _pool_id) external {
        Pool storage pool = pools[_pool_id];
        Bet storage userBet = pool.userBet[msg.sender];
        uint256 reward = userBet.claimedAmount;
        require(reward > 0, "No reward to claim");
        require(!userBet.claimed, "Bet already claimed");
        require(pool.poolEnded, "Pool not ended yet");
        userBet.claimed = true;
        require(token.transfer(msg.sender, reward), "Token transfer failed");
        emit BetClaimed(msg.sender, reward);
    }

    // Withdraw tokens by the contract owner (if unclaimed)
    function withdraw(uint256 amount, address _receiver) external onlyOwner {
        require(token.transfer(_receiver, amount), "Token transfer failed");
    }

    function getBets(uint256 _pool_id) external view returns (Bet[] memory) {
        return bets[_pool_id];
    }

    function getPoolId() external view returns (uint256) {
        return pool_id;
    }

    function receive() external payable {}

}
