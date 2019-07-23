import React, { useState,useEffect } from 'react';

//material-ui
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import UploadIcon from '@material-ui/icons/CloudUpload'
import SaveIcon from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { useSnackbar } from 'notistack';
import useStyles from './styles/edit'

import {Prompt} from 'react-router-dom'




function EditProduk ({match}){
    
    const { firestore, storage, user } = useFirebase();

    const {enqueueSnackbar} = useSnackbar()

    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
    const produkStorageRef = storage.ref(`toko/${user.uid}/produk`);

    const [snapshot, loading] = useDocument(produkDoc);

    const [form, setForm] = useState({
        nama:'',
        sku:'',
        harga:0,
        stok:0,
        deskripsi:''
    });

    const [isSubmiting, setSubmiting] = useState(false);

    const [isSomethingChange, setSomethingChange] = useState(false);

    const [error, setError] = useState({
        nama:'',
        sku:'',
        harga:'',
        stok:'',
        deskripsi:''
    })

    const classes = useStyles()

    useEffect(() => {
        if(snapshot){
           setForm(curentForm=>({
            ...curentForm,
            ...snapshot.data()
           }))
        }
    }, [snapshot]);

    const handleChange = (e)=> {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })

        setError({
            ...error,
            [e.target.name]:''
        })

        setSomethingChange(true); 
        
    }

    const validate = () =>{
        
        const newError = {...error};

        if(!form.nama){
            newError.nama = "Nama produk wajib diisi"
        }

        if(!form.harga){
            newError.harga = "Harga produk wajib diisi"
        }

        if(!form.stok){
            newError.stok = "Stok produk wajib diisi"
        }
        
        return newError
    }
    const handleSubmit = async e =>{
        e.preventDefault();

        const findErrors = validate();

        if(Object.values(findErrors).some(err=>err !== '')){
            setError(findErrors);
            setSubmiting(true)
        }else{
            try {
                await produkDoc.set(form,{merge:true})
                enqueueSnackbar("Data produk berhasil disimpan", {variant:"success"})
                setSomethingChange(false)
            } catch (error) {
                enqueueSnackbar(e.message, {variant:'error'})
            }
            
        }
        setSubmiting(false)

    }

    const handleUpladFile = async (e)=>{
        const file = e.target.files[0];

        if(!['image/png','image/jpeg'].includes(file.type)){

            setError(error=>({
                ...error,
                foto:`Tipe file tidak didukung: ${file.type}`
            }))
        }else if(file.size >= 512000){
            setError(error =>({
                ...error,
                foto:`Ukuran file terlalu besar > 5000KB`
            }))
        }else{

            const reader = new FileReader();
            reader.onabort = () =>{
                setError(error => ({
                    ...error,
                    foto:`Proses pembacaan file dibatalkan`
                }))
            }
            reader.onerror = ()=>{
                setError(error => ({
                    ...error,
                    foto:`File tidak bisa dibaca`
                }))
            }
            reader.onload = async ()=>{
                setError(error => ({
                    ...error,
                    foto:''
                }))
                setSubmiting(true)
                try {
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
                    const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`);

                    const fotoSnapshot = await fotoRef.putString(reader.result,'data_url');
                    const fotoUrl =  await fotoSnapshot.ref.getDownloadURL();

                    setForm(curentForm=>({
                        ...curentForm,
                        foto: fotoUrl
                    }))
                    setSomethingChange(true)
                } catch (e) {
                    setError(error => ({
                        ...error,
                        foto:e.message
                    }))
                }

                setSubmiting(false)

            }

            reader.readAsDataURL(file);
        }
    }

    if(loading){
        return <AppPageLoading />
    }
    return(
        <div>
            <Typography>Edit Produk : {form.nama}</Typography>
            <Grid container alignItems="center" justify="center">
                <Grid item xs={12} sm={6}>
                    <form id="produk-form" onSubmit={handleSubmit} noValidate>
                    <TextField 
                        id="nama"
                        name="nama"
                        label="Nama Produk"
                        margin="normal"
                        fullWidth
                        required
                        value={form.nama}
                        helperText={error.nama}
                        onChange={handleChange}
                        error={error.nama ? true:false}
                        disabled={isSubmiting}
                    />
                    <TextField 
                        id="sku"
                        name="sku"
                        label="SKU Produk"
                        margin="normal"
                        fullWidth
                        value={form.sku}
                        helperText={error.sku}
                        onChange={handleChange}
                        error={error.sku ? true:false}
                        disabled={isSubmiting}
                    />
                    <TextField 
                        id="harga"
                        name="harga"
                        type="number"
                        label="Harga Produk"
                        margin="normal"
                        fullWidth
                        required
                        value={form.harga}
                        helperText={error.harga}
                        onChange={handleChange}
                        error={error.harga ? true:false}
                        disabled={isSubmiting}
                    />
                    <TextField 
                        id="stok"
                        name="stok"
                        type="number"
                        label="Stok Produk"
                        margin="normal"
                        fullWidth
                        required
                        value={form.stok}
                        helperText={error.stok}
                        onChange={handleChange}
                        error={error.stok ? true:false}
                        disabled={isSubmiting}
                    />
                    <TextField 
                        id="deskripsi"
                        name="deskripsi"
                        label="Deskripsi Produk"
                        margin="normal"
                        multiline
                        rowsMax={3}
                        fullWidth
                        value={form.deskripsi}
                        helperText={error.deskripsi}
                        onChange={handleChange}
                        error={error.deskripsi ? true:false}
                        disabled={isSubmiting}
                    />
                    </form>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className={classes.uploadFotoProduk}>
                        {form.foto &&
                        <img 
                            src={form.foto} 
                            className={classes.prevewFotoProduk}
                            alt={`Foto Produk ${form.nama}`}
                        />}
                        <input className={classes.handleInput}
                            type="file"
                            id="upload-foto-produk" 
                            accept="image/jpeg,image/png"
                            onChange={handleUpladFile}
                        />
                        <label htmlFor="upload-foto-produk">
                        {error.foto &&
                            <Typography 
                                color="error">{error.foto}
                            </Typography>
                        }
                        <Button variant="outlined" component="span">Upload Foto<UploadIcon className={classes.iconRight} /></Button>
                        </label>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div  className={classes.actionButton}>
                    <Button
                        form="produk-form"
                        type="submit"
                        color="primary" 
                        variant="contained"
                        disabled={isSubmiting || !isSomethingChange}>
                        <SaveIcon className={classes.iconLeft} />
                    Simpan</Button>
                    </div>
                </Grid>
            </Grid>
            <Prompt
                when={isSomethingChange}
                message="Terdapat perubahan yang belum disimpan,
                Apakah anda yankin ingin meniggalkan halaman ini?"
                
            />
        </div>
    )
}

export default EditProduk