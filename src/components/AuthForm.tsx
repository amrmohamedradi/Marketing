import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;