import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';

interface Props {
  data: string[];
  onItemSelected: (item: string) => void;
}

export function SearchableDropdown({ data, onItemSelected }: Props) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<string[]>([]);

  const handleSelectItem = (item: string) => {
    onItemSelected(item);
    setQuery(item);
    setIsDropdownOpen(false);
  };

  const handleFilteredData = () => {
    const filteredData = data.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredData.length === 0) {
      return [query];
    }

    return filteredData;
  }

  useEffect(() => {
    setFilteredData(handleFilteredData());
  }, [data, query]);

  return (
    <>
      <TextInput
        style={[ styles.input, { marginBottom: isDropdownOpen ? 0 : '5%' } ]}
        placeholder='Escolha uma categoria'
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setIsDropdownOpen(false)}
      />
      {isDropdownOpen && (
        <FlatList
          style={[ styles.list, { marginBottom: isDropdownOpen ? '5%' : 0 } ]}
          data={filteredData}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectItem(item)}>
              <View style={styles.item}>
                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
};

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
    textAlign:"left",
    justifyContent:'center'
  }
});