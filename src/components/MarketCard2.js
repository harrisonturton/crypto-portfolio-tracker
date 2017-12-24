import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { VictoryGroup, VictoryArea } from 'victory-native';

import CollapsableCard from './CollapsableCard';
import TextButton from './TextButton';
import { trimAndBin, getDailyHistory, getHourlyHistory } from '../util/DataUtils';

export default class MarketCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDataLoaded: false,
			isRemoved: false,
			currentData: dummyData
		};
	}
	 // VictoryCharts cannot have dynamic width, so we
	 // must save the width when the layout changes and update
	 // manually.
	_setWidth(event) {
		this.setState({
			chartWidth: event.nativeEvent.layout.width
		});
	}
	// Update historic data.
	async _getData() {
		let dailyHistory = await getDailyHistory(this.props.config.symbol, 2000);
		let hourlyHistory = await getHourlyHistory(this.props.config.symbol, 168);
		this.setState({
			all: trimAndBin(dailyHistory, 30),
			year: trimAndBin(dailyHistory.slice(-365), 30),
			month: trimAndBin(dailyHistory.slice(-30), 30),
			week: trimAndBin(hourlyHistory, 30),
			week: trimAndBin(hourlyHistory.slice(-24), 30),
		});
	}
	// Change what data series is currently displayed on the chart
	_changeCurrentData(data) {
		this.setState({
			currentData: data
		});
	}
	// Update state on this component,
	// then run remove method on child,
	// then run parent callback.
	_remove() {
		this.setState({ isRemoved: true }, () => {
			let symbol = this.props.config.symbol;
			let removeCallback = this.props.removeCallback;
			this.refs.card.remove(removeCallback(symbol));
		})
	}
	_renderHeader() {
		return (
			<View style={styles.header} onLayout={this._setWidth}>
				<View style={styles.headerLeft}>
					<Text style={styles.name}>{this.props.config.name}</Text>
					<Text style={styles.symbol}>{this.props.config.symbol}</Text>
				</View>
				<View style={styles.headerRight}>
					<Text style={styles.price}>{(this.props.config.price).toFixed(2)}</Text>
					<Text style={styles.change}>{this.props.config.change}%</Text>
				</View>
			</View>
		);
	}
	_renderBody() {
		return (
			<View style={styles.body}>
				<VictoryGroup height={150} width={this.state.chartWidth} padding={0}>
					{this.state.isDataLoaded &&
						<VictoryArea
							data={this.state.currentData}
							x='time'
							y='price'
							interpolation='natural'
							style={{ data: styles.chart }}
						/>
					}
				</VictoryGroup>
				<View style={styles.chartButtonWrapper}>
					<TextButton onPress={() => this.changeCurrentData(this.state.day)} style={styles.chartButton} text='DAY'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.week)} style={styles.chartButton} text='WEEK'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.month)} style={styles.chartButton} text='MONTH'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.year)} style={styles.chartButton} text='YEAR'/>
					<TextButton onPress={() => this.changeCurrentData(this.state.all)} style={styles.chartButton} text='ALL'/>
				</View>
			</View>
		);
	}
	_renderFooter() {
		return (
			<View style={styles.footer}>
				<TextButton onPress={() => this.refs.card.remove(this.onRemove)} style={[styles.footerButton, { color: this.props.config.color }]} text='FORGET'/>
				<TextButton style={[styles.footerButton, { color: this.props.config.color }]} text='BUY'/>
			</View>
		);
	}
	render() {
		return (
			<CollapsableCard
				ref={ref => this.card = ref}
				style={[styles.container, {
					backgroundColor: this.props.config.color,
				}]}
				containerStyle={{
					paddingHorizontal: 20,
					paddingBottom: this.state.isRemoved ? 0 : 30
				}}
				header={this.renderHeader}
				body={this.renderBody}
				footer={this.renderFooter}
			/>
		);
	}
}

const styles = StyleSheet.create({});
