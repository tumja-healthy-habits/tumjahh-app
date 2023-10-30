import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { VAR_PASSWORD, VAR_USERNAME, login, signup } from "src/authentification";

import DatePicker from 'react-native-date-picker';

import InputField from './InputField';
import LoginForm from './LoginForm';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RegistrationPNG from '../../assets/images/behealthy-logo.png';
import CustomButton from './CustomButton';

export default function SignupForm() {
//   const [date, setDate] = useState(new Date());
//   const [open, setOpen] = useState(false);
//   const [dobLabel, setDobLabel] = useState('Date of Birth');

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        {/* <View style={{alignItems: 'center'}}>
          <RegistrationPNG
            height={300}
            width={300}
            style={{transform: [{rotate: '-5deg'}]}}
          />
        </View> */}

        <Text
          style={{
            fontFamily: 'Roboto-Medium',
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Sign Up!
        </Text>

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
        />

        {/* <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{marginRight: 5}}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>
              {dobLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={open}
          date={date}
          mode={'date'}
          maximumDate={new Date('2005-01-01')}
          minimumDate={new Date('1980-01-01')}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
            setDobLabel(date.toDateString());
          }}
          onCancel={() => {
            setOpen(false);
          }} 
        />*/
        }

        <CustomButton label={'Register'} onPress={()=>{}} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Already registered?</Text>
          {/* <TouchableOpacity onPress={() => LoginForm()}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}> Login</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

