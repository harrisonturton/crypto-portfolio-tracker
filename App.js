import React, { Component } from 'react';
import { StatusBar, Image, TouchableOpacity, StyleSheet, Text, FlatList, View } from 'react-native';
import { Font } from 'expo';

import { TabNavigator } from 'react-navigation';
import Market from './src/components/Market';
import Portfolio from './src/components/Portfolio';

const RootTabs = TabNavigator({
	Market: {
		screen: Market,
		navigationOptions: {
			tabBarIcon: ({ tintColor, focused }) => {
				return (
					<Image
						source={require('./assets/img/eye-icon.png')}
						style={{
							resizeMode: 'contain',
							width: 20,
							height: 20,
							opacity: focused ? 1 : 0.5,
							tintColor: focused ? '#03A9F4' : '#212121'
						}}
					/>
				);
			}
		}
	},
	Portfolio: {
		screen: Portfolio,
		navigationOptions: {
			tabBarIcon: ({ tintColor, focused }) => {
				const style = StyleSheet.create({
					icon: {
						resizeMode: 'contain',
						width: 20,
						height: 20,
						opacity: focused ? 1 : 0.5
					}
				})

				if (focused) {
					return <Image style={style.icon} source={require('./assets/img/portfolio-icon-focused.png')}/>
				} else {
					return <Image style={style.icon} source={require('./assets/img/portfolio-icon-unfocused.png')}/>
				}
			}
		}
	}
}, {
	headerMode: 'none',
	tabBarPosition: 'bottom',
	animationEnabled: true,
	tabBarOptions: {
		showIcon: true,
		showLabel: false,
		style: {
			backgroundColor: 'white',
			elevation: 0,
		},
		labelStyle: {
			color: '#212121',
			fontFamily: 'Rubik-Regular'
		},
		indicatorStyle: {
			backgroundColor: '#03A9F4',
		}
	}
});

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFontsLoaded: false,
			isDataLoaded: false,
			watching: [
				'BTC',
				'ETH',
				'NEO',
				'LTC',
				'XRP',
				'IOT',
				'DASH',
				'BCH'
			]
		};
	}
	componentDidMount() {
		return fetch('https://www.cryptocompare.com/api/data/coinlist/')
			.then((response) => response.json())
			.then((responseJson) => {
				let coinsObj = responseJson['Data'];
				let coinNames = {};
				Object.keys(coinsObj).forEach(symbol => {
					coinNames[symbol] = {
						name: coinsObj[symbol]['CoinName'],
						symbol: symbol
					};
				});
				this.setState({
					coinNames: coinNames,
					isDataLoaded: true
				});
			});
	}
	async componentWillMount() {
		await Font.loadAsync({
			'Rubik-Regular': require('./assets/font/Rubik-Regular.ttf'),
			'Rubik-Light': require('./assets/font/Rubik-Light.ttf'),
			'Rubik-Medium': require('./assets/font/Rubik-Medium.ttf'),
		});
		this.setState((prevState) => ({
			isFontsLoaded: true
		}));
	}
	render() {
		if (!this.state.isFontsLoaded || !this.state.isDataLoaded) {
			return <Text>Loading...</Text>;
		}

		let screenProps = {
			watching: this.state.watching,
			coinNames: this.state.coinNames
		}

		return (
			<RootTabs
				screenProps={screenProps}
			/>
		);
	}
}
