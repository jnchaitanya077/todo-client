import { useState } from "react";

function InputField({handleNewTask, systemAlert}) {

    const [task, setTask] = useState("")
    const [date, setDate] = useState("")

    function validateFormInputs() {

        if(task && date) handleNewTask(task, date);
        else systemAlert({message:"Enter all the required fields", type: "alert"});
        
    }

    return (
        <div className="input-group mb-3">
            <input type="text" className="form-control" onChange={(e)=>{setTask(e.target.value)}} placeholder="Enter your task" />
            <input type="date" className="form-control" name="trip-start" onChange={(e)=>{setDate(e.target.value)}}/>
            <button className="btn btn-primary" type="button" onClick={()=>{validateFormInputs()}} >Create</button>
        </div>)

}

export default InputField;