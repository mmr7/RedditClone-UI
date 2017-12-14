export interface Post {
    postId: number,
    title: string,
    link: string,
    body: string,
    upvotes: number,
    downvotes: number,
    commentsIds: number[],
    author: string
}