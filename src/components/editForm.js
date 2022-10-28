import { useEffect, useState } from "react";


export default function EditForm({ formData, handleEditData, editOption }) {

    const [taskData, setTaskData] = useState({
        task_name: "",
        date: "",
        status: "",
        task_id: ""
    })

    useEffect(() => {
        // set the selected row data to the table.
        setTaskData({ ...formData });
    }, [])

    function handleChange(event) {
        event.preventDefault();
        setTaskData({ ...taskData, [event.target.name]: event.target.value });
    }

    return (
        <div>
            <h4>Edit Task Information</h4>
            
            <div>
                <form onSubmit={(e) => { handleEditData(e, taskData, editOption) }} className="input-group mb-3">
                    <input type="text" className="form-control" name="task_name" value={taskData.task_name} onChange={(e) => handleChange(e)} />
                    <input type="date" className="form-control" name="date" value={taskData.date} onChange={(e) => handleChange(e)} />
                    <select name="status" className="form-control" id={taskData.task_id} defaultValue={formData.status} onChange={e => handleChange(e)}>
                        <option value="Completed">Completed</option>
                        <option value="In Complete">In-Complete</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    )

}