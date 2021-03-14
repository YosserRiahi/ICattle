import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import { weatherConditions } from '../utilies/wheathercondition.util';

const Weather = ({ weather, temperature, humidity }) => {
	// const weather = 'Rain';
	return (
		<View
			style={[styles.weatherContainer]}
		>
			<View style={styles.headerContainer}>


				<Icon size={30} name={weatherConditions[weather].icon} color={'#008000'} style={{ marginRight: 5, marginStart: -10 }} />
				<Text style={styles.title}>{weatherConditions[weather].title}</Text>
				<View style={{
					backgroundColor: "#008000", height: 35, width: 35, alignItems: 'center', borderRadius: 5,
					justifyContent: 'center', marginRight: 10
				}}>
					<FontAwesome5 name="temperature-low" size={30} color={'#FFFFFF'} />
				</View>
				<Text style={styles.tempText}>{temperature}˚c</Text>


			</View>

		</View>
	);
};

const styles = StyleSheet.create({
	weatherContainer: {
		flex: 1,

	},
	headerContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center', flexDirection: "row"
	},
	tempText: {
		fontSize: 20,
		color: '#008000'
	},
	bodyContainer: {
		flex: 2,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',
		paddingLeft: 25,
		marginBottom: 40
	},
	title: {
		fontSize: 14,
		color: '#008000', marginRight: 80, fontWeight: "700"
	},
	subtitle: {
		fontSize: 24,
		color: '#fff'
	}, Weather_Image: {
		height: "80%",
		width: "50%"
	}
});

export default Weather;