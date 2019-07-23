import React, { useState, useRef } from 'react';

import TextField from '@material-ui/core/TextField'
import { useFirebase } from '../../../components/FirebaseProvider';

import { useSnackbar } from 'notistack';

import isEmail from 'validator/lib/isEmail'

import useStyels from './styles/pengguna'

function Pengguna() {
    const clasess = useStyels();
    const { user } = useFirebase();
    const [isSubmiting, setSubmiting] = useState(false)
    const [error, setError] = useState(
        {
            displayName: '',
            email: '',
            password:''
        });
    const { enqueueSnackbar } = useSnackbar();
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const saveDisplayName = async (e) => {
        const displayName =
            displayNameRef.current.value;

        if (!displayName) {
            setError({
                displayName: "Nama wajib diisi"
            })
        } else if (displayName !== user.displayName) {

            setError({
                displayName: ''
            })
            setSubmiting(true)
            await user.updateProfile({
                displayName
            })
            setSubmiting(false);
            enqueueSnackbar('Data pengguna berhasil di rubah', { variant: 'success' })
        }
    }

    const updateEmail = async (e) => {
        const email = emailRef.current.value;

        if (!email) {
            setError({
                email: "Email wajib diisi"
            });
        } else if (!isEmail(email)) {
            setError({
                email: "Email tidak valid"
            });
        } else if (email !== user.email) {
            setError({
                email: ''
            })
            setSubmiting(true)
            try {
                await user.updateEmail(email);
                enqueueSnackbar("Email berhasil di perbaharui", { variant: "success" })
            } catch (e) {
                let emailError = ''
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email sudah digunakan';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = 'Silahkan logout untuk memperbaharui email anda';
                        break;
                    default:
                        emailError = "Terjadi kesalahan silahkan coba kembali";
                        break;
                }
                setError({
                    email: emailError
                })
            }
            setSubmiting(false)
        }
    }

    const updatePassword = async (e)=>{
        const password = passwordRef.current.value
        if(!password){
            setError({
                password:"Password wajib disi"
            })
            
        } else {
            setSubmiting(true)
            try {
                await user.updatePassword(password);
                enqueueSnackbar("Password berhasil di perbaharui",{variant:'success'})
            } catch (e) {
                let errorPassword = ''
                switch (e.code) {
                    case 'auth/weak-password':
                        errorPassword = 'Password terlalu lemah';
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = 'Silahkan logout untuk memperbaharui password anda';
                        break;
                    default:
                        errorPassword = "Terjadi kesalahan silahkan coba kembali";
                        break;
                }
                setError({
                    password: errorPassword
                })
            }
            setSubmiting(false)
            }

    }

    return (
        <div className={ clasess.pengaturanPengguna } >

            <TextField
                id="displayName"
                name="displayName"
                label="Nama"
                margin="normal"
                defaultValue={user.displayName}
                inputProps={{
                    ref: displayNameRef,
                    onBlur: saveDisplayName
                }}
                disabled={isSubmiting}
                helperText={error.displayName}
                error={error.displayName ? true : false}
            />

            <TextField
                id="email"
                name="email"
                label="Email"
                margin="normal"
                defaultValue={user.email}
                inputProps={{
                    ref: emailRef,
                    onBlur: updateEmail,

                }}
                helperText={error.email}
                error={error.email ? true : false}
                disabled={isSubmiting}
            />

            <TextField 
                id="password"
                name="password"
                label="Password Baru"
                type='password'
                margin='normal'
                disabled={isSubmiting}
                inputProps={{
                    ref: passwordRef,
                    onBlur:updatePassword
                }}
                helperText={error.password}
                error = {error.password ? true : false}
            />
        </div>
    )
}

export default Pengguna