import Header from './header.js';
import Navbar from './navbar.js';
import Home from './home.js';
import Welcome from './welcome.js';
import { useState, useEffect } from 'react';
import { usePage, PageProvider } from '../contexts/pageContext.js';
import { SelectedIDProvider } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';

function Content() {
  const {currentPage} = usePage();
  const [status, setStatus] = useState([]);

  useEffect(() => {
    async function getStatus() {
      const statusResponse = await utils.status();
      setStatus(await statusResponse);
      console.log(statusResponse);
    }
    getStatus();
  }, [utils.status().isLoggedIn])


  return (
    <div id="content">
      {currentPage || ((status.isLoggedIn) ?  <Home/> : <Welcome/>)}
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