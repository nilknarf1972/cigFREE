import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0F5257' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          title: 'Clear Path • The Primo IT Tech LLC'
        }}
      />
    </>
  );
}
