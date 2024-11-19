// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
contract lottery {
    address public owner;
    address[] public participants;
    bool public isTicketPurchasable;
    uint256 public dernierGain;
    uint256 public dernierGagnant;
 
    event GagnantTire(address gagnant, uint256 montant);
 
    constructor() payable {
        owner = msg.sender;
        isTicketPurchasable = false;
        dernierGain = 0;
    }
 
    function CurrentContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
 
    receive() external payable {}
 
    fallback() external payable {}
 
    function Start () public {
        require(!isTicketPurchasable, "Les tickets sont déjà disponibles à l'achat");
        isTicketPurchasable = true;
    }
 
    function Finalize() public {
        require(isTicketPurchasable, "Il n'est plus possible d'acheter des tickets");
        isTicketPurchasable = false;
    }
 
    function Buy () public payable {
        require(isTicketPurchasable, "La participation est impossible tant que la loterie n'est pas en ligne."");
        participants.push(msg.sender);
    }
 
    function ChooseWinner () public {
        require(!isTicketPurchasable, "Vous devez arrêter les ventes de tickets avant de désigner le gagnant."");
        require(participants.length > 0, "Vous n'avez aucun participant a votre loterie");
 
        uint256 gagnantIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants))) % participants.length;
        address gagnant = participants[gagnantIndex];
 
        delete participants;
 
        dernierGain = address(this).balance;
        payable(gagnant).transfer(dernierGain);
 
        emit GagnantTire(gagnant, dernierGain);
    }
 
    function ListPlayers() public view returns (address[] memory) {
        return participants;
    }
}