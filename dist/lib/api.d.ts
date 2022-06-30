export declare let api: {
    threads: {
        checkExist: (options: {
            threadId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        images: (options: {
            threadId: number;
            commentId?: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/image").Image[], any>>;
        get: (options: {
            threadId: number;
            page?: number;
            start?: number;
            end?: number;
            sort?: "vote";
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/thread").Thread, any>>;
        userVotes: (options: {
            threadId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/userVotes").UserVotes, any>>;
        pin: (options: {
            threadId: number;
            commentId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        unpin: (options: {
            threadId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        create: (options: {
            comment: string;
            rtoken: string;
            title: string;
            category: number;
        }) => Promise<import("axios").AxiosResponse<{
            id: number;
        }, any>>;
        comments: {
            get: (options: {
                threadId: number;
                commentId: number;
            }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/comment").Comment, any>>;
            replies: (options: {
                threadId: number;
                commentId: number;
            }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/comment").Comment[], any>>;
            vote: (options: {
                threadId: number;
                commentId: number;
                vote: "U" | "D";
            }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
            add: (options: {
                threadId: number;
                comment: string;
                rtoken: string;
                quote?: number;
            }) => Promise<import("axios").AxiosResponse<{
                id: number;
            }, any>>;
        };
    };
    users: {
        uploadAvatar: (options: {
            avatar: File;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        rename: (options: {
            name: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK & import("metahkg-api/dist/types/token").Token, any>>;
        login: (options: {
            userNameOrEmail: string;
            password: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/token").Token, any>>;
        register: (options: {
            username: string;
            email: string;
            password: string;
            rtoken: string;
            sex: import("metahkg-api/dist/types/user").userSex;
            invitecode?: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        verify: (options: {
            email: string;
            code: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/token").Token, any>>;
        resend: (options: {
            email: string;
            rtoken: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        forgot: (options: {
            email: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        reset: (options: {
            email: string;
            verificationToken: string;
            newPassword: string;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/token").Token, any>>;
        status: () => Promise<import("axios").AxiosResponse<{
            active: boolean;
            id?: number;
            name?: string;
        }, any>>;
        block: (options: {
            userId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        unblock: (options: {
            userId: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/ok").OK, any>>;
        blocklist: void;
    };
    profile: {
        avatars: (options: {
            userId: number;
        }) => Promise<import("axios").AxiosResponse<string, any>>;
        userProfile: (options: {
            userId: number;
            nameonly?: boolean;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/user").Profile, any>>;
    };
    menu: {
        threads: (options: {
            threads: number[];
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/thread").Summary[], any>>;
        history: (options: {
            userId: number | "self";
            sort?: 0 | 1 | "Created" | "LastReply";
            page?: number;
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/thread").Summary[], any>>;
        main: (options: import("metahkg-api/dist/types/xor").RequireAtLeastOne<{
            categoryId?: number;
            threadId?: number;
            sort?: 0 | 1 | "Latest" | "Viral";
            page?: number;
        }, "categoryId" | "threadId">) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/thread").Summary[], any>>;
        search: (options: {
            page?: number;
            searchQuery: string;
            sort?: 0 | 2 | 1 | "Created" | "LastReply" | "Relevance";
            mode?: 0 | 1 | "Title" | "OP";
        }) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/thread/thread").Summary[], any>>;
    };
    category: {
        info: (options: import("metahkg-api/dist/types/xor").RequireAtLeastOne<{
            categoryId?: number;
            threadId?: number;
        }, "categoryId" | "threadId">) => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/category").Category, any>>;
        categories: () => Promise<import("axios").AxiosResponse<import("metahkg-api/dist/types/category").Category[], any>>;
    };
};
export declare function resetApi(): void;
