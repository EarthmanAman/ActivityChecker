import React from 'react';
import { StyleSheet,AsyncStorage, Text, View, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Appbar, Button, Provider as PaperProvider, TextInput, IconButton, RadioButton, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from 'react-native-vector-icons/materialIcons'

import { createStackNavigator, createAppContainer } from "react-navigation";

export default class AllTask extends React.Component {

    /* CONSTRUCTOR */

    constructor(props)
    {
        super(props);
        this.changed = this.changed.bind(this);
        this.add = this.add.bind(this);
        this.state = {
            activities:[],
            days: [1,2,3],
            visible:false,
            mode: '',
            hour: ''
        }
    }

    /*Entry point of the application*/
// Unsafe
    componentWillMount (){

        try {
            let acts = this.retrieveItem("activities").then((tasks) => {
                this.setState({
                    activities: JSON.parse(tasks),
                });
            }).catch((error) => {
                let taskIn = [{taskObject:[{task:"none", hours:"none", done:false},], dateIn: '1/1/2019', day:'Tuesday'},];
                const acts = this.storeItem("activities", taskIn);
                this.setState({
                    activities: taskIn,
                });
            });
        }
        catch (e) {
            let taskIn = [{taskObject:[{task:"none", hours:"none", done:false},], dateIn: '1/1/2019', day:'Tuesday'},];
            const acts = this.storeItem("activities", taskIn);
            this.setState({
                activities: taskIn,
            });
            Alert.alert("ERROR OCCUR")
        }}

    changed(text){
        try {
            this.setState({
                taskIn: text,
            })
        }
        catch (error) {
            this.setState({
                activities: {
                    task: 'error',
                    hours: '0'
                }
            })
        }
    };


    async storeItem(key, item) {
        try {
            var jsonTask = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonTask;
        } catch (error) {
            Alert.alert(error)
        }
    };


    async retrieveItem(key) {
        try {
            let retrievedTasks = await  AsyncStorage.getItem(key);
            let tasks = JSON.parse(retrievedTasks);
            return tasks;
        } catch (error) {
            Alert.alert(error)
        }
    }
    hourChanging = (hourIn) => {
        this.setState({
            hour:hourIn
        })
    };
    changedHour =(hourIn) => {
        try {
            let activitys = this.state.activities;

            let task = {task:this.state.taskIn, hours:hourIn, done:false}
            activitys.push(task)
            this.setState({
                activities:activitys
            })
        }
        catch (error) {
            this.setState({
                activities: {
                    task: 'none',
                    hours: 'none'
                }
            })
        }
    };

    inputVisible = (event) => {
        this.setState({
            visible:true,
        })
    };

    inputUnVisible(){
        this.setState({
            visible:false
        })
    }

    done = (even) => {
        let activs = this.state.activities;
        for(let i=0; i<=activs[0].taskObject.length; i++)
        {
            if(i === parseInt(even)){
                activs[0].taskObject[i].done = true;
                break
            }
        }
        this.setState({
            activities: activs,
        });
        const acts = this.storeItem("activities", JSON.stringify(activs))
    };

    unDone = (even) => {
        let activs = this.state.activities;
        for(let i=0; i<=activs[0].taskObject.length; i++)
        {
            if(i === parseInt(even)){
                activs[0].taskObject[i].done = false;
                break
            }
        }
        this.setState({
            activities: activs,
        });
        const acts = this.storeItem("activities", JSON.stringify(activs))
    };

    remove = (even) => {
        let activs = this.state.activities;
        activs[0].taskObject.splice(parseInt(even), 1);
        this.setState({
            activities: activs,
        });
        const acts = this.storeItem("activities", JSON.stringify(activs))
    };

    removeItem = (even, event) =>{
        event.preventDefault();
        Alert.alert(
            'Delete',
            'Are you sure you want to delete the task?',
            [
                {text: 'Yes', onPress: (()=> {this.remove(even)})},
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
        );

    };

    doneAll = (event) => {
        event.preventDefault();
        let acts = this.state.activities;
        for(let i=0; i<acts[0].taskObject.length; i++)
        {
            acts[0].taskObject[i].done = true;
        }
        this.setState({
            activities:acts
        });
        const activity = this.storeItem("activities", JSON.stringify(acts))
    };

    clear = (event) => {
        event.preventDefault();
        this.setState({
            activities:[]
        });
        let acts = [];
        AsyncStorage.setItem("activities", JSON.stringify(acts));
    };


    render() {
        const {activities} = this.state;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const {visible} = this.state;
        var today = new Date();
        const date=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
        const day = days[today.getDay()];

        return (
            <PaperProvider>

                <KeyboardAvoidingView behavior="padding" style={styles.container}>

                    <Appbar.Header style={styles.appBar}>
                        <Appbar.Action icon="undo" size={35}/>
                        <Appbar.Content
                            title="ALL THE TASK"
                            subtitle="For Easy Tracking"
                        />
                        <Appbar.Action icon="done-all" style={styles.done} color="white" onPress = {this.doneAll.bind(this)}/>
                        <Appbar.Action icon="delete" style={styles.clear} onPress = {this.clear.bind(this)}/>
                    </Appbar.Header>

                    <Text style={styles.head}>{day} : {date}</Text>

                    <ScrollView contentContainerStyle={{ paddingHorizontal: 40 }}>

                        <View>

                            {activities.map((activitys, index) => (
                                        activitys.taskObject.map((tasks, key) =>
                                            (tasks.done === false) ?

                                                <List.Item title={tasks.hours + " hours"}
                                                           key={key} value={key}
                                                           left={props => <IconButton {...props} icon="schedule" size={30} color='darkblue' touch={true} />}
                                                           right={props => <IconButton {...props} icon="panorama-fish-eye" color='green' size={30}
                                                                                       touch={true}
                                                                                       onPress={() => {this.done(key)}} />}
                                                           style={styles.lists}
                                                           description={tasks.task}
                                                           onPress={(event) => {this.removeItem(key, event)}}/>:

                                                <List.Item
                                                    title={tasks.hours + " hours"}
                                                    key={key} value={key}
                                                    left={props => <IconButton
                                                        {...props}
                                                        icon="schedule"
                                                        size={30}
                                                        color='darkblue'
                                                        touch={true}
                                                    />}
                                                    right={props => <IconButton
                                                        {...props}
                                                        icon="done"
                                                        color='green'
                                                        touch={true}
                                                        onPress={() => {this.unDone(key)}}
                                                    />}
                                                    style={styles.lists}
                                                    description={tasks.task} onPress={(event) => {this.removeItem(key, event)}}
                                                /> )

                                )
                            )}

                        </View>
                    </ScrollView>

                    {(visible !== false) ?
                        <View style={styles.listIn}>
                            <TouchableOpacity><IconButton
                                touch={true}
                                icon="clear"
                                color='white'
                                size={30}
                                style={styles.clear}
                                onPress = {this.inputUnVisible.bind(this)}
                                className='floating-button-icon'
                            /></TouchableOpacity>

                            <TextInput
                                mode= "flat(focused)"
                                placeholder='Add Task'
                                ref={ref => this.textInputRef1 = ref}
                                underLineColor= "white" style={styles.inputIn}
                                onEndEditing={(text) => {this.changed(text.nativeEvent.text)}}
                            />

                            <TextInput
                                mode= "flat(focused)"
                                placeholder='Add hours'
                                ref={ref => this.textInputRef2 = ref}
                                underLineColor= "white" style={styles.inputIn}
                                onChange={(hour) => {this.hourChanging(hour.nativeEvent.text)}}
                            />


                            <TouchableOpacity>
                                <Button mode="contained" onPress={this.add} style={styles.button} >
                                    Press me
                                </Button>
                            </TouchableOpacity>

                        </View> :
                        <TouchableOpacity><IconButton
                            touch={true}
                            icon="add"
                            color='white'
                            size={70}
                            onPress={this.inputVisible.bind(this)} style={styles.add}
                            className='floating-button-icon'
                        />
                        </TouchableOpacity>}

                </KeyboardAvoidingView>

            </PaperProvider>
        );
    }
    addTask = () => {
        try {
            let dateToday = new Date();
            const date=dateToday.getDate() + "/"+ parseInt(dateToday.getMonth()+1) +"/"+ dateToday.getFullYear();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let activitys = this.state.activities;
            let task = {task:this.state.taskIn, hours:this.state.hour, done:false};
            if (activitys[0].dateIn === date)
            {
                activitys[0].taskObject.push(task)

            }
            else {
                let tasks = {taskObject:[{task:this.state.taskIn, hours:this.state.hour, done:false},], dateIn:date, day:days[dateToday.getDay()]};
                activitys.unshift(tasks);
            }
            this.setState({
                activities:activitys
            });
            AsyncStorage.setItem("activities", JSON.stringify(activitys));
            const acts = this.storeItem("activities", JSON.stringify(activitys))
        }
        catch (error) {
            Alert.alert("AN ERROR OCCUR")
        }
    };
    add(){
        try {
            this.textInputRef1.clear();
            this.textInputRef2.clear();
            this.setState({
                visible: false
            });
            Alert.alert(
                'ADD A TASK',
                'Are you sure you want to add the task?',
                [
                    {text: 'Yes', onPress: (this.addTask)},
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ],
                {cancelable: true},
            );
        }
        catch (error) {

        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: 'white',
        backgroundColor: 'black',
        borderColor: 'darkblue',
        borderWidth: 2,

    },
    headIn: {
        // backgroundColor: 'purple',
    },

    lists: {
        color: 'white',
        borderColor: 'darkblue',
        borderWidth: 2,
        backgroundColor: 'darkgrey',
        borderRadius: 10,
        margin: 5,
    },

    list: {
        color: 'white',
        borderColor: 'darkblue',
        marginTop: 5,
        marginBottom: 5,
    },
    head: {
        fontSize: 18,
        color: 'brown',
        textAlign: 'center',
        marginBottom: 10,
        borderColor: 'darkblue'
    },
    inputIn: {
        width: 340,
        backgroundColor: 'grey',
        borderColor: 'darkblue',
        borderWidth: 1.5,
        margin: 5,
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        justifyContent: 'center',
        width: 340,
        marginTop: 10,
        left: 10,
        marginBottom: 10,
    },
    add: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: 70,
        height: 70,
        borderColor: 'white',
        backgroundColor: 'brown',
        borderRadius: 100
    },
    clear: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        borderColor: 'darkblue',
        backgroundColor: 'red',
        borderRadius: 100
    },
    done: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: 30,
        height: 30,
        borderColor: 'darkblue',
        borderWidth: 1,
        backgroundColor: 'green',
        borderRadius: 100
    },
    appBar: {
        backgroundColor: 'black',
        borderColor: 'darkblue',
        borderWidth: 2,
    }
});
