import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', type: 'tool', borrower: '', borrowed: false });

  useEffect(() => {
    axios
      .get('http://steffohost.hopto.org:3000/api/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  const borrowItem = async (id) => {
    const borrower = prompt('Enter the name of the person borrowing the item:');
    if (borrower) {
      try {
        const response = await axios.post(`http://steffohost.hopto.org:3000/api/items/borrow/${id}`, { borrower });
        setItems(items.map(item => item._id === id ? response.data : item));
      } catch (error) {
        console.error('Error borrowing item:', error);
      }
    }
  };

  const returnItem = async (id) => {
    try {
      const response = await axios.post(`http://steffohost.hopto.org:3000/api/items/return/${id}`);
      setItems(items.map(item => item._id === id ? response.data : item));
    } catch (error) {
      console.error('Error returning item:', error);
    }
  };

  const addItem = async () => {
    if (newItem.name.trim() === '') {
      alert('Please enter a tool name');
      return;
    }

    try {
      const response = await axios.post('http://steffohost.hopto.org:3000/api/items', newItem);
      const updatedItems = [...items, response.data];
      updatedItems.sort((a, b) => a.name.localeCompare(b.name));
      setItems(updatedItems);
      setNewItem({ name: '', type: 'tool', borrower: '', borrowed: false });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://steffohost.hopto.org:3000/api/items/${id}`);
      setItems(items.filter(item => item._id !== id));
      alert('Item removed');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="App">
      <h1>UTLÅNING AV VERKTYG</h1>

    {/*   <div className="add-item-form">
        <h3>Lägg till ett nytt Verktygsnamn:</h3>
        <input
          type="text"
          placeholder="Verktygsnamn"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <button onClick={addItem}>Lägg till verktyg</button>
      </div>*/}

      <div>
        {items.map((item) => (
          <div key={item._id} className="item">
            <div>
              <h3>{item.name}</h3>
              <p>{item.borrowed ? `Lånad av: ${item.borrower}` : 'Tillgänglig'}</p>
            </div>
            <div>
              <button onClick={() => borrowItem(item._id)} disabled={item.borrowed}>
                Låna
              </button>
              <button onClick={() => returnItem(item._id)} disabled={!item.borrowed}>
                Lämna tillbaka
              </button>
            {/*   <button onClick={() => deleteItem(item._id)} className="delete-btn">
                Ta bort 
              </button>*/}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
