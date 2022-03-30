// import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from './src/firebaseConfig'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Main from './src/main'
initializeApp(firebaseConfig)

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Main/>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
const styles = StyleSheet.create({
  container: {
      flex: 1
  }
})