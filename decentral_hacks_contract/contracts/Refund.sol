// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

abstract contract FiatTokenProxy{
    function transfer(address to, uint256 value) public virtual returns (bool success);
    function balanceOf(address account) public virtual view returns(uint256);
}

contract Refund {

  FiatTokenProxy public usdcToken;
  address private owner;
  uint256 private profitCollected;
  mapping(string=>OrderDetails) private pendingOrders;
  mapping(string=>bool) private orders;
  mapping(address=>SellerDetails) public blacklist;

  struct OrderDetails {
    address buyer;
    address seller;
    uint256 amount;
    uint256 deliveryTime;
    uint256 key;
  }

  struct SellerDetails {
    bool exists;
    uint256 penalty;
    uint256 counter;
  }

  constructor(FiatTokenProxy _usdcToken) {
    usdcToken = _usdcToken;
    owner= msg.sender;
  }

  modifier restricted() {
    require(msg.sender == owner, "You are not authorized to perform this action");
    _;
  }
  
  //Triggered when order is placed after checkout
  function placeOrder(string memory orderID, uint256 amount, uint256 deliveryDays, address buyer, address seller) public restricted returns(bool){
    require(blacklist[seller].exists != true, "The seller for this order is banned.");
    require(orders[orderID] != true, "This order has already been placed");

    //deliveryTime = block.timestamp + 86400*refundPeriod;
    uint256 deliveryTime = block.timestamp + 60*deliveryDays;
    orders[orderID] = true;
    pendingOrders[orderID] = OrderDetails(buyer, seller, amount, deliveryTime, 0);
    return true;
  }

  //Triggered for verification
  function verifyDelivery(string memory orderID, uint256 key) public restricted returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(pendingOrders[orderID].key == 0, "This order has been delivered");

    pendingOrders[orderID].key = key;
    return true;
  }
  
  //Triggered for refund on non-delivery of product
  function getRefund(string memory orderID) public restricted returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(pendingOrders[orderID].key==0, "This order is delivered.");
    require(block.timestamp > pendingOrders[orderID].deliveryTime, "The order is still in delivery process");

    usdcToken.transfer(pendingOrders[orderID].buyer, pendingOrders[orderID].amount);
    blacklist[pendingOrders[orderID].seller] = SellerDetails(true, pendingOrders[orderID].amount, blacklist[pendingOrders[orderID].seller].counter + 1);
    return true;
  }
  
  function removeFromBlacklist (address seller) public restricted returns(bool){
    require(blacklist[seller].exists == true, "This address is not blacklisted.");
    //require(blacklist[seller].counter <= 5, "You have been banned permanently.");

    blacklist[seller].exists = false;
    return true;
  }

  function getBlacklisted (address seller) public view restricted returns(bool){
    if(blacklist[seller].exists == true){
      return true;
    }else{
      return false;
    }
  }

}