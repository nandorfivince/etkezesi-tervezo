import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ onClose, onSave, profile }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    age: '',
    allergies: '',
    favoriteFoods: '',
    dislikedFoods: '',
    goals: '',
    weight: '',
    height: '',
    activity: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    onSave(profileData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">X</button>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Név:</label>
            <input type="text" name="name" value={profileData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Neme:</label>
            <input type="text" name="gender" value={profileData.gender} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Kora években:</label>
            <input type="number" name="age" value={profileData.age} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Ismert étel érzékenység, allergia:</label>
            <input type="text" name="allergies" value={profileData.allergies} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Kedvenc ételei:</label>
            <input type="text" name="favoriteFoods" value={profileData.favoriteFoods} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Ételek amiket nem szeret:</label>
            <input type="text" name="dislikedFoods" value={profileData.dislikedFoods} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Célok:</label>
            <input type="text" name="goals" value={profileData.goals} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Súly kg-ban:</label>
            <input type="number" name="weight" value={profileData.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Magasság cm-ben:</label>
            <input type="number" name="height" value={profileData.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mozgási tevékenység, sport:</label>
            <input type="text" name="activity" value={profileData.activity} onChange={handleChange} />
          </div>
          <button type="button" onClick={handleSave} className="save-button">Mentés</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
