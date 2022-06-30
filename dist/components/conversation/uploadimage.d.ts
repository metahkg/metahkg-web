/// <reference types="react" />
import { AxiosResponse } from "axios";
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadImage(props: {
    className?: string;
    onUpload?: () => void;
    onSuccess: (res: AxiosResponse<any, any>) => void;
    onError: (err: any) => void;
}): JSX.Element;
