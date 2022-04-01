// import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider as PaperProvider, Provider } from 'react-native-paper'
import Main from './src/main'
import React from 'react'
import { Root } from 'react-native-alert-notification'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Provider>
          <Root>
            <Main/>
          </Root>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})