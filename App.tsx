import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { styles } from './src/styles';
import { pb } from "./pocketbaseService"
import { BaseModel, RecordAuthResponse } from 'pocketbase';
import LabelledTextInput from 'components/LabelledTextInput';
import { StatusBar } from 'expo-status-bar';

async function fetchUserList(): Promise<any[]> {
  return []
  const data: any[] = await pb.collection("friends_with").getFullList()
  return data
}

export default function App() {
  const [userData, setUserData] = useState<any[]>([]) // default value in the brackets
  const [currentUser, setCurrentUser] = useState<BaseModel | null>(null)
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  function getUserData(): void {
    fetchUserList()
      .then(userData => setUserData(userData))
      .catch(() => console.error("An error occured while fetching the user data from pocketbase!"))
  }

  async function signup(): Promise<void> {
    const data: {} = {
      username: username,
      password: password,
      passwordConfirm: password,
    }
    await pb.collection("users").create(data)
    await login()
  }

  async function login(): Promise<void> {
    const response: RecordAuthResponse = await pb.collection("users").authWithPassword(username, password)
    setCurrentUser(pb.authStore.model)
  }

  async function logout(): Promise<void> {
    await pb.authStore.clear()
  }

  useEffect(() => {
    getUserData() // fetch a list of the users
    // whenever the currently authenticated user changes, update the currentUser state variable
    pb.authStore.onChange((_: string, model: BaseModel | null) => setCurrentUser(model))
  }, [])

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <Text>{currentUser === null ? "Not signed in!" : "Signed in as " + currentUser.id}</Text>
        <View style={styles.loginBox}>
          <LabelledTextInput label="Username:" placeholder="username" onChangeText={(text: string) => setUsername(text)} style={styles.textInput} />
          <LabelledTextInput label="Password:" placeholder='password' onChangeText={(text: string) => setPassword(text)} style={styles.textInput} secureTextEntry />
        </View>
        <View>
          <Button title="Sign Up" onPress={signup}></Button>
          <Button title="Log in" onPress={login}></Button>
          <Button title="Log out" onPress={logout}></Button>
        </View>
      </View>
    </>
  );
}