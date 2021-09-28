// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

abstract contract FiatTokenProxy{
    function transfer(address to, uint256 value) public virtual returns (bool success);
    function balanceOf(address account) public virtual view returns(uint256);
}

contract InvoiceDiscounting {

  FiatTokenProxy public usdcToken;
  address private owner;
  mapping(string=>TransactionDetails) private fundingList;

  struct TransactionDetails {
      uint256 amount;
      uint256 lastTransaction;
      uint256 dailyCounter;
  }

  constructor(FiatTokenProxy _usdcToken) {
    usdcToken = _usdcToken;
    owner= msg.sender;
  }

  modifier restricted() {
    require(msg.sender == owner, "You are not authorized to perform this action");
    _;
  }
  
  function fundWallet(string memory customerId, address customer, uint256 amount) public restricted returns(bool) {
    require(amount < 500000000, "The crediting threshold is $500 at a time."); //Only 500 dollars credit at a time
    require(amount < usdcToken.balanceOf(address(this)) , "Funding this amount is not possible at the moment. Please try again later."); //Beneficiary should have enough funds 
    require( block.timestamp - fundingList[customerId].lastTransaction > 1*86400
             ||(block.timestamp - fundingList[customerId].lastTransaction <= 1*86400 
             && fundingList[customerId].dailyCounter < 3)
             , "The limit for today's transaction has been reached." ); //Only 3 deposits per day

    usdcToken.transfer(customer, amount);
    if(block.timestamp - fundingList[customerId].lastTransaction > 1*86400) {
        fundingList[customerId] = TransactionDetails(amount, block.timestamp, 1);
    }else{
        fundingList[customerId] = TransactionDetails(amount, block.timestamp, fundingList[customerId].dailyCounter+1);
    }
    return true;
  }

  function collectFunds(uint256 amount) public restricted returns(bool) {
    require(amount < usdcToken.balanceOf(address(this)) , "The amount is not collected."); //Beneficiary should have enough funds 

    usdcToken.transfer(owner, amount);
    return true;
  }

}