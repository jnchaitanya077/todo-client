import React, { useState, useEffect } from "react";

import { sendApiRequest } from "../utils/helper";

import InputField from "../components/input";
import Table from "../components/list";

import HOST from "..";



function TodoList({ authorization, logout, systemAlert }) {

    const [todoData, setTodo] = useState([]);

    useEffect(() => {

        async function fetchData(params) {

            const data = await sendApiRequest({
                method: 'GET',
                url: HOST + '/task',
                params: {
                    user_id: localStorage.getItem('user_id')
                }
            });

            if (data.data.tasks) setTodo(data.data.tasks);

        }

        fetchData()

    }, [])

    async function handleNewTask(taskName, date) {

        const config = {
            method: 'POST',
            url: HOST + '/task/create',
            data: {
                task_name: taskName,
                date: date
            }
        }

        const response = await sendApiRequest(config);

        console.log(response);

        if (response.status === 440) {
            // alert user before logout.
            systemAlert({ message: "Session Expired. Please login", type: "alert" });
            // if response code is 440 set authorization to false.
            authorization(false);
        }
        else if (response.status === 200 && response.data.status) {
            // add new task to the list and update the state.
            setTodo((prevState) => [...prevState, response.data.data[0]]);

        }
    }

    async function handleDelete(id) {

        const config = {
            method: 'DELETE',
            url: HOST + '/task/',
            data: {
                task_id: id
            }
        };

        const response = await sendApiRequest(config);

        console.log(response);

        if (response.status === 440) {
            // alert user before logout.
            systemAlert({ message: "Session Expired. Please login", type: "alert" });
            // if response code is 440 set authorization to false.
            authorization(false);
        }
        else if (response.status === 200 && response.data.status) {
            // add new task to the list and update the state.
            setTodo(todoData.filter((task) => id !== task._id));
        }


    }

    async function handleUpdate(event, data, setEdit) {
        event.preventDefault();

        const { _id, task_name, status, date } = data;

        const config = {
            method: 'PATCH',
            url: HOST + '/task',
            data: {
                task_id: _id,
                task_name: task_name,
                date: date,
                status: status
            }
        }

        const response = await sendApiRequest(config);

        console.log(response)

        if (response.status === 440) {
            // alert user before logout.
            systemAlert({ message: "Session Expired. Please login", type: "alert" });
            // if response code is 440 set authorization to false.
            authorization(false);
        }
        else if (response.status === 200 && response.data.status) {

            let data = response.data.data;
            // update the data 
            for (let index = 0; index < todoData.length; index++) {
                if (todoData[index]._id === data._id) {
                    console.log("found");
                    todoData[index].task_name = data.task_name;
                    todoData[index].status = data.status;
                    todoData[index].date = data.date;
                    break;
                }
            }
            // set the editing to false to display all the tasks.
            setEdit(false);
            // set the updated list to the state
            setTodo(todoData);

        }

    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm p-2">
                    <h1>Welcome</h1>
                </div>
                <div className="col-sm">
                    <button type="button" className="btn btn-outline-danger m-3 float-end" onClick={(e) => { logout(e) }}>Logout</button>
                </div>
                <hr />
                <InputField handleNewTask={handleNewTask} systemAlert={systemAlert} />
                <hr />
                <Table data={todoData} remove={handleDelete} edit={handleUpdate} systemAlert={systemAlert} />
            </div>
        </div>
    )

}

export default TodoList