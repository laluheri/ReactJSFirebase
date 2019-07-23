import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import {enqueueSnackbar} from 'notistack'
import ImageIcon from '@material-ui/icons/Image'
import Typography from '@material-ui/core/Typography'
import { useFirebase } from '../../../components/FirebaseProvider'
import { Grid, Avatar } from '@material-ui/core';
import { useCollection } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import useStyles from './styles'

function Home (){

    const { firestore, auth, user} = useFirebase()
    const produkCol = firestore.collection(`toko/${user.uid}/produk`)
    const [snapshotProduk, loadingProduk] = useCollection(produkCol)
    const [transaksi, setTransaksi] = useState({
        items:{

        }
    })
    const [produkItem, setProdukItem] = useState([])
    const [filterProduk, setFilterProduk] =  useState('')
    const classes = useStyles(); 
    
    useEffect(() => {
      if(snapshotProduk){
          setProdukItem(snapshotProduk.docs.filter(
              (produkDoc) =>{
                  if(filterProduk){
                      return produkDoc.data().nama.toLowerCase().includes(filterProduk.toLowerCase())
                  }
                  return true;
              }
          ))
      }
    }, [snapshotProduk, filterProduk])

    const addItem = produkDoc=>e=>{
        let newItem = {...transaksi.items[produkDoc.id]}
        const produkData = produkDoc.data()

        if(newItem.jumlah){
            newItem.jumlah = newItem.jumlah +1
            newItem.harga = produkData.harga * newItem.jumlah
        }else{
            newItem.jumlah=1
            newItem.subtotal = produkData.harga
            newItem.nama = produkData.nama
        }
        if(newItem.jumlah > produkDoc.stok){
            enqueueSnackbar('Jumlah melebihi stok produk', {variant:'error'})
        }else{
            setTransaksi(transaksi => ({
                ...transaksi,
                item:{
                    ...transaksi.items,[produkDoc.id]:newItem
                }
            }))
        }
        console.log("test");
        
    }

    if(loadingProduk){
        return <AppPageLoading />
    }
    return(
        <div>
            <Typography variant="h5" component="h1">Buat Transaksi Baru</Typography>

            <Grid container>
                <Grid item xs={12}>
                <Table>
                        <TableHead>
                            <TableCell>Item</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell>Harga</TableCell>
                            <TableCell>Subtotal</TableCell>
                        </TableHead>
                        <TableBody>
                            {
                                Object.keys(transaksi.items).map(k=>{
                                    const item = transaksi.items[k];
                                    return(
                                        <TableRow key={k}>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.jumlah}</TableCell>
                                            <TableCell>{item.harga}</TableCell>
                                            <TableCell>{item.subtotal}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <List 
                        className={classes.produkList}
                        component="div"
                        subheader={
                            <ListSubheader component="div">
                                <TextField 
                                    autoFocus
                                    label="Cari Produk" 
                                    fullWidth margin="normal" 
                                    onChange={e=>{
                                        setFilterProduk(e.target.value)
                                    }}/>
                            </ListSubheader>
                        }
                    >
                        {
                            produkItem.map((produkDoc) =>{
                                const produkData = produkDoc.data()
                                return <ListItem
                                    key={produkDoc.id} 
                                    button
                                    disabled={!produkData.stok}
                                    onClick={addItem(produkDoc)}
                                >
                                    {
                                        produkData.foto? 
                                        <ListItemAvatar>
                                            <Avatar src={produkData.foto} alt={produkData.nama} />
                                     </ListItemAvatar>
                                     :
                                     <ListItemIcon>
                                         <ImageIcon />
                                     </ListItemIcon>
                                    }
                                    
                                    <ListItemText 
                                        primary={produkData.nama}
                                        secondary = {`Stok: ${produkData.stok || 0}`}
                                    />
                                    

                                </ListItem>
                            })
                                
                        }
                    </List>
                </Grid>
            </Grid>
        </div>

    )
}

export default Home