// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract StakingContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct NFTMetadata {
                        uint256 tokenId;
                        string description_pairs;
                        uint256 amount;
                        uint256 time_minted;
                        }

    mapping(uint256 => uint256) public tokenStakedAmount;
    mapping(address => NFTMetadata) public Metadata;

    constructor() ERC721("Yield Forge LP NFT", "YF_NFT") {}

    function stake() external payable {
        require(msg.value > 0, "Amount must be greater than zero");
        uint256 tokenId = _tokenIdCounter.current();

        NFTMetadata memory data = NFTMetadata(tokenId, "ETH/USD", msg.value, block.timestamp);
        Metadata[msg.sender] = data;

        // Mint new LP NFT to represent the staked position
        _safeMint(msg.sender, tokenId);
        tokenStakedAmount[tokenId] = msg.value;

        _tokenIdCounter.increment();
    }

    function withdraw(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of the token");

        // Burn the LP NFT
        _burn(tokenId);

        // Transfer the staked ETH back to the user
        uint256 amount = tokenStakedAmount[tokenId];
        delete tokenStakedAmount[tokenId];
        payable(msg.sender).transfer(amount);
    }
}
