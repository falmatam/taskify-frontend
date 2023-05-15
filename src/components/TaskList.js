import TaskForm from "./TaskForm";
import Task from "./Task";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { URL } from "../App";
import loadingImg from '../assets/loader.gif';


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [taskID, setTaskID] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        completed: false
    })

    const {name} = formData;


    const getTasks = async () => {
        setIsLoading(true)
        try{
            const {data} = await axios.get(`${URL}/api/tasks`);
            setTasks(data);
            setIsLoading(false);
        }
        catch(err){
            toast.error(err.message);
            console.log(err);
            setIsLoading(false);
        }
    }

    
    useEffect(() => {
        getTasks()
    }, []);


    const deleteTask = async (id) => {
        try{
            await axios.delete(`${URL}/api/tasks/${id}`);
            getTasks();
        }
        catch(err){
            toast.error(err.message);
        }
    }

    useEffect(() => {
        const completed = tasks.filter((task) => {
            return task.completed === true;
        })
        setCompletedTasks(completed);
    }, [tasks]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    
    const createTask = async (e) => {
        e.preventDefault();
        if(name === ""){
            return toast.error("Input field cannot be empty");
        }
        try{
            await axios.post(`${URL}/api/tasks`, formData);
            toast.success("Task added successfully");
            setFormData({...formData, name:""});
            getTasks();
        }
        catch(err){
            toast.error(err.message);
        }
    }

    const getSingleTask = async (task) => {
        setFormData({name:task.name, completed:false});
        setTaskID(task._id);
        setIsEditing(true);
    }
    

    const updateTask = async (e) => {
        e.preventDefault()
        if(name === ""){
            return toast.error("Input field cannot be empty");
        }
        try{
            await axios.put(`${URL}/api/tasks/${taskID}`, formData); //grabbing from current state in input, then UPDATING db at specific id 
            toast.success("Task edited successfully");
            setFormData({...formData, name:""});//clears the form
            setIsEditing(false);
            getTasks();
        }
        catch(err){
            toast.error(err.message);
        }
    }

    const markComplete = async (task) => {
        const newFormData = {
            name: task.name,
            completed: true,
        }
        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
            getTasks();
        } catch (err) {
            toast.error(err.message);
        }
    }
    


    return (
        <div>
           <h2>Task Manager</h2> 
           <TaskForm 
                name={name} 
                handleInputChange={handleInputChange}
                createTask={createTask}
                isEditing={isEditing}
                updateTask={updateTask}
            />
           {tasks.length > 0 && (
               <div className="--flex-between --pb">
                    <p>
                        <b>Total Tasks: </b> {tasks.length}
                    </p>
                    <p>
                        <b>Completed Tasks: </b> {completedTasks.length}
                    </p>
                </div>
           )}
           <hr />
           {isLoading && (
               <div className="--flex-center">
                   <img src={loadingImg} alt="loading" />
                </div>
           )}  
           {
               !isLoading && tasks.length === 0 ? (
                   <p className="--py">No task added. Please add a task.</p>
               ) : (
                   <>
                    {tasks.map((task, index) => {
                        return <Task 
                            key={task.id} 
                            task={task} 
                            index={index} 
                            deleteTask={deleteTask}
                            getSingleTask={getSingleTask}
                            markComplete={markComplete}
                        />;
                    })}
                   </>
               )
           } 
           
        </div>
    )
}

export default TaskList
