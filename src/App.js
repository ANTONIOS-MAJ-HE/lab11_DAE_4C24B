import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentIndex: null,
      title: 'Nuevo',
      id: 0,
      name: '',
      username: '',
      email: '',
      city: ''
    };
  }

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  showUser = (id, index) => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => {
        const { name, username, email, address } = res.data;
        this.setState({
          currentIndex: index,
          title: 'Editar',
          id: res.data.id,
          name: name,
          username: username,
          email: email,
          city: address.city
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  saveUser = (e) => {
    e.preventDefault();
    const { id, name, username, email, city } = this.state;
    const data = {
      name: name,
      username: username,
      email: email,
      address: {
        city: city
      }
    };

    if (id > 0) { // Editar un usuario existente
      axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, data)
        .then(res => {
          const { users, currentIndex } = this.state;
          const updatedUsers = [...users];
          updatedUsers[currentIndex] = res.data;
          this.setState({
            currentIndex: null,
            title: 'Nuevo',
            id: 0,
            name: '',
            username: '',
            email: '',
            city: '',
            users: updatedUsers
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else { // Agregar un nuevo usuario
      axios.post('https://jsonplaceholder.typicode.com/users', data)
        .then(res => {
          const { users } = this.state;
          this.setState({
            id: 0,
            name: '',
            username: '',
            email: '',
            city: '',
            users: [...users, res.data]
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  deleteUser = (id) => {
    const confirmDelete = window.confirm('¿Desea eliminar?');
    if (confirmDelete) {
      axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(() => {
          const { users } = this.state;
          const updatedUsers = users.filter(user => user.id !== id);
          this.setState({
            users: updatedUsers
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const { users, title, name, username, email, city } = this.state;

    return (
      <div>
        <h1>Lista de usuarios</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.address.city}</td>
                <td>
                  <button onClick={() => this.showUser(user.id, index)}>Editar</button>
                  <button onClick={() => this.deleteUser(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h1>{title}</h1>
        <form onSubmit={this.saveUser}>
          <input type="hidden" value={this.state.id} />
          <p>
            Ingrese nombre:
            <input type="text" name="name" value={name} onChange={this.handleChange} />
          </p>
          <p>
            Ingrese nombre de usuario:
            <input type="text" name="username" value={username} onChange={this.handleChange} />
          </p>
          <p>
            Ingrese email:
            <input type="email" name="email" value={email} onChange={this.handleChange} />
          </p>
          <p>
            Ingrese ciudad:
            <input type="text" name="city" value={city} onChange={this.handleChange} />
          </p>
          <p>
            <input type="submit" value="Guardar" />
          </p>
        </form>
      </div>
    );
  }
}

export default App;
