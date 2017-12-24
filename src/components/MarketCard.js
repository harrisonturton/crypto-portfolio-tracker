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
			currentData: dummyData,
			isRemoved: false,
			forgetAnim: new Animated.Value(0)
		};
		this.changeCurrentData = this.changeCurrentData.bind(this);
		this._setWidth = this._setWidth.bind(this);
		this.onRemove = this.onRemove.bind(this);
	}
	componentDidMount(){
		return Promise.all([
			getDailyHistory(this.props.config.symbol, 2000),
			getHourlyHistory(this.props.config.symbol, 168)
		])
		.then(([daily, hourly]) => {
			this.setState({
				all: trimAndBin(daily, 30),
				year: trimAndBin(daily.slice(-365), 30),
				month: daily.slice(-30),
				week: trimAndBin(hourly, 30),
				day: hourly.slice(-24),
				currentData: daily.slice(-30),
				isDataLoaded: true
			});
		});
	}
	onRemove() {
		this.setState({
			isRemoved: true
		});
		this.props.forgetCallback(this.props.config.symbol);
	}
	_setWidth(event) {
		this.setState({
			width: event.nativeEvent.layout.width
		});
	}
	changeCurrentData(data) {
		this.setState({
			currentData: data
		});
	}
	render() {
		if (!this.state.isDataLoaded) {
			return <Text>Loading...</Text>;
		}
		/* Always visible portion of the card */
		let header = (
			<View style={styles.header} onLayout={this._setWidth}>
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
		/* Collapsable portion of the card */
		let currentData = this.state.currentData;
		let max = currentData.map(item => item.price).reduce((acc, x) => Math.max(acc, x));
		let min = currentData.map(item => item.price).reduce((acc, x) => Math.min(acc, x));
		let domain = {
			x: [currentData[0].time, currentData[currentData.length-1].time],
			y: [min * 0.8, max * 1.2]
		};
		let body = (
			<View style={styles.body}>
				<View >
					<VictoryGroup
						height={150}
						width={this.state.width}
						padding={0}
						containerComponent={
							<VictoryVoronoiContainer
								labels={(data) => {
									let day = Moment.unix(data.time);
									let dayString = day.format('MMM Do [\']YY');
									return `${dayString}\n$${data.price}`
								}}
								labelComponent={
									<VictoryTooltip
										y={40}
										x={55}
										labelComponent={
											<VictoryLabel
												lineHeight={5}
											/>
										}
										flyoutStyle={{
											fill: 'transparent',
											stroke: 'transparent'
										}}
										style={{
											color: 'white',
											fill: 'white'
										}}
									/>
								}
							/>
						}
					>
						{this.state.isDataLoaded &&
							<VictoryArea
								interpolation={'natural'}
								data={this.state.currentData}
								domain={domain}
								x='time'
								y='price'
								style={{
									data: {
										fill: 'white',
										fillOpacity: 0.4,
										stroke: 'transparent',
									}
								}}
							/>
						}
					</VictoryGroup>
				</View>
				<View style={styles.chartButtonWrapper}>
					<TextButton onPress={() => this.changeCurrentData(this.state.day)} style={styles.chartButton} text='DAY'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.week)} style={styles.chartButton} text='WEEK'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.month)} style={styles.chartButton} text='MONTH'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.year)} style={styles.chartButton} text='YEAR'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.all)} style={styles.chartButton} text='ALL'/>
				</View>
			</View>
		);
		/* Options below the card, visible upon expansion */
		let footer = (
			<View style={styles.footer}>
				<TextButton onPress={() => this.refs['card'].remove(this.onRemove)} style={[styles.footerButton, { color: this.props.config.color }]} text='FORGET'/>
				<TextButton style={[styles.footerButton, { color: this.props.config.color }]} text='BUY'/>
			</View>
		);
		return (
			<CollapsableCard
				ref='card'
				style={[styles.container, {
					backgroundColor: this.props.config.color,
				}]}
				containerStyle={{
					paddingHorizontal: 20,
					paddingBottom: this.state.isRemoved ? 0 : 30
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
