import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const METHOD = 0; // 用AsyncStorage
// const METHOD = 1; // 用SecureStore

export async function read(key) {
  if (METHOD) return await SecureStore.getItemAsync(key);
  else return await AsyncStorage.getItem(key);
}

export async function write(key, value) {
  if (METHOD) return await SecureStore.setItemAsync(key, value);
  else return await AsyncStorage.setItem(key, value);
}

export async function remove(key) {
  if (METHOD) return await SecureStore.deleteItemAsync(key);
  else return await AsyncStorage.removeItem(key);
}
