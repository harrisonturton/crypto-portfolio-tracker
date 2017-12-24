import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class TextButton extends Component {
	render() {
		return (
			<TouchableOpacity onPress={this.props.onPress}>
				<Text style={this.props.style}>{this.props.text}</Text>
			</TouchableOpacity>
		);
	}
}
