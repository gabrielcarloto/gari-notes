import React from 'react';
import { View, Text, TextInput, StyleSheet } from "react-native";

interface SearchBarProps {
    onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Pesquisar</Text>
            <TextInput
                style={styles.input}
                onChangeText={onSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 32,
        paddingBottom: 8,
        paddingTop: 0,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        backgroundColor: "#FAFAFA",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#8C8C8C",
        borderRadius: 8,
    },
});

export default SearchBar;