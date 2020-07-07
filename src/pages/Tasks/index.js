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
import Ionicons from 'react-native-vector-icons/Ionicons' //ios-arrow-back, alert, ios-arrow-up, ios-close-circle-outline, ios-checkmark-circle-outline
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons' //options, energy
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5' //fire, stopwatch, calendar
import FontAwesome from 'react-native-vector-icons/FontAwesome' //circle-o, cricle
import { format, isAfter, parseISO, parse, setHours } from 'date-fns'
import UUIDGenerator from 'react-native-uuid-generator'
import getRealm from '../../services/realm'
import styles from './styles'

const Tasks = () => {

    const [date, setDate] = useState('') 
    const [time, setTime] = useState('')
    const [title, setTitle]= useState('')
    const [idAlterTask, setIdAlterTask] = useState('')
    const [description, setDescription] = useState('')
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)
    const [addTaskModalVisible, setAddTaskModalVisible] = useState(false)
    const [tasks, setTasks] = useState([])
    const [tasksOverdue, setTasksOrverdue] = useState([])
    const [overdue, setOverdue] = useState(false)

    useEffect(() => {
        const dateNow = Date.now()
        const formatDateNow = format(dateNow, 'yyyy-MM-dd')
        setDate(formatDateNow)
    
        const timeNow = Date.now()
        const formatTimeNow = format(timeNow, 'H:mm')
        setTime(formatTimeNow)
    }, [])

    useEffect(() => {
        loadTasks()
        loadTasksOverdue()
    }, [])

    async function loadTasksOverdue() {
        const realm = await getRealm()
        const data = realm.objects('Tasks').filtered(' do = "no" ')

        const newTasksOverdue = data.filter(task => {
            const newTaskOverdue = isAfter(parseISO(format(Date.now(), 'yyyy-MM-dd')), parseISO(format(task.date, 'yyyy-MM-dd'))) 
            if(newTaskOverdue) {
                setOverdue(true)
                return task
            }
            else {
                return
            } 
        }) 
        if(newTasksOverdue.length < 1) {
            setOverdue(false)
        }
        setTasksOrverdue(newTasksOverdue)
    }
    
    async function loadTasks() {
        const realm = await getRealm()
        const data = realm.objects('Tasks').sorted('do', false)
        const task = data.filter(task => {
            const newTask = isAfter(parseISO(format(Date.now(), 'yyyy-MM-dd')), parseISO(format(task.date, 'yyyy-MM-dd'))) 
            if(!newTask) {
                return task
            }
            else {
                return
            } 
        }) 
        setTasks(task)
    }

    function handleMoveToTodayTask(task) {
        setIdAlterTask(task.id)
        setTitle(task.name)
        setDescription(task.description)
        setAddTaskModalVisible(true)
    }

    async function saveTask(data) {        
        const realm = await getRealm()
        realm.write(() => {
            realm.create('Tasks', data, 'modified')
        })
        setIdAlterTask('')
        return data
    }

    async function handleCheckedTask(task) {
        const checkedTask = {
            id: task.id,
            name: task.name,
            description: task.description,
            hour: task.hour,
            date: task.date,
            do: task.do === 'no' ? 'yes' : 'no'
        }
        await saveTask(checkedTask)

        loadTasks()
        loadTasksOverdue()
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
            date: task.date,
            do: task.do
        }

        await deleteTask(taskDelete)
        loadTasks()
        loadTasksOverdue()
    }

    async function handleAddTask() {
        try {
            const data = {
                id: idAlterTask ? idAlterTask : (await UUIDGenerator.getRandomUUID()).toString(),
                name: title,
                description: description,
                hour: time,
                date: date,
                do: 'no'
            } 
            await saveTask(data)
            Alert.alert(idAlterTask ? 'Changed task' : 'Created task.')
            handleCloseModalAddTask()
            Keyboard.dismiss()
            loadTasks()
            loadTasksOverdue()
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
        var formatDate = format(currentDate, 'yyyy-MM-dd')
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
                {format(Date.now(), 'MMMM do, yyyy')}
            </Text>
        </View>
        {
            overdue &&
            <View style={styles.containerOverdue}>
                <Text style={styles.titleContainer}>Overdue</Text>
                <FlatList 
                    data={tasksOverdue}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={taskOverdue => String(taskOverdue.id)}
                    renderItem={({ item: taskOverdue }) => (
                            <View style={styles.containerOptions}>
                                <View style={styles.options}>
                                    <Ionicons name='md-alert' size={22} color='#2ae2b1' />
                                    <Text style={styles.optionsText}>{taskOverdue.name}</Text>
                                </View>
                                <View style={styles.options}>
                                    <TouchableOpacity onPress={() => handleMoveToTodayTask(taskOverdue)}>
                                        <Text style={styles.optionsTextButtom}>new date</Text>
                                    </TouchableOpacity>
                                    <SimpleLineIcons name='energy' size={20} color='#2ae2b1' />
                                </View>
                            </View>
                    )}
                />
            </View>
        }
        <View style={styles.containerTodayTasks}>
            <Text style={[styles.titleContainer, {marginBottom: 10}]}>Next tasks</Text>
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