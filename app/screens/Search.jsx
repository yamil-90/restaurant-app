import React, {useState} from 'react'
import { StyleSheet, Text, View, Flatlist, Image } from 'react-native'
import { ListItem, Icon, SearchBar } from 'react-native-elements'

const Search = (props) => {
    const {navigation}=props;
const [search, setSearch] = useState("")
    return (
        <View>
            <SearchBar
            placeholder='Buscar restaurante...'
            onChangeText={(e)=>setSearch(e)}
            value={search}
            containerStyle={styles.searchBar}
            />
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    searchBar:{
        marginBottom:20
    }
})

