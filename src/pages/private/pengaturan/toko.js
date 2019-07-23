import React, {useState, useEffect} from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import useStyles from './styles/toko'
import { useSnackbar } from 'notistack'

import isURL from 'validator/lib/isURL'
import {useFirebase} from '../../../components/FirebaseProvider'
import {useDocument} from 'react-firebase-hooks/firestore'

import ApppageLoading from '../../../components/AppPageLoading'
import {Prompt} from 'react-router-dom'


function Toko (){
    const classes = useStyles()
    const {enqueueSnackbar} = useSnackbar();
    const [isSubmiting, setSubmiting] = useState(false)
    const [isSomethingChange, setSomethingChange] = useState(false)

    const { firestore, user } = useFirebase();
    const tokoDoc = firestore.doc(`toko/${user.uid}`)

    const [snapshot, loading] = useDocument(tokoDoc)//menggunakan react hook document refrence

    const [form, setForm] = useState({
        nama:'',
        alamat:'',
        telepon:'',
        website:''
    })

    const [error, setError] = useState({
        nama:'',
        alamat:'',
        telepon:'',
        website:''
    })

    useEffect(() => {
        if(snapshot){
            setForm(snapshot.data())
        }
    }, [snapshot])

    const handleChange = e=>{ 
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
        setError({
            ...error,
            [e.target.name]:''
        })
        setSomethingChange(true)
        
        
    }

    const validate = () =>{
        
        const newError = {...error}
        if(!form.nama){
            newError.nama="Nama wajib diisi"
        }
        if(!form.alamat){
            newError.alamat="Alamat wajib diisi"
        }
        if(!form.telepon){
            newError.telepon="Telepon wajib diisi"
        }
        if(!form.website){
            newError.website="Website wajib diisi"
        }else if(!isURL(form.website)){
            newError.website="Website tidak valid"
        }

        return newError
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const findErrors = validate();
        if(Object.values(findErrors).some(err=>err !=='')){
            setError(findErrors)
        }else{
            setSubmiting(true)
            try {
                await tokoDoc.set(form,{merge:true})
                enqueueSnackbar("Data toko berhasil disimpan", {variant:'success'})
            } catch (e) {
                console.log(e.message);
                
            }
            setSubmiting(false)
            setSomethingChange(false)
        }
        
    }
    
    if(loading){
        return <ApppageLoading />
    }
    
    return(
        <div className={classes.PengaturanToko} >
        <form onSubmit={handleSubmit} noValidate>
            <TextField 
            id='nama'
            name='nama'
            label='Nama Toko'
            margin='normal'
            fullWidth
            value={form.nama}
            required
            onChange={handleChange}
            error={error.nama ? true: false}
            helperText={error.nama}
            disabled={isSubmiting}
            />
            <TextField 
            id='alamat'
            name='alamat'
            label='Alamat Toko'
            margin='normal'
            fullWidth
            required
            multiline
            rowsMax={3}
            value={form.alamat}
            onChange={handleChange}
            error={error.alamat ? true: false}
            helperText={error.alamat}
            disabled={isSubmiting}
            />
            <TextField 
            id='telepon'
            name='telepon'
            label='No Telepon Toko'
            margin='normal' 
            fullWidth
            required
            value={form.telepon}
            onChange={handleChange}
            error={error.telepon ? true: false}
            helperText={error.telepon}
            disabled={isSubmiting}
            />
            <TextField 
            id='website'
            name='website'
            label='Website Toko'
            margin='normal' 
            fullWidth
            required
            value={form.website}
            onChange={handleChange}
            error={error.website ? true: false}
            helperText={error.website}
            disabled={isSubmiting}
            />
            <Button
                 type='submit'
                 className={classes.actionButton}
                 variant="contained" 
                 color="primary" 
                 disabled={isSubmiting || !isSomethingChange}>
            Simpan
            </Button>
        </form>
        <Prompt
            when={isSomethingChange}
            message="Terdapat perubahan yang belum disimpan,
            apakah anda yakin ingin meninggalkan halaman ini"
        />

        </div>
    )
}

export default Toko