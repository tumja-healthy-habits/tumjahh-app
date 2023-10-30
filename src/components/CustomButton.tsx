import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FFF4EC',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        width:'90%',
        alignSelf:'center'
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 16,
          color: '#000',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}