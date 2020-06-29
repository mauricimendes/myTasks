import React, { useState, useEffect } from 'react'
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList, 
    ScrollView, 
    Image, 
    Modal, 
    TextInput, 
    Alert,
    Keyboard
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Ionicons from 'react-native-vector-icons/Ionicons' //ios-arrow-back, ios-arrow-up, ios-close-circle-outline, ios-checkmark-circle-outline
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons' //options, energy
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5' //fire, stopwatch, calendar
import FontAwesome from 'react-native-vector-icons/FontAwesome' //circle-o, cricle
import { format } from 'date-fns'
import UUIDGenerator from 'react-native-uuid-generator'
import getRealm from '../../services/realm'
import styles from './styles'

const Tasks = () => {

    const [date, setDate] = useState('') 
    const [time, setTime] = useState('')
    const [title, setTitle]= useState('')
    const [description, setDescription] = useState('')
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false)
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        const dateNow = Date.now()
        const formatDateNow = format(dateNow, 'MMM do, yyyy')
        setDate(formatDateNow)
    
        const timeNow = Date.now()
        const formatTimeNow = format(timeNow, 'H:mm')
        setTime(formatTimeNow)
    }, [])

    useEffect(() => {
        loadTasks()
    }, [])
    
    async function loadTasks() {
        const realm = await getRealm()
        const data = realm.objects('Tasks').sorted('do', false)
        setTasks(data)
    }

    async function saveTask(data) {        
        const realm = await getRealm()
        realm.write(() => {
            realm.create('Tasks', data, 'modified')
        })

        return data
    }

    async function handleCheckedTask(task) {
        const checkedTask = {
            id: task.id,
            name: task.name,
            description: task.description,
            hour: task.hour,
            day: task.day,
            do: task.do === 'no' ? 'yes' : 'no'
        }
        await saveTask(checkedTask)

        loadTasks()
    }

    async function deleteTask(data) {
        const realm = await getRealm()
        let task = realm.objects('Tasks').filtered(`id = '${data.id}'`)
        realm.write(() => {
            realm.delete(task)
        })
    }

    async function handleDeleteTask(task) {
        const taskDelete = {
            id: task.id,
            name: task.name,
            description: task.description,
            hour: task.hour,
            day: task.day,
            do: task.do
        }

        await deleteTask(taskDelete)
        loadTasks()
    }

    async function handleAddTask() {
        try {
            const data = {
                id: (await UUIDGenerator.getRandomUUID()).toString(),
                name: title,
                description: description,
                hour: time,
                day: date,
                do: 'no'
            } 
            await saveTask(data)
            Alert.alert('Created task.')
            handleCloseModalAddTask()
            Keyboard.dismiss()
            loadTasks()
        } catch (err) {
            Alert.alert('Error when creating the task.')
        }
    }

    function handleCloseModalAddTask() {
        setAddTaskModalVisible(false)
        setTitle('')
        setDescription('')
        setDate('')
        setTime('')
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date
        var formatDate = format(currentDate, 'MMM do, yyyy')
        setShowDate(false)
        setDate(formatDate)
    }

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date
        var formatDate = format(currentDate, 'H:mm')
        setShowTime(false)
        setTime(formatDate)
    }
    
    const showDatepicker = () => {
        setShowDate(true)
    }
    
    const showTimepicker = () => {
        setShowTime(true)
    }

    return (
        <>
        {showDate && (
            <DateTimePicker 
                testID='dateTimePicker'
                mode='date'
                value={Date.now()}
                is24Hour={true}
                display='default'
                onChange={onChangeDate} 
            />
        )}
        {showTime && (
            <DateTimePicker 
                testID='dateTimePicker'
                mode='time'
                is24Hour={true}
                value={Date.now()}
                display='default'
                onChange={onChangeTime} 
            /> 
        )}
        <Modal
            animationType='slide'
            transparent={true}
            visible={addTaskModalVisible}
        >
            <View style={styles.containerAddTask}>
                <View style={styles.containerActionsModal}>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleCloseModalAddTask}>
                        <Ionicons name='ios-close-circle-outline' size={36} color='#2ae2b1' />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={handleAddTask}>
                        <Ionicons name='ios-checkmark-circle-outline' size={36} color='#2ae2b1' />
                    </TouchableOpacity>
                </View>
                <View style={styles.modal}>
                    <TextInput 
                        style={styles.textInput}
                        placeholderTextColor='#85878d'
                        placeholder='Title'
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput 
                        style={styles.textAreaInput}
                        placeholderTextColor='#85878d'
                        placeholder='Description'
                        value={description}
                        onChangeText={setDescription}
                        numberOfLines={10}
                        multiline={true}
                    />
                    <View style={styles.addTaskDateTime}>
                        <TextInput
                            style={styles.inputDateTime}
                            placeholder='Calendar'
                            placeholderTextColor='#85878d'
                            value={`${date}`}
                        />
                        <TouchableOpacity onPress={showDatepicker}>
                            <FontAwesome5 name='calendar' size={32} color='#2ae2b1'  />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addTaskDateTime}>
                        <TextInput
                            style={styles.inputDateTime}
                            placeholder='Time'
                            placeholderTextColor='#85878d'
                            value={`${time}`}
                        />
                        <TouchableOpacity onPress={showTimepicker}>
                            <FontAwesome5 name='stopwatch' size={32} color='#2ae2b1' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <View style={styles.containerButtons}>
            {/* <TouchableOpacity activeOpacity={0.8}>
                <Ionicons name='ios-arrow-back' size={24} color='#2ae2b1' />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8}>
                <SimpleLineIcons name='options' size={24} color='#2ae2b1' />
            </TouchableOpacity> */}
        </View>
        <View style={styles.containerToday}>
            <FontAwesome5 name='fire' size={26} color='#2ae2b1' />
            <Text style={styles.today}>
                {format(Date.now(), 'MMM do, yyyy')}
            </Text>
        </View>
        {/* <View style={styles.containerOverdue}>
            <Text style={styles.titleContainer}>Overdue</Text>
            <View style={styles.containerOptions}>
                <View style={styles.options}>
                    <FontAwesome name='circle-o' size={20} color='#2ae2b1' />
                    <Text style={styles.optionsText}>Call center</Text>
                </View>
                <View style={styles.options}>
                    <TouchableOpacity>
                        <Text style={styles.optionsTextButtom}>move to today</Text>
                    </TouchableOpacity>
                    <SimpleLineIcons name='energy' size={20} color='#2ae2b1' />
                </View>
            </View>
        </View> */}
        <View style={styles.containerTodayTasks}>
            {/* <Text style={[styles.titleContainer, {marginBottom: 10}]}>{format(Date.now(), 'MMM do, yyyy')}</Text> */}
            <FlatList 
                data={tasks}
                showsVerticalScrollIndicator={false}
                keyExtractor={task => String(task.id)}
                renderItem={({ item: task }) => (
                    <View style={styles.containerOptions}>
                        <View style={styles.options}>
                            <TouchableOpacity 
                                onPress={() => handleCheckedTask(task)}
                                onLongPress={() => handleDeleteTask(task)}
                            >
                                <FontAwesome 
                                    name={task.do === 'no' ? 'circle-o' : 'circle'} 
                                    size={20} 
                                    color='#2ae2b1' 
                                />
                            </TouchableOpacity>
                            <Text 
                                style={[styles.optionsText, 
                                        task.do === 'yes' ? { textDecorationLine: 'line-through' } : {}
                                    ]}
                            >
                                {task.name}
                            </Text>                  
                        </View>
                        <View style={styles.options}>
                            {task.do === 'no'
                                ?
                                <Text style={styles.optionsTextButtom}>{task.hour}</Text>
                                :
                                <Ionicons 
                                    style={{ marginRight: 10 }} 
                                    name='ios-arrow-up' 
                                    size={24} 
                                    color='#2ae2b1' 
                                />
                            }
                        </View>
                    </View>
                )}
            />
        </View>
        <View style={styles.addTaskContainer}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setAddTaskModalVisible(true)} >
                <Image style={styles.imageAddTask} source={require('../../assets/addtask.png')} />
            </TouchableOpacity>
        </View>
        </>
    )
}

export default Tasks