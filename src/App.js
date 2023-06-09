import { AiTwotoneDelete, AiTwotoneEdit, AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import Checkbox from '@mui/material/Checkbox';



function App() {
  const Todos = ({ todos }) => {
    return (
      <div className="todos">
        {todos.map((todo) => {
          return (

            <div className="todo" key={todo.id}>
              <Checkbox
                checked={todo.status}
                onChange={() => modifyStatusTodo(todo)}
                style={{ color: todo.status ? 'green' : 'white' }}
              />
              <p>{todo.id}</p>
              <p>{todo.name}</p>
              <p>{todo.description}</p>
              <p>{format(new Date(todo.date), "yyyy-MM-dd")}</p>
              <button onClick={() => handleWithEditButtonClick(todo)}>
                <AiTwotoneEdit size={20} className="buttonUpdate"></AiTwotoneEdit>
              </button>
              <button onClick={() => deleteTodo(todo)}>
                <AiTwotoneDelete size={20} color={"#64697b"}></AiTwotoneDelete>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  function handleWithNewButton() {
    setInputVisibility(!inputVisibility);
  }
  

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
    setInputValue(todo.name);
    setInputDescription(todo.description);
    const formattedDate = format(new Date(todo.date), "yyyy-MM-dd");
    setInputDate(formattedDate);
  }

  async function getTodos() {
    const response = await axios.get(`https://tasklist-api-hue5.onrender.com/init`);
    setTodos(response.data);
    console.log(response.data);
  }

  async function editTodo() {
    const { id } = selectedTodo;

    const response = await axios.put(`https://tasklist-api-hue5.onrender.com/init/${id}`, {
      name: inputValue,
      description: inputDescription,
      date: inputDate,
    });

    setSelectedTodo(null);
    setInputVisibility(false);
    getTodos();
    setInputValue("");
    setInputDescription("");
    setInputDate("");
  }

  async function deleteTodo(todo) {
    await axios.delete(`https://tasklist-api-hue5.onrender.com/init/${todo.id}`);
    setTodos(todos.filter((item) => item.id !== todo.id));
  }
  

  async function modifyStatusTodo(todo) {
    const updatedTodo = {
      ...todo,
      status: !todo.status,
    };

    const response = await axios.put(`https://tasklist-api-hue5.onrender.com/init/${todo.id}`, updatedTodo);
    getTodos();
  }

  async function createTodo() {
    const response = await axios.post(`https://tasklist-api-hue5.onrender.com/init`, {
      name: inputValue,
      description: inputDescription,
      date: inputDate,
    });
    getTodos();
    setInputVisibility(false);
    setInputValue("");
    setInputDescription("");
    setInputDate("");
  }
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputVisibility, setInputVisibility] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="App">
      <header className="container">
        <Todos todos={todos} />
        {inputVisibility && (
          <form>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Nome da tarefa"
              className="inputName"
            />
            <input
              value={inputDescription}
              onChange={(event) => setInputDescription(event.target.value)}
              placeholder="Descrição da tarefa"
              className="inputDescription"
            />
            <input
              type="date"
              value={inputDate}
              onChange={(event) => setInputDate(event.target.value)}
              placeholder="Data da tarefa"
              className="inputDate"
            />
            <button
              onClick={
                selectedTodo ? editTodo : createTodo
              }
              className="confirmButton"
            >
              {selectedTodo ? "Editar" : "Confirmar"}
            </button>
          </form>
        )}
        <button
          onClick={handleWithNewButton}
          className="newTaskButton"
        >
          {inputVisibility ? "Cancelar" : "+ Nova Tarefa"}
        </button>
      </header>
      <footer className="footer">
        <div className="social-buttons">
          <a href="https://www.linkedin.com/in/matheusvsm/" target="_blank" rel="noopener noreferrer">
            <button className="social-button linkedin">
              <AiFillLinkedin></AiFillLinkedin>
            </button>
          </a>
          <a href="https://github.com/Matheusvsm" target="_blank" rel="noopener noreferrer">
            <button className="social-button github">
              <AiFillGithub></AiFillGithub>
            </button>
          </a>
          <a href="https://wa.me/5585992829326" target="_blank" rel="noopener noreferrer">
            <button className="social-button whatsapp">
              <BsWhatsapp></BsWhatsapp>
            </button>
          </a>
        </div>
      </footer>

    </div>
  );
}

export default App;