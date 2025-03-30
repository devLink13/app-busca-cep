import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import api from './src/services/api';


export default function App() {

  const [inputValue, setInputValue] = useState('');
  const [exibirResultados, setExibirResultados] = useState(false);
  const [infoCep, setInfoCep] = useState({});
  const [inLoad, setInLoad] = useState(false);

  const inputRef = useRef(null);


  async function buscaCep() { // função que faz a chamada da api e busca o cep

    setInLoad(true);

    if (!inputValue || (inputValue.length < 8)) {
      alert('CEP INVÁLIDO !');
      return;
    }


    const route = `${inputValue}/json/`;

    try {
      const response = await api.get(route);
      const data = response.data;

      if (data['erro'] === 'true') {
        return alert('CEP INVÁLIDO !');
      }

      setInfoCep(data); // passamos o objeto para a state
      setExibirResultados(true);

      setTimeout(() => { // espera dois segundos para tirar a tela de loading
        setInLoad(false);
      }, 2000)

      console.log(data);

    }
    catch (error) {
      alert('ocorreu algum erro.');
      console.log(error);
    }


  }

  return (
    <View style={styles.container}>
      <View style={styles.boxHeader}>
        <Text style={styles.titleHeader}>BUSCA CEP</Text>
      </View>
      <View style={styles.boxConteudo}>

        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Ionicons name={'search'} size={80} color={'#6f89ff'} />
        </View>

        <TextInput
          value={inputValue}
          placeholder='digite o cep'
          style={styles.input}
          keyboardType='numeric'
          onChangeText={(value) => setInputValue(value)}
          ref={inputRef}
          maxLength={8}
          onFocus={() => setExibirResultados(false)}
        />

        <View style={styles.boxBtn}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#6f89ff' }]}
            onPress={() => {
              Keyboard.dismiss();
              buscaCep();
            }}
          >
            <Text style={styles.txtButton}>BUSCAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: '#ff213f' }]}
            onPress={() => {
              setInputValue('');
              setExibirResultados(false);
              inputRef.current.focus();

            }}
          >
            <Text style={styles.txtButton}>APAGAR</Text>
          </TouchableOpacity>
        </View>

        {exibirResultados
          ? inLoad
            ? <View style={[styles.boxResultados]} >
              <Text style={[styles.conteudoTxt]}>BUSCANDO CEP...</Text>
              <ActivityIndicator color={'#fff'} size={'large'} />
            </View>

            : <View style={styles.boxResultados}>
              <Text style={styles.conteudoTxt}>CEP: {infoCep['cep']}</Text>
              <Text style={styles.conteudoTxt}>Logradouro: {infoCep['logradouro']}</Text>
              <Text style={styles.conteudoTxt}>Bairro: {infoCep['bairro']}</Text>
              <Text style={styles.conteudoTxt}>Cidade: {infoCep['localidade']}</Text>
              <Text style={styles.conteudoTxt}>Estado: {infoCep['estado']} </Text>
            </View>



          : null
        }


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boxHeader: {
    backgroundColor: '#6f89ff',
    width: '100%',
    height: 125,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    marginBottom: 15
  },
  titleHeader: {
    paddingBottom: 18,
    paddingLeft: 20,
    color: '#fff',
    fontSize: 25,
    fontWeight: '500'
  },
  boxConteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15
  },

  input: {
    borderColor: 'grey',
    borderWidth: 1,
    width: '100%',
    height: 50,
    borderRadius: 10,
    padding: 15,
    fontSize: 19,
    marginBottom: 15
  },
  boxBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  btn: {
    borderRadius: 8,
    height: 40,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtButton: {
    color: '#fff',
    fontSize: 16
  },
  boxResultados: {
    marginTop: 45,
    backgroundColor: '#6f89ff',
    width: '90%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.78,
    shadowRadius: 3.5
  },
  conteudoTxt: {
    fontSize: 20,
    padding: 2,
    color: '#fff'
  }

});
