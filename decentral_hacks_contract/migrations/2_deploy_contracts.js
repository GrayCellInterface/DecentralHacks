var InvoiceDiscounting = artifacts.require("./InvoiceDiscounting.sol");

module.exports = function (deployer) {
  deployer.deploy(InvoiceDiscounting, "TFGBSrddCjLJAwuryZ9DUxtEmKv13BPjnh");
};
