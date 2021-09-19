// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

abstract contract FiatTokenProxy{
    function transfer(address to, uint256 value) public virtual returns (bool success);
    function balanceOf(address account) public virtual view returns(uint256);
}

contract HTLC {

  FiatTokenProxy public usdcToken;
  address private owner;
  mapping(string=>OrderDetails) private pendingOrders;
  mapping(string=>bool) private orders;

  struct OrderDetails {
    address buyer;
    address seller;
    uint256 amount;
    uint256 refundTime;
    uint256 key;
  }

  constructor(FiatTokenProxy _usdcToken) {
    usdcToken = _usdcToken;
    owner= msg.sender;
  }

  modifier restricted() {
    require(msg.sender == owner, "You are not authorized to perform this action");
    _;
  }
  
  //Following functions will be triggered by buyer
  function placeOrder(string memory orderID, uint256 amount, uint256 deliveryDays, address buyer, address seller) public restricted returns(bool){
    require(orders[orderID] != true, "This order has already been placed");

    //refundTime = block.timestamp + 86400*deliveryDays + 86400*5;
    uint256 refundTime = block.timestamp + 60*deliveryDays + 60*5;
    orders[orderID] = true;
    pendingOrders[orderID] = OrderDetails(buyer, seller, amount, refundTime, 0);
    return true;
  }
  
  function getRefund(string memory orderID) public restricted returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(block.timestamp > pendingOrders[orderID].refundTime, "Too early to initiate a refund");
    require(pendingOrders[orderID].key == 0, "This order has been delivered");

    usdcToken.transfer(pendingOrders[orderID].buyer, pendingOrders[orderID].amount);
    return true;
  }
  
  //Will be triggered by delivery agent
  function verifyDelivery(string memory orderID, uint256 key) public restricted returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(pendingOrders[orderID].key == 0, "This order has been delivered");

    pendingOrders[orderID].key = key;
    return true;
  }
  
  //Following functions will be triggered by seller
  function withdrawOrder(string memory orderID, uint256 key) public returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(msg.sender == pendingOrders[orderID].seller, "You cannot withdraw this order");
    require(pendingOrders[orderID].key == key, "Wrong key");

    usdcToken.transfer(pendingOrders[orderID].seller, pendingOrders[orderID].amount);
    return true;
  }

  function extendDeliveryTime(string memory orderID, uint256 extendedDays) public returns(bool){
    require(orders[orderID] == true, "Such an order does not exist");
    require(msg.sender == pendingOrders[orderID].seller, "You cannot withdraw this order");
    require(block.timestamp < pendingOrders[orderID].refundTime, "The amount has already been refunded to customer");
    require(pendingOrders[orderID].key == 0, "This order has been delivered");
    require(extendedDays < 2, "Extended time is too high");

    //pendingOrders[orderID].refundTime = pendingOrders[orderID].refundTime + 86400*extendedDays;
    pendingOrders[orderID].refundTime = pendingOrders[orderID].refundTime + 60*extendedDays;
    return true;
  }

}