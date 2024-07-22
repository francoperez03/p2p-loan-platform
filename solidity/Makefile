-include .env

build: forge build
deploy-sepolia:
	forge script script/Deploy.s.sol --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvv
deploy-local:
	forge script script/Deploy.s.sol --rpc-url $(LOCAL_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast -vvvv
deploy-mode:
	forge script script/Deploy.s.sol --rpc-url $(MODE_TESTNET_RPC_URL) --private-key $(MODE_PRIVATE_KEY) --broadcast --gas-price 10 --priority-gas-price 1 -vvvv
deposit:
	forge script script/Deposit.s.sol:DepositToPeerToPeerLending --fork-url $(MODE_TESTNET_RPC_URL) --broadcast --private-key $(MODE_PRIVATE_KEY) --gas-price 10 --priority-gas-price 1 -vvvv
transfer:
	forge script script/Transfer.s.sol:TransferTokens --fork-url $(MODE_TESTNET_RPC_URL) --broadcast --private-key $(MODE_PRIVATE_KEY) --gas-price 10 --priority-gas-price 1 -vvvv
