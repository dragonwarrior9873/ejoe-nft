// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract MarketPlace is ERC721URIStorage, Ownable(msg.sender) {
    constructor() ERC721("MarketPlace by Ciscrypt", "Ciscrypt") {}

    uint256 private NFTNextId = 0;
    uint256 private platformFee = 2;

    event NFTsActivity(
        uint256 indexed action,
        uint256 indexed tokenId,
        address from,
        address to,
        uint256 time,
        uint256 price
    );

    event triggerNodejsServer();
    event AuctionEndTimeExtended(uint256 indexed tokenId, uint256 newEndTime);
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );

    struct NFTDetailsObject {
        uint256 createAt;
        uint256 creatorFees;
        bool isListed;
        bool isAuction;
        uint256 price;
        address creator;
        address owner;
        string category;
        string fileType;
        uint256 no_of_fav;
    }
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 startPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }
    struct NFTObjectReturn {
        uint256 price;
        string uri;
        uint256 tokenId;
        address creator;
        address owner;
        uint256 createAt;
        string fileType;
        uint256 no_of_fav;
    }
    struct AuctionNFTObjectReturn {
        uint256 createAt;
        uint256 creatorFees;
        bool IsListed;
        bool isAuction;
        uint256 tokenId;
        address seller;
        uint256 startPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
        uint256 price;
        string uri;
        address creator;
        address owner;
        Bid[] nftBids;
    }

    struct NFTDataObjectReturn {
        bool isAuction;
        uint256 price;
        string uri;
        address owner;
        address creator;
    }

    struct NFTsListed {
        uint256 tokenId;
        uint256 Prices;
    }
    // Define a struct for filters and sort options
    struct NFTFilter {
        bool includeBuyNow; // Whether to include buy now NFTs
        bool includeAuction; // Whether to include auction NFTs
        bool sortByEndingSoon; // Sort by ending soon auctions
        bool sortByPriceLowToHigh; // Sort by price low to high
        bool sortByPriceHighToLow; // Sort by price high to low
        bool sortByMostFavorited; // Sort by most favorited
        uint256 minPrice; // Minimum price range
        uint256 maxPrice; // Maximum price range
        uint256 startIndex; // Index to start pagination
        uint256 pageSize; // Number of NFTs/auctions per page
        string category; // Filter by category
    }
    struct NFTObject {
        uint256 tokenId;
        uint256 price;
        string uri;
        address creator;
        address owner;
        uint256 creatorFees;
        bool isListed;
        bool isAuction;
        address seller;
        uint256 startPrice;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
        uint256 createAt;
        string fileType;
        uint256 no_of_fav;
        Bid[] nftBids;
    }
    mapping(uint256 => NFTDetailsObject) public NFTsDetails;
    mapping(uint256 => Auction) public auctions;
    event AuctionStarted(
        uint256 indexed tokenId,
        uint256 startPrice,
        uint256 endTime
    );
    event HighestBidIncreased(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount
    );

    event AuctionEnded(
        uint256 indexed tokenId,
        address indexed winner,
        uint256 amount
    );
    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
        string image;
        string username;
    }
    mapping(uint256 => Bid[]) public nftBids;
    // Define an event
    event LogMessage(string message);

    function mintNFT(
        string calldata TokenURI,
        uint256 CreatorFee,
        uint256 priceOfNFT,
        bool ApproveNFT,
        bool startAuction,
        uint256 startPrice,
        uint256 endTime,
        string calldata category,
        string calldata fileType
    ) public returns (uint256) {
        _safeMint(msg.sender, NFTNextId);
        _setTokenURI(NFTNextId, TokenURI);
        uint256 price = priceOfNFT;

        NFTsDetails[NFTNextId] = NFTDetailsObject(
            block.timestamp,
            CreatorFee,
            ApproveNFT,
            startAuction,
            price,
            msg.sender,
            address(0),
            category,
            fileType,
            0
        );
        //  setApprovalForAll(msg.sender, true);
        if (startAuction) {
            _setNFTApprove(true, NFTNextId);
            emit triggerNodejsServer();
        } else {
            approveNFT(NFTNextId, ApproveNFT);
        }

        emit NFTsActivity(
            98, // for mint code
            NFTNextId,
            msg.sender,
            address(0),
            block.timestamp,
            price
        );
        NFTNextId += 1;
        // If startAuction is true, create the auction
        if (startAuction) {
            createAuction(NFTNextId - 1, startPrice, endTime);
        }
        return NFTNextId - 1;
    }

    function createAuction(
        uint256 tokenId,
        uint256 startPrice,
        uint256 endTime
    ) internal onlyTokenOwner(tokenId) {
        require(!auctions[tokenId].ended, "Auction already ended");
        // require(block.timestamp <= endTime, "Invalid auction times");
        // block.timestamp < startTime &&
        // Ensure the NFT is not already listed for sale
        require(
            !NFTsDetails[tokenId].isListed,
            "NFT is already listed for sale"
        );

        auctions[tokenId] = Auction(
            tokenId,
            msg.sender,
            startPrice,
            endTime,
            address(0),
            0,
            false
        );
        NFTsDetails[tokenId].isAuction = true;
        emit AuctionStarted(tokenId, startPrice, endTime);
    }

    function buyNFT(uint256 tokenId) public payable {
        if (NFTsDetails[tokenId].price == msg.value) {
            address payable NFTOwner = payable(ownerOf(tokenId));

            address payable NFTCreator = payable(NFTsDetails[tokenId].creator);
            uint256 NFTCreatorFee = NFTsDetails[tokenId].creatorFees;

            address payable ownerOfMarketPlace = payable(owner());

            uint256 remeinNFTPrice = distributePaymentsAndApplyFees(
                ownerOfMarketPlace,
                NFTOwner,
                NFTCreator,
                NFTCreatorFee
            );

            NFTsDetails[tokenId].owner = msg.sender;
            NFTsDetails[tokenId].price = remeinNFTPrice;

            transferFrom(NFTOwner, msg.sender, tokenId);
            emit NFTsActivity(
                76, // for buyNFT code
                tokenId,
                NFTOwner,
                msg.sender,
                block.timestamp,
                remeinNFTPrice
            );
        } else {
            revert("Payment was Revert");
        }
    }

    function approveNFT(uint256 tokenId, bool IsApproved) public {
        NFTsDetails[tokenId].isListed = IsApproved;
        _setNFTApprove(IsApproved, tokenId);
        emit triggerNodejsServer();
    }
    function extendAuctionEndTime(uint256 tokenId, uint256 newEndTime) public {
        // require(msg.sender == ownerOf(tokenId), "Only token owner can extend auction end time");
        // require(auctions[tokenId].endTime > block.timestamp, "Auction is not active");
        // require(newEndTime > auctions[tokenId].endTime, "New end time must be after current end time");
        auctions[tokenId].endTime = newEndTime;
        emit AuctionEndTimeExtended(tokenId, newEndTime);
    }

    function getPriceOfNFT(uint256 tokenId) public view returns (uint256) {
        return NFTsDetails[tokenId].price;
    }

    function getNFTsByFilter(
        NFTFilter memory filter
    ) public view returns (NFTObject[] memory) {
        uint256 totalNFTs = totalSupply();
        NFTObject[] memory nftObjects = new NFTObject[](totalNFTs);
        uint256 count = 0;

        // Iterate over all NFTs
        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 tokenId = i; // Assuming token IDs start from 0 and increment by 1
            NFTDetailsObject memory nftDetails = NFTsDetails[tokenId];
            //   emit PriceDebug(nftDetails.price, filter.minPrice, filter.maxPrice);
            // Check if NFT matches the category filter
            if (keccak256(bytes(filter.category)) != keccak256("All NFTs")) {
                if (bytes(filter.category).length > 0) {
                    // Implement category filtering logic here
                    if (
                        keccak256(bytes(nftDetails.category)) !=
                        keccak256(bytes(filter.category))
                    ) {
                        continue; // Skip if category doesn't match
                    }
                }
            }

            // Check if NFT matches the price range filter
            // Check if NFT matches the price range filter
            if (
                nftDetails.price < filter.minPrice ||
                nftDetails.price > filter.maxPrice
            ) {
                continue;
            }

            // Check if NFT matches sales type filter
            if (
                (filter.includeBuyNow &&
                    nftDetails.isListed &&
                    !nftDetails.isAuction) ||
                (filter.includeAuction &&
                    nftDetails.isAuction &&
                    !isAuctionEnded(tokenId))
            ) {
                NFTObject memory nftObject;

                // Set common fields for all NFTs
                nftObject.tokenId = tokenId;
                nftObject.price = nftDetails.price;
                nftObject.uri = tokenURI(tokenId);
                nftObject.creator = nftDetails.creator;
                nftObject.owner = ownerOf(tokenId);
                nftObject.creatorFees = nftDetails.creatorFees;
                nftObject.isListed = nftDetails.isListed;
                nftObject.isAuction = nftDetails.isAuction;
                nftObject.createAt = nftDetails.createAt;
                nftObject.fileType = nftDetails.fileType;
                nftObject.no_of_fav = nftDetails.no_of_fav;

                if (nftDetails.isAuction) {
                    // Get auction details
                    Auction memory auction = auctions[tokenId];

                    // Check if auction has ended
                    if (!auction.ended && auction.endTime <= block.timestamp) {
                        auction.ended = true;
                    }

                    // Set auction-specific fields
                    nftObject.seller = auction.seller;
                    nftObject.startPrice = auction.startPrice;
                    nftObject.endTime = auction.endTime;
                    nftObject.highestBidder = auction.highestBidder;
                    nftObject.highestBid = auction.highestBid;
                    nftObject.ended = auction.ended;
                    nftObject.nftBids = nftBids[tokenId];
                } else {
                    // For non-auction NFTs, set auction-specific fields to default values
                    nftObject.seller = address(0);
                    nftObject.startPrice = 0;
                    nftObject.endTime = 0;
                    nftObject.highestBidder = address(0);
                    nftObject.highestBid = 0;
                    nftObject.ended = false;
                }

                // Add the NFTObject to the array
                nftObjects[count] = nftObject;
                count++;
            }
        }

        // Resize the array based on the count of filtered NFTs
        NFTObject[] memory filteredNFTs = new NFTObject[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredNFTs[i] = nftObjects[i];
        }

        // Sort the filtered NFTs based on the provided sort options
        // if (filter.sortByPriceLowToHigh) {
        //     sortNFTsByPriceLowToHigh(filteredNFTs);
        // } else if (filter.sortByPriceHighToLow) {
        //     sortNFTsByPriceHighToLow(filteredNFTs);
        // } else if (filter.sortByEndingSoon) {
        //     sortAuctionsByEndingSoon(filteredNFTs);
        // } else if (filter.sortByMostFavorited) {
        //     // Implement sorting logic here based on the favorited count, if available
        // }

        // Apply pagination to the filtered and sorted NFTs
        uint256 paginatedSize = filter.pageSize > count
            ? count
            : filter.pageSize;
        NFTObject[] memory paginatedNFTs = new NFTObject[](paginatedSize);

        uint256 startIndex = filter.startIndex;
        for (uint256 i = 0; i < paginatedSize && startIndex + i < count; i++) {
            paginatedNFTs[i] = filteredNFTs[startIndex + i];
        }

        // Return the paginated NFTs
        return paginatedNFTs;
    }
    function isAuctionEnded(uint256 tokenId) internal view returns (bool) {
        Auction memory auction = auctions[tokenId];
        return auction.ended || auction.endTime <= block.timestamp;
    }
    function countNFTsByFilter(
        bool filterIsAuction,
        bool filterIsListed
    ) public view returns (uint256) {
        uint256 totalNFTs = totalSupply();
        uint256 count = 0;
        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 tokenId = i;
            NFTDetailsObject memory nftDetails = NFTsDetails[tokenId];
            if (
                (filterIsListed &&
                    nftDetails.isListed &&
                    !nftDetails.isAuction) ||
                (filterIsAuction && nftDetails.isAuction)
            ) {
                count++;
            }
        }
        return count;
    }

    function getUserOwnedNFTs(
        address _user
    ) public view returns (NFTObjectReturn[] memory) {
        uint256 length = getNFTsOfAddress(_user).owned.length;
        NFTObjectReturn[] memory userNFTs = new NFTObjectReturn[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = getNFTsOfAddress(_user).owned[i];
            userNFTs[i] = NFTObjectReturn({
                price: getPriceOfNFT(tokenId),
                uri: tokenURI(tokenId),
                tokenId: tokenId,
                creator: NFTsDetails[tokenId].creator,
                owner: NFTsDetails[tokenId].owner,
                createAt: NFTsDetails[tokenId].createAt,
                fileType: NFTsDetails[tokenId].fileType,
                no_of_fav: NFTsDetails[tokenId].no_of_fav
            });
        }
        return userNFTs;
    }

    function getUserCreatedNFTs(
        address _user
    ) public view returns (NFTObjectReturn[] memory) {
        uint256 leg = getNFTsOfAddress(_user).created.length;
        uint256 count;
        NFTObjectReturn[] memory userNfts = new NFTObjectReturn[](leg);

        for (uint256 i = 0; i < leg; i++) {
            uint256 tokenId = getNFTsOfAddress(_user).created[i];

            // Check if the NFT is not listed for auction
            if (!NFTsDetails[tokenId].isAuction) {
                userNfts[count] = NFTObjectReturn({
                    price: getPriceOfNFT(tokenId),
                    uri: tokenURI(tokenId),
                    tokenId: tokenId,
                    creator: NFTsDetails[tokenId].creator,
                    owner: NFTsDetails[tokenId].owner,
                    createAt: NFTsDetails[tokenId].createAt,
                    fileType: NFTsDetails[tokenId].fileType,
                    no_of_fav: NFTsDetails[tokenId].no_of_fav
                });
                count++;
            }
        }

        // Resize the array to remove any empty slots
        assembly {
            mstore(userNfts, count)
        }

        return userNfts;
    }
    function getUserCreatedAuctionNFTs(
        address _user
    ) public returns (AuctionNFTObjectReturn[] memory) {
        uint256 leg = getNFTsOfAddress(_user).created.length;
        uint256 count;
        AuctionNFTObjectReturn[] memory userNfts = new AuctionNFTObjectReturn[](
            leg
        );

        for (uint256 i = 0; i < leg; i++) {
            uint256 tokenId = getNFTsOfAddress(_user).created[i];
            if (NFTsDetails[tokenId].isAuction) {
                endAuctionIfExpired(tokenId);
                userNfts[count] = AuctionNFTObjectReturn({
                    createAt: NFTsDetails[tokenId].createAt,
                    creatorFees: NFTsDetails[tokenId].creatorFees,
                    IsListed: NFTsDetails[tokenId].isListed,
                    isAuction: NFTsDetails[tokenId].isAuction,
                    tokenId: tokenId,
                    seller: auctions[tokenId].seller,
                    startPrice: auctions[tokenId].startPrice,
                    endTime: auctions[tokenId].endTime,
                    highestBidder: auctions[tokenId].highestBidder,
                    highestBid: auctions[tokenId].highestBid,
                    ended: auctions[tokenId].ended,
                    price: getPriceOfNFT(tokenId),
                    uri: tokenURI(tokenId),
                    creator: NFTsDetails[tokenId].creator,
                    owner: NFTsDetails[tokenId].owner,
                    nftBids: nftBids[tokenId]
                });
                count++;
            }
        }

        // Resize the array to remove any empty slots
        assembly {
            mstore(userNfts, count)
        }

        return userNfts;
    }
    function getUserOwnedAuctionNFTs(
        address _user
    ) public returns (AuctionNFTObjectReturn[] memory) {
        uint256 leg = getNFTsOfAddress(_user).owned.length;
        uint256 count;
        AuctionNFTObjectReturn[] memory userNfts = new AuctionNFTObjectReturn[](
            leg
        );

        for (uint256 i = 0; i < leg; i++) {
            uint256 tokenId = getNFTsOfAddress(_user).created[i];
            if (NFTsDetails[tokenId].isAuction) {
                endAuctionIfExpired(tokenId);
                userNfts[count] = AuctionNFTObjectReturn({
                    createAt: NFTsDetails[tokenId].createAt,
                    creatorFees: NFTsDetails[tokenId].creatorFees,
                    IsListed: NFTsDetails[tokenId].isListed,
                    isAuction: NFTsDetails[tokenId].isAuction,
                    tokenId: tokenId,
                    seller: auctions[tokenId].seller,
                    startPrice: auctions[tokenId].startPrice,
                    endTime: auctions[tokenId].endTime,
                    highestBidder: auctions[tokenId].highestBidder,
                    highestBid: auctions[tokenId].highestBid,
                    ended: auctions[tokenId].ended,
                    price: getPriceOfNFT(tokenId),
                    uri: tokenURI(tokenId),
                    creator: NFTsDetails[tokenId].creator,
                    owner: NFTsDetails[tokenId].owner,
                    nftBids: nftBids[tokenId]
                });
                count++;
            }
        }

        // Resize the array to remove any empty slots
        assembly {
            mstore(userNfts, count)
        }

        return userNfts;
    }
    function endAuctionIfExpired(uint256 tokenId) internal {
        if (
            auctions[tokenId].endTime <= block.timestamp &&
            !auctions[tokenId].ended
        ) {
            auctions[tokenId].ended = true;
            emit AuctionEnded(
                tokenId,
                auctions[tokenId].highestBidder,
                auctions[tokenId].highestBid
            );
        }
    }

    function getNFTById(
        uint256 tokenId
    ) public view returns (NFTDataObjectReturn memory) {
        NFTDataObjectReturn memory NFT;
        address onwerOfNFT = ownerOf(tokenId);
        string memory uriOfNFT = tokenURI(tokenId);
        uint256 price = NFTsDetails[tokenId].price;
        address creator = NFTsDetails[tokenId].creator;
        NFT = NFTDataObjectReturn({
            isAuction: NFTsDetails[tokenId].isAuction,
            price: price,
            uri: uriOfNFT,
            owner: onwerOfNFT,
            creator: creator
        });
        return NFT;
    }

    function getNFTAndAuctionDetails(
        uint256 tokenId
    ) public view returns (AuctionNFTObjectReturn memory) {
        NFTDetailsObject memory nftDetails = NFTsDetails[tokenId];
        Auction memory auction = auctions[tokenId];
        if (!auction.ended && auction.endTime <= block.timestamp) {
            auction.ended = true; // Mark the auction as ended if its end time has passed
        }
        AuctionNFTObjectReturn memory auctionInfo = AuctionNFTObjectReturn({
            createAt: nftDetails.createAt,
            creatorFees: nftDetails.creatorFees,
            IsListed: nftDetails.isListed,
            isAuction: nftDetails.isAuction,
            tokenId: tokenId,
            seller: auction.seller,
            startPrice: auction.startPrice,
            endTime: auction.endTime,
            highestBidder: auction.highestBidder,
            highestBid: auction.highestBid,
            ended: auction.ended,
            price: nftDetails.price,
            uri: tokenURI(tokenId),
            creator: nftDetails.creator,
            owner: ownerOf(tokenId),
            nftBids: nftBids[tokenId]
        });

        return auctionInfo;
    }

    function setNFTPrice(
        uint256 tokenId,
        uint256 _price
    ) public onlyTokenOwner(tokenId) {
        NFTsDetails[tokenId].price = _price;
        emit triggerNodejsServer();
    }

    function setNFTUri(
        string calldata _uri,
        uint256 tokenId
    ) public onlyTokenOwner(tokenId) {
        _setTokenURI(tokenId, _uri);
        emit triggerNodejsServer();
    }

    function distributePaymentsAndApplyFees(
        address payable MarketOwner,
        address payable Seller,
        address payable Creator,
        uint256 fee
    ) public payable returns (uint256) {
        uint256 amountForMarketOwner = (msg.value * platformFee) / 100;
        uint256 amountForCreator = ((msg.value - amountForMarketOwner) * fee) /
            100;
        uint256 amountForSeller = (msg.value - amountForCreator) -
            amountForMarketOwner;
        MarketOwner.transfer(amountForMarketOwner);
        Seller.transfer(amountForSeller);
        Creator.transfer(amountForCreator);
        return amountForSeller;
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        if (msg.sender == ownerOf(tokenId)) {
            _;
        } else {
            revert("you are not owner of this token for edit");
        }
    }

    function totalSupply() public view returns (uint256) {
        return NFTNextId;
    }
    function placeBid(
        uint256 tokenId,
        string calldata image,
        string calldata username
    ) external payable {
        Auction storage auction = auctions[tokenId];

        // Ensure the auction exists and is ongoing
        // require(auction.endTime > block.timestamp, "Auction is not active");
        require(!auction.ended, "Auction has ended");

        // Ensure the bid amount is higher than the current highest bid
        require(
            msg.value > auction.highestBid,
            "Bid amount must be higher than current highest bid"
        );

        // Refund the previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // Update the highest bidder and bid amount
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        address payable NFTOwner = payable(ownerOf(tokenId));
        // Store bid information
        nftBids[tokenId].push(
            Bid({
                bidder: msg.sender,
                amount: msg.value,
                timestamp: block.timestamp,
                image: image,
                username: username
            })
        );

        emit BidPlaced(tokenId, msg.sender, msg.value);
        emit NFTsActivity(
            77, // for bid code
            tokenId,
            msg.sender,
            NFTOwner,
            block.timestamp,
            msg.value
        );
    }
    function getBidsForNFT(uint256 tokenId) public view returns (Bid[] memory) {
        return nftBids[tokenId];
    }
    function claimAuctionNFT(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];

        // // Ensure the auction has ended
        // require(auction.ended, "Auction has not ended yet");

        // // Ensure the caller is the highest bidder
        // require(msg.sender == auction.highestBidder, "You are not the highest bidder");
        //   IERC721 nft = IERC721(nftAddress);
        // nft.transferFrom(address(this), msg.sender, tokenId);
        //   nft.transferFrom(address(this), auction.highestBidder, tokenId);
        // Transfer the NFT to the highest bidder
        transferFrom(ownerOf(tokenId), auction.highestBidder, tokenId);
        payable(ownerOf(tokenId)).transfer(auction.highestBid);
        // Mark the auction as ended
        auction.ended = true;

        emit AuctionEnded(tokenId, msg.sender, auction.highestBid);
    }

    function countNFTsByCategory(
        string[] memory categories
    ) public view returns (uint256[] memory counts) {
        counts = new uint256[](categories.length);
        for (uint256 i = 0; i < categories.length; i++) {
            string memory category = categories[i];
            uint256 count = 0;
            for (uint256 tokenId = 0; tokenId < NFTNextId; tokenId++) {
                if (
                    keccak256(bytes(NFTsDetails[tokenId].category)) ==
                    keccak256(bytes(category))
                ) {
                    count++;
                }
            }
            counts[i] = count;
        }

        return counts;
    }
}
