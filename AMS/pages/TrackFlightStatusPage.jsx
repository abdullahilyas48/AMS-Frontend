import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const airportCoords = {
  JFK: { latitude: 40.6413, longitude: -73.7781, name: "New York (JFK)" },
  LHR: { latitude: 51.4700, longitude: -0.4543, name: "London Heathrow" },
  ISB: { latitude: 33.5499, longitude: 73.1007, name: "Islamabad" },
  DXB: { latitude: 25.2532, longitude: 55.3657, name: "Dubai" },
  LAX: { latitude: 33.9416, longitude: -118.4085, name: "Los Angeles" },
};

const API_BASE_URL = 'http://192.168.1.7:7798'; // Replace with your actual backend URL

const TrackFlightStatusPage = ({ navigation }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFlightStatus = async () => {
    Keyboard.dismiss();
    setError('');
    setFlightData(null);
    setLoading(true);
  
    try {
      const trimmedFlightNumber = flightNumber.trim();
      const response = await fetch(`${API_BASE_URL}/flight-status/${trimmedFlightNumber}`);
  
      const text = await response.text();
  
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || 'Flight not found');
        } catch (e) {
          throw new Error(text || 'Flight not found');
        }
      }
  
      const flight = JSON.parse(text);
  
      // Update route data to match the response format
      const from = flight.departure?.location;
      const to = flight.destination?.location;
  
      // Debug: Check for required fields
      if (!from || !to) {
        console.warn('Missing route data in response:', {
          hasFrom: !!from,
          hasTo: !!to,
          fullResponse: flight
        });
        throw new Error('Flight data incomplete - missing route information');
      }
  
      // Calculate progress based on status
      let progress = 0;
      switch(flight.status) {
        case 'Boarding': progress = 0.1; break;
        case 'In Flight': progress = Math.random() * 0.9; break;
        case 'Landed': progress = 1; break;
        case 'Delayed': progress = 0.05; break;
        case 'Taxiing': progress = 0.2; break;
        default: progress = 0;
      }
  
      // Update flight data with proper from/to values
      setFlightData({
        ...flight,
        from,
        to,
        progress
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch flight status');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateFlightPosition = () => {
    if (!flightData) return null;
    
    const from = airportCoords[flightData.from];
    const to = airportCoords[flightData.to];
    const progress = flightData.progress || 0.5;
    
    return {
      latitude: from.latitude + (to.latitude - from.latitude) * progress,
      longitude: from.longitude + (to.longitude - from.longitude) * progress,
    };
  };

  const renderMap = () => {
    if (!flightData) return null;
  
    try {
      const from = airportCoords[flightData.from];
      const to = airportCoords[flightData.to];
      const currentPos = calculateFlightPosition();

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
            <style>
              body { margin: 0; padding: 0; }
              #map { height: 100vh; width: 100vw; }
              .plane-icon {
                color: #6a1b9a;
                font-size: 24px;
                text-shadow: 0 0 3px white;
                transform: rotate(45deg);
              }
            </style>
          </head>
          <body>
            <div id="map"></div>
            <script>
              try {
                const map = L.map('map', { zoomControl: false }).setView([${currentPos.latitude}, ${currentPos.longitude}], 4);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                
                // Departure marker
                L.marker([${from.latitude}, ${from.longitude}], {
                  icon: L.divIcon({
                    html: '<div style="color:#4caf50;font-size:24px">📍</div>',
                    className: 'marker-icon'
                  })
                }).addTo(map).bindPopup("${from.name}");
                
                // Arrival marker
                L.marker([${to.latitude}, ${to.longitude}], {
                  icon: L.divIcon({
                    html: '<div style="color:#f44336;font-size:24px">📍</div>',
                    className: 'marker-icon'
                  })
                }).addTo(map).bindPopup("${to.name}");
                
                // Flight path
                L.polyline(
                  [[${from.latitude}, ${from.longitude}], [${to.latitude}, ${to.longitude}]],
                  { color: '#6a1b9a', dashArray: '5,5', weight: 3 }
                ).addTo(map);
                
                // Current plane position
                L.marker([${currentPos.latitude}, ${currentPos.longitude}], {
                  icon: L.divIcon({
                    html: '<div class="plane-icon">✈</div>',
                    className: 'plane-marker',
                    iconSize: [24, 24]
                  })
                }).addTo(map);
              } catch(e) {
                console.error('Map error:', e);
              }
            </script>
          </body>
        </html>
      `;
  
      return (
        <WebView
          source={{ html }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          originWhitelist={['*']}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('HTTP error:', nativeEvent.statusCode);
          }}
        />
      );
    } catch (error) {
      console.error('Error generating map HTML:', error);
      return <Text style={{color: 'red'}}>Map failed to load</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#6a1b9a" />
      </TouchableOpacity>

      <Text style={styles.header}>Flight Status Tracker</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Flight Number</Text>
        <View style={styles.inputBox}>
          <Ionicons name="airplane" size={20} color="#6a1b9a" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. PK301"
            placeholderTextColor="#999"
            value={flightNumber}
            onChangeText={setFlightNumber}
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity 
          style={styles.trackButton} 
          onPress={fetchFlightStatus}
          disabled={loading || !flightNumber.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.trackText}>Track Flight</Text>
              <Ionicons name="search" size={18} color="#fff" style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning" size={20} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {flightData && (
        <>
          <View style={styles.infoCard}>
            <View style={styles.flightHeader}>
              <Text style={styles.flightNumber}>{flightData.flightNumber}</Text>
              <Text style={styles.statusBadge}>{flightData.status}</Text>
            </View>
            
            <View style={styles.routeContainer}>
              <View style={styles.route}>
                <Text style={styles.airportCode}>{flightData.from}</Text>
                <Text style={styles.airportName}>{airportCoords[flightData.from]?.name}</Text>
                <Text style={styles.time}>{flightData.time}</Text>
              </View>
              
              <Ionicons name="airplane" size={20} color="#6a1b9a" style={styles.planeIcon} />
              
              <View style={styles.route}>
                <Text style={styles.airportCode}>{flightData.to}</Text>
                <Text style={styles.airportName}>{airportCoords[flightData.to]?.name}</Text>
                <Text style={styles.time}>{flightData.arrivalTime}</Text>
              </View>
            </View>
            
            <Text style={styles.airlineText}>{flightData.airline}</Text>
          </View>

          <View style={styles.mapContainer}>
            {renderMap()}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a1b9a',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  trackButton: {
    backgroundColor: '#6a1b9a',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#e1bee7',
    color: '#6a1b9a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  route: {
    flex: 1,
  },
  airportCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  airportName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
  },
  planeIcon: {
    marginHorizontal: 8,
  },
  airlineText: {
    color: '#666',
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});

export default TrackFlightStatusPage;