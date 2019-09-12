const ContractRegistry = artifacts.require("ContractRegistry");
const ContractIds = artifacts.require("ContractIds");
const ContractFeatures = artifacts.require("ContractFeatures");
const BancorGasPriceLimit = artifacts.require("BancorGasPriceLimit");
const BancorFormula = artifacts.require("BancorFormula");
const NonStandardTokenRegistry = artifacts.require("NonStandardTokenRegistry");
const BancorConverterFactory = artifacts.require("BancorConverterFactory");
const BancorConverterUpgrader = artifacts.require("BancorConverterUpgrader");
const BancorNetwork = artifacts.require("BancorNetwork");

module.exports = async function(deployer, network, accounts) {
  let account = accounts[0];

  // ContractRegistry
  await deployer.deploy(ContractRegistry);
  const contractRegistry = await ContractRegistry.deployed();

  // ContractIds
  await deployer.deploy(ContractIds);
  const contractIds = await ContractIds.deployed();

  // ContractFeatures
  await deployer.deploy(ContractFeatures);
  const contractFeatures = await ContractFeatures.deployed();
  const contractFeaturesId = await contractIds.CONTRACT_FEATURES.call();
  await contractRegistry.registerAddress(
    contractFeaturesId,
    contractFeatures.address
  );

  // BancorGasPriceLimit
  await deployer.deploy(
    BancorGasPriceLimit,
    BancorGasPriceLimit.class_defaults.gasPrice
  );
  const gasPriceLimit = await BancorGasPriceLimit.deployed();
  const gasPriceLimitId = await contractIds.BANCOR_GAS_PRICE_LIMIT.call();
  await contractRegistry.registerAddress(
    gasPriceLimitId,
    gasPriceLimit.address
  );

  // BancorFormula
  await deployer.deploy(BancorFormula);
  const formula = await BancorFormula.deployed();
  const formulaId = await contractIds.BANCOR_FORMULA.call();
  await contractRegistry.registerAddress(formulaId, formula.address);

  // NonStandardTokenRegistry
  await deployer.deploy(NonStandardTokenRegistry);
  const nonStandardTokenRegistry = await NonStandardTokenRegistry.deployed();
  let nonStandardTokenRegistryId = await contractIds.NON_STANDARD_TOKEN_REGISTRY.call();
  await contractRegistry.registerAddress(
    nonStandardTokenRegistryId,
    nonStandardTokenRegistry.address
  );

  // BancorNetwork
  await deployer.deploy(BancorNetwork, contractRegistry.address);
  const bancorNetwork = await BancorNetwork.deployed();
  const bancorNetworkId = await contractIds.BANCOR_NETWORK.call();
  await contractRegistry.registerAddress(
    bancorNetworkId,
    bancorNetwork.address
  );
  await bancorNetwork.setSignerAddress(account);

  // BancorConverterFactory
  await deployer.deploy(BancorConverterFactory);
  const factory = await BancorConverterFactory.deployed();
  const bancorConverterFactoryId = await contractIds.BANCOR_CONVERTER_FACTORY.call();
  await contractRegistry.registerAddress(
    bancorConverterFactoryId,
    factory.address
  );

  // BancorConverterUpgrader
  await deployer.deploy(BancorConverterUpgrader, contractRegistry.address);
  const upgrader = await BancorConverterUpgrader.deployed();
  const bancorConverterUpgraderId = await contractIds.BANCOR_CONVERTER_UPGRADER.call();
  await contractRegistry.registerAddress(
    bancorConverterUpgraderId,
    upgrader.address
  );
};
