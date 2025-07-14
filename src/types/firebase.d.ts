declare module 'firebase/app' {
  import firebase from 'firebase';
  export default firebase;
}

declare module 'firebase/auth' {
  import firebase from 'firebase';
  export default firebase.auth;
}

declare module 'firebase/firestore' {
  import firebase from 'firebase';
  export default firebase.firestore;
}

declare module 'firebase/storage' {
  import firebase from 'firebase';
  export default firebase.storage;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: string[]): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
  };
  
  export default AsyncStorage;
}

declare module '@expo/vector-icons' {
  import { ComponentClass } from 'react';
  
  export const MaterialCommunityIcons: ComponentClass<{
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }>;
  
  export const Ionicons: ComponentClass<{
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }>;
} 