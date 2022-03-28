import {useEffect, useState} from 'react'
import axios from "axios"
import {format} from "date-fns"
import './App.css';

const baseURL = "http://localhost:5000"

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [userList, setUserList] = useState([])

  const fetchUsers = async () => {
    const data = await axios.get(`${baseURL}/users`)
    const {users} = data.data
    setUserList(users)
  }

  const handleNameChange = e => {
    setName(e.target.value)
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const data = await axios.post(`${baseURL}/users/new`, {name, email})
      setUserList([...userList, data.data])
      setName('')
      setEmail('')
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
          <label htmlFor='email'>Email</label>
          <input
            onChange={handleEmailChange}
            type="text"
            name="email"
            id="email"
            value={email}
          />
          <button type="submit">Submit</button>
        </form>
        <section>
          <ul>
            {userList.map( user => {
              return(
                <li style={{display: "flex"}} key={user.id}>
                  {user.name}
                  <button onClick={ () => handleDelete(user.id)}>X</button>
                </li>
              )
            })}
          </ul>
        </section>
      </header>
    </div>
  );
}

export default App;
