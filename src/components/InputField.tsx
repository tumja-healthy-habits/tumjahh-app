import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  textFunction
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomColor: '#FFF4EC',
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}>
      {icon}
      {inputType == 'password' ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          secureTextEntry={true}
          onChangeText={textFunction}
          autoCapitalize='none'
        />
      ) : (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          onChangeText={textFunction}
          autoCapitalize='none'
        />
      )}
      <TouchableOpacity onPress={fieldButtonFunction}>
        <Text style={{color: '#FFF4EC', fontWeight: '700'}}>{fieldButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}