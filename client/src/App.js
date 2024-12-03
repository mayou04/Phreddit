// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import Phreddit from './components/phreddit.js'

function App() {
  document.title = "Phreddit";
  
  return (
    <section className="phreddit">
      <Phreddit />
    </section>
  );
}

export default App;
