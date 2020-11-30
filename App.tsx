import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AppLoading } from 'expo';

type markersType = {
  latlng: LatLng;
};

export default function App() {
  const [markers, setMarkers] = useState<markersType[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  let positionLoaded = false;
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      positionLoaded = true;
    })();
  }, []);
  if (location === null) {
    return <AppLoading />;
  }
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onPress={(e) =>
          setMarkers([...markers, { latlng: e.nativeEvent.coordinate }])
        }
      >
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              calloutAnchor={{
                x: 2.4,
                y: 0.9,
              }}
              anchor={{
                x: 0.0,
                y: 1,
              }}
              coordinate={marker.latlng}
            ></Marker>
          );
        })}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
