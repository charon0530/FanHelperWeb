import React, { Suspense } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link //eslint-disable-line no-unused-vars
} from "react-router-dom";
//내가 만든 컴포넌트들 임포트
import LandingPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
//import LoginPage2 from "./components/views/LoginPage/LoginPage2"
import NavBar from "./components/views/NavBar/NavBar"
import RegisterPage from "./components/views/RegisterPage/RegisterPage"
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage"
import PhotoUploadPage from "./components/views/PhotoUploadPage/PhotoUploadPage"
import Auth from "./hoc/auth"
import PhotoPage from './components/views/PhotoPage/PhotoPage';
import PhotoEditPage from './components/views/PhotoEditPage/PhotoEditPage';
import VideoPage from './components/views/VideoPage/VideoPage';
import VideoDetailPage from './components/views/VideoDetailPage/VideoDetailPage'
import VideoEditPage from './components/views/VideoEditPage/VideoEditPage'
import PhotoDetailPage from './components/views/PhotoDetailPage/PhotoDetailPage'
import SubscriptionPage from './components/views/SubscriptionPage/SubscriptionPage'

function App() {
  return (
  <Suspense fallback={(<div>Loading</div>)}>
    
    <Router>
    <NavBar />
      <div>
        {/*
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/login2">Login2</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>

        <hr />
        */}
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/photo" component={Auth(PhotoPage, null)} />
          <Route exact path="/video" component={Auth(VideoPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/photo/upload" component={Auth(PhotoUploadPage, true)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />

          <Route exact path="/video/:videoId" component={Auth(VideoDetailPage, null)} />
          <Route exact path="/video/edit/:videoId" component={Auth(VideoEditPage, true)} />

          <Route exact path="/photo/:photoId" component={Auth(PhotoDetailPage, null)} />
          <Route exact path="/photo/edit/:photoId" component={Auth(PhotoEditPage, true)} />

          <Route exact path="/subscription" component={Auth(SubscriptionPage, null)} />
        </Switch>
      </div>
    </Router>
  </Suspense>
    
  );
}


export default App;
