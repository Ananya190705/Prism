import React from "react";
import prismLogo from "./prism_logo.jpg";
import { motion } from "framer-motion";

const Welcome = ({ onLoginClick = () => {} }) => {
  const title = "Welcome to Prism!";
  const letters = title.split("");

  return (
    <div className="welcome-bg">
      <motion.div
        className="welcome-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.img
          src={prismLogo}
          alt="Prism Logo"
          className="welcome-logo"
          initial={{ rotate: -10, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Animated Title */}
        <motion.h1
          className="welcome-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {letters.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </motion.h1>

        {/* ✅ Login Button */}
        <motion.button
          className="welcome-login-button"
          onClick={onLoginClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome;
