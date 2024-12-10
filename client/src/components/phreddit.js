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

  // useEffect(async () => {
  //   setStatus(utils.status());
  //   console.log(status);
  // }, [utils.status().isLoggedIn])


  return (
    <div id="content">
      {(status.isLoggedIn) ? console.log("A") : console.log(status)}
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