// https://connect.ncdot.gov/resources/gis/cartographic-standards/Pages/CSG.aspx
import {createMuiTheme} from "@material-ui/core/styles";
import {kaiTheme} from "./kaiTheme";

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: kaiTheme.ncdot_blue,
            dark: '#232f34',
            light: '#4A6572'
        },
        secondary: {
            main: kaiTheme.kai_color_orange_pms,
            dark: kaiTheme.kai_color_orange,
            light: kaiTheme.kai_color_yellow_bright,
        }
    }
})