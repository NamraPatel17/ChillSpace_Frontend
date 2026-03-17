import React, { useEffect, useState } from "react";
import axios from "axios";

export const Home = () => {

  const [properties,setProperties] = useState([])

  const getProperties = async()=>{
    try{

      const res = await axios.get("/property")

      setProperties(res.data)

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getProperties()
  },[])

  return (
    <div>

      {/* HERO SECTION */}
      <div className="bg-blue-500 text-white p-10 rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Perfect Stay 🏡
        </h1>

        <p className="mb-6">
          Discover amazing places to stay with ChillSpace
        </p>

        <input
          type="text"
          placeholder="Search city or property..."
          className="p-3 rounded-lg text-black w-full md:w-1/3"
        />
      </div>

      {/* PROPERTY LIST */}
      <h2 className="text-2xl font-bold mb-6">
        Popular Properties
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {properties.map((property)=>{

          return(

            <div
              key={property._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >

              {/* IMAGE */}
              <img
                src={property.image || "https://picsum.photos/400"}
                alt="property"
                className="w-full h-48 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4">

                <h3 className="text-lg font-semibold">
                  {property.title}
                </h3>

                <p className="text-gray-500">
                  {property.location}
                </p>

                <p className="text-blue-500 font-bold mt-2">
                  ₹{property.price} / night
                </p>

                <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full">
                  View Details
                </button>

              </div>

            </div>

          )

        })}

      </div>

    </div>
  );
};