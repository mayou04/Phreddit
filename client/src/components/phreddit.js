import Header from './header.js';
import Navbar from './navbar.js';
import Home from './home.js';
import Welcome from './welcome.js';
import { usePage, PageProvider } from '../contexts/pageContext.js';
import { SelectedIDProvider } from '../contexts/selectedIDContext.js';


function Content() {
  const {currentPage} = usePage(); 
  return (
    <div id="content">
      {currentPage || <Welcome />}
    </div>
  );
}

export default function Phreddit() {
  return (
    <div id="container">
      <PageProvider>
        <SelectedIDProvider>
          <Header />
          <Navbar />
          <Content />
        </SelectedIDProvider>
      </PageProvider>
    </div>
  );
}