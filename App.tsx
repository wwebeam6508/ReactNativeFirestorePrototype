// import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Provider as PaperProvider } from 'react-native-paper'
import { Provider as ReduxProvider } from 'react-redux'
import Main from './src/main'
import React from 'react'
import { Root } from 'react-native-alert-notification'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './src/redux/slices/authSlice'
import userReducer from './src/redux/slices/userSlice'

const store = configureStore({
  reducer:{
    auth:authReducer,
    user:userReducer
  }
})
export default function App() {
  return (
    
      <ReduxProvider store={store}>
          <PaperProvider>
            <SafeAreaProvider >
              <SafeAreaView style={styles.container}>
                    <Root>
                      <Main/>
                    </Root>
              </SafeAreaView>
            </SafeAreaProvider>
          </PaperProvider>
      </ReduxProvider>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
