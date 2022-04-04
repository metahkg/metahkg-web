import React, { Suspense } from "react";
import Spinner from "react-spinner-material";
import { useImage } from "react-image";
import { CSSstring } from "../../lib/cssstring";
function ImgComponent(props: {
  src: string;
  height?: string;
  width?: string;
  style?: string;
}) {
  const { src } = useImage({ srcList: props.src });
  return (
    <img
      src={src}
      alt=""
      height={props.height}
      width={props.width}
      style={CSSstring(String(props.style))}
      loading="lazy"
    />
  );
}
export default function Img(props: {
  src: string;
  height?: string;
  width?: string;
  style?: string;
}) {
  return (
    <Suspense
      fallback={<Spinner radius={60} color="gray" stroke={2} visible={true} />}
    >
      <ImgComponent
        src={props.src}
        height={props.height}
        width={props.width}
        style={props.style}
      />
    </Suspense>
  );
}
