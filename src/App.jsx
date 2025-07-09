
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import Aboutus from './Pages/Aboutus'
import Business from './Pages/Business'
import Careers from './Pages/Careers'
import Learn from './Pages/Learn'
import Navbar from './Components/Navbar';



function App() {
  return (
    
    <div className='App w-[100vw]'>
      
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/business" element={<Business />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/learn" element={<Learn />} />
        </Routes>
     
       
    </div>

   
  
  );
}

export default App
