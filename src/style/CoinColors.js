import React from 'react';

const colors = {
	orange: '#FF9800',
	slate: '#424C73',
	lightBlue: '#03A9F4',
	silver: '#607D8B',
	navy: '#3F51B5',
	red: '#F44336',
	blueGreen: '#009688',
	paleGreen: '#8BC34A'
}

const coinColors = {
	'BTC': colors.orange,
	'ETH': colors.slate,
	'IOT': colors.lightBlue,
	'XRP': colors.lightBlue,
	'LTC': colors.silver,
	'DASH': colors.lightBlue,
	'ZEC': colors.navy,
	'XMR': colors.red,
	'VTC': colors.blueGreen,
	'NEO': colors.paleGreen
}

export const GetColor = (symbol) => {
	if (symbol in coinColors) {
		return coinColors[symbol];
	} else {
		let hashCode = parseInt(getHashCode(symbol)) % Object.keys(colors).length;
		return Object.values(colors)[hashCode];
	}	
} 

function getHashCode(str) {
	return str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}
