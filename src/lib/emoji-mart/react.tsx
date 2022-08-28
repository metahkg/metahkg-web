import React, { useEffect, useRef } from "react";
import { Picker, PickerOptions } from "emoji-mart";

export default function EmojiMart(props: PickerOptions) {
    const ref = useRef<HTMLDivElement>(null);
    const instance = useRef<Picker | null>(null);

    if (instance.current) {
        instance.current.update(props);
    }

    useEffect(() => {
        instance.current = new Picker({ ...props, ref });

        return () => {
            instance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return React.createElement("div", { ref });
}
