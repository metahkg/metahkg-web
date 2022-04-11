export type post = {
	id: number;
	title: string;
	body: string;
};

interface storeType {
	posts: post[];
}

export default storeType;
