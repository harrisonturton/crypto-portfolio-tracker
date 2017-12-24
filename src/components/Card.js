import React, { Component } from 'react';
import { Animated, Easing, Dimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Color, Stylesheets } from '../style/style';

import Svg from 'react-native-svg';
import { VictoryGroup, VictoryArea } from 'victory-native';
import TextButton from './TextButton';

const dummyData = [
	{ x: 0, y: 1 },
	{ x: 1, y: 2 },
	{ x: 2, y: 3 },
	{ x: 3, y: 1 },
	{ x: 4, y: 4 },
];

export default class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false,
			expandAnim: new Animated.Value(0),
		};
		this._setHeaderHeight = this._setHeaderHeight.bind(this);
		this._setExpandedHeight = this._setExpandedHeight.bind(this);
		this.changeDataInterval = this.changeDataInterval.bind(this);
		this.toggle = this.toggle.bind(this);
	}
	_setHeaderHeight(event) {
		this.setState({
			headerHeight: event.nativeEvent.layout.height
		});
	}
	_setExpandedHeight(event) {
		this.setState({
			expandedHeight: this.state.headerHeight + event.nativeEvent.layout.height,
		});
	}
	_setWidth(event) {
		this.setState({
			width: event.nativeEvent.layout.width
		})
	}
	// Change what data is displayed on card, e.g. DAY, MONTH, ALL
	changeDataInterval(interval) {
		this.setState({
		})
	}
	toggle() {
		this.setState({
			isExpanded: !this.state.isExpanded
		});
		Animated.timing(this.state.expandAnim, {
			toValue: this.state.isExpanded ? 0 : 1,
			duration: 250,
			easing: Easing.elastic(1)
		}).start();
	}
	render() {
		let heightAnim = this.state.expandAnim.interpolate({
			inputRange: [0, 1],
			outputRange: [this.state.headerHeight, this.state.expandedHeight]
		});

		return (
			<View>
				<Animated.View
					style={[styles.container, {
						height: heightAnim,
						backgroundColor: this.props.color,
						shadowColor: this.props.color
					}]}
				>
					<TouchableOpacity onPress={this.toggle}>
						<View style={styles.headerContainer} onLayout={this._setHeaderHeight}>
							<View style={styles.leftHeaderContainer}>
								<Text style={styles.name}>{this.props.name}</Text>
								<Text style={styles.symbol}>{this.props.symbol}</Text>
							</View>
							<View style={styles.rightHeaderContainer}>
								<Text style={styles.price}>{this.props.price}</Text>
								<Text style={styles.change}>{this.props.change}</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View onLayout={(event) => {
						this._setExpandedHeight(event);
						this._setWidth(event);
					}}>
						<TouchableOpacity onPress={this.toggle}>
							<View pointerEvents='none'>
								<VictoryGroup height={150} width={this.state.width} padding={0}>
									<VictoryArea
										data={dummyData}
										interpolation={'natural'}
										style={{
											data: {
												fill: 'white',
												fillOpacity: 0.25,
												stroke: 'transparent',
												width: 50
											}
										}}
										x='x'
										y='y'
									/>
								</VictoryGroup>
							</View>
						</TouchableOpacity>
						<View style={styles.chartButtons}>
							<TextButton style={styles.chartButton} text='DAY'/>
							<TextButton style={styles.chartButton} text='WEEK'/>
							<TextButton style={styles.chartButton} text='MONTH'/>
							<TextButton style={styles.chartButton} text='YEAR'/>
							<TextButton style={styles.chartButton} text='ALL'/>
						</View>
					</View>
				</Animated.View>
				{this.state.isExpanded &&
					<View style={styles.outerOptions}>
						<TextButton text='WATCH' style={[styles.outerOption, {color: this.props.color}]}/>
						<TextButton text='BUY' style={[styles.outerOption, {color: this.props.color}]}/>
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	name: {
		fontFamily: 'Rubik-Regular',
		color: 'white',
		fontSize: 18
	},
	price: {
		fontFamily: 'Rubik-Light',
		color: 'white',
		fontSize: 20,
		textAlign: 'right'
	},
	symbol: {
		fontFamily: 'Rubik-Regular',
		color: 'white',
		fontSize: 16,
		opacity: 0.75
	},
	change: {
		fontFamily: 'Rubik-Regular',
		color: 'white',
		fontSize: 16,
		opacity: 0.75,
		textAlign: 'right',
		alignSelf: 'flex-end'
	},
	container: {
		overflow: 'hidden',
		borderRadius: 10,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
	},
	chartButtons: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15,
		paddingHorizontal: 20,
		backgroundColor: 'rgba(255,255,255,0.25)'
	},
	chartButton: {
		color: 'white',
		opacity: 0.5
	},
	outerOptions: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	outerOption: {
		fontFamily: 'Rubik-Regular',
		fontSize: 16,
		paddingRight: 20,
		paddingTop: 20
	}
});
