import {makeStyles} from '@material-ui/styles'


const useStyles = makeStyles(theme =>({
    handleInput:{
        display:'none'
    },

    uploadFotoProduk:{
        textAlign:'center',
        padding: theme.spacing(3)
    },

    prevewFotoProduk:{
        width:'100%',
        height:'auto'
    },
    iconRight:{
        marginLeft:theme.spacing(1)
    },

    iconLeft:{
        marginRight:theme.spacing(1)
    },

    actionButton:{
        paddingTop:theme.spacing(2)
    }
}))

export default useStyles;