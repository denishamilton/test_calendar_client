import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

function App() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7777/meals')
      .then(response => {
        const formattedMeals = response.data.map(meal => ({
          title: `${meal.meal1} / ${meal.meal2}`,
          date: meal.date,
          id: meal.id,
          meal1: meal.meal1,
          meal2: meal.meal2,
          selectedMeal: meal.selectedMeal
        }));
        setMeals(formattedMeals);
      })
      .catch(error => {
        console.error('There was an error fetching the meals!', error);
      });
  }, []);

  const handleDateClick = (info) => {
    const meal = meals.find(meal => meal.date === info.dateStr);
    if (meal) {
      const selectedOption = prompt(`Select a meal:\n1. ${meal.meal1}\n2. ${meal.meal2}`);
      let selectedMeal;
      if (selectedOption === '1') {
        selectedMeal = meal.meal1;
      } else if (selectedOption === '2') {
        selectedMeal = meal.meal2;
      }

      if (selectedMeal) {
        axios.post(`http://localhost:7777/meals/${meal.id}/select`, { selectedMeal })
          .then(response => {
            alert(`Selected meal: ${selectedMeal}`);
            setMeals(meals.map(m => m.id === meal.id ? { ...m, selectedMeal } : m));
          })
          .catch(error => {
            console.error('There was an error selecting the meal!', error);
          });
      } else {
        alert('Invalid selection');
      }
    } else {
      alert('No meal data available for this date');
    }
  };

  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={meals.map(meal => ({
          ...meal,
          title: `${meal.title} (Selected: ${meal.selectedMeal || 'None'})`
        }))}
        dateClick={handleDateClick}
      />
    </div>
  );
}

export default App;
