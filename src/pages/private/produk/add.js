import React, {useState} from 'react'
import propTypes from 'prop-types'

//material-ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useFirebase } from '../../../components/FirebaseProvider';

import {withRouter} from 'react-router-dom'

function AddDialog ({history, open, handleClose}){
    const { firestore, user } = useFirebase();

    const produkCol = firestore.collection(`toko/${user.uid}/produk`);
    const [nama, setNama] = useState();
    const [error, setError] = useState('');
    const [isSubmiting, setSubmiting] = useState(false);
    const handleSimpan = async(e) =>{
        
        setSubmiting(true)
        try {
            
            if(!nama){
                throw new Error("Nama produk wajib diisi")
            }
            const produkBaru = await produkCol.add({nama});
            history.push(`produk/edit/${produkBaru.id}`);
        } catch (e) {
           setError(e.message)
        }
        setSubmiting(false);
    }
    return <Dialog 
                    disableBackdropClick={isSubmiting} 
                    disableEscapeKeyDown={isSubmiting}
                    open={open} 
                    onClose={handleClose}>
            <DialogTitle>Buat Produk Baru</DialogTitle>
            <DialogContent dividers>
                <TextField 
                        id="nama"
                        label="Nama Produk"
                        value={nama}
                        onChange={(e)=>{
                            setError("")
                            setNama(e.target.value)
                        }}
                        helperText={error}
                        error={error?true:false}
                    />
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isSubmiting}
                    onClick={handleClose}
                >Batal</Button>
                <Button
                    disabled={isSubmiting}
                    onClick={handleSimpan } color="primary">Simpan</Button>
            </DialogActions>

    </Dialog>
}

AddDialog.propTypes = {
    open: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired
}

export default withRouter(AddDialog);