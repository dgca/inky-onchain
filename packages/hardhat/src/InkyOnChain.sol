// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IBitmapRendererV1.sol";

/**
 * @title InkyOnChain
 * @author typeof.eth
 * @notice An onchain art project commemorating the launch of the Ink L2 chain.
 * Bitmap images are rendered and stored onchain.
 */
contract InkyOnChain is ERC721Enumerable, Ownable {
    uint256 public maxSupply = 2024;

    uint256 public mintPrice = 0.002 ether;

    uint256 public maxMintPerAddress = 3;

    uint256 public nextTokenId = 1;

    IBitmapRendererV1 public bitmapRenderer;

    mapping(uint256 => address) public tokenIdToMinter;

    mapping(uint256 => bytes) public tokenIdToImageBytes;

    mapping(address => uint256) public addressToMintCount;

    uint256[] public palette = [
        0xFFFFFF,
        0x2F1267,
        0x6630D9,
        0x7F51D4,
        0x1C0844,
        0xAD99DC,
        0x000000
    ];

    // prettier-ignore
    uint8[] public imageData = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 4, 1, 4, 4, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 3, 3, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 2, 2, 2, 3, 3, 1, 1, 1, 1, 4, 1, 4, 4, 1, 1, 1, 0,
        0, 1, 1, 4, 1, 4, 4, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 3, 3, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 4, 1, 4, 4, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 5, 1, 5, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 5, 1, 5, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 0, 6, 2, 0, 6, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 5, 2, 5, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 5, 5, 5, 5, 5, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 5, 1, 5, 1, 5, 1, 5, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 5, 1, 5, 1, 5, 1, 5, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 0,
        0, 4, 1, 1, 1, 4, 5, 1, 1, 4, 1, 1, 5, 4, 5, 1, 5, 4, 5, 1, 1, 1, 1, 1, 5, 4, 1, 1, 1, 4, 0,
        0, 1, 4, 1, 4, 5, 5, 5, 4, 1, 4, 1, 5, 1, 5, 1, 5, 1, 5, 1, 4, 1, 4, 5, 5, 5, 4, 1, 4, 1, 0,
        0, 4, 1, 4, 1, 4, 5, 4, 1, 4, 1, 5, 1, 4, 5, 4, 5, 4, 1, 5, 1, 4, 1, 4, 5, 4, 1, 4, 1, 4, 0,
        0, 1, 4, 1, 4, 1, 4, 5, 4, 1, 5, 1, 4, 5, 4, 1, 4, 5, 4, 1, 5, 1, 4, 5, 4, 1, 4, 1, 4, 1, 0,
        0, 4, 4, 4, 4, 4, 4, 4, 5, 5, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 0,
        0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
        0, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 0,
        0, 4, 4, 1, 4, 1, 1, 1, 4, 4, 4, 4, 5, 5, 5, 4, 5, 5, 5, 4, 4, 4, 4, 4, 1, 4, 1, 4, 1, 4, 0,
        0, 4, 1, 4, 4, 1, 4, 1, 4, 4, 4, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 1, 4, 4, 1, 1, 1, 4, 0,
        0, 4, 1, 1, 4, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 1, 4, 0,
        0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    constructor(
        address _bitmapRendererAddress
    ) ERC721("InkyOnChain", "INKY") Ownable(msg.sender) {
        bitmapRenderer = IBitmapRendererV1(_bitmapRendererAddress);
    }

    /// @notice Mint an Inky with your unique tokenId and address encoded into the image
    /// @dev Limited to 2024 tokens
    /// @dev Minting costs 0.002 ETH
    function mint() external payable returns (uint256) {
        uint256 tokenId = _getNextTokenId();

        require(tokenId <= maxSupply, "Sold out");
        require(msg.value >= mintPrice, "Invalid mint price");
        require(
            addressToMintCount[msg.sender] < maxMintPerAddress,
            "Max mint per address reached"
        );

        // Increment the mint count for the minter
        addressToMintCount[msg.sender]++;

        // Store the minter address for the tokenId so it can be used in the token metadata
        tokenIdToMinter[tokenId] = msg.sender;

        uint8[] memory imageData_ = imageData;
        uint256[] memory palette_ = new uint256[](palette.length + 6);

        for (uint i = 0; i < palette.length; i++) {
            palette_[i] = palette[i];
        }

        // Encode the tokenId into the image
        // The tokenId will be displayed in binary in the top right of the image
        for (uint8 i = 0; i < 11; i++) {
            bool isSet = (tokenId & (1 << i)) != 0;
            imageData_[30 - i] = isSet ? 1 : 0;
        }

        // Encode the minter address into the image
        // The minter address will be turned into six colors, and will be displayed in the bottom left of the image
        uint256 minterInt = uint256(uint160(msg.sender));

        for (uint i = 0; i < 6; i++) {
            uint256 shift = (5 - i) * 24; // 24 bits = 6 hex digits
            uint256 color = (minterInt >> shift) & 0xFFFFFF;
            palette_[palette.length + i] = color;

            imageData_[imageData.length - 31 + i] = uint8(palette.length + i);
        }

        // Generate the image bytes data and store it
        tokenIdToImageBytes[tokenId] = bitmapRenderer.create8bitBMPData(
            31,
            31,
            palette_,
            imageData_
        );

        // Mint the token to the minter.
        _safeMint(msg.sender, tokenId);

        return tokenId;
    }

    /// @notice Get the base64 encoded image for a given tokenId
    /// @param _tokenId The tokenId of the Inky
    /// @return The base64 encoded image
    function getBase64EncodedImage(
        uint256 _tokenId
    ) public view returns (string memory) {
        return Base64.encode(tokenIdToImageBytes[_tokenId]);
    }

    /// @notice Get the image bytes for a given array of tokenIds
    /// @param _tokenIds The tokenIds to get the images for
    /// @return An array of images in bytes format
    function getImageBytesForTokenIds(
        uint256[] memory _tokenIds
    ) public view returns (bytes[] memory) {
        bytes[] memory imageBytes = new bytes[](_tokenIds.length);

        for (uint i = 0; i < _tokenIds.length; i++) {
            imageBytes[i] = tokenIdToImageBytes[_tokenIds[i]];
        }
        return imageBytes;
    }

    /// @notice Get the tokenURI for a given tokenId
    /// @param _tokenId The tokenId of the Inky
    /// @return The tokenURI as onchain metadata
    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        string memory json = string.concat(
            "{",
            '"name": "Inky #',
            Strings.toString(_tokenId),
            '",',
            '"image": "',
            string(
                abi.encodePacked(
                    "data:image/bmp;base64,",
                    getBase64EncodedImage(_tokenId)
                )
            ),
            '",',
            '"attributes": [',
            "{",
            '"trait_type": "Minter",',
            '"value": "',
            Strings.toHexString(uint256(uint160(tokenIdToMinter[_tokenId]))),
            '"',
            "}",
            "]",
            "}"
        );

        string memory dataUri = string.concat(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        );

        return dataUri;
    }

    /// @notice Withdraw funds from the contract
    /// @param _to The address to send the funds to
    /// @param _amount The amount of funds to send. If 0, all funds will be sent
    function withdraw(address _to, uint256 _amount) external onlyOwner {
        uint256 amountToSend = _amount == 0 ? address(this).balance : _amount;
        (bool success, ) = _to.call{ value: amountToSend }("");
        require(success, "Transfer failed");
    }

    function _getNextTokenId() internal returns (uint256) {
        uint256 _nextId = nextTokenId;
        uint256 _newNextId = nextTokenId + 1;
        nextTokenId = _newNextId;

        return _nextId;
    }

    // Functions below this comment are overrides required by the interfaces this contract inherits

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
