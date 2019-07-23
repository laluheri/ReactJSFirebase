import {} from '@material-ui/styles'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme=>({
    title:{
        textAlign:'center',
        padding:theme.spacing(3)
    },
    paper:{
        marginTop:theme.spacing(8),
        padding:theme.spacing(6),
    },
    buttons:{
        marginTop:theme.spacing(6)
    }

}))

export default useStyles