import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./styles.css";
const DEFAULT_DURATION_MS = 1600;
const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = 400;
const calcShimmerStyle = (width, height, duration = DEFAULT_DURATION_MS) => ({
    backgroundSize: `${width * 10}px ${height}px`,
    animationDuration: `${(duration / 1000).toFixed(1)}s`,
});
export const Shimmer = ({ className, duration, height = DEFAULT_HEIGHT, width = DEFAULT_WIDTH, }) => {
    const shimmerStyle = calcShimmerStyle(width, height, duration);
    const style = Object.assign(Object.assign({}, shimmerStyle), { height, width });
    return _jsx("div", { className: clsx("shimmer", className), style: style });
};
Shimmer.propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    className: PropTypes.string,
    duration: PropTypes.number,
};
//# sourceMappingURL=shimmer.js.map