import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormControl, InputLabel, MenuItem, Select, } from "@mui/material";
import { useCategories } from "../ContextProvider";
/**
 * It takes in a category number and a setter function for the category number, and returns a form
 * control with a select menu that allows the user to choose a category
 * @param {number} props.cat The currently choosed category
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCat The function to update props.cat
 * @returns A form control with a select menu.
 */
export default function ChooseCat(props) {
    const { cat, setCat } = props;
    const changeHandler = (e) => {
        setCat(Number(e.target.value));
    };
    const categories = useCategories();
    return (_jsx("div", { children: categories.length && (_jsxs(FormControl, Object.assign({ className: "create-choosecat-form" }, { children: [_jsx(InputLabel, Object.assign({ color: "secondary" }, { children: "Category" })), _jsx(Select, Object.assign({ color: "secondary", value: cat, label: "Category", onChange: changeHandler }, { children: categories.map((category) => (_jsx(MenuItem, Object.assign({ value: category.id }, { children: category.name })))) }))] }))) }));
}
//# sourceMappingURL=ChooseCat.js.map