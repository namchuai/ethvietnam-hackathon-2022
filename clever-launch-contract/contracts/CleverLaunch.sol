// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Comment for Remix
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.0/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.0/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Project {
    uint128 id;
    uint48 approvedAt;
    uint48 endAt;
    address walletAddress; // 20 bytes
    uint256 backedAmount;
    uint256 targetAmount;
}

contract CleverLaunch is Ownable {
    // MainStorage part
    mapping(uint128 => Project) private projectMap;

    mapping(uint128 => mapping(address => uint256)) private userBackedAmount;

    address tokenAddress;

    address cleverLaunchAddress;
    // End of MainStorage part

    // Event part
    event TokenAddressChanged(
        address indexed previousTokenAddress,
        address indexed newTokenAddress
    );

    event ProjectApproved(uint128 indexed projectId);

    event ProjectDeposit(
        uint128 indexed projectId,
        address from,
        uint256 amount
    );

    event BackerClaimFund(
        uint128 indexed projectId,
        address indexed walletAddress,
        uint256 amount
    );

    event CreatorClaimFund(
        uint128 indexed projectId,
        address indexed walletAddress,
        uint256 amount
    );
    // TODO: add more event
    // End of Event part

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    // Modifier part
    /**
     * @dev Throws if project id does not exist.
     */
    modifier onlyProjectExist(uint128 _projectId) {
        require(
            projectMap[_projectId].approvedAt != 0,
            "Project does not exist"
        );
        _;
    }

    modifier onlyProjectNotEnded(uint128 _projectId) {
        require(
            projectMap[_projectId].endAt > block.timestamp,
            "Project ended"
        );
        _;
    }

    modifier onlyProjectNotExist(uint128 _projectId) {
        require(
            projectMap[_projectId].approvedAt == 0,
            "Project already exist"
        );
        _;
    }

    modifier onlyProjectFailedFunding(uint128 _projectId) {
        if (
            projectMap[_projectId].endAt > block.timestamp * 1000 &&
            projectMap[_projectId].targetAmount >
            projectMap[_projectId].backedAmount
        ) {
            revert("Project is not failed funding yet");
        }
        _;
    }

    modifier onlyProjectSuccessFunding(uint128 _projectId) {
        if (
            projectMap[_projectId].endAt > block.timestamp * 1000 &&
            projectMap[_projectId].targetAmount <=
            projectMap[_projectId].backedAmount
        ) {
            revert("Project is not success funding yet");
        }
        _;
    }

    // End of Modifier part

    // Action part
    function deposit(uint128 _projectId, uint256 _amount)
        external
        onlyProjectExist(_projectId)
        onlyProjectNotEnded(_projectId)
    {
        require(_amount > 0, "Amount can't be 0");

        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _amount);

        // update state
        userBackedAmount[_projectId][msg.sender] += _amount;
        projectMap[_projectId].backedAmount += _amount;

        emit ProjectDeposit(_projectId, msg.sender, _amount);
    }

    function createProject(
        uint128 _projectId,
        uint48 _approvedAt,
        uint48 _endAt,
        address _walletAddress,
        uint256 _targetAmount
    ) external onlyOwner onlyProjectNotExist(_projectId) {
        require(
            _approvedAt < _endAt,
            "Approved time must be higher than end time"
        );
        require(_endAt > block.timestamp, "Invalid end time");
        require(
            _targetAmount > 0,
            "Target amount cannot be equal or less than 0"
        );
        // prevent accidentally burn fund
        require(_walletAddress != address(0x0), "Invalid wallet address");

        projectMap[_projectId] = Project(
            _projectId,
            _approvedAt,
            _endAt,
            _walletAddress,
            0,
            _targetAmount
        );
    }

    // Set the ERC20 token address
    function setTokenAddress(address _tokenAddress) external {
        require(tokenAddress != _tokenAddress);
        address prevTokenAddress = tokenAddress;
        tokenAddress = _tokenAddress;
        emit TokenAddressChanged(prevTokenAddress, tokenAddress);
    }

    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }

    // For backer to reclaim their fund
    // Only work after project has failed funding round
    function claimFundBacker(uint128 _projectId)
        external
        onlyProjectExist(_projectId)
        onlyProjectFailedFunding(_projectId)
    {
        require(
            userBackedAmount[_projectId][msg.sender] > 0,
            "User backed amount is empty"
        );
        IERC20 token = IERC20(tokenAddress);
        uint256 transferAmount = userBackedAmount[_projectId][msg.sender];
        userBackedAmount[_projectId][msg.sender] = 0;

        token.transfer(msg.sender, transferAmount);

        emit BackerClaimFund(_projectId, msg.sender, transferAmount);
    }

    function claimFundCreator(uint128 _projectId)
        external
        onlyProjectExist(_projectId)
        onlyProjectSuccessFunding(_projectId)
    {
        require(
            projectMap[_projectId].backedAmount > 0,
            "Project fund is empty"
        );
        IERC20 token = IERC20(tokenAddress);

        // CleverLaunch takes 5%
        uint256 transferAmount = projectMap[_projectId].backedAmount -
            (projectMap[_projectId].backedAmount * 5) /
            100;
        projectMap[_projectId].backedAmount = 0;

        token.transfer(projectMap[_projectId].walletAddress, transferAmount);

        emit CreatorClaimFund(
            _projectId,
            projectMap[_projectId].walletAddress,
            transferAmount
        );
    }

    function getBackerAmount(uint128 _projectId, address _backerAddress)
        external
        view
        returns (uint256)
    {
        return userBackedAmount[_projectId][_backerAddress];
    }

    function getProjectEndTime(uint128 _projectId)
        external
        view
        returns (uint48)
    {
        return projectMap[_projectId].endAt;
    }

    function getProjectBackedAmount(uint128 _projectId)
        external
        view
        returns (uint256 backedAmount)
    {
        backedAmount = projectMap[_projectId].backedAmount;
    }

    function getProjectWalletAddress(uint128 _projectId)
        external
        view
        returns (address)
    {
        return projectMap[_projectId].walletAddress;
    }
}
