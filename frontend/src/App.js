import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

//för att koppla lokal kod till git :::::::::: git remote add origin https://github.com/steffosteffo/my-react-appVerk.git
// för att hitta programmet på nätet:::::::::: http://steffohost-hopto.org:3000/my-react-appVerk


const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', type: 'tool', borrower: '', borrowed: false });

  // Fetch items when component mounts
  useEffect(() => {
    axios
      //.get('http://localhost:3000/api/items')
      .get('http://steffohost.hopto:3001/api/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  // Borrow an item
  const borrowItem = async (id) => {
    const borrower = prompt('Enter the name of the person borrowing the item:');
    if (borrower) {
      try {
      //const response = await axios.post(`http://localhost:3000/api/items/borrow/${id}`, { borrower });
        const response = await axios.post(`http://steffohost.hopto.org:3000/api/items/borrow/${id}`, { borrower });
        setItems(items.map(item => item._id === id ? response.data : item)); // Update the item in state
      } catch (error) {
        console.error('Error borrowing item:', error);
      }
    }
  };

  // Return an item
  const returnItem = async (id) => {
    try {
      //const response = await axios.post(`http://localhost:3000/api/items/return/${id}`);
      const response = await axios.post(`http://steffohost.hopto.org:3000/api/items/return/${id}`);
      setItems(items.map(item => item._id === id ? response.data : item)); // Update the item in state
    } catch (error) {
      console.error('Error returning item:', error);
    }
  };

  
  const addItem = async () => {
    if (newItem.name.trim() === '') {
      alert('Skriv ett verktygsnamn v3');
      return;
    }
  
    try {
      //const response = await axios.post('http://localhost:3000/api/items', newItem);
      const response = await axios.post('http://steffohost.hopto.org:3000/api/items', newItem);
      
      // Add the new item to the state
      const updatedItems = [...items, response.data];
  
      // Sort the items alphabetically by name (or modify to any sorting logic you prefer)
      updatedItems.sort((a, b) => a.name.localeCompare(b.name));
  
      // Update the state with the sorted items
      setItems(updatedItems);
  
      // Reset form after submission
      setNewItem({ name: '', type: 'tool', borrower: '', borrowed: false });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };



  // Delete an item
  const deleteItem = async (id) => {
    try {
     // await axios.delete(`http://localhost:3000/api/items/${id}`);
     await axios.delete(`http://steffohost.hopto.org:3000/api/items/${id}`);
      setItems(items.filter(item => item._id !== id)); // Remove the item from state
      alert('Verktyg togs bort');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="App">
      <h1>Utlån av verktyg</h1>

      {/* Form to add new item */}
      <div className="add-item-form">
        <h3>Nytt verktyg att lägga till:</h3>
        <input
          type="text"
          placeholder="Tool Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <button onClick={addItem}>Lägg till</button>
      </div>

      {/* List of items */}
      <div>
        {items.map((item) => (
          <div key={item._id} className="item">
            <h3>{item.name}</h3>
            <p>{item.borrowed ? `Lånad av: ${item.borrower}` : 'Tillgänglig'}</p>
            <button onClick={() => borrowItem(item._id)} disabled={item.borrowed}>
              Låna
            </button>
            <button onClick={() => returnItem(item._id)} disabled={!item.borrowed}>
              Återlämna
            </button>
            <button onClick={() => deleteItem(item._id)} className="delete-btn">
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
