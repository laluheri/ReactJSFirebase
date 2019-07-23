import React, { useState } from 'react'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid';

import isEmail from 'validator/lib/isEmail'

import useStyles from './styles'

import { Link, Redirect } from 'react-router-dom'

import { useFirebase } from '../../components/FirebaseProvider'

import AppLoading from '../../components/AppLoading'




export default function Login(props) {
    const {location} = props
    const clasess = useStyles();
    const [form, setForm] = useState({
        email: '',
        password: '',
        
    });
    const [error, setError] = useState({
        email: '',
        password: '',
        
    })

    const [isSubmiting, setSubmiting] = useState(false)

    const { auth, user, loading} = useFirebase()

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }



    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email Wajib diisi';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email tidak valid'
        }

        if (!form.password) {
            newError.password = 'Password wajid diisi'
        }

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();
        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmiting(true);
                await auth.signInWithEmailAndPassword(
                    form.email, form.password
                )
            } catch (error) {
                const newError = {};
                switch (error.code) {
                    case "auth/user-not-found":
                        newError.email = "Email tidak terdaftar"
                        break;
                    case "auth/invalid-email":
                        newError.email = "Email tidak valid";
                        break;
                    case "auth/wrong-password":
                        newError.password = "Password salah";
                        break;
                    case "auth/user-disabled":
                        newError.password = "Pengguna di blokir"
                        break;
                    default:
                        newError.email = "Terjadi Kesalahan silahkan coba lagi"
                        break;
                }
                setError(newError)
                setSubmiting(false); 
            }
        }
    }

    if(loading){
       return <AppLoading />
    }

    if(user){
      const redirectTo = location.state && 
      location.state.from &&
      location.state.from.pathname ?
      location.state.from.pathname : '/';      
      return <Redirect to= {redirectTo} />
    }
    
    return (
        <Container maxWidth="xs">
            <Paper className={clasess.paper}>
                <Typography
                    variant='h5'
                    component="h1"
                    className={clasess.title}
                >
                    Login
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        margin="normal"
                        label="Alamat Email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                        helperText={error.email}
                        error={error.email ? true : false}
                        disabled = {isSubmiting}

                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        margin="normal"
                        label="Password"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                        helperText={error.password}
                        error={error.password ? true : false}
                        disabled = {isSubmiting}
                    />
                    <Grid container className={clasess.buttons}>
                        <Grid item xs>
                            <Button
                                disabled = {isSubmiting}
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                            >Login</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                disabled = {isSubmiting}
                                component={Link}
                                variant="contained"
                                size="large"
                                to="/registrasi"
                            >Daftar</Button>
                        </Grid>
                    </Grid>
                    <div className={clasess.forgotPassword}>
                    <Typography component={Link} to="/lupa-password">Lupa password ?</Typography>
                    </div>
                    
                </form>

            </Paper>
        </Container>
    )
}