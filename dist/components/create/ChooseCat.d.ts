import React from "react";
/**
 * It takes in a category number and a setter function for the category number, and returns a form
 * control with a select menu that allows the user to choose a category
 * @param {number} props.cat The currently choosed category
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCat The function to update props.cat
 * @returns A form control with a select menu.
 */
export default function ChooseCat(props: {
    cat: number;
    setCat: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element;
