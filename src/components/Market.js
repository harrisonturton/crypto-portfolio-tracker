import React, { Component } from 'react';
import { Image, TouchableOpacity, StatusBar, Dimensions, Text, FlatList, StyleSheet, View } from 'react-native';

import MarketCard from './MarketCard';
import { GetColor } from '../style/CoinColors';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			isDataLoaded: false,
			watchedCoins: this.props.screenProps.watching,
			coinNames: this.props.screenProps.coinNames
		};
		this.forgetCoin = this.forgetCoin.bind(this);
	}
	componentDidMount() {
		let symbols = (this.state.watchedCoins).join(',');
		let coinData = {};
		return fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols}&tsyms=BTC,USD,EUR`)
			.then((response) => response.json())
			.then((responseJson) => {
				this.state.watchedCoins.forEach(symbol => {
					coinData[symbol] = {
						name: this.state.coinNames[symbol].name,
						key: this.state.coinNames[symbol].symbol,
						symbol: this.state.coinNames[symbol].symbol,
						price: responseJson['RAW'][symbol]['USD']['PRICE'],
						change: responseJson['DISPLAY'][symbol]['USD']['CHANGEPCT24HOUR']
					};
				})
			})
			.then(() => {
				this.setState({
					coinData: coinData,
					isDataLoaded: true
				});
				console.log(coinData['BTC']);
			});
	}
	renderHeader() {
		return (
			<View style={styles.header}>
				<TouchableOpacity>
					<Image style={styles.menuIcon} source={require('../../assets/img/menu-icon.png')}/>
				</TouchableOpacity>
				<Text style={styles.headerLabel}>WATCHING</Text>
				<TouchableOpacity>
					<Image style={styles.marketIcon} source={require('../../assets/img/market-icon.png')}/>
				</TouchableOpacity>
			</View>
		);
	}
	forgetCoin(symbol) {
		let watchedCoins = this.state.watchedCoins;
		let index = watchedCoins.indexOf(symbol);
		watchedCoins.splice(index, 1);
		this.setState({
			watchedCoins: watchedCoins
		});
	}
	render() {
		if (!this.state.isDataLoaded) {
			return <Text>Loading...</Text>;
		}

		//let data = Object.keys(this.state.coinData).map(key => this.state.coinData[key]);
		//let data = this.state.watchedCoins;
		let data = this.state.watchedCoins.map(symbol => {
			return {
				key: symbol,
				name: this.state.coinData[symbol].name,
				symbol: symbol,
				change: this.state.coinData[symbol].change,
				price: this.state.coinData[symbol].price
			};
		});
		return (
			<FlatList
				data={data}
				ListHeaderComponent={this.renderHeader}
				renderItem={({item}) => {
					return (
						<View>
							<StatusBar hidden={true} />
							<MarketCard
								config={{
									name: item.name,
									price: item.price,
									symbol: item.symbol,
									change: item.change,
									color: GetColor(item.symbol)
								}}
								forgetCallback={this.forgetCoin}
							/>
						</View>
					);
				}}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20
	},
	header: {
		width: Dimensions.get('window').width,
		height: 75,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		alignItems: 'center',
		backgroundColor: 'white'
	},
	headerLabel: {
		fontFamily: 'Rubik-Regular',
		fontSize: 16,
		letterSpacing: 0.01,
		color: '#212121'
	},
	menuIcon: {
		resizeMode: 'contain',
		width: 25,
		height: 25,
		tintColor: '#212121'
	},
	marketIcon: {
		resizeMode: 'contain',
		width: 25,
		height: 25
	}
});

let coinsToDisplay = {
	'BTC': {
		key: 'Bitcoin',
		symbol: 'BTC',
		color: '#FF9800'
	},
	'ETH': {
		key: 'Ethereum',
		symbol: 'ETH',
		color: '#424C73'
	},
	'NEO': {
		key: 'NEO',
		symbol: 'NEO',
		color: '#8BC34A'
	},
	'IOT': {
		key: 'IOTA',
		symbol: 'IOT',
		color: '#03A9F4'
	},
	'XRP': {
		key: 'Ripple',
		symbol: 'XRP',
		color: '#673AB7'
	},
	'LTC': {
		key: 'LiteCoin',
		symbol: 'LTC',
		color: '#607D8B'
	},
	'DASH': {
		key: 'Dash',
		symbol: 'DASH',
		color: '#03A9F4' 
	},
	'ZEC': {
		key: 'ZCash',
		symbol: 'ZEC',
		color: '#3F51B5'
	},
	'XMR': {
		key: 'Monero',
		symbol: 'XMR',
		color: '#F44336'
	},
	'VTC': {
		key: 'Vertcoin',
		symbol: 'VTC',
		color: '#009688'
	}
}
