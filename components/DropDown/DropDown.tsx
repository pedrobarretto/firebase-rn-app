import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

interface Props {
  data: string[];
  onItemSelected: (item: string) => void;
}

export function SearchableDropdown({ data, onItemSelected }: Props) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const handleSelectItem = (item: string) => {
    console.log('item:', item);
    console.log('item.length === 0 ? query : item: ', item.length === 0 ? query : item)    
    onItemSelected(item.length === 0 ? query : item);
    setQuery(item);
    setIsDropdownOpen(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredData);
  }, [data, query]);

  const handleListPress = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    console.log('query: ', query);
    onItemSelected(query);
  }, [query])

  return (
    <>
      <TextInput
        style={[styles.input, { marginBottom: isDropdownOpen ? 0 : '5%' }]}
        placeholder='Escolha uma categoria'
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setIsDropdownOpen(false)}
      />
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={handleListPress}>
          <FlatList
            style={[styles.list, { marginBottom: isDropdownOpen ? '5%' : 0 }]}
            data={filteredData}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectItem(item)}>
                <View style={styles.item}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            ref={flatListRef}
            keyboardShouldPersistTaps='handled'
          />
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  list: {
    maxHeight: 100,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    width:'90%'
  },
  input: {
    padding:10,
    backgroundColor:'#fff',
    borderRadius: 5,
    paddingVertical: 8,
    width:'90%',
    alignSelf:'center',
    textAlign:'left',
    justifyContent:'center'
  }
});