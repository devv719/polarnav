import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './components/home/HomePage';
import MapPage from './pages/MapPage';
import ModulePage from './pages/ModulePage';

/* Page transition variants */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const pageTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

/* Sets html class for map route (enables overflow:hidden) */
function MapViewManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/map') {
      document.documentElement.classList.add('map-view');
    } else {
      document.documentElement.classList.remove('map-view');
    }
  }, [location.pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <MapViewManager />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* 1. Cinematic Homepage */}
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <HomePage />
              </motion.div>
            }
          />

          {/* 2. Antarctic GIS Map Dashboard */}
          <Route
            path="/map"
            element={
              <motion.div
                className="w-screen h-screen"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
              >
                <MapPage />
              </motion.div>
            }
          />

          {/* 3. Module pages */}
          <Route
            path="/sea-ice"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ModulePage type="sea-ice" />
              </motion.div>
            }
          />
          <Route path="/modules/sea-ice" element={<Navigate to="/sea-ice" replace />} />

          <Route
            path="/icebergs"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ModulePage type="icebergs" />
              </motion.div>
            }
          />
          <Route path="/modules/icebergs" element={<Navigate to="/icebergs" replace />} />

          <Route
            path="/routes"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ModulePage type="routes" />
              </motion.div>
            }
          />
          <Route path="/modules/routes" element={<Navigate to="/routes" replace />} />

          <Route
            path="/ocean"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ModulePage type="ocean" />
              </motion.div>
            }
          />
          <Route path="/modules/ocean" element={<Navigate to="/ocean" replace />} />
          <Route path="/modules/weather" element={<Navigate to="/ocean" replace />} />
          <Route
            path="/weather"
            element={<Navigate to="/ocean" replace />}
          />
          <Route
            path="/mission"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ModulePage type="mission" />
              </motion.div>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
