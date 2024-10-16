import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from "expo-location";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    // Solicitar permissão de localização
    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            try {
                const currentPosition = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                setLocation(currentPosition);
            } catch (error) {
                console.error("Erro ao obter a localização: ", error);
                Alert.alert("Erro", "Não foi possível obter a localização.");
            }
        } else {
            Alert.alert("Permissão negada", "Permissão de localização não concedida.");
        }
        setLoading(false);
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Verifique se a localização está disponível
    if (!location || !location.coords) {
        Alert.alert("Erro", "Localização não disponível.");
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true} // Mostra a localização do usuário
                followsUserLocation={true} // Segue a localização do usuário
            />
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default MapScreen;
