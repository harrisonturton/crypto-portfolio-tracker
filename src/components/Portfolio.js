import React, { Component } from 'react';
import { StatusBar, Image, TouchableOpacity, StyleSheet, Text, FlatList, View } from 'react-native';

import { VictoryLabel, VictoryTooltip, VictoryVoronoiContainer, VictoryGroup, VictoryArea } from 'victory-native';
import TextButton from './TextButton';

const dummyData = [
	{ time: 0, price: 1 },
	{ time: 1, price: 2 },
	{ time: 2, price: 3 },
	{ time: 3, price: 1 },
	{ time: 4, price: 4 },
];

export default class Portfolio extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this._setWidth = this._setWidth.bind(this);
	}
	_setWidth(event) {
		this.setState({
			width: event.nativeEvent.layout.width
		});
	}
	renderBreakdown() {

	}
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.cardContainer} onLayout={this._setWidth}>
					<VictoryGroup
						padding={0}
						height={125}
						width={this.state.width}
					>
						<VictoryArea
							data={dummyData}
							interpolation='natural'
							x='time'
							y='price'
							style={{
								data: {
									fill: '#00C853'
								}
							}}
						/>
					</VictoryGroup>
					<View style={styles.belowChartContainer}>
						<Text style={styles.portfolioWorth}>567.70</Text>
						<View style={styles.chartButtonWrapper}>
							<TextButton text='DAY' style={styles.chartButton}/>
							<TextButton text='WEEK' style={styles.chartButton}/>
							<TextButton text='MONTH' style={styles.chartButton}/>
							<TextButton text='YEAR' style={styles.chartButton}/>
							<TextButton text='ALL' style={styles.chartButton}/>
						</View>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 80,
		paddingHorizontal: 20,
	},
	cardContainer: {
		paddingTop: 15,
		borderRadius: 10,
	},
	belowChartContainer: {
		backgroundColor: '#00C853',
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
	},
	chartButtonWrapper: {
		paddingVertical: 15,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	chartButton: {
		paddingHorizontal: 15,
		color: 'white',
		opacity: 0.75
	},
	portfolioWorth: {
		color: 'white',
		alignSelf: 'center',
		fontFamily: 'Rubik-Light',
		fontSize: 26,
		paddingVertical: 10
	}
})
