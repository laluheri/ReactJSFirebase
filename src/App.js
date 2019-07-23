import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import Theme from './config/Theme';
import Login from './pages/login';
import Registrasi from './pages/registrasi';
import LupaPassword from './pages/lupas-password';
import NotFound from './pages/404';
import Private from './pages/private';
import PrivateRoute from './components/PrivateRoute'
import FirebaseProvider from './components/FirebaseProvider';
import {SnackbarProvider} from 'notistack'


function App(){
  return(
    
      <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={Theme}>
      <SnackbarProvider autoHideDuration={3000}>
      <FirebaseProvider>
      <Router>
          <Switch>
            <PrivateRoute path="/" exact component={Private} />
            <Route path="/login" component={Login}/>
            <Route path="/registrasi" component={Registrasi} />
            <Route path="/lupa-password" component={LupaPassword} />
            <PrivateRoute path="/pengaturan" component={Private} />
            <PrivateRoute path="/produk" component={Private} />
            <PrivateRoute path="/transaksi" component={Private} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </FirebaseProvider>
      </SnackbarProvider>
      </ThemeProvider>
    </React.Fragment>
   
  )
}

export default App