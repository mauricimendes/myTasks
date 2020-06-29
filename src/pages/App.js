import React from 'react'
import { StatusBar, View } from 'react-native'
import Tasks from '../pages/Tasks'

const App = () => {
    return (
        <>
        <StatusBar barStyle="light-content" backgroundColor="#191929" />
        <View  style={{ flex: 1, backgroundColor: '#191929'}}>
            <Tasks />
        </View>
        </>
    )
}

export default App