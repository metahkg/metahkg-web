import React from "react";
export interface UserData {
    id: number;
    name: string;
    count: number;
    sex: "M" | "F";
    role: "user" | "admin";
    createdAt: string;
}
interface DataTableProps {
    requestedUser: UserData;
    setUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}
export default function DataTable(props: DataTableProps): JSX.Element;
export {};
