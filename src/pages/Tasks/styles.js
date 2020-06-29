import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10 
    },
    containerToday: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    today: {
        color: '#FFF',
        fontSize: 24,
        marginHorizontal: 20
    },
    containerOverdue: {
        paddingHorizontal: 20,
        marginVertical: 10
    },
    titleContainer: {
        fontSize: 18,
        color: '#abaab1'
    },
    containerOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 5,
        backgroundColor: '#212133',
        borderRadius: 10,
        alignItems: 'center',
        height: 60
    },
    options: {
        flexDirection: 'row',
    },
    optionsText: {
        fontSize: 15,
        color: '#cccbd2',
        marginHorizontal: 8
    },
    optionsTextButtom: {
        fontSize: 15,
        color: '#2ae2b1',
        marginHorizontal: 8
    },
    containerTodayTasks: {
        padding: 20,
        height: 580
    },
    addTaskContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageAddTask: {
        height: 75,
        width: 75    
    },
    containerAddTask: {
        flex: 1,
        backgroundColor: "#000000dd", 
        paddingTop: 20
    },
    containerActionsModal: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 30
    },
    modal: {
        flex: 1,
        marginTop: 70,
        backgroundColor: "#191929", 
        margin: 20, 
        padding: 20,
        borderRadius: 10,
        height: 370,
        width: 320,
        position: 'absolute',
    },
    textInput: {
        height: 50,
        backgroundColor: '#212133',
        marginVertical: 10,
        borderRadius: 8,
        padding: 10,
        color: '#cccbd2'
    },
    textAreaInput: {
        fontFamily: 'Roboto_300Light',
        height: 100,
        backgroundColor: '#212133',
        marginVertical: 10,
        borderRadius: 8,
        padding: 10,
        color: '#cccbd2'
    },
    inputDateTime: {
        height: 50,
        width: 200,
        backgroundColor: '#212133',
        marginVertical: 10,
        borderRadius: 8,
        padding: 10,
        color: '#cccbd2'
    },
    addTaskDateTime: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems:'center',
        paddingRight: 10
    }
})

export default styles