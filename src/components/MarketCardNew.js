import React, { Component } from 'react';
import { Flyout, Animated, Easing, Dimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { G } from 'react-native-svg';
import CollapsableCard from './CollapsableCard';
import TextButton from './TextButton';
import { VictoryLabel, VictoryTooltip, VictoryVoronoiContainer, VictoryGroup, VictoryArea } from 'victory-native';
import Moment from 'moment';
import { trimAndBin, getDailyHistory, getHourlyHistory } from '../util/DataUtils';

const dummyData = [
	{ time: 0, price: 1 },
	{ time: 1, price: 2 },
	{ time: 2, price: 3 },
	{ time: 3, price: 1 },
	{ time: 4, price: 4 },
];

export default class MarketCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDataLoaded: false,
			chartData: dummyData
		};
		this._setChartWidth = this._setChartWidth.bind(this);
		this._changeChartData = this._changeChartData.bind(this);
		this._fetchHistory = this._fetchHistory.bind(this);
	}
	componentDidMount() {
		return this._fetchHistory().then(() => this.setState({
			isDataLoaded: true,
			currentData: this.state.historicalData.week
		}));
	}
	_setChartWidth(event) {
		this.setState({
			chartWidth: event.nativeEvent.layout.width
		});
	}
	_changeChartData(data) {
		this.setState({
			chartData: data
		});
	}
	_fetchHistory() {
		return Promise.all([
			getDailyHistory(this.props.config.symbol, 2000),
			getHourlyHistory(this.props.config.symbol, 168),
		])
		.then(([daily, hourly]) => {
			this.setState({
				historicalData: {
					all: trimAndBin(daily, 30),
					year: trimAndBin(daily.slice(-365), 30),
					month: daily.slice(-30),
					week: trimAndBin(hourly, 30),
					day: hourly.slice(-24),
				}
			});
		})
	}
	_renderHeader() {
		return (
			<View style={styles.header} onLayout={this._setChartWidth}>
				<View style={styles.headerLeft}>
					<Text style={styles.name}>{this.props.config.name}</Text>
					<Text style={styles.symbol}>{this.props.config.symbol}</Text>
				</View>
				<View style={styles.headerRight}>
					<text style={styles.price}>{(this.props.config.price).tofixed(2)}</text>
					<text style={styles.change}>{this.props.config.change}%</text>
				</View>
			</View>
		);
	}
	_renderBody() {
		let data = this.state.chartData;
		let max = data.map(item => item.price).reduce((acc, x) => Math.max(acc, x));
		let min = data.map(item => item.price).reduce((acc, x) => Math.min(acc, x));
		let domain = {
			x: [data[0].time, data[data.length-1].time],
			y: [min * 0.8, max * 1.2]
		};

		return (
			<View style={styles.body}>
				<View pointerEvents='none'>
					<VictoryGroup
						height={150}
						width={this.state.chartWidth}
						padding={0}
					>
						{this.state.isDataLoaded &&
							<VictoryArea
								data={this.state.chartData}
								domain={domain}
								x='time'
								y='price'
								interpolation='natural'
								style={{
									data: {
										fill: 'white',
										fillOpacity: 0.4,
										stroke: 'transparent'
									}
								}}
							/>
						}
					</VictoryGroup>
				</View>
				<View style={styles.chartButtonWrapper}>
					<TextButton onPress={() => this._changeChartData(this.state.historicalData.day)} style={styles.chartButton} text='DAY'/>
					<TextButton onPress={() => this._changeChartData(this.state.historicalData.week)} style={styles.chartButton} text='WEEK'/>
					<TextButton onPress={() => this._changeChartData(this.state.historicalData.month)} style={styles.chartButton} text='MONTH'/>
					<TextButton onPress={() => this._changeChartData(this.state.historicalData.year)} style={styles.chartButton} text='YEAR'/>
					<TextButton onPress={() => this._changeChartData(this.state.historicalData.all)} style={styles.chartButton} text='ALL'/>
				</View>
			</View>
		);
	}
	_renderFooter() {
		return (
			<View style={styles.footer}>
				<TextButton style={[styles.footerButton, { color: this.props.config.color }]} text='FORGET'/>
				<TextButton style={[styles.footerButton, { color: this.props.config.color }]} text='BUY'/>
			</View>
		);
	}
	render() {
		let header = this._renderHeader();
		let body = this._renderBody();
		let footer = this._renderFooter();
		return (
			<CollapsableCard
				style={[styles.container, {
					backgroundColor: this.props.config.color
				}]}
				containerStyle={{
					paddingHorizontal: 20,
				}}
				header={header}
				body={body}
				footer={footer}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		borderRadius: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
	},
	name: {
		fontFamily: 'Rubik-Regular',
		fontSize: 18,
		color: 'white'
	},
	price: {
		fontFamily: 'Rubik-Light',
		fontSize: 20,
		color: 'white',
		textAlign: 'right'
	},
	symbol: {
		fontFamily: 'Rubik-Regular',
		fontSize: 16,
		color: 'white',
		opacity: 0.75,
	},
	change: {
		fontFamily: 'Rubik-Regular',
		fontSize: 16,
		color: 'white',
		opacity: 0.75,
		textAlign: 'right'
	},
	body: {
		paddingTop: 10
	},
	chartButtonWrapper: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'rgba(255,255,255,0.4)',
	},
	chartButton: {
		color: 'white',
		padding: 15,
		paddingTop: 0,
		opacity: 0.75,
	},
	footer: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	footerButton: {
		fontFamily: 'Rubik-Regular',
		fontSize: 16,
		paddingRight: 20,
		paddingTop: 20,
	}
});
