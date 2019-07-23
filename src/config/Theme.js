import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const Theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  status: {
    danger: 'orange',
  },
});

export default Theme