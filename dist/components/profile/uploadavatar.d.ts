/// <reference types="react" />
import { AxiosResponse } from "axios";
import { OK } from "metahkg-api/dist/types/ok";
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar(props: {
    onUpload?: () => void;
    onSuccess: (res: AxiosResponse<OK>) => void;
    onError: (err: any) => void;
}): JSX.Element;
