import React from "react";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Footer from "./components/Footer";

import "./style.css"; // your full CSS

function App() {
    return (
        <CartProvider>
            <Navbar />
            <Home />
            <Footer />
        </CartProvider>
    );
}

export default App;
