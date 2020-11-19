import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import React from "react";

class CustomSliderInput extends React.Component {
    render() {
        return (
            <div style={{height:"34pt"}}>
                {/*<Typography variant="caption" id={this.props.id}>{this.props.label}</Typography>*/}
                <Grid container spacing={2} alignItems="center">
                    <Grid item style={{width:"120px"}}>
                        <Typography variant="caption" id={this.props.id}>{this.props.label}</Typography>
                    </Grid>
                    {this.props.percentStr &&
                        <Grid item style={{width: '75px'}}>
                            {this.props.percentStr}
                        </Grid>
                    }
                    {this.props.showInput &&
                    <Grid item style={{width: '75px'}}>
                        <Input
                            value={this.props.value}
                            margin="dense"
                            onChange={this.props.funcInputChange}
                            onBlur={this.props.funcBlur}
                            inputProps={{
                                step: this.props.step,
                                min: this.props.min,
                                max: this.props.max,
                                type: 'number',
                                'aria-labelledby': this.props.id
                            }}
                        />
                    </Grid>
                    }
                    <Grid item xs>
                        <Slider value={this.props.value}
                                onChange={this.props.funcHandleSlide}
                                onChangeCommitted={this.props.funcSliderChangeCommit}
                                step={this.props.step}
                                min={this.props.min}
                                max={this.props.max}
                                color="primary"
                                aria-labelledby={this.props.id}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default CustomSliderInput;