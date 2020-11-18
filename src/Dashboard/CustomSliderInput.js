import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import React from "react";

class CustomSliderInput extends React.Component {
    render() {
        return (
            <div>
                <Typography variant="caption" id={this.props.id}>{this.props.label}</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider value={this.props.value}
                                onChange={this.props.funcHandleSlide}
                                onChangeCommitted={this.props.funcSliderChangeCommit}
                                step={this.props.step}
                                min={this.props.min}
                                max={this.props.max}
                                aria-labelledby={this.props.id}/>
                    </Grid>
                    <Grid item>
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
                </Grid>
            </div>
        )
    }
}

export default CustomSliderInput;