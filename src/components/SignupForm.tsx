import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import Colors from "constants/colors";
import { useState } from "react";
import { styles } from "../styles";
import { NavigationProp, useNavigation } from "@react-navigation/native";


import { VAR_PASSWORD, VAR_USERNAME, login, signup } from "src/authentification";

import InputField from './InputField';
import LoginForm from './LoginForm';
import CustomButton from './CustomButton';
import { UserRecord } from 'types';
import { LoginParamList } from "./LoginNavigator";


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TextInputMask from 'react-native-masked-text'



export default function SignupForm() {

    const [username, setUsername] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = useState<string>("")
    
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [dobLabel, setDobLabel] = useState('Date of Birth');

    //const navigation = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()

    const { navigate, goBack } = useNavigation<NavigationProp<LoginParamList, "SignupForm">>()



    async function handleSignup(): Promise<void> {
        try {
            const newRecord: UserRecord = await signup(username, name ? name : username, email, password, passwordConfirm)
        }
        catch(error) {
            console.log(error.message)
            if (error.message == "validation_invalid_username") {
                Alert.alert("Username already exists.\n Please choose a different username")
            }
            else if (error.message == "validation_required") {
                Alert.alert("Confirm Password and Password must be the same")
            }
            else if (error.message == "validation_invalid_email") {
                Alert.alert("E-Mail already registered.\n Please use a different E-Mail")
            }
        }
    }


  return (
    <View style={styles.lcontainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{width:"90%"}}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom:15}}>
            <Text style={{color: Colors.accent, fontSize: 30, marginLeft: 15, alignSelf:'flex-end', marginBottom:15}}>Register</Text>
            <Image source={require("assets/images/behealthy-icon.png")} style={{width:170, height:170, alignSelf:'flex-end'}}/>
        </View>

        
        <InputField
          label={'Username'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          textFunction={(text: string) => setUsername(text)}
        />

        <InputField
          label={'Name'}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          textFunction={(text: string) => setName(text)}
        />

        <InputField
          label={'Email'}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          keyboardType="email-address"
          textFunction={(text: string) => setEmail(text)}
        />

        <InputField
          label={'Password'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          textFunction={(text: string) => setPassword(text)}
        />

        <InputField
          label={'Confirm Password'}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{marginRight: 5}}
            />
          }
          inputType="password"
          textFunction={(text: string) => setPasswordConfirm(text)}
        />

        {/* <TextInputMask
            refInput={setDate}
            type={'datetime'}
            options={{
                format: 'DD-MM-YYYY HH:mm:ss'
            }}
        /> */}
        

        <CustomButton label={'Register'} onPress={handleSignup} />
        {/* <Button title={"Already registered?\n Login!"} onPress={goBack} color={Colors.accent }></Button> */}

        <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                    <Text>Already registered?</Text>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={{color: '#FFF4EC', fontWeight: '700'}}> Login</Text>
                    </TouchableOpacity>
                </View>

      </ScrollView>
    </View>
  );
};

