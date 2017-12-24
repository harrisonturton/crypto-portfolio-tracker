
/*
 * Remove all leading 'empty' datapoints.
 */
export const trimLeadingBlanks = (data) => {
	let result = [];
	for(var i = 0; i < data.length; i++) {
		if (data[i].price > 0) {
			result = data.slice(i, data.length-1);
			break;
		}
	}
	return result;
}

/*
 * Select equally-spaced datapoints such that 'numBins' number
 * of points remain.
 */
export const binData = (data, numBins) => {
	let binSize = Math.floor(data.length / numBins);
	let result = [];
	for (var i = 0; i < data.length; i += binSize) {
		result.push(data[i]);
	}
	return result;
}

/*
 * Trim leading blanks, and then bin the data.
 */
export const trimAndBin = (data, numBins) => {
	return binData(trimLeadingBlanks(data), numBins);
}

export const getDailyHistory = (symbol, numDays) => {
	return fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=${numDays}&e=CCCAGG`)
		.then((response) => response.json())
		.then((data) => {
			console.log('Fetched daily...');
			return data['Data'].map(day => {
				return { time: day['time'], price: day['close'] };
			});
		});
}

export const getHourlyHistory = (symbol, numHours) => {
	console.log('Inside hourly...');
	return fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${symbol}&tsym=USD&limit=${numHours}&aggregate=3&e=CCCAGG`)
		.then((response) => response.json())
		.then((data) => {
			console.log('Fetched hourly...');
			return data['Data'].map(hour => {
				return { time: hour['time'], price: hour['close'] };
			});
		});
}
