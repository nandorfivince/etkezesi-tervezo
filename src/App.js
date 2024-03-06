import React, { useState } from 'react';
import './App.css';
import Modal from './Modal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

function App() {
  const [profiles, setProfiles] = useState([
    {
    name: 'Zsíros Lajos',
    gender: 'Férfi',
    age: '54',
    allergies: 'krumpli, cukor, glutén, mogyoró, kagylófélék',
    favoriteFoods: 'marha hús, csicseriborsó, pizza',
    dislikedFoods: 'édesburgonya, sütőtök, tej',
    goals: 'hízni',
    weight: '59',
    height: '177',
    activity: 'nincs'
  },
  {
    name: 'Fitty Panka',
    gender: 'Nő',
    age: '28',
    allergies: 'laktóz, mogyoró',
    favoriteFoods: 'saláták',
    dislikedFoods: 'zsíros ételek',
    goals: 'izmosodás',
    weight: '55',
    height: '162',
    activity: 'ülőmunka heti 4-szer kocogás'
  },
  {
    name: 'Dömper Dani',
    gender: 'Férfi',
    age: '40',
    allergies: 'glutén, laktóz',
    favoriteFoods: 'marha pörkölt, pacal pörkölt, sült császárszalonna',
    dislikedFoods: 'zeller, saláta, gyömbér',
    goals: 'fogyás',
    weight: '120',
    height: '175',
    activity: 'ülőmunka'
  }
]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableProfile, setEditableProfile] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [content, setContent] = useState('');
  const [lastSuggestionResponse, setLastSuggestionResponse] = useState('');

  const handleOpenModal = (profile = null) => {
    setEditableProfile(profile);
    setIsModalOpen(true);
  };

  const addProfile = (profile) => {
    if (editableProfile) {
      setProfiles(profiles.map(p => p.name === editableProfile.name ? profile : p));
    } else {
      setProfiles([...profiles, profile]);
    }
    setEditableProfile(null);
    setIsModalOpen(false);
  };

  const deleteProfile = (profileName) => {
    setProfiles(profiles.filter(profile => profile.name !== profileName));
  };

  const fetchSuggestions = async () => {
    console.log('Fetching suggestions...');
    const activeProfile = profiles.find(p => p.name === selectedProfile);
    if (!activeProfile) {
      alert('Kérjük, válasszon ki egy profilt a javaslatok előtt.');
      return;
    }

    const messages = [
      {
        "role": "system",
        "content": "Egy segítőkész asszisztens vagy aki csakis annyit válaszol és olyan formában ahogyan a felhasználó kéri."
      },
      {
        "role": "user",
        "content": `Válaszolj 3 ételnek a nevével a megadott profil paraméterek alapján(Például: Leves: Krumplileves, 
          Főétel: csirke saslátával, Desszert: gyümölcs saláta). Magyar nyelven írj. Legyél étkezési szakértő-dietetikus 
          és legyél rövid tömör és legyél pragmatikus. A személy profilja akire tervezned kell a 3 ételt: 
          Neve: ${activeProfile.name}; Neme: ${activeProfile.gender}; Kora években: ${activeProfile.age}; 
          Ismert étel érzékenység; allergia: ${activeProfile.allergies}; Kedvenc ételei: ${activeProfile.favoriteFoods}; 
          Ételek amiket nem szeret: ${activeProfile.dislikedFoods}; Célok: ${activeProfile.goals}; Súlya: ${activeProfile.weight}kg; 
          Magasság: ${activeProfile.height}cm; Mozgási tevékenység, sport: ${activeProfile.activity}.`
      }
    ];
  
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`
        }
      });
  
      console.log(response.data.choices[0].message.content)
      setSuggestions(response.data.choices[0].message.content);
      setLastSuggestionResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Hiba történt a javaslatok lekérdezése közben', error);
    }
  };

  const fetchSoup = async () => {
    console.log('Fetching soup...');
    const messages = [
      {
        "role": "system",
        "content": "Egy segítőkész asszisztens vagy aki csakis annyit válaszol és olyan formában ahogyan a felhasználó kéri."
      },
      {
        "role": "user",
        "content": `Csak is a levesre koncentrálj. Semmi másra! Válaszodban adj meg egy általad jónak gondolt receptet ebben 
        a szövegben talált leveshez. Válasz formátum: Leves neve, hozzávalók, elkészítés módja. 
        A szöveg amiből a leveshez kell receptet készítened: ${lastSuggestionResponse}`
      }
    ];
  
    try {
      const soupResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`
        }
      });
      console.log(soupResponse.data.choices[0].message.content)
      setContent(soupResponse.data.choices[0].message.content);
    } catch (error) {
      console.error('Hiba történt a javaslatok lekérdezése közben', error);
    }
  };

  const fetchMainDish = async () => {
    console.log('Fetching main dish...');
    const messages = [
      {
        "role": "system",
        "content": "Egy segítőkész asszisztens vagy aki csakis annyit válaszol és olyan formában ahogyan a felhasználó kéri."
      },
      {
        "role": "user",
        "content": `Csak is a főételre koncentrálj. Semmi másra! Válaszodban adj meg egy általad jónak gondolt receptet ebben 
        a szövegben talált főételhez. Válasz formátum: Főétel neve, hozzávalók, elkészítés módja. 
        A szöveg amiből a leveshez kell receptet készítened: ${lastSuggestionResponse}`
      }
    ];
    try {
      const mainDishResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`
        }
      });
      console.log(mainDishResponse.data.choices[0].message.content)
      setContent(mainDishResponse.data.choices[0].message.content);
    } catch (error) {
      console.error('Hiba történt a javaslatok lekérdezése közben', error);
    }
  };

  const fetchDessert = async () => {
    console.log('Fetching dessert...');
    const messages = [
      {
        "role": "system",
        "content": "Egy segítőkész asszisztens vagy aki csakis annyit válaszol és olyan formában ahogyan a felhasználó kéri."
      },
      {
        "role": "user",
        "content": `Csak is a desszertre koncentrálj. Semmi másra! Válaszodban adj meg egy általad jónak gondolt receptet ebben a szövegben talált desszerthez. Válasz formátum: Desszert neve, hozzávalók, elkészítés módja. A szöveg amiből a leveshez kell receptet készítened: ${lastSuggestionResponse}`
      }
    ];
    try {
      const dessertResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: messages,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`
        }
      });
      console.log(dessertResponse.data.choices[0].message.content)
      setContent(dessertResponse.data.choices[0].message.content);
    } catch (error) {
      console.error('Hiba történt a javaslatok lekérdezése közben', error);
    }
  };

  return (
    <div className="App">
      <aside className="left-sidebar">
        <div className="profile-section">
          <div className="profile-header">Profilok</div>
          <button onClick={() => handleOpenModal()} className="add-profile-button">
            <FaPlus />
          </button>
          <div className="profiles-list">
            {profiles.map((profile, index) => (
              <div key={index} className={`profile-item ${profile.name === selectedProfile ? 'selected-profile' : ''}`} onClick={() => setSelectedProfile(profile.name)}>
                <span className="profile-name">
                  {profile.name}
                </span>
                <FaEdit onClick={() => handleOpenModal(profile)} />
                <FaTrash onClick={() => deleteProfile(profile.name)} />
              </div>
            ))}
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1 className="question" onClick={fetchSuggestions}>
            Mit együnk ma?
          </h1>
        </header>
        <section className="suggestions-section">
          <div className="container">
            <div className="box" onClick={() => fetchSoup()}>Leves receptje</div>
            <div className="box" onClick={() => fetchMainDish()}>Főétel receptje</div>
            <div className="box" onClick={() => fetchDessert()}>Desszert receptje</div>
          </div>
          <div className="suggestions-box">Javasolt ételek leírása: {suggestions}</div>
        </section>
      </main>
      <aside className="right-sidebar">
        <div className="tall-box">A választott étel recepje, elkészítési módja: {content}</div>
      </aside>
      {isModalOpen && (
        <Modal
          profile={editableProfile}
          onClose={() => setIsModalOpen(false)}
          onSave={addProfile}
        />
      )}
    </div>
  );
}

export default App;
