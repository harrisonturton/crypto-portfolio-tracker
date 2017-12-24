import React, { Component } from 'react';
import { Animated, Easing, Dimensions, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Color, Stylesheets } from '../style/style';

export default class CollapsableCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false,
			isDeleted: false,
			expandAnim: new Animated.Value(0)
		};
		this._setHeaderHeight = this._setHeaderHeight.bind(this);
		this._setExpandedHeight = this._setExpandedHeight.bind(this);
		this.toggle = this.toggle.bind(this);
	}
	_setHeaderHeight(event) {
		this.setState({
			headerHeight: event.nativeEvent.layout.height
		});
	}
	_setExpandedHeight(event) {
		this.setState({
			expandedHeight: this.state.headerHeight + event.nativeEvent.layout.height
		});
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
	remove(onRemove) {
		this.setState({
			isDeleted: true
		});
		Animated.timing(this.state.expandAnim, {
			toValue: 0,
			duration: 100,
		}).start(() => onRemove());
	}
	render() {
		let heightAnim = this.state.expandAnim.interpolate({
			inputRange: [0, 1],
			outputRange: [this.state.headerHeight, this.state.expandedHeight]
		});

		if (this.state.isDeleted) {
			heightAnim = this.state.expandAnim.interpolate({
				inputRange: [0, 1],
				outputRange: [0, this.state.expandedHeight]
			});
		}

		let opacityAnim = this.state.expandAnim.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		});

		return (
			<View style={this.props.containerStyle}>
				<TouchableOpacity
					onPress={this.toggle}
					delayLongPress={500}
					onLongPress={this.props.toggleRowActive}
					activeOpacity={0.5}
					{...this.props.sortHandlers}
				>
					<Animated.View style={[styles.container, this.props.style, {
						height: heightAnim,
						opacity: this.state.isDeleted ? opacityAnim : 1,
					}]}>
						{/* Header */}
						<View style={this.props.headerStyle} onLayout={this._setHeaderHeight}>
							{this.props.header}
						</View>
						{/* Hidden Body */}
						<View style={styles.body} onLayout={this._setExpandedHeight}>
							{this.props.body}
						</View>
					</Animated.View>
					{/* Footer */}
					{this.state.isExpanded && !this.state.isDeleted &&
						<View style={styles.footer}>
							{this.props.footer}
						</View>
					}
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden',
	},
});
