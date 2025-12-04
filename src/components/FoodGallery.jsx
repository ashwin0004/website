import React, { useEffect, useState } from "react";

const FoodGallery = () => {
  const [meals, setMeals] = useState([]);

  const fetchMeals = async (query = "pizza") => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    setMeals(data.meals || []);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <>
      <div className="food-gallery" id="food-container">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="food-card">
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h3>{meal.strMeal}</h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default FoodGallery;
