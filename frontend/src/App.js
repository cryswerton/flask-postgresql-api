import {useEffect, useState} from 'react'
import axios from "axios"
import {format} from "date-fns"
import './App.css';
import { toBeInTheDocument } from '@testing-library/jest-dom/dist/matchers';

const baseURL = "http://localhost:5000"

function App() {
  const [name, setName] = useState('')
  const [editName, setEditName] = useState('')
  const [userId, setUserId] = useState(null)
  const [userList, setUserList] = useState([])

  const fetchUsers = async () => {
    const data = await axios.get(`${baseURL}/users`)
    const {users} = data.data
    setUserList(users)
  }

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleDelete = async (id) => {
    try{
      await axios.delete(`${baseURL}/users/delete/${id}`)
      const updatedList = userList.filter(user => user.id !== id)
      setUserList(updatedList)
    } catch(err){
      console.error(err.message)
    }
  }

  const toggleEdit = (user) => {
    setUserId(user.id)
    setEditName(user.name)
  }

  const handleChange = (e, field) => {
    if(field === 'edit'){
      setEditName(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if(editName){
        const data = await axios.put(`${baseURL}/users/update/${userId}`, {name: editName})
        const updatedUser = data.data.user
        const updatedList = userList.map(user => {
          if(user.id === userId){
            return user = updatedUser
          }
          return user
        })
        setUserList(updatedList)
        }else{
          const data = await axios.post(`${baseURL}/users/new`, {name})
          setUserList([...userList, data.data])
        }
        setName('')
        setEditName('')
        setUserId(null)
    }catch(err){
      console.error(err.message)
    }

  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}> 
          <label htmlFor='name'>Name</label>
          <input
            onChange={handleNameChange}
            type="text"
            name="name"
            id="name"
            value={name}
          />
          <button type="submit">Submit</button>
        </form>
        <section>
          <ul>
            {userList.map( user => {
              if(userId === user.id){
                return(
                  <li>
                    <form onSubmit={handleSubmit} key={user.id}>
                    <input
                      onChange={(e) => handleChange(e, 'edit')}
                      type="text"
                      name="editName"
                      id="editName"
                      value={editName}
                    />
                    <button type='submit'>Submit</button>
                    </form>
                  </li>
                )
              } else {
                return(
                  <li style={{display: 'flex'}} key={user.id}>
                    {user.name}
                    <button onClick={() => toggleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>X</button>
                  </li>
                )
              }
            })}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
