import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import CounterButton from './components/CounterButton'
import { styles } from './styles';
import { pb } from "./pocketbaseService"
import { BaseModel, RecordAuthResponse } from 'pocketbase';

async function fetchUserData(): Promise<any[]> {
  const data: any[] = await pb.collection("friends_with").getFullList()
  return data
}

export default function App() {
  const [text, setText] = useState<string>("")
  const [userData, setUserData] = useState<any[]>([]) // default value
  const [count, setCount] = useState<number>(0)
  const [currentUser, setCurrentUser] = useState<BaseModel | null>(null)
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  function getUserData(): void {
    fetchUserData()
      .then(userData => setUserData(userData))
  }

  async function signup() {
    await pb.collection("users").create({
      username: username,
      password: password,
      passwordConfirm: password,
    })

    await login()
  }

  async function login() {
    const response: RecordAuthResponse = await pb.collection("users").authWithPassword(username, password)
    setCurrentUser(pb.authStore.model)
  }

  async function logout() {
    await pb.authStore.clear()
  }

  useEffect(getUserData, [])
  useEffect(() => {
    pb.authStore.onChange((token: string, model: BaseModel | null) => setCurrentUser(model))
  }, [])

  function handleTextChange(newText: string): void {
    setText(newText)
  }
  console.log("about to render")
  return (
    <View style={styles.container}>
      <Text>{currentUser === null ? "Not signed in!" : "Signed in as " + currentUser.id}</Text>
      <View style={styles.loginBox}>
        <TextInput placeholder='username' onChangeText={(text: string) => setUsername(text)} style={styles.textInput} />
        <TextInput placeholder='password' onChangeText={(text: string) => setPassword(text)} style={styles.textInput} secureTextEntry />
      </View>
      <Button title="Sign Up" onPress={signup}></Button>
      <Button title="Log in" onPress={login}></Button>
      <Button title="Log out" onPress={logout}></Button>
    </View>
  );
}
