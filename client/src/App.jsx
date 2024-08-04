import { Routes, Route} from "react-router-dom";
import Participants from './components/participants';
import Host from './components/host';
import Try from "./components/try";


function App() {
  return (
    <>
      <Routes>
        <Route path='/host' element={<Host />} />
        <Route path='/' element = {<Participants/>}/>
        <Route path='/try' element={<Try/>}/>
      </Routes>
    </>
  )
}

export default App
