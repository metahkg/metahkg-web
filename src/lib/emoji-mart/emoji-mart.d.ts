declare module "emoji-mart" {
    export class Picker {
        constructor(props: PickerOptions);

        update: (props: PickerOptions) => void;
    }

    export interface PickerOptions {
        ref?: React.RefObject<HTMLDivElement>;
        /** Data to use for the picker
         * @default null
         */
        data?: Object;
        /** Localization data to use for the picker
         * @default null
         */
        i18n?: Object;
        /** Categories to show in the picker. Order is respected.
         * @default []
         */
        categories?: (
            | "frequent"
            | "people"
            | "nature"
            | "foods"
            | "activity"
            | "places"
            | "objects"
            | "symbols"
            | "flags"
        )[];
        /** Custom emojis https://www.npmjs.com/package/emoji-mart#custom-emojis
         * @example
         *  [
                {
                    id: 'github',
                    name: 'GitHub',
                    emojis: [
                        {
                            id: 'octocat',
                            name: 'Octocat',
                            keywords: ['github'],
                            skins: [{ src: './octocat.png' }],
                        },
                        {
                            id: 'shipit',
                            name: 'Squirrel',
                            keywords: ['github'],
                            skins: [
                              { src: './shipit-1.png' }, { src: './shipit-2.png' }, { src: './shipit-3.png' },
                              { src: './shipit-4.png' }, { src: './shipit-5.png' }, { src: './shipit-6.png' },
                            ],
                        },
                    ],
                },
                {
                    id: 'gifs',
                    name: 'GIFs',
                    emojis: [
                        {
                            id: 'party_parrot',
                            name: 'Party Parrot',
                            keywords: ['dance', 'dancing'],
                            skins: [{ src: './party_parrot.gif' }],
                        },
                    ],
                },
            ]
         * @default []
         */
        custom?: {
            id: string;
            name: string;
            emojis: {
                id: string;
                name: string;
                keywords: string[];
                skins: { src: string }[];
            }[];
        }[];
        /** Callback when an emoji is selected
         * @default null
         */
        onEmojiSelect?: (emoji: {
            id: string;
            name: string;
            /** emoji */
            native: string;
            /** unicode */
            unified: string;
            keywords: string[];
            shortcodes: string | string[];
        }) => void;
        /** Callback when a click outside of the picker happens
         * @default null
         */
        onClickOutside?: () => void;
        /** Callback when the Add custom emoji button is clicked. The button will only be displayed if this callback is provided. It is displayed when search returns no results.
         * @default null
         */
        onAddCustomEmoji?: () => void;
        /** Whether the picker should automatically focus on the search input
         * @default false
         */
        autoFocus?: boolean;
        /** Custom category icons https://www.npmjs.com/package/emoji-mart#custom-category-icons
         * @default null
         * @example
         *  categoryIcons: {
                activity: {
                    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M57.89 397.2c-6.262-8.616-16.02-13.19-25.92-13.19c-23.33 0-31.98 20.68-31.98 32.03c0 6.522 1.987 13.1 6.115 18.78l46.52 64C58.89 507.4 68.64 512 78.55 512c23.29 0 31.97-20.66 31.97-32.03c0-6.522-1.988-13.1-6.115-18.78L57.89 397.2zM496.1 352c-44.13 0-79.72 35.75-79.72 80s35.59 80 79.72 80s79.91-35.75 79.91-80S540.2 352 496.1 352zM640 99.38c0-13.61-4.133-27.34-12.72-39.2l-23.63-32.5c-13.44-18.5-33.77-27.68-54.12-27.68c-13.89 0-27.79 4.281-39.51 12.8L307.8 159.7C262.2 192.8 220.4 230.9 183.4 273.4c-24.22 27.88-59.18 63.99-103.5 99.63l56.34 77.52c53.79-35.39 99.15-55.3 127.1-67.27c51.88-22 101.3-49.87 146.9-82.1l202.3-146.7C630.5 140.4 640 120 640 99.38z"/></svg>',
                },
                people: {
                    src: './people.png',
                },
            },
         */
        categoryIcons?: Object;
        /** An array of color that affects the hover background color
         * @example ["#f00", "pink", "rgba(155,223,88,.7)"]
         * @default []
         */
        emojiButtonColors?: string[];
        /** The radius of the emoji buttons
         * @example "6px"
         * @example "1em"
         * @example "100%"
         * @default "100%""
         */
        emojiButtonRadius?: string;
        /** The size of the emoji buttons
         * @default 36
         */
        emojiButtonSize?: number;
        /** The size of the emojis (inside the buttons)
         * @default 24
         */
        emojiSize?: number;
        /** The version of the emoji data to use. Latest version supported in @emoji-mart/data is currently 14
         * @default 14
         */
        emojiVersion?: number;
        /** The type of icons to use for the picker. outline with light theme and solid with dark theme.
         * @default "auto"
         */
        icons?: "auto" | "outline" | "solid";
        /** The locale to use for the picker
         * @default "en"
         */
        locale?:
            | "en"
            | "ar"
            | "de"
            | "es"
            | "fa"
            | "fr"
            | "it"
            | "ja"
            | "nl"
            | "pl"
            | "pt"
            | "ru"
            | "uk"
            | "zh";
        /** The maximum number of frequent rows to show. 0 will disable frequent category
         * @default 4
         */
        maxFrequentRows?: number;
        /** The position of the navigation bar
         * @default "top"
         */
        navPosition?: "top" | "bottom" | "none";
        /** Whether to show country flags or not. If not provided, tbhis is handled automatically (Windows doesn’t support country flags)
         * @default false
         */
        noCountryFlags?: boolean;
        /** The id of the emoji to use for the no results emoji
         * @default "cry"
         */
        noResultsEmoji?: string;
        /** The number of emojis to show per line
         * @default 9
         */
        perLine?: number;
        /** The id of the emoji to use for the preview when not hovering any emoji. point_up when preview position is bottom and point_down when preview position is top.
         * @default "point_up"
         */
        previewEmoji?: string;
        /** The position of the preview
         * @default "bottom"
         */
        previewPosition?: "top" | "bottom" | "none";
        /** The position of the search input
         * @default "sticky"
         */
        searchPosition?: "sticky" | "static" | "none";
        /** The set of emojis to use for the picker. native being the most performant, others rely on spritesheets.
         * @default "native"
         */
        set?: "native" | "apple" | "facebook" | "google" | "twitter";
        /** The emojis skin tone
         * @default 1
         */
        skin?: 1 | 2 | 3 | 4 | 5 | 6;
        /** The position of the skin tone selector
         * @default "preview"
         */
        skinTonePosition?: "preview" | "search" | "none";
        /** The color theme of the picker
         * @default "auto"
         */
        theme?: "auto" | "light" | "dark";
        /** A function that returns the URL of the spritesheet to use for the picker. It should be compatible with the data provided.
         * @default null
         */
        getSpritesheetURL?: (data: any) => string;
    }
}
