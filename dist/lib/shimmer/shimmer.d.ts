/// <reference types="react" />
import PropTypes from "prop-types";
import "./styles.css";
export interface ShimmerProps {
    height: number;
    width: number;
    className?: string;
    duration?: number;
}
export declare const Shimmer: {
    ({ className, duration, height, width, }: ShimmerProps): JSX.Element;
    propTypes: {
        height: PropTypes.Validator<number>;
        width: PropTypes.Validator<number>;
        className: PropTypes.Requireable<string>;
        duration: PropTypes.Requireable<number>;
    };
};
