import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AddRewardItemScreen } from '../screens/AddRewardItemScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { RewardItemDetailScreen } from '../screens/RewardItemDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SmokingSettingsScreen } from '../screens/SmokingSettingsScreen';
import { getOnboarded } from '../storage/storage';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    (async () => {
      const onboarded = await getOnboarded();
      setInitialRoute(onboarded ? 'Home' : 'Onboarding');
    })();
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E6BFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SmokingSettings" component={SmokingSettingsScreen} options={{ title: '喫煙設定' }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddRewardItem" component={AddRewardItemScreen} options={{ title: '商品追加' }} />
      <Stack.Screen name="RewardItemDetail" component={RewardItemDetailScreen} options={{ title: '商品詳細' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '設定' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
});
