/**
 * network IDs:
 * - BSC mainnet: 56
 * - BSC testnet: 97
 * 
 * RPCs:
 * - BSC mainnet: https://bsc-dataseed.binance.org/
 * - BSC testnet: https://data-seed-prebsc-1-s1.binance.org:8545/
 */

export const menu_routine = 150;
export const menu_dimensions = [
	{
		menu: "wallet",
		dimensions: {
			width: 360,
			height: 350
		}
	},
	{
		menu: "products",
		dimensions: {
			width: 860,
			height: 350
		}
	},
	{
		menu: "socials",
		dimensions: {
			width: 400,
			height: 500
		}
	}
];
export const notification_duration = 20;

export const jackpot_data = [
	{
		audit: "",
		address: "0x5f9666E78D9874f55C8A8dDCA0d75BbBaF2bf238",
		chain_id: 97
	},
	{
		audit: "",
		address: "0x09675B1F7e6125C7a558C187F3Fd0c4508949f34",
		chain_id: 56
	}
];