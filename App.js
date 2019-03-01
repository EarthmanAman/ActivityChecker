import React from 'react';
import { StyleSheet,AsyncStorage, Text, View, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Appbar, Button, Provider as PaperProvider, TextInput, IconButton, RadioButton, List} from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';

export default class App extends React.Component {

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
            hour: '',
            taskIn: '',
            all: false,
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
    let taskIn = [];
    const acts = this.storeItem("activities", taskIn);
    this.setState({
        activities: taskIn,
    });
});
}
catch (e) {
    let taskIn = [];
    const acts = this.storeItem("activities", taskIn);
    this.setState({
        activities: taskIn,
    });
    Alert.alert("ERROR OCCUR")
}}

changed(text){
    try {
        if (text !== ""){
        this.setState({
            taskIn: text,
        })}
        else {
            Alert.alert("The task cannot be EMPTY")
        }
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
            activities: []
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

done = (index, even) => {
    let activs = this.state.activities;
    for(let i=0; i<=activs[0].taskObject.length; i++)
    {
        if(i === parseInt(even)){
            activs[index].taskObject[i].done = true;
            break
        }
    }
    this.setState({
        activities: activs,
    });
    const acts = this.storeItem("activities", JSON.stringify(activs))
};

unDone = (index, even) => {
    let activs = this.state.activities;
    for(let i=0; i<=activs[0].taskObject.length; i++)
    {
        if(i === parseInt(even)){
            activs[index].taskObject[i].done = false;
            break
        }
    }
    this.setState({
        activities: activs,
    });
    const acts = this.storeItem("activities", JSON.stringify(activs))
};

remove = (index, even) => {
    let activs = this.state.activities;
    activs[index].taskObject.splice(parseInt(even), 1);
    this.setState({
        activities: activs,
    });
    const acts = this.storeItem("activities", JSON.stringify(activs))
};

removeItem = (index, even, event) =>{
    event.preventDefault();
    Alert.alert(
        'Delete',
        'Are you sure you want to delete the task?',
        [
            {text: 'Yes', onPress: (()=> {this.remove(index, even)})},
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
    for (let j=0; j < acts.length; j++){
        for(let i=0; i<acts[j].taskObject.length; i++)
        {
            acts[j].taskObject[i].done = true;
        }
    }
    this.setState({
        activities:acts
    });
    const activity = this.storeItem("activities", JSON.stringify(acts))
};


clearTask = () => {
    this.setState({
        activities:[]
    });
    let acts = [];
    AsyncStorage.setItem("activities", JSON.stringify(acts));
};


    clearNotify = (event) => {
        event.preventDefault();
        Alert.alert(
            'Delete',
            'Are you sure you want to delete ALL the tasks?',
            [
                {text: 'Yes', onPress: (()=> {this.clearTask()})},
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
        );

    }



    all =() => {
    this.setState({
        all:true,
    })
};

single = () => {
    this.setState({
        all:false,
    })
};

render() {
    const {activities} = this.state;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const {visible} = this.state;
    var today = new Date();
    const date=today.getDate() + "/"+ parseInt(today.getMonth()+1) +"/"+ today.getFullYear();
    const day = days[today.getDay()];


    let data = [{
        value: 'Reminder',
    }, {
        value: 'Minutes',
    }, {
        value: 'Hours',
    }];

    return (
        <PaperProvider>

          <KeyboardAvoidingView behavior="padding" style={styles.container}>

              <Appbar.Header style={styles.appBar}>
                  <Appbar.Action icon="event" size={35}/>
                  <Appbar.Content
                      title="Activity Checker"
                      subtitle="For Easy Tracking"
                  />
                  <Appbar.Action icon="done-all" style={styles.done} color="white" onPress = {this.doneAll.bind(this)}/>
                  {(this.state.all === false) ? <Appbar.Action icon="delete" style={styles.clear} onPress = {this.clearNotify.bind(this)}/>:<Text> </Text>}
                  {(this.state.all === false)?  <Appbar.Action icon="redo" style={styles.done} onPress={this.all.bind(this)}/>:
                      <Appbar.Action icon="undo" style={styles.done} onPress={this.single.bind(this)}/>
                  }
              </Appbar.Header>
              {(this.state.all ===false) ? <Text style={styles.head}>{day} : {date}</Text>: <Text style={styles.head}>ALL THE TASKS </Text>}

              <ScrollView contentContainerStyle={{ paddingHorizontal: 40 }}>

                  <View>
                      { (this.state.all ===false ) ?
                      activities.map((activitys, index) => (
                          (activitys.dateIn === date) ?
                              activitys.taskObject.map((tasks, key) =>
                              (tasks.done === false) ?
                                <List.Item title={tasks.hours + " " + tasks.mode}
                                   key={key} value={key}
                                   left={props => <IconButton {...props} icon="schedule" size={30} color='darkblue' touch={true} />}
                                   right={props => <IconButton {...props} icon="panorama-fish-eye" color='green' size={30}
                                            touch={true}
                                            onPress={() => {this.done(index, key)}} />}
                                   style={styles.lists}
                                   description={tasks.task}
                                   onPress={(event) => {this.removeItem(index, key, event)}}/>:

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
                                             onPress={() => {this.unDone(index, key)}}
                                         />}
                                 style={styles.lists}
                                 description={tasks.task} onPress={(event) => {this.removeItem(index, key, event)}}
                              /> )
                     : <Text key={index}> </Text>
                          )
                      ):
                          activities.map((activitys, index) => (
                              activitys.taskObject.map((tasks, key) =>
                                  (tasks.done === false) ?
                                      <List.Item title={activitys.day}
                                                 key={key} value={key}
                                                 left={props => <IconButton {...props} icon="schedule" size={30} color='darkblue' touch={true} />}
                                                 right={props => <IconButton {...props} icon="panorama-fish-eye" color='green' size={30}
                                                                             touch={true}
                                                                             onPress={() => {this.done(index, key)}} />}
                                                 style={styles.lists}
                                                 description={tasks.task}
                                                 onPress={(event) => {this.removeItem(index, key, event)}}/>:

                                      <List.Item
                                          title={activitys.day}
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
                                              onPress={() => {this.unDone(index, key)}}
                                          />}
                                          style={styles.lists}
                                          description={tasks.task} onPress={(event) => {this.removeItem(index, key, event)}}
                                      /> )
                              )
                          )
                      }

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

                      <Dropdown
                          label='Time Mode'
                          data={data}
                          fontSize= {22}
                          baseColor='white'
                          itemColor='blue'
                          textColor='green'
                          containerStyle={styles.dropdown}
                          selectedItemColor='green'
                          onChangeText={(text) => {this.setState({mode:text, hour: ''})}}
                          style={styles.dropdown}
                      />

                      <TextInput
                          mode= "flat(focused)"
                          placeholder='Add Task'
                          ref={ref => this.textInputRef1 = ref}
                          underLineColor= "white" style={styles.inputIn}
                          onChange={(hour) => {this.changed(hour.nativeEvent.text)}}
                      />
                      {(this.state.mode === 'Reminder') ?
                      <TextInput
                          mode= "flat(focused)"
                          placeholder='Add Time'
                          disabled={true}
                          ref={ref => this.textInputRef2 = ref}
                          underLineColor= "white" style={styles.inputIn}
                          onChange={(hour) => {this.hourChanging(hour.nativeEvent.text)}}
                      />:
                      <TextInput
                          mode= "flat(focused)"
                          placeholder='Add Time'
                          ref={ref => this.textInputRef2 = ref}
                          underLineColor= "white" style={styles.inputIn}
                          onChange={(hour) => {this.hourChanging(hour.nativeEvent.text)}}
                      />}
                      <TouchableOpacity>
                          <Button mode="contained" onPress={this.add} style={styles.button} >
                             ADD
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
            if (this.state.taskIn !== '' && this.state.mode !==''){
            let dateToday = new Date();
            const date=dateToday.getDate() + "/"+ parseInt(dateToday.getMonth()+1) +"/"+ dateToday.getFullYear();
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let activitys = this.state.activities;
            let task = {task:this.state.taskIn, hours:this.state.hour, done:false, mode:this.state.mode};
            if (activitys.length >= 1){
            if (activitys[0].dateIn === date && activitys.length >=1)
            {
                activitys[0].taskObject.push(task)

            }
            else {
                let tasks = {taskObject:[{task:this.state.taskIn, hours:this.state.hour, done:false, mode:this.state.mode},],
                    dateIn:date,
                    day:days[dateToday.getDay()]};
                if (activitys.length < 1)
                {
                    activitys.push(tasks);
                }
                else {
                    activitys.unshift(tasks)
                }
            }}
            else {
                let tasks = {taskObject:[{task:this.state.taskIn, hours:this.state.hour, done:false, mode:this.state.mode},], dateIn:date, day:days[dateToday.getDay()]};
                    activitys.push(tasks)
            }
            this.setState({
                activities:activitys,
                mode: '',
                hour: '',
                taskIn: '',

            });
            AsyncStorage.setItem("activities", JSON.stringify(activitys));
            const acts = this.storeItem("activities", JSON.stringify(activitys))

        }
        else {
                Alert.alert(
                    'ERROR',
                    'Task OR Time Mode Cannot be EMPTY',
                    [
                        {text: 'Okay'},
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                    ],
                    {cancelable: true},
                );
            }
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

// const AppNavigator = createStackNavigator(
//     {
//         home: App,
//         allTask: AllTask
//     },
//     {
//         initialRouteName: "home"
//     }
// );
//
// export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
      backgroundColor: 'black',
      borderColor: 'darkblue',
      borderWidth: 2,

  },

dropdown : {
  width:270,
  marginLeft: 50,
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
    fontSize: 20,
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
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
  },

    listIn: {
      borderColor: 'white',
      borderWidth: 1.5,
     borderRadius: 20
  }
});
